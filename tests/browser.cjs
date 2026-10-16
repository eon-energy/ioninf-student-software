const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright');
const widths=[320,375,390,600,601,640,680,700,768,840,841,1024,1440];
const origin=process.env.TEST_URL||'http://127.0.0.1:4174';
const result={checks:[],widths,errors:[],performance:null};
const record=name=>{result.checks.push(name);console.log('PASS '+name);};
async function assertMinimalUI(page){
  assert.equal(await page.locator('.file-meta,.file-name,.source-links,.requirements,.small,.share-step,[data-share],figcaption,.platform-note,.tip,.step-count,.dialog-hint,.dialog-caption,footer').count(),0,'No ancillary microcopy or source links');
  const text=await page.locator('body').innerText();
  assert.ok(!/Официальный сайт|Официальная страница|Системные требования|Официальная инструкция|Скопировать ссылку на этот шаг|Скачайте, установите — и можно начинать\.|↗/.test(text),'No removed labels or decorative link arrows');
}
async function geometry(page){
  return page.evaluate(()=>{
    const errors=[],width=innerWidth;
    for(const el of document.querySelectorAll('button,a,select,input,h1,h2,h3,p,pre')){
      const r=el.getBoundingClientRect(),style=getComputedStyle(el);
      if(!r.width||!r.height||style.visibility==='hidden'||el.closest('dialog:not([open])'))continue;
      if(r.left < -1||r.right >width+1)errors.push(el.tagName+' '+el.textContent.trim().slice(0,50)+' outside '+r.left+':'+r.right);
      let parent=el.parentElement;
      while(parent){const ps=getComputedStyle(parent),pr=parent.getBoundingClientRect();if(['hidden','clip'].includes(ps.overflowX)&&(r.left<pr.left-1||r.right>pr.right+1))errors.push('clipped '+el.textContent.slice(0,30));parent=parent.parentElement;}
    }
    return errors;
  });
}
(async()=>{
  await fs.mkdir('test-results',{recursive:true});
  let server;
  if(!process.env.TEST_URL){const {createStaticServer}=await import('../scripts/serve.mjs');server=createStaticServer();await new Promise((resolve,reject)=>server.listen(4175,'127.0.0.1',resolve).on('error',reject));}
  const base=process.env.TEST_URL||'http://127.0.0.1:4175';
  const localChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser=await chromium.launch({headless:true,...(require('node:fs').existsSync(localChrome)?{executablePath:localChrome}:{})});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
    const page=await context.newPage();
    await page.addInitScript(()=>{window.scrollCalls=[];const original=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(options){window.scrollCalls.push(options?.behavior);return original.call(this,options);};});
    page.on('pageerror',error=>result.errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')result.errors.push(message.text());});
    const ready=async url=>{await page.goto(url);await page.waitForSelector('html[data-ready=true]');};
    await ready(base);
    await assertMinimalUI(page);
    assert.equal(await page.locator('.install-toggle:visible').count(),3);
    assert.equal(await page.locator('.install-panel:visible').count(),0);
    assert.equal(await page.locator('img').count(),1,'No hidden guide images in initial DOM');
    for(const width of widths){
      await page.setViewportSize({width,height:width===375?667:900});
      await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
      assert.deepEqual(await geometry(page),[],width+'px closed');
      if([375,601,1440].includes(width)){await page.waitForTimeout(150);await page.screenshot({path:'test-results/default-'+width+'.png'});}
      if(width===375){const r=await page.locator('[data-setup=python]').boundingBox();assert.ok(r.y+r.height<=667,'First install action visible without scrolling');}
      await page.locator('[data-setup=pycharm]').click();
      await page.locator('[data-os=windows]').click();
      assert.deepEqual(await geometry(page),[],width+'px expanded');
      await page.locator('[data-setup=pycharm]').click();
    }record('All 13 widths: actual edges, clipping and first mobile action');
    // This must detect the original failure, even when an ancestor hides overflow.
    await page.setViewportSize({width:601,height:900});
    await page.evaluate(()=>{const el=document.querySelector('.software-row');el.style.gridTemplateColumns='400px 400px';el.style.overflow='hidden';});
    assert.ok((await geometry(page)).length>0,'Geometry guard must catch deliberate clipped button');
    await ready(base+'/#programs');record('Negative mutation: clipped 601px button is detected');
    const catalog=JSON.parse(await fs.readFile('catalog.json','utf8'));
    const {getSections}=await import('../guide-data.js');
    const {downloadFor}=await import('../model.js');
    await page.setViewportSize({width:1024,height:900});
    for(const app of ['python','pycharm','libreoffice']){
      for(const os of ['windows','macos']){
        await ready(base+'/#guide/'+app+'/'+os+'/choose/install/download');
        if(os==='macos'&&app!=='python'){
          assert.equal(await page.locator('.download-link').count(),0);
          assert.equal(await page.locator('[data-chip][aria-pressed=true]').count(),0);
          for(const chip of ['apple','intel']){await page.locator('[data-chip="'+chip+'"]').click();assert.equal(await page.locator('.download-link').getAttribute('href'),downloadFor(catalog.programs[app],os,chip).url);}
        }else assert.equal(await page.locator('.download-link').getAttribute('href'),downloadFor(catalog.programs[app],os,null).url);
        assert.equal(await page.locator('.download-link').getAttribute('target'),'_blank');
        await assertMinimalUI(page);
        for(const section of getSections(app,os,catalog.programs)){
          await page.locator('[data-chapter="'+section.id+'"]').click();
          for(const step of section.steps){
            await page.locator('[data-step="'+step.id+'"]').click();
            assert.equal(await page.locator('#step-heading').textContent(),step.title);
            assert.deepEqual(await geometry(page),[],app+'/'+os+'/'+section.id+'/'+step.id);
            await assertMinimalUI(page);
            if(step.image){await page.locator('.image-zoom img').evaluate(img=>img.decode());assert.ok((await page.locator('.image-zoom img').getAttribute('alt')).includes(step.image.version));}
            if(step.code){await page.locator('[data-copy-code]').click();await page.waitForFunction(()=>document.querySelector('#copy-status').textContent==='Скопировано');}
          }
        }
      }
    }record('8 download variants, explicit chips; all 55 guide states and images; removed microcopy stays absent');
    await ready(base+'/#guide/python/macos/choose/install/verify');
    await page.locator('[data-open-app=pycharm]').click();
    assert.ok(page.url().includes('/pycharm/macos/'));
    await page.locator('[data-chip=intel]').click();
    await page.locator('[data-chapter=run]').click();await page.locator('[data-step=verify]').click();
    for(const i of [0,1,2])await page.locator('[data-confirm="'+i+'"]').check();
    assert.ok((await page.locator('.completion [role=status]').textContent()).startsWith('Готово'));
    await page.reload();await page.waitForSelector('html[data-ready=true]');
    assert.equal(await page.locator('[data-confirm]:checked').count(),3);
    assert.equal(await page.locator('[data-chip=intel]').getAttribute('aria-pressed'),'true');
    record('Python → PyCharm retains OS; explicit completion, reload, command copying and chip persistence');
    await page.locator('[data-prev]').click();const prev=page.url();await page.locator('[data-prev]').click();
    await page.goBack();await page.waitForFunction(url=>location.href===url,prev);assert.equal(await page.locator('#step-heading').textContent(),'Напишите и запустите код');
    await page.goForward();await page.waitForFunction(()=>location.hash.endsWith('/name-file'));
    assert.equal(await page.locator('#step-heading').textContent(),'Назовите файл main');
    await page.locator('[data-image]').click();assert.ok(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert.ok(!(await page.locator('dialog').isVisible()));assert.ok(await page.locator('[data-image]').evaluate(el=>el===document.activeElement));
    await page.locator('[data-reset]').click();assert.equal(await page.locator('.download-link').count(),0);record('Back/forward, dialog Escape + focus, reset');
    await ready(base+'/#guide/not-a-program/macos/apple/run/oops');assert.equal(await page.locator('.install-panel:visible').count(),0);
    await ready(base+'/#guide/python/garbage/garbage/garbage/garbage');assert.equal(await page.locator('.download-link').count(),0);record('Malformed deep links are safe');
    await ready(base+'/#guide/python/windows/choose/install/download');
    for(const width of [390,1440]){
      await page.setViewportSize({width,height:width===390?844:1000});
      await page.locator('#python-heading').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
      await page.waitForTimeout(150);await page.screenshot({path:'test-results/download-'+width+'.png'});
    }
    await ready(base+'/#guide/pycharm/windows/choose/run/new-file');
    await page.setViewportSize({width:390,height:844});await page.locator('#step-heading').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(150);await page.screenshot({path:'test-results/guide-390.png'});
    await page.setViewportSize({width:1440,height:1000});await page.locator('#step-heading').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(150);await page.screenshot({path:'test-results/guide-1440.png'});
    await page.locator('[data-image]').click();await page.screenshot({path:'test-results/dialog-1440.png'});await page.keyboard.press('Escape');
    // 200% page zoom: layout viewport is halved, matching browser zoom reflow.
    await page.setViewportSize({width:640,height:450});assert.deepEqual(await geometry(page),[]);
    // Additionally double all computed text sizes at 320px, not just rem units.
    await page.setViewportSize({width:320,height:800});
    await page.evaluate(()=>{for(const el of document.querySelectorAll('h1,h2,h3,h4,p,a,button,label,select,pre,.version,.signature,figcaption'))el.style.fontSize=parseFloat(getComputedStyle(el).fontSize)*2+'px';});
    assert.deepEqual(await geometry(page),[],'200% text at 320px');record('200% reflow/text stress, including 320px');
    assert.deepEqual(result.errors,[],'No console errors or CSP violations in normal flows');
    assert.ok((await page.evaluate(()=>window.scrollCalls)).every(behavior=>behavior==='instant'),'Reduced motion never requests smooth scrolling');
    await ready(base+'/#programs');await page.keyboard.press('Tab');
    const focused=await page.evaluate(()=>({color:getComputedStyle(document.activeElement).outlineColor,width:getComputedStyle(document.activeElement).outlineWidth}));
    assert.equal(focused.color,'rgb(0, 113, 227)');assert.equal(focused.width,'3px');
    await page.locator('[data-setup=python]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-setup=python]').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');assert.equal(await page.locator('[data-setup=python]').getAttribute('aria-expanded'),'false');
    record('Keyboard opening/Escape, opaque blue focus and reduced-motion scroll behavior');
    await context.close();
    const independent=await browser.newContext({reducedMotion:'no-preference'}),independentPage=await independent.newPage();
    await independentPage.addInitScript(()=>{window.scrollCalls=[];const original=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(options){window.scrollCalls.push(options?.behavior);return original.call(this,options);};document.addEventListener('DOMContentLoaded',()=>document.querySelector('#libreoffice-panel')?.remove(),{once:true});});
    await independentPage.goto(base);await independentPage.waitForSelector('html[data-ready=true]');
    assert.equal(await independentPage.locator('.install-toggle:visible').count(),2);assert.ok(await independentPage.locator('#libreoffice .fallback-guide').isVisible());
    await independentPage.locator('[data-setup=python]').click();await independentPage.locator('[data-os=windows]').click();assert.ok(await independentPage.locator('.download-link').isVisible());
    assert.ok((await independentPage.evaluate(()=>window.scrollCalls)).includes('smooth'),'Normal motion uses the shared smooth helper');
    await independent.close();record('One broken program keeps its fallback without disabling the other programs; normal motion');
    // Static fallback must survive both JS-disabled mode and independent bootstrap failures.
    for(const mode of ['disabled','script','guide-data','catalog']){
      const ctx=await browser.newContext({javaScriptEnabled:mode!=='disabled'});
      const p=await ctx.newPage();if(mode!=='disabled')await p.route('**/*',route=>route.request().url().includes('/'+mode+'.')?route.abort():route.continue());
      await p.goto(base);await p.waitForLoadState('networkidle');
      assert.equal(await p.locator('.fallback-guide:visible').count(),3,mode);
      assert.equal(await p.locator('.install-toggle:visible').count(),0,mode);
      for(const app of ['python','pycharm','libreoffice']){
        await p.locator('#'+app+' summary').click();
        const links=p.locator('#'+app+' .fallback-guide a');
        assert.equal(await links.count(),app==='python'?2:3);
        const expected=['windows','macos'].flatMap(os=>(os==='macos'&&app!=='python'?['apple','intel']:[null]).map(chip=>downloadFor(catalog.programs[app],os,chip).url));
        assert.deepEqual(await links.evaluateAll(els=>els.map(el=>el.href)),expected);
        for(const link of await links.all())assert.ok(await link.isVisible());
      }
      await assertMinimalUI(p);
      await ctx.close();
    }record('HTML fallback: JavaScript off, missing controller, guide module and catalog');
    const retryContext=await browser.newContext(),retry=await retryContext.newPage();let block=true;
    await retry.route('**/assets/guides/**',route=>block?route.abort():route.continue());
    await retry.goto(base+'/#guide/python/windows/choose/install/path');await retry.waitForSelector('.image-error:not([hidden])');
    block=false;await retry.locator('[data-retry-image]').click();await retry.locator('.image-zoom img').evaluate(img=>img.decode());
    assert.ok(retry.url().endsWith('/path'));await retryContext.close();record('Missing image: readable text + retry without losing step');
    for(const name of ['missing.jpg','missing.js','missing.css','unknown-route']){const response=await fetch(base+'/'+name);assert.equal(response.status,404);assert.ok(!(response.headers.get('content-type')||'').includes('text/html'));}
    record('Missing files/routes return real non-HTML 404');
    // Lab slow-network budget. Event Timing is interaction evidence, not field INP.
    const perfContext=await browser.newContext({viewport:{width:375,height:667},deviceScaleFactor:2});
    const perf=await perfContext.newPage(),cdp=await perfContext.newCDPSession(perf);
    await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
    await perf.addInitScript(()=>{
      window.metrics={lcp:0,cls:0,interaction:0};
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.interactionId)window.metrics.interaction=Math.max(window.metrics.interaction,e.duration);}).observe({type:'event',buffered:true,durationThreshold:16});
    });
    await perf.goto(base);await perf.waitForSelector('html[data-ready=true]');await perf.waitForLoadState('networkidle');await perf.locator('img').evaluate(img=>img.decode());
    const initial=await perf.evaluate(()=>({bytes:performance.getEntriesByType('navigation')[0].transferSize+performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.transferSize,0),resources:performance.getEntriesByType('resource').map(e=>e.name),...window.metrics}));
    assert.ok(initial.bytes<=500000,'Initial transfer budget '+initial.bytes);assert.ok(!initial.resources.some(url=>url.includes('/guides/')));
    await perf.locator('[data-setup=python]').click();await perf.waitForTimeout(200);
    result.performance={...initial,interactionLabMs:await perf.evaluate(()=>window.metrics.interaction),network:'1.6 Mbps down, 150ms latency; lab, not field INP'};
    await perfContext.close();record('Initial transfer ≤500KB; no hidden guide image downloads; slow-network lab metrics');
  }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));await fs.writeFile('test-results/browser.json',JSON.stringify(result,null,2));}
})().catch(error=>{console.error(error);process.exitCode=1;});
