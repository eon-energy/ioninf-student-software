import {readFile,writeFile,mkdir,readdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getSections} from '../guide-data.js';
import {PROGRAM_ORDER,downloadFor} from '../model.js';
const root=fileURLToPath(new URL('../',import.meta.url)),output=path.join(root,'dist');
const catalog=JSON.parse(await readFile(path.join(root,'catalog.json'),'utf8'));
await mkdir(output,{recursive:true});
// Delete only files enumerated by our previous build, never arbitrary repository files.
try{for(const file of JSON.parse(await readFile(path.join(output,'release-manifest.json'),'utf8')).files){if(!file.includes('..')&&!path.isAbsolute(file))await unlink(path.join(output,file)).catch(()=>{});}}catch{}
const files=[],assets={};
async function emit(name,content,hashed=true){
  const ext=path.extname(name),stem=name.slice(0,-ext.length);
  const target=hashed?stem+'.'+createHash('sha256').update(content).digest('hex').slice(0,12)+ext:name;
  await mkdir(path.dirname(path.join(output,target)),{recursive:true});
  await writeFile(path.join(output,target),content);files.push(target);return target;
}
const imagePaths=new Set(['assets/favicon.svg','assets/portrait-320.webp','assets/portrait-640.webp','assets/fonts/bad-script-signature.woff2','assets/fonts/OFL.txt']);
for(const app of PROGRAM_ORDER)for(const os of ['windows','macos'])for(const section of getSections(app,os,catalog.programs))for(const step of section.steps)if(step.image)imagePaths.add(step.image.src);
for(const asset of imagePaths)assets[asset]=await emit(asset,await readFile(path.join(root,asset)));
const catalogName=await emit('catalog.json',JSON.stringify({...catalog,assets}));
const model=await emit('model.js',await readFile(path.join(root,'model.js')));
const guide=await emit('guide-data.js',(await readFile(path.join(root,'guide-data.js'),'utf8')).replace('./model.js','./'+model));
const script=await emit('script.js',(await readFile(path.join(root,'script.js'),'utf8')).replace('./model.js','./'+model).replace('./guide-data.js','./'+guide).replace('./catalog.json','./'+catalogName));
let css=await readFile(path.join(root,'styles.css'),'utf8');
for(const [source,target]of Object.entries(assets))css=css.replaceAll(source,target);
const styles=await emit('styles.css',css);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external='target="_blank" rel="noopener noreferrer"';
const programRows=PROGRAM_ORDER.map(app=>{
  const program=catalog.programs[app];
  const fallback=['windows','macos'].map(os=>{
    const chips=os==='macos'&&!program.downloads.macos?['apple','intel']:[null];
    const downloads=chips.map(chip=>'<a class="primary" href="'+esc(downloadFor(program,os,chip).url)+'" '+external+'>Скачать '+esc(program.name)+' '+esc(program.version)+(chip?' · '+(chip==='apple'?'Apple Silicon':'Intel'):'')+'</a>').join('');
    return '<h4>'+(os==='windows'?'Windows x64':'macOS')+'</h4><div class="fallback-downloads">'+downloads+'</div><ol>'+getSections(app,os,catalog.programs).flatMap(section=>section.steps).map(step=>'<li><strong>'+esc(step.title)+'.</strong> '+esc(step.text)+(step.code?'<pre>'+esc(step.code)+'</pre>':'')+(step.expected?'<pre>'+esc(step.expected)+'</pre>':'')+'</li>').join('')+'</ol>';
  }).join('');
  return '<article class="software-entry" id="'+app+'" data-program="'+app+'"><div class="software-row"><div class="software-copy"><h3>'+program.name+' <span class="version">'+program.version+'</span></h3><p>'+program.role+'</p></div><button class="primary install-toggle" data-setup="'+app+'" aria-expanded="false" aria-controls="'+app+'-panel" hidden>Установить '+program.name+'</button></div><div class="install-panel" id="'+app+'-panel" hidden></div><details class="fallback-guide"><summary>Инструкция по установке '+program.name+'</summary>'+fallback+'</details></article>';
}).join('\n');
let html=(await readFile(path.join(root,'index.template.html'),'utf8')).replace('{{programRows}}',programRows).replace('{{styles}}',styles).replace('{{script}}',script);
html=html.replace(/\{\{asset:([^}]+)\}\}/g,(_,asset)=>assets[asset]);
if(html.includes('{{'))throw new Error('Unresolved HTML token');
await emit('index.html',html,false);
await writeFile(path.join(output,'release-manifest.json'),JSON.stringify({schemaVersion:1,files:files.sort()},null,2)+'\n');
console.log('Built '+files.length+' allowlisted files; no repository, mockup or full-size portrait published.');
