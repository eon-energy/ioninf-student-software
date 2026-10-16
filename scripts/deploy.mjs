import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const identity=process.env.SOFT_SSH_KEY;
if(!identity)throw new Error('Set SOFT_SSH_KEY to an authorized SSH identity file.');
const run=(bin,args)=>execFileSync(bin,args,{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
const connection=['-i',identity,'-o','BatchMode=yes','-o','ConnectTimeout=20','-o','ControlMaster=auto','-o','ControlPersist=60','-o','ControlPath='+path.join(root,'.codex-artifacts','soft-deploy.sock')];
const ssh=command=>run('ssh',[...connection,'root@213.165.34.164',command]);
const quote=value=>"'"+value.replaceAll("'","'\\''")+"'";
const revision=run('git',['rev-parse','--short=12','HEAD']).trim();
const release=new Date().toISOString().replace(/[-:.]/g,'')+'-'+revision;
const folder=path.join(root,'.codex-artifacts','deploy',release);
await mkdir(folder,{recursive:true});
const oldConfig=ssh('cat /opt/ion-edge/Caddyfile');
const fragment=await readFile(path.join(root,'deploy/Caddyfile.server'),'utf8');
const block=host=>new RegExp('^'+host.replaceAll('.','\\.')+' \\{\\n[\\s\\S]*?^\\}','m');
let candidate=oldConfig;
for(const host of ['soft.infa-ion.ru','soft.ioninf.ru']){
  const match=fragment.match(block(host));if(!match||!candidate.match(block(host)))throw new Error('Missing exact site block '+host);
  candidate=candidate.replace(block(host),()=>match[0]);
}
const unrelated=config=>['soft.infa-ion.ru','soft.ioninf.ru'].reduce((text,host)=>text.replace(block(host),''),config);
if(unrelated(candidate)!==unrelated(oldConfig))throw new Error('Unrelated Caddy configuration changed');
await writeFile(path.join(folder,'Caddyfile.before'),oldConfig);
await writeFile(path.join(folder,'Caddyfile.candidate'),candidate);
const manifest=JSON.parse(await readFile(path.join(root,'dist/release-manifest.json'),'utf8'));
const files=[...manifest.files,'release-manifest.json'];
if(files.some(name=>!/^[-a-zA-Z0-9_./]+$/.test(name)||name.includes('..')||name.startsWith('/')))throw new Error('Unsafe manifest');
const listed=ssh("test -d /var/www/ioninf-soft\nfind /var/www/ioninf-soft -type f -printf '%P\\n'").trim().split('\n').filter(Boolean);
const legacy=listed.filter(name=>!files.includes(name)&&!/[.][a-f0-9]{12}[.][a-z0-9]+$/.test(name));
if(legacy.some(name=>!/^[-a-zA-Z0-9_./]+$/.test(name)||name.includes('..')||name.startsWith('/')))throw new Error('Unrecognized legacy filename; inspect manually');
const plan={release,revision,files,legacyRemovedAfterBackup:legacy,backup:'/var/backups/ioninf-soft-'+release,config:'/opt/ion-edge/Caddyfile',site:'/var/www/ioninf-soft'};
await writeFile(path.join(folder,'plan.json'),JSON.stringify(plan,null,2));
console.log(JSON.stringify(plan,null,2));
if(!process.argv.includes('--apply')){console.log('Plan only. Inspect candidate diff and rerun with --apply to publish.');process.exit(0);}
if(run('git',['status','--porcelain']).trim())throw new Error('Commit reviewed source before deploying.');
run('tar',['-czf',path.join(folder,'site.tar.gz'),'-C',path.join(root,'dist'),'--',...files]);
const stage=ssh('mktemp -d /var/tmp/ion-soft-release.XXXXXX').trim();
if(!/^\/var\/tmp\/ion-soft-release\.[A-Za-z0-9]+$/.test(stage))throw new Error('Unexpected staging path');
run('scp',[...connection,path.join(folder,'site.tar.gz'),path.join(folder,'Caddyfile.candidate'),'root@213.165.34.164:'+stage+'/']);
ssh('set -eu\nmkdir '+quote(stage+'/site')+'\ntar -xzf '+quote(stage+'/site.tar.gz')+' -C '+quote(stage+'/site'));
const remoteHashes=ssh('cd '+quote(stage+'/site')+'\nsha256sum -- '+files.map(quote).join(' '));
const hashMap=new Map(remoteHashes.trim().split('\n').map(line=>[line.slice(66),line.slice(0,64)]));
for(const file of files)if(hashMap.get(file)!==createHash('sha256').update(await readFile(path.join(root,'dist',file))).digest('hex'))throw new Error('Staging checksum mismatch: '+file);
const inContainer='/tmp/ion-soft-'+release+'.Caddyfile';
ssh('set -eu\ndocker cp '+quote(stage+'/Caddyfile.candidate')+' avito-crm-caddy-1:'+quote(inContainer)+'\ndocker exec avito-crm-caddy-1 caddy validate --config '+quote(inContainer)+' --adapter caddyfile');
// Backups precede both writes and the explicitly enumerated legacy-file cleanup.
ssh('set -eu\nmkdir '+quote(plan.backup)+'\ncp -a /var/www/ioninf-soft '+quote(plan.backup+'/site')+'\ncp -a /opt/ion-edge/Caddyfile '+quote(plan.backup+'/Caddyfile'));
const commands=['set -eu',...files.filter(file=>file!=='index.html').map(file=>'install -D -m 644 '+quote(stage+'/site/'+file)+' '+quote(plan.site+'/'+file)),
  'install -m 644 '+quote(stage+'/site/index.html')+' '+quote(plan.site+'/.index-next'),
  'mv '+quote(plan.site+'/.index-next')+' '+quote(plan.site+'/index.html')];
if(legacy.length)commands.push('rm -- '+legacy.map(file=>quote(plan.site+'/'+file)).join(' '));
commands.push('cp '+quote(stage+'/Caddyfile.candidate')+' /opt/ion-edge/Caddyfile',
  'docker exec avito-crm-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile');
ssh(commands.join('\n'));
await writeFile(path.join(root,'test-results/deployment.json'),JSON.stringify({...plan,stage,publishedAt:new Date().toISOString()},null,2));
console.log('Published; backup retained at '+plan.backup+'. Run npm run test:production now.');
