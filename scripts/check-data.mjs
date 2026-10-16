import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getSections } from '../guide-data.js';
import { PROGRAM_ORDER, downloadFor, resolveVersion } from '../model.js';
const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('catalog.json', root), 'utf8'));
let links = 0, steps = 0;
function jpegSize(bytes) {
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset++] !== 0xff) continue;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = bytes.readUInt16BE(offset);
    if ([0xc0,0xc1,0xc2].includes(marker)) return [bytes.readUInt16BE(offset+5),bytes.readUInt16BE(offset+3)];
    offset += length;
  }
  throw new Error('Cannot read JPEG dimensions');
}
for (const id of PROGRAM_ORDER) {
  const program = catalog.programs[id];
  assert.match(program.version, /^\d+\.\d+\.\d+$/);
  for (const field of ['owner','checkedAt']) assert.ok(catalog[field]);
  assert.ok(program.pinnedReason && program.requirements.windows && program.requirements.macos);
  assert.equal(new URL(resolveVersion(program.source, program)).protocol, 'https:');
  for (const platform of id === 'python' ? ['windows','macos'] : ['windows','apple','intel']) {
    const file = downloadFor(program, platform === 'windows' ? 'windows' : 'macos', platform);
    assert.ok(file, `${id} ${platform} is required`);
    const url = new URL(file.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(catalog.allowedDownloadHosts.includes(url.hostname), `Unapproved host ${url.hostname}`);
    assert.ok(url.pathname.includes(program.version));
    assert.ok(url.pathname.endsWith('.'+file.type));
    assert.ok(Number.isInteger(file.bytes) && file.bytes > 1e6);
    links++;
  }
  for (const os of ['windows','macos']) {
    const sections = getSections(id, os, catalog.programs);
    assert.equal(new Set(sections.map(s=>s.id)).size, sections.length);
    for (const section of sections) {
      assert.ok(section.steps.length > 0);
      assert.equal(new Set(section.steps.map(s=>s.id)).size, section.steps.length);
      for (const step of section.steps) {
        steps++;
        assert.ok(step.id && step.title && step.text);
        assert.ok(!JSON.stringify(step).includes('{{'), `${id}: unresolved template`);
        if (!step.image) continue;
        const image = step.image;
        assert.equal(image.provenance, 'Скриншот преподавателя');
        const path = new URL(image.src, root);
        await stat(path);
        assert.deepEqual(jpegSize(await readFile(path)), [image.width,image.height], image.src);
        for (const {box:[x,y,w,h],from:[fx,fy]} of image.marks) {
          assert.ok([x,y,w,h,fx,fy].every(Number.isFinite));
          assert.ok(x>=0 && y>=0 && w>0 && h>0 && x+w<=image.width && y+h<=image.height, `Box outside ${image.src}`);
          assert.ok(fx>=0 && fy>=0 && fx<=image.width && fy<=image.height, `Arrow outside ${image.src}`);
        }
      }
    }
  }
}
console.log(`Catalog OK: ${links} installers, ${steps} platform step states. Root: ${fileURLToPath(root)}`);
