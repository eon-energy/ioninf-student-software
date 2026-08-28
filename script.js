const platformConfig = {
  windows: {
    label: 'Windows',
    downloadUrl: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/win/x86_64/LibreOffice_26.8.0_Win_x86-64.msi',
    steps: [
      ['Дождитесь загрузки', 'Файл LibreOffice_26.8.0_Win_x86-64.msi появится в папке «Загрузки».'],
      ['Откройте файл', 'Найдите загруженный файл в папке «Загрузки» и запустите его двойным нажатием.'],
      ['Завершите установку', 'Нажимайте «Далее», оставляя стандартные настройки. В конце нажмите «Готово».']
    ]
  },
  macos: {
    label: 'macOS',
    steps: [
      ['Дождитесь загрузки', 'Файл .dmg появится в папке «Загрузки».'],
      ['Откройте образ', 'Дважды нажмите на загруженный файл .dmg — появится окно установки.'],
      ['Перенесите программу', 'Перетащите значок LibreOffice в папку Applications («Программы»), затем откройте приложение.']
    ]
  }
};

const macDownloadUrls = {
  apple: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/mac/aarch64/LibreOffice_26.8.0_MacOS_aarch64.dmg',
  intel: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/mac/x86_64/LibreOffice_26.8.0_MacOS_x86-64.dmg'
};

const osButtons = document.querySelectorAll('.os-option');
const architectureButtons = document.querySelectorAll('.architecture-option');
const architecturePicker = document.querySelector('#architecture-picker');
const downloadLink = document.querySelector('#download-link');
const instructionButton = document.querySelector('#instruction-button');
const instructionDialog = document.querySelector('#instruction-dialog');
const dialogPlatform = document.querySelector('#dialog-platform');
const dialogClose = document.querySelector('.dialog-close');
const stepsList = document.querySelector('#steps-list');
let selectedOs = 'windows';
let selectedArchitecture = 'apple';

function currentDownloadUrl() {
  return selectedOs === 'macos' ? macDownloadUrls[selectedArchitecture] : platformConfig.windows.downloadUrl;
}

function renderPlatform(os) {
  selectedOs = os;
  const config = platformConfig[os];
  osButtons.forEach((button) => {
    const selected = button.dataset.os === os;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  architecturePicker.hidden = os !== 'macos';
  downloadLink.href = currentDownloadUrl();
  downloadLink.querySelector('span').textContent = `Скачать для ${config.label}`;
  dialogPlatform.textContent = `LibreOffice · ${config.label}`;
  stepsList.innerHTML = config.steps.map(([title, text], index) => `
    <li>
      <span>${index + 1}</span>
      <div><h3>${title}</h3><p>${text}</p></div>
    </li>
  `).join('');
}

osButtons.forEach((button) => button.addEventListener('click', () => renderPlatform(button.dataset.os)));
architectureButtons.forEach((button) => button.addEventListener('click', () => {
  selectedArchitecture = button.dataset.architecture;
  architectureButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  downloadLink.href = currentDownloadUrl();
}));

instructionButton.addEventListener('click', () => instructionDialog.showModal());
dialogClose.addEventListener('click', () => instructionDialog.close());
instructionDialog.addEventListener('click', (event) => {
  if (event.target === instructionDialog) instructionDialog.close();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && instructionDialog.open) instructionDialog.close();
});

const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.includes('mac')) renderPlatform('macos');
document.querySelector('#year').textContent = new Date().getFullYear();
