import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getSections } from '../guide-data.js';
import { encodeRoute, decodeRoute, downloadFor } from '../model.js';
const programs = JSON.parse(readFileSync(new URL('../catalog.json', import.meta.url))).programs;
const sections = (app,os) => getSections(app,os,programs);
test('Mac requires an explicit chip except the universal Python installer', () => {
  assert.equal(downloadFor(programs.pycharm,'macos',null), null);
  assert.equal(downloadFor(programs.libreoffice,'macos',null), null);
  assert.ok(downloadFor(programs.python,'macos',null).url.endsWith('.pkg'));
  assert.notEqual(downloadFor(programs.pycharm,'macos','apple').url,downloadFor(programs.pycharm,'macos','intel').url);
});
test('stable deep links round trip, without retaining invalid platform data', () => {
  const state={app:'pycharm',os:'macos',architecture:'intel',chapter:'project',step:'interpreter'};
  assert.deepEqual(decodeRoute(encodeRoute(state),programs,sections),state);
  assert.equal(decodeRoute('#guide/unknown/windows/choose/install/download',programs,sections).app,null);
  assert.equal(decodeRoute('#guide/__proto__/windows/choose/install/download',programs,sections).app,null);
  const old=decodeRoute('#guide/python/windows/apple/obsolete/step99',programs,sections);
  assert.equal(old.chapter,'install');assert.equal(old.step,'download');assert.equal(old.architecture,null);
});
test('changing catalog version changes filenames and verification command together', () => {
  const changed=structuredClone(programs);changed.python.version='3.99.42';
  assert.ok(downloadFor(changed.python,'windows',null).url.endsWith('python-3.99.42-amd64.exe'));
  const verify=getSections('python','windows',changed)[0].steps.at(-1);
  assert.equal(verify.code,'py -3.99 --version');assert.equal(verify.expected,'Python 3.99.42');
});
test('LibreOffice uses six original Windows screenshots in order, not on Mac', () => {
  const windows=sections('libreoffice','windows')[0].steps;
  assert.deepEqual(windows.map(step=>step.id),['download','setup','install','wait','finish','launch','verify']);
  assert.equal(windows.filter(step=>step.image).length,6);
  for(const step of windows.filter(step=>step.image)){
    assert.equal(step.image.src,'assets/guides/libreoffice-'+step.id+'.jpg');
    assert.equal(step.image.os,'Windows');
    assert.equal(step.image.version,'26.8.0.3');
    assert.ok(step.image.marks.length>0);
  }
  assert.ok(windows.find(step=>step.id==='setup').text.includes('«Типичный»'));
  assert.equal(sections('libreoffice','macos')[0].steps.filter(step=>step.image).length,0);
  const changed=structuredClone(programs);changed.libreoffice.version='99.1.2';
  assert.ok(getSections('libreoffice','windows',changed)[0].steps[0].text.includes('LibreOffice_99.1.2_Win_x86-64.msi'));
  assert.equal(getSections('libreoffice','windows',changed)[0].steps[0].image.version,'26.8.0.3');
  for(const step of ['download','setup','install','finish','verify']){
    assert.equal(decodeRoute('#guide/libreoffice/windows/choose/install/'+step,programs,sections).step,step);
  }
});
