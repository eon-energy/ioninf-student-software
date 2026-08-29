const platformConfig = {
  windows: {
    label: 'Windows',
    href: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/win/x86_64/LibreOffice_26.8.0_Win_x86-64.msi',
    file: 'LibreOffice_26.8.0_Win_x86-64.msi',
    description: 'Скачайте установщик и следуйте четырём шагам ниже.'
  },
  macos: {
    label: 'macOS',
    description: 'Скачайте образ программы и перенесите LibreOffice в «Программы».'
  }
};

const macDownloadUrls = {
  apple: {
    href: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/mac/aarch64/LibreOffice_26.8.0_MacOS_aarch64.dmg',
    file: 'LibreOffice_26.8.0_MacOS_aarch64.dmg'
  },
  intel: {
    href: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/mac/x86_64/LibreOffice_26.8.0_MacOS_x86-64.dmg',
    file: 'LibreOffice_26.8.0_MacOS_x86-64.dmg'
  }
};

const installToggle = document.querySelector('#install-toggle');
const installPanel = document.querySelector('#install-panel');
const platformButtons = [...document.querySelectorAll('.platform-option')];
const architecture = document.querySelector('#architecture');
const architectureButtons = [...document.querySelectorAll('.architecture-option')];
const instructionEmpty = document.querySelector('#instruction-empty');
const instructionReady = document.querySelector('#instruction-ready');
const instructionDescription = document.querySelector('#instruction-description');
const downloadLink = document.querySelector('#download-link');
const downloadLabel = document.querySelector('#download-label');
const downloadFile = document.querySelector('#download-file');
const windowsGuide = document.querySelector('#windows-guide');
const macGuide = document.querySelector('#mac-guide');
let selectedOs = null;
let selectedArchitecture = 'apple';

function setInstallOpen(open) {
  installPanel.hidden = !open;
  installToggle.setAttribute('aria-expanded', String(open));
  installToggle.querySelector('span').textContent = open ? 'Свернуть' : 'Установить';

  if (open) {
    if (window.matchMedia('(max-width: 600px)').matches) {
      installPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    installToggle.focus();
  }
}

function currentMacDownload() {
  return macDownloadUrls[selectedArchitecture];
}

function renderDownload() {
  if (!selectedOs) {
    instructionEmpty.hidden = false;
    instructionReady.hidden = true;
    return;
  }

  const config = platformConfig[selectedOs];
  const download = selectedOs === 'macos' ? currentMacDownload() : config;
  instructionEmpty.hidden = true;
  instructionReady.hidden = false;
  instructionDescription.textContent = config.description;
  downloadLink.href = download.href;
  downloadLabel.textContent = `Скачать для ${config.label}`;
  downloadFile.textContent = `${download.file} · официальный файл`;
  windowsGuide.hidden = selectedOs !== 'windows';
  macGuide.hidden = selectedOs !== 'macos';
}

function selectPlatform(os) {
  selectedOs = os;
  platformButtons.forEach((button) => {
    const selected = button.dataset.os === os;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  architecture.hidden = os !== 'macos';
  renderDownload();
}

installToggle.addEventListener('click', () => {
  setInstallOpen(installToggle.getAttribute('aria-expanded') !== 'true');
});

platformButtons.forEach((button) => {
  button.addEventListener('click', () => selectPlatform(button.dataset.os));
});

architectureButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedArchitecture = button.dataset.architecture;
    architectureButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderDownload();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !installPanel.hidden) setInstallOpen(false);
});
