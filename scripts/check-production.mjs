import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const origin=process.argv[2]||'https://soft.infa-ion.ru';
const report={origin,checkedAt:new Date().toISOString(),checks:[]};
const response=await fetch(origin,{cache:'no-store'});
assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/text\/html/);
assert.match(response.headers.get('cache-control'),/no-cache|must-revalidate/);
const csp=response.headers.get('content-security-policy');
for(const rule of ["script-src 'self'","style-src 'self'","object-src 'none'","frame-ancestors 'none'"])assert.ok(csp.includes(rule),rule);
assert.ok(!csp.includes('unsafe-inline'));
report.checks.push('HTML revalidates; restrictive CSP');
const html=await response.text();
const local=JSON.parse(await readFile(new URL('../dist/release-manifest.json',import.meta.url)));
for(const file of local.files){
  const r=await fetch(new URL(file,origin),{cache:'no-store'});assert.equal(r.status,200,file);
  const data=Buffer.from(await r.arrayBuffer());
  if(file!=='index.html'){
    assert.match(r.headers.get('cache-control'),/max-age=31536000.*immutable/,file);
    assert.ok(!r.headers.get('content-type').includes('text/html'),file);
    const hash=file.match(/\.([a-f0-9]{12})\.[^.]+$/)?.[1];assert.ok(hash);
    assert.equal(createHash('sha256').update(data).digest('hex').slice(0,12),hash,file);
  }
  assert.deepEqual(data,await readFile(new URL('../dist/'+file,import.meta.url)),file+' differs from release');
}
report.checks.push('All '+local.files.length+' deployed files match release; hashed assets immutable');
for(const file of ['missing.jpg','missing.js','missing.css','missing.123456abcdef.css','unknown-route','.git/config','README.md','catalog.json','assets/installation-reference.png','assets/im-ion-cutout-final.png']){
  const r=await fetch(new URL(file,origin));assert.equal(r.status,404,file);assert.ok(!(r.headers.get('cache-control')||'').includes('immutable'),'404 must not be immutable');report.checks.push(file+': 404');
}
const redirect=await fetch('https://soft.ioninf.ru/test/path?source=check',{redirect:'manual'});
assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'https://soft.infa-ion.ru/test/path?source=check');
report.checks.push('Legacy hostname preserves path and query in 308 redirect');
assert.ok(html.includes('Что установить'));
assert.ok(!/Официальный сайт|Системные требования|↗/.test(html));
await mkdir(new URL('../test-results/',import.meta.url),{recursive:true});
await writeFile(new URL('../test-results/production.json',import.meta.url),JSON.stringify(report,null,2));
console.log(report.checks.join('\n'));
