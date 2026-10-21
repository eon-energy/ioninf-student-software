import { getSections } from './guide-data.js';
import { PROGRAM_ORDER, STORAGE_KEY, downloadFor, encodeRoute, decodeRoute, scrollToContent } from './model.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = 'target="_blank" rel="noopener noreferrer"';
const entries = new Map();
let catalog, programs, state = { app: null, os: null, architecture: null }, confirmations = {};
const sectionsFor = (app, os) => getSections(app, os, programs);
function remember() { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({state, confirmations})); } catch { /* URLs work without storage. */ } }
function writeRoute(replace = false) { history[replace ? 'replaceState' : 'pushState']({}, '', encodeRoute(state)); remember(); }
function current() {
  if (!state.app) return {};
  const sections = sectionsFor(state.app, state.os || 'windows');
  const section = sections.find(s => s.id === state.chapter) || sections[0];
  const step = section.steps.find(s => s.id === state.step) || section.steps[0];
  state.chapter = section.id; state.step = step.id;
  return {sections, section, step, index: section.steps.indexOf(step)};
}
function setState(patch, {focus, scroll = false, replace = false} = {}) {
  state = {...state, ...patch}; current(); render(); writeRoute(replace);
  const element = focus && document.querySelector(focus);
  element?.focus({preventScroll:true}); if (element && scroll) scrollToContent(element);
}
function openProgram(app) { setState({app,chapter:'install',step:'download'}, {focus:'#'+app+'-heading',scroll:true}); }
function closeProgram() { const app = state.app; setState({app:null}); entries.get(app)?.toggle.focus({preventScroll:true}); }

