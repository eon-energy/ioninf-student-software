import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { downloadFor } from '../model.js';
const catalog = JSON.parse(await readFile(new URL('../catalog.json', import.meta.url)));
const report = { checkedAt: new Date().toISOString(), checks: [], errors: [] };
const verifyFiles = process.argv.includes('--verify-libreoffice');
const verifyMirrors = process.argv.includes('--verify-mirrors');
const only = process.argv.find(a=>a.startsWith('--only='))?.split('=')[1];
const allowedMime = /^(application\/(octet-stream|x-msi|x-msdownload|vnd\.microsoft\.portable-executable|x-apple-diskimage|x-xar|x-msdos-program)|binary\/octet-stream)(;|$)/;

export async function checkedFetch(url, { method = 'HEAD', allowedHosts = catalog.allowedDownloadHosts, headers = {}, timeout = 30000, fetchImpl = fetch } = {}) {
  const chain = [];
  for (let hop=0;hop<8;hop++) {
    const target = new URL(url);
    assert.equal(target.protocol,'https:',`Blocked insecure redirect: ${url}`);
    assert.ok(allowedHosts.includes(target.hostname),`Blocked unapproved host: ${target.hostname}`);
    const response = await fetchImpl(url,{method,headers:{'Accept-Encoding':'identity',...headers},redirect:'manual',signal:AbortSignal.timeout(timeout)});
    chain.push({url: target.origin+target.pathname,status:response.status});
    if ([301,302,303,307,308].includes(response.status)) {
      const location=response.headers.get('location');assert.ok(location,'Redirect without Location');
      await response.body?.cancel();url=new URL(location,url).href;continue;
    }
    return { response, chain };
  }
  throw new Error('Redirect limit exceeded');
}

// Negative tests prove that protocol and allowlist checks actually reject unsafe paths.
for (const url of ['http://www.python.org/file.exe','https://unapproved.invalid/file.exe']) {
  await assert.rejects(checkedFetch(url));
}
for (const location of ['http://www.python.org/file.exe','https://unapproved.invalid/file.exe']) {
  await assert.rejects(checkedFetch('https://www.python.org/file.exe',{fetchImpl:async()=>new Response(null,{status:302,headers:{location}})}));
}
assert.doesNotMatch('text/html; charset=utf-8',allowedMime,'A 200 HTML error page is not an installer');
if(process.argv.includes('--self-test')){console.log('Negative download checks passed: protocol, host, redirected protocol/host, HTML MIME.');process.exit(0);}

for (const [id,program] of Object.entries(catalog.programs)) {
  if (only && only!==id) continue;
  for (const platform of Object.keys(program.downloads)) {
    const file=downloadFor(program,platform==='windows'?'windows':'macos',platform);
    try {
      const {response,chain}=await checkedFetch(file.url);
      assert.equal(response.status,200);
      const mime=response.headers.get('content-type')||'';
      assert.match(mime,allowedMime,`Not an installer MIME: ${mime}`);
      assert.equal(Number(response.headers.get('content-length')),file.bytes,'File size changed');
      const item={program:id,platform,chain,mime,bytes:file.bytes};
      const {response:sample}=await checkedFetch(file.url,{method:'GET',headers:{Range:'bytes=0-15'}});
      assert.equal(sample.status,206,'Server must support a small byte-range check');
      const prefix=Buffer.from(await sample.arrayBuffer());
      if(file.type==='exe') assert.equal(prefix.subarray(0,2).toString(),'MZ');
      if(file.type==='pkg') assert.equal(prefix.subarray(0,4).toString(),'xar!');
      if(file.type==='msi') assert.equal(prefix.subarray(0,8).toString('hex'),'d0cf11e0a1b11ae1');
      if(file.type==='dmg') {
        const {response:tail}=await checkedFetch(file.url,{method:'GET',headers:{Range:`bytes=${file.bytes-512}-${file.bytes-1}`}});
        assert.equal(tail.status,206);assert.equal(Buffer.from(await tail.arrayBuffer()).subarray(0,4).toString(),'koly');
      }
      item.fileSignature='passed';
      if(file.mirrored) {
        assert.equal(chain.length,1,'Owned mirror must not redirect to the publisher');
        assert.match(response.headers.get('content-disposition')||'',/^attachment;/i);
        assert.equal(response.headers.get('x-amz-meta-sha256'),file.sha256);
        const {response:checksum}=await checkedFetch(file.integritySource,{method:'GET',allowedHosts:catalog.allowedIntegrityHosts});
        assert.equal(checksum.status,200);
        const [publisherHash,publisherFile]=(await checksum.text()).trim().split(/\s+/);
        assert.equal(publisherHash,file.sha256);
        assert.equal(publisherFile.replace(/^\*/,''),new URL(file.url).pathname.split('/').at(-1));
        item.publisherChecksum=file.sha256;
        if(verifyMirrors) {
          console.log(`Hashing owned mirror ${id}/${platform} (${file.bytes} bytes; not executing)...`);
          const {response:binary}=await checkedFetch(file.url,{method:'GET',timeout:600000});
          assert.equal(binary.status,200);const hash=createHash('sha256');let size=0;
          for await(const chunk of binary.body){hash.update(chunk);size+=chunk.length;}
          assert.equal(size,file.bytes);assert.equal(hash.digest('hex'),file.sha256);item.fullSha256Verified=true;
        }
      }
      if(id==='libreoffice') {
        // MirrorBrain can omit country-only mirrors for a CI runner abroad.
        // Select the mirror's documented country for metadata, not for the binary request.
        const metadataUrl=new URL(file.integritySource);
        if(program.mirrorCountry)metadataUrl.searchParams.set('country',program.mirrorCountry);
        const {response:metadata}=await checkedFetch(metadataUrl.href,{method:'GET',allowedHosts:catalog.allowedIntegrityHosts});
        assert.equal(metadata.status,200);
        const html=await metadata.text();assert.ok(html.includes(file.sha256));assert.ok(html.includes(file.url),'Mirror is not listed by publisher');
        item.publisherChecksum=file.sha256;
        item.mirrorListCountry=program.mirrorCountry||null;
        if(verifyFiles) {
          console.log(`Hashing ${id}/${platform} (${file.bytes} bytes; not executing)...`);
          const {response:binary}=await checkedFetch(file.url,{method:'GET',timeout:600000});
          assert.equal(binary.status,200);const hash=createHash('sha256');let size=0;
          for await(const chunk of binary.body){hash.update(chunk);size+=chunk.length;}
          assert.equal(size,file.bytes);assert.equal(hash.digest('hex'),file.sha256);item.fullSha256Verified=true;
        }
      }
      report.checks.push(item);console.log(`PASS ${id}/${platform}: ${chain.length} HTTPS hop(s), ${mime}, signature OK`);
    } catch(error) { report.errors.push({program:id,platform,message:error.message});console.error(`FAIL ${id}/${platform}: ${error.message}`); }
  }
}
await mkdir(new URL('../test-results/',import.meta.url),{recursive:true});
await writeFile(new URL('../test-results/downloads.json',import.meta.url),JSON.stringify(report,null,2));
if(report.errors.length) process.exitCode=1;
