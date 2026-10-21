export const PROGRAM_ORDER = ['python', 'pycharm', 'libreoffice'];
export const STORAGE_KEY = 'ion-soft-progress-v1';

export function resolveVersion(template, program) {
  return template.replaceAll('{version}', program.version).replaceAll('{versionCompact}', program.version.replaceAll('.', ''));
}

export function downloadFor(program, os, architecture) {
  const key = os === 'windows' ? 'windows' : program.downloads.macos ? 'macos' : architecture;
  const data = program.downloads[key];
  if (!data) return null;
  const release = { version: data.version || program.version };
  return { ...data, version: release.version, url: resolveVersion(data.url, release), integritySource: resolveVersion(data.integritySource, release) };
}

export function formatBytes(bytes) {
  return bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(2).replace('.', ',')} ГБ` : `${(bytes / 1024 ** 2).toFixed(1).replace('.', ',')} МБ`;
}

export function interpolate(text, programs) {
  return text?.replace(/\{\{(python|pycharm|libreoffice)\.(version|series)\}\}/g, (_, app, field) => field === 'series' ? programs[app].version.split('.').slice(0, 2).join('.') : programs[app].version);
}

export function encodeRoute(state) {
  if (!state.app) return '#programs';
  return `#guide/${state.app}/${state.os || 'choose'}/${state.architecture || 'choose'}/${state.chapter || 'install'}/${state.step || 'download'}`;
}

export function decodeRoute(hash, programs, sectionsFor) {
  if (!hash.startsWith('#guide/')) return null;
  const [, app, os, architecture, chapter, step] = hash.split('/');
  if (!Object.hasOwn(programs, app)) return { app: null, os: null, architecture: null };
  const platform = ['windows', 'macos'].includes(os) ? os : null;
  const chip = ['apple', 'intel'].includes(architecture) ? architecture : null;
  const sections = sectionsFor(app, platform || 'windows');
  const section = sections.find(s => s.id === chapter) || sections[0];
  const current = section.steps.find(s => s.id === step) || section.steps[0];
  return { app, os: platform, architecture: platform === 'macos' ? chip : null, chapter: section.id, step: current.id };
}

export function scrollToContent(element) {
  // A single motion rule for all software; CSS controls the sticky-header offset.
  element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}