function annotatedImage(image, unique) {
  const marks = image.marks.map((m, i) => {
    const [x,y,w,h] = m.box, [fx,fy] = m.from;
    const tx = Math.max(x, Math.min(fx, x+w)), ty = Math.max(y, Math.min(fy, y+h));
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3"/><path d="M '+fx+' '+fy+' L '+tx+' '+ty+'" marker-end="url(#arrow-'+unique+')"/><circle cx="'+fx+'" cy="'+fy+'" r="15"/><text x="'+fx+'" y="'+(fy+5)+'">'+(i+1)+'</text>';
  }).join('');
  return '<span class="annotated-image"><img src="'+esc(catalog.assets[image.src])+'" width="'+image.width+'" height="'+image.height+'" alt="'+esc(current().step.title)+' — '+image.os+', версия '+image.version+'"><svg viewBox="0 0 '+image.width+' '+image.height+'" aria-hidden="true"><defs><marker id="arrow-'+unique+'" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="arrowhead"/></marker></defs>'+marks+'</svg></span>';
}
function downloadMarkup(program) {
  if (!state.os) return '';
  const file = downloadFor(program, state.os, state.architecture);
  if (!file) return '';
  return '<div class="download-info"><a class="primary download-link" href="'+esc(file.url)+'" '+external+'>Скачать '+esc(program.name)+' '+esc(file.version)+'</a></div>';
}
function completionMarkup() {
  if (state.app === 'python') return '<div class="completion"><h4>Python установлен?</h4><button class="primary" data-open-app="pycharm">Перейти к установке PyCharm</button></div>';
  if (state.app === 'libreoffice') return '<div class="completion"><button data-return>Вернуться к программам</button></div>';
  const checked = confirmations[state.os] || [];
  const labels = ['В проекте выбран Python '+programs.python.version.split('.').slice(0,2).join('.'), 'Файл main.py запускается без ошибки', 'В окне Run вижу hello world и exit code 0'];
  return '<div class="completion"><h4>Подтвердите результат на своём компьютере</h4>'+labels.map((label,i)=>'<label class="check-result"><input type="checkbox" data-confirm="'+i+'" '+(checked.includes(i)?'checked':'')+'> <span>'+esc(label)+'</span></label>').join('')+'<p role="status">'+(checked.length===3?'Готово к занятиям':'')+'</p><button data-return>Вернуться к программам</button></div>';
}
function guideMarkup() {
  const {sections,section,step,index} = current();
  const chapterIndex = sections.indexOf(section), last = chapterIndex===sections.length-1 && index===section.steps.length-1;
  let html='<div class="guide"><nav class="chapter-nav" aria-label="Разделы инструкции">'+sections.map(s=>'<button data-chapter="'+s.id+'" aria-current="'+(s===section?'step':'false')+'">'+esc(s.title)+'</button>').join('')+'</nav><div class="guide-layout"><nav class="step-nav" aria-label="Шаги раздела">'+section.steps.map((s,i)=>'<button data-step="'+s.id+'" aria-current="'+(s===step?'step':'false')+'"><span>'+(i+1)+'.</span> '+esc(s.title)+'</button>').join('')+'</nav><div class="step-content"><label class="mobile-step">Перейти к шагу<select data-step-select>'+section.steps.map((s,i)=>'<option value="'+s.id+'" '+(s===step?'selected':'')+'>'+(i+1)+'. '+esc(s.title)+'</option>').join('')+'</select></label><h3 id="step-heading" tabindex="-1">'+esc(step.title)+'</h3><p>'+esc(step.text)+'</p>';
  if(step.code)html+='<div class="code-block"><pre><code>'+esc(step.code)+'</code></pre><button data-copy-code>Копировать команду</button><span role="status" id="copy-status"></span></div>';
  if(step.image) {
    html+='<figure><button class="image-zoom" data-image aria-label="Увеличить скриншот: '+esc(step.title)+'">'+annotatedImage(step.image,'step')+'</button><div class="image-error" hidden><p>Скриншот не загрузился. Текст шага выше остаётся доступен.</p><button data-retry-image>Повторить загрузку изображения</button></div></figure>';
  }
  if(step.expected)html+='<p class="expected-label">Ожидаемый результат</p><pre class="expected">'+esc(step.expected)+'</pre>';
  if(last)html+=completionMarkup();
  html+='<div class="step-actions"><button data-prev '+(chapterIndex===0&&index===0?'disabled':'')+'>Назад</button>'+(!last?'<button class="primary" data-next>'+(index===section.steps.length-1?'Далее: '+esc(sections[chapterIndex+1].title):'Следующий шаг')+'</button>':'')+'</div></div></div></div>';
  return html;
}
function render() {
  for (const [app,entry] of entries) {
    const open=state.app===app;
    entry.toggle.setAttribute('aria-expanded',String(open));
    entry.toggle.textContent=(open?'Свернуть ':'Установить ')+programs[app].name;
    entry.panel.hidden=!open;
    if(!open){entry.panel.replaceChildren();continue;}
    const program=programs[app];
    let html='<h2 id="'+app+'-heading" class="panel-title" tabindex="-1">Установка '+esc(program.name)+'</h2><div class="setup-controls"><div><p class="control-label" id="system-label">Какая у вас система?</p><div class="choice-group" role="group" aria-labelledby="system-label">'+[['windows','Windows x64'],['macos','macOS']].map(([id,label])=>'<button data-os="'+id+'" aria-pressed="'+(state.os===id)+'">'+label+'</button>').join('')+'</div></div>';
    if(state.os==='macos'&&!program.downloads.macos)html+='<div><p class="control-label" id="chip-label">Процессор Mac</p><div class="choice-group" role="group" aria-labelledby="chip-label">'+[['apple','Apple Silicon'],['intel','Intel']].map(([id,label])=>'<button data-chip="'+id+'" aria-pressed="'+(state.architecture===id)+'">'+label+'</button>').join('')+'</div></div>';
    html+='<button class="reset" data-reset aria-label="Сбросить выбор и прогресс">Сбросить</button></div>';
    entry.panel.innerHTML=html+downloadMarkup(program)+(state.os?guideMarkup():'');
    entry.panel.querySelector('.image-zoom img')?.addEventListener('error',()=>{entry.panel.querySelector('.image-zoom').hidden=true;entry.panel.querySelector('.image-error').hidden=false;});
  }
}
function advance(delta) {
  const {sections,section,index}=current();let ci=sections.indexOf(section),si=index+delta;
  if(si<0){ci--;si=sections[ci]?.steps.length-1;}else if(si>=section.steps.length){ci++;si=0;}
  if(sections[ci]?.steps[si])setState({chapter:sections[ci].id,step:sections[ci].steps[si].id},{focus:'#step-heading',scroll:true});
}
async function copy(text) {
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText(text);status.textContent='Скопировано';}
  catch{status.textContent='Не удалось скопировать. Выделите команду вручную.';}
}
const dialog=document.querySelector('#image-dialog');let imageOpener;
function closeImage(){dialog.close();imageOpener?.focus({preventScroll:true});}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.matches('[data-setup]'))return state.app===button.dataset.setup?closeProgram():openProgram(button.dataset.setup);
  if(button.matches('[data-open-app]'))return openProgram(button.dataset.openApp);
  if(button.matches('[data-return]')){closeProgram();scrollToContent(document.querySelector('#programs'));return;}
  if(button.matches('[data-os]'))return setState({os:button.dataset.os,architecture:null,chapter:'install',step:'download'},{focus:'[data-os="'+button.dataset.os+'"]'});
  if(button.matches('[data-chip]'))return setState({architecture:button.dataset.chip},{focus:'[data-chip="'+button.dataset.chip+'"]'});
  if(button.matches('[data-reset]')){confirmations={};return setState({os:null,architecture:null,chapter:'install',step:'download'},{focus:'[data-os="windows"]'});}
  if(button.matches('[data-chapter]'))return setState({chapter:button.dataset.chapter,step:null},{focus:'#step-heading',scroll:true});
  if(button.matches('[data-step]'))return setState({step:button.dataset.step},{focus:'#step-heading',scroll:true});
  if(button.matches('[data-prev]'))return advance(-1);
  if(button.matches('[data-next]'))return advance(1);
  if(button.matches('[data-copy-code]'))return copy(current().step.code);
  if(button.matches('[data-image]')){imageOpener=button;dialog.querySelector('.dialog-scroll').innerHTML=annotatedImage(current().step.image,'dialog');dialog.querySelector('#image-dialog-title').textContent=current().step.title;dialog.showModal();dialog.querySelector('[data-close-image]').focus();return;}
  if(button.matches('[data-close-image]'))return closeImage();
  if(button.matches('[data-retry-image]')){const figure=button.closest('figure'),zoom=figure.querySelector('.image-zoom'),img=zoom.querySelector('img');zoom.hidden=false;figure.querySelector('.image-error').hidden=true;img.src=catalog.assets[current().step.image.src]+'?retry='+Date.now();}
});
document.addEventListener('change',event=>{
  if(event.target.matches('[data-step-select]'))setState({step:event.target.value},{focus:'#step-heading',scroll:true});
  if(event.target.matches('[data-confirm]')){const key=Number(event.target.dataset.confirm),checked=new Set(confirmations[state.os]||[]);event.target.checked?checked.add(key):checked.delete(key);confirmations[state.os]=[...checked];remember();event.target.closest('.completion').querySelector('[role="status"]').textContent=checked.size===3?'Готово к занятиям':'';}
});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeImage();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.open&&document.activeElement?.closest('.install-panel'))closeProgram();});
function restoreRoute(){
  if(!programs)return;
  state=decodeRoute(location.hash,programs,sectionsFor)||{...state,app:null};current();render();remember();
  const heading=state.app&&document.querySelector('#'+state.app+'-heading');heading?.focus({preventScroll:true});if(heading)scrollToContent(heading);
}
window.addEventListener('popstate',restoreRoute);
window.addEventListener('hashchange',()=>{if(programs&&location.hash!==encodeRoute(state))restoreRoute();});
async function init(){
  new ResizeObserver(([entry])=>document.documentElement.style.setProperty('--header-height',entry.target.getBoundingClientRect().height+'px')).observe(document.querySelector('.topbar'));
  const response=await fetch(new URL('./catalog.json',import.meta.url));if(!response.ok)throw new Error('Catalog unavailable');
  catalog=await response.json();programs=catalog.programs;
  let saved;try{saved=JSON.parse(sessionStorage.getItem(STORAGE_KEY));}catch{/* Optional storage. */}
  const restored=saved?.state;
  if(restored)state=decodeRoute(encodeRoute(restored),programs,sectionsFor)||{app:null,os:['windows','macos'].includes(restored.os)?restored.os:null,architecture:['apple','intel'].includes(restored.architecture)?restored.architecture:null};
  if(location.hash)state=decodeRoute(location.hash,programs,sectionsFor)||{...state,app:PROGRAM_ORDER.includes(location.hash.slice(1))?location.hash.slice(1):null};
  for(const os of ['windows','macos'])confirmations[os]=[...new Set(Array.isArray(saved?.confirmations?.[os])?saved.confirmations[os].filter(n=>[0,1,2].includes(n)):[])];
  for(const app of PROGRAM_ORDER){try{const element=document.querySelector('[data-program="'+app+'"]'),toggle=element.querySelector('[data-setup]'),panel=element.querySelector('.install-panel');if(!toggle||!panel)throw new Error('Incomplete program markup');entries.set(app,{element,toggle,panel});toggle.hidden=false;element.classList.add('is-enhanced');}catch(error){console.warn('Text fallback retained for '+app,error);}}
  current();render();document.querySelector('#enhancement-status').hidden=entries.size===PROGRAM_ORDER.length;
  if(state.app){writeRoute(true);document.querySelector('#'+state.app+'-heading')?.scrollIntoView({behavior:'instant',block:'start'});}
  document.documentElement.dataset.ready='true';
}
init().catch(error=>{for(const entry of entries.values()){entry.element.classList.remove('is-enhanced');entry.toggle.hidden=true;entry.panel.hidden=true;}document.querySelector('#enhancement-status').hidden=false;document.querySelector('#enhancement-status').textContent='Не удалось открыть инструкцию. Используйте текстовые шаги ниже.';console.warn('Using static software instructions',error);});
