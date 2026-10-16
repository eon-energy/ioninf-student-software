/* Official installers verified on 2026-10-16. Keep Python pinned to the course version.
   Screenshot pixels are untouched; annotation coordinates use the original image size. */
const setupCatalog = {
  python: {
    name: 'Python', version: '3.13.16',
    source: 'https://www.python.org/downloads/release/python-31316/',
    windows: { href: 'https://www.python.org/ftp/python/3.13.16/python-3.13.16-amd64.exe', label: 'Windows · 64-bit', size: '28,5 МБ', note: 'Рекомендованный установщик .exe, не архив. Подходит для большинства компьютеров с Windows.' },
    macos: { href: 'https://www.python.org/ftp/python/3.13.16/python-3.13.16-macos11.pkg', label: 'macOS · Intel и Apple Silicon', size: '67,1 МБ', note: 'Один установщик .pkg для Intel и Apple Silicon. Не нужно выбирать процессор.' }
  },
  pycharm: {
    name: 'PyCharm', version: '2026.2.3',
    source: 'https://www.jetbrains.com/pycharm/download/',
    windows: { href: 'https://download.jetbrains.com/python/pycharm-2026.2.3.exe', label: 'Windows · 64-bit', size: '918 МБ', note: 'Стабильная версия на 16 октября 2026. Обычный установщик .exe для Windows 10 / 11 (Intel и AMD).' },
    apple: { href: 'https://download.jetbrains.com/python/pycharm-2026.2.3-aarch64.dmg', label: 'macOS · Apple Silicon', size: '1,14 ГБ', note: 'Для Mac с M1 и новее. По требованиям JetBrains: macOS 15 / 26, 8 ГБ памяти и 10 ГБ на диске.' },
    intel: { href: 'https://download.jetbrains.com/python/pycharm-2026.2.3.dmg', label: 'macOS · Intel', size: '1,18 ГБ', note: 'Для Mac с процессором Intel. По требованиям JetBrains: macOS 15 / 26, 8 ГБ памяти и 10 ГБ на диске.' }
  }
};

const shot = (number, width, height, marks) => ({
  src: `assets/guides/step-${String(number).padStart(2, '0')}.jpg`, width, height, marks
});
// Each mark: highlighted rectangle, numbered arrow origin. Labels live in the step text.
const mark = (box, from) => ({ box, from });

const pythonWindowsSteps = [
  { title: 'Откройте установщик', text: 'Нажмите «Скачать» выше и дождитесь окончания загрузки. Нажмите на файл python-3.13.16-amd64.exe в загрузках браузера. Если Windows запросит разрешение, проверьте, что издатель — Python Software Foundation.',
    image: shot(1, 455, 267, [mark([58, 40, 317, 68], [225, 180])]) },
  { title: 'Включите PATH и установите', text: '1 — обязательно поставьте галочку Add python.exe to PATH внизу окна. 2 — затем нажмите Install Now. Остальные настройки оставьте как есть.',
    tip: 'Сначала галочка, потом установка. PATH позволяет запускать Python из командной строки.',
    image: shot(2, 654, 401, [mark([183, 367, 195, 24], [442, 320]), mark([185, 136, 143, 33], [421, 113])]) },
  { title: 'Дождитесь установки', text: 'Пока заполняется зелёная полоса, ничего нажимать не нужно. Не закрывайте окно и не нажимайте Cancel.',
    image: shot(3, 651, 402, [mark([182, 200, 460, 25], [492, 292])]) },
  { title: 'Закройте установщик', text: 'Надпись Setup was successful означает, что установка закончена. Нажмите Close. Если появится Disable path length limit, это дополнительная настройка; для первых занятий она не обязательна.',
    image: shot(4, 656, 399, [mark([558, 363, 86, 28], [493, 313])]) },
  { title: 'Проверьте Python', text: 'Откройте новую командную строку: нажмите Win + R, введите cmd и нажмите Enter. Выполните команду ниже. Должно появиться Python 3.13.16. После этого можно устанавливать PyCharm.', code: 'py -3.13 --version', expected: 'Python 3.13.16',
    tip: 'Если команда не найдена, закройте и заново откройте командную строку. Если не помогло — повторно запустите установщик и проверьте установку Python Launcher.' }
];

const pythonMacSteps = [
  { title: 'Откройте файл .pkg', text: 'Скачайте Python кнопкой выше. В Finder откройте «Загрузки» и дважды нажмите python-3.13.16-macos11.pkg. Это обычный установщик, распаковывать архив не нужно.' },
  { title: 'Установите Python', text: 'Нажимайте «Продолжить» (Continue), прочитайте лицензию и подтвердите её, затем нажмите «Установить» (Install). При необходимости введите пароль пользователя Mac. Дождитесь окончания и нажмите «Закрыть».' },
  { title: 'Установите сертификаты', text: 'В Finder откройте «Программы» → Python 3.13 и дважды нажмите Install Certificates.command. Дождитесь завершения в открывшемся окне Terminal: это нужно для защищённых интернет-соединений Python.' },
  { title: 'Проверьте Python', text: 'Откройте Terminal через Spotlight (⌘ + пробел) и выполните команду ниже. Ожидаемый ответ — Python 3.13.16. Теперь переходите к PyCharm.', code: 'python3.13 --version', expected: 'Python 3.13.16' }
];

const pycharmWindowsSteps = [
  { title: 'Запустите установщик', text: 'Скачайте PyCharm кнопкой выше. Когда загрузка закончится, нажмите файл .exe в загрузках браузера. На фото старый номер версии — у вас в имени файла будет 2026.2.3.',
    image: shot(5, 399, 152, [mark([8, 40, 306, 64], [351, 126])]) },
  { title: 'Начните установку', text: 'В приветственном окне нажмите Next («Далее»). Если Windows запросит разрешение на изменения, проверьте издателя JetBrains перед подтверждением.',
    image: shot(6, 498, 385, [mark([324, 350, 74, 25], [281, 284])]) },
  { title: 'Оставьте папку по умолчанию', text: 'Менять путь установки не нужно. Нажмите Next. Проверьте, что на диске достаточно свободного места: актуальному PyCharm требуется 10 ГБ.',
    image: shot(7, 495, 383, [mark([321, 349, 76, 25], [286, 296])]) },
  { title: 'Отметьте четыре опции', text: '1 — PyCharm: ярлык на рабочем столе. 2 — Add “bin” folder to the PATH. 3 — Add “Open Folder as Project”. 4 — .py: открывать Python-файлы в PyCharm. Поставьте галочки, как на фото. 5 — нажмите Next.',
    image: shot(8, 496, 384, [mark([28, 133, 82, 23], [151, 112]), mark([246, 133, 215, 23], [397, 97]), mark([28, 190, 199, 24], [276, 218]), mark([28, 248, 55, 24], [130, 283]), mark([324, 350, 76, 25], [330, 301])]) },
  { title: 'Нажмите Install', text: 'Оставьте папку меню «Пуск» JetBrains. Нажмите Install («Установить»).',
    image: shot(9, 496, 386, [mark([324, 351, 76, 25], [289, 311])]) },
  { title: 'Дождитесь окончания', text: 'Установка может занять несколько минут. Пока заполняется полоса прогресса, ничего нажимать не нужно.',
    image: shot(10, 494, 382, [mark([21, 111, 452, 22], [262, 192])]) },
  { title: 'Завершите установку', text: '1 — поставьте галочку Run PyCharm, чтобы сразу открыть программу. 2 — нажмите Finish. Если установщик предложит перезагрузку, сначала сохраните открытые документы.',
    image: shot(11, 496, 384, [mark([178, 168, 88, 21], [318, 216]), mark([324, 349, 76, 26], [300, 291])]) },
  { title: 'Откройте PyCharm', text: 'Если программа не открылась автоматически, дважды щёлкните левой кнопкой по ярлыку PyCharm на рабочем столе. Или найдите PyCharm в меню «Пуск». Дальше переходите к разделу «Первый проект».',
    image: shot(13, 255, 185, [mark([94, 46, 65, 78], [203, 145])]) }
];

const pycharmMacSteps = [
  { title: 'Выберите правильный файл', text: 'В меню Apple откройте «Об этом Mac». Если указан чип Apple M1 или новее — выберите Apple Silicon. Если указан процессор Intel — выберите Intel. Скачайте .dmg кнопкой выше.' },
  { title: 'Перенесите PyCharm в «Программы»', text: 'Дважды нажмите скачанный файл .dmg. В открывшемся окне перетащите PyCharm в Applications («Программы») и дождитесь копирования.' },
  { title: 'Запустите приложение', text: 'Откройте PyCharm из папки «Программы». При обычном подтверждении первого запуска нажмите «Открыть». Если macOS сообщает о повреждении файла или угрозе, не отключайте защиту — скачайте файл заново с официального сайта или напишите Иону.', tip: 'Дальше откройте раздел «Первый проект». Основные действия одинаковые на Windows и Mac; снимки ниже сделаны на Windows.' }
];

const projectSteps = [
  { title: 'Пропустите импорт настроек', text: 'Если PyCharm предлагает импортировать настройки, нажмите Skip Import. Если такого экрана нет, переходите к следующему шагу. Условия использования прочитайте и подтвердите самостоятельно; отправка статистики не обязательна.',
    image: shot(14, 641, 498, [mark([276, 307, 91, 32], [426, 380])]) },
  { title: 'Создайте новый проект', text: 'На стартовом экране нажмите New Project. Не New Script и не New Notebook: для занятий нужен обычный Python-проект.',
    image: shot(15, 980, 702, [mark([559, 283, 92, 98], [726, 452])]) },
  { title: 'Выберите Python 3.13', text: 'В списке Python version выберите уже установленный Python 3.13 с пометкой system. Не выбирайте download and install для другой версии. Если Python не найден, сначала установите его из раздела выше и перезапустите PyCharm.',
    image: shot(17, 838, 198, [mark([122, 44, 705, 29], [652, 145])]) },
  { title: 'Проверьте параметры проекта', text: '1 — в Location задайте папку проекта, например PythonProject, без кириллицы. Слева оставьте Pure Python, а в Interpreter type — Project venv. 2 — проверьте Python 3.13. 3 — нажмите Create и дождитесь создания окружения. Галочки Create Git repository и Create a welcome script для первого занятия не нужны.',
    image: shot(16, 984, 712, [mark([224, 52, 748, 29], [744, 119]), mark([269, 182, 703, 31], [665, 294]), mark([819, 674, 77, 32], [723, 607])]) }
];

const settingsSteps = [
  { title: 'Откройте Settings', text: 'В левом верхнем углу откройте главное меню (три полоски), затем File → Settings. Быстрый способ: Ctrl + Alt + S. На Mac: PyCharm → Settings или ⌘ + запятая.',
    image: shot(20, 483, 677, [mark([45, 282, 321, 29], [267, 218])]) },
  { title: 'Включите изменение размера шрифта', text: '1 — слева раскройте Editor → General. 2 — включите Change font size with Ctrl+Mouse Wheel in. Оставьте Active editor. Теперь размер кода можно менять, удерживая Ctrl и вращая колесо; на Mac ориентируйтесь на клавишу, указанную в вашей версии PyCharm.',
    image: shot(23, 979, 728, [mark([9, 213, 236, 53], [164, 158]), mark([294, 118, 352, 29], [716, 195])]) },
  { title: 'Отключите дописывание кода', text: '1 — откройте Editor → General → Inline Completion. 2 — снимите галочку Enable local Full Line completion suggestions. Для первых занятий так удобнее: код вы пишете сами. Обычные списки подсказок при этом можно оставить.',
    image: shot(25, 982, 729, [mark([6, 461, 253, 27], [170, 403]), mark([274, 118, 369, 26], [741, 197])]) },
  { title: 'Сохраните настройки', text: 'Нажмите OK — изменения сохранятся, а окно настроек закроется. Apply только применяет изменения, не закрывая окно.',
    image: shot(27, 271, 117, [mark([11, 59, 76, 33], [126, 24])]) }
];

const codeSteps = [
  { title: 'Создайте Python-файл', text: '1 — нажмите ПРАВОЙ кнопкой мыши на папку проекта слева (не на .venv). 2 — наведите на New. 3 — левой кнопкой выберите Python File. На Mac правый клик — нажатие двумя пальцами на трекпаде.',
    image: shot(28, 784, 715, [mark([20, 45, 195, 28], [126, 179]), mark([219, 50, 264, 31], [346, 160]), mark([491, 50, 284, 31], [646, 154])]) },
  { title: 'Назовите файл main', text: 'Введите main латинскими буквами, оставьте тип Python file и нажмите Enter. Расширение .py добавится автоматически.',
    image: shot(30, 347, 152, [mark([17, 38, 315, 30], [279, 118])]) },
  { title: 'Напишите и запустите код', text: '1 — в открытом main.py напишите строку ниже. 2 — нажмите ПРАВОЙ кнопкой внутри редактора. 3 — левой кнопкой выберите Run ‘main’. На Mac контекстное меню также открывается нажатием двумя пальцами.',
    code: 'print("hello world")',
    image: shot(31, 1280, 698, [mark([370, 52, 119, 23], [590, 144]), mark([645, 210, 85, 65], [555, 335]), mark([800, 448, 236, 22], [1094, 406])]) },
  { title: 'Проверьте результат', text: 'Внизу откроется окно Run. Если в нём появилась строка hello world и сообщение Process finished with exit code 0 — всё настроено, можно начинать занятия.', expected: 'hello world\nProcess finished with exit code 0',
    tip: 'Нет кнопки Run или появилась ошибка? Проверьте, что файл называется main.py, код написан в точности как в примере, а для проекта выбран Python 3.13.' }
];

function guideSections(app, os) {
  if (app === 'python') return [{ title: 'Установка Python', steps: os === 'windows' ? pythonWindowsSteps : pythonMacSteps }];
  return [
    { title: 'Установка', steps: os === 'windows' ? pycharmWindowsSteps : pycharmMacSteps },
    { title: 'Первый проект', steps: projectSteps },
    { title: 'Настройки', steps: settingsSteps },
    { title: 'Запуск кода', steps: codeSteps }
  ];
}

// Static course content only; no remote HTML or user input is inserted.
function annotatedImage(image, alt) {
  const radius = Math.max(12, image.width * .017);
  const stroke = Math.max(2.5, image.width * .0033);
  const arrows = image.marks.map(({ box: [x, y, w, h], from: [fx, fy] }, index) => {
    const cx = x + w / 2, cy = y + h / 2;
    const dx = cx - fx, dy = cy - fy, distance = Math.hypot(dx, dy);
    const inset = Math.min(w / 2 / (Math.abs(dx) || 1), h / 2 / (Math.abs(dy) || 1));
    const ex = cx - dx * inset, ey = cy - dy * inset;
    const sx = fx + dx / distance * radius, sy = fy + dy / distance * radius;
    const angle = Math.atan2(ey - sy, ex - sx), head = radius * .7;
    const ax = ex - head * Math.cos(angle - .5), ay = ey - head * Math.sin(angle - .5);
    const bx = ex - head * Math.cos(angle + .5), by = ey - head * Math.sin(angle + .5);
    const path = `M${sx},${sy} L${ex},${ey} M${ax},${ay} L${ex},${ey} L${bx},${by}`;
    return `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" stroke="white" stroke-width="${stroke + 2}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" stroke="#e25d00" stroke-width="${stroke}"/><path d="${path}" stroke="white" stroke-width="${stroke + 2}"/><path d="${path}" stroke="#e25d00" stroke-width="${stroke}"/></g><circle cx="${fx}" cy="${fy}" r="${radius}" fill="#e25d00" stroke="white" stroke-width="2"/><text x="${fx}" y="${fy}" dy=".35em" fill="white" text-anchor="middle" font-family="Arial,sans-serif" font-size="${radius * 1.2}" font-weight="700">${index + 1}</text>`;
  }).join('');
  return `<span class="annotated-shot"><img src="${image.src}" width="${image.width}" height="${image.height}" alt="${alt}" decoding="async"><svg viewBox="0 0 ${image.width} ${image.height}" aria-hidden="true">${arrows}</svg></span>`;
}

const imageDialog = document.querySelector('.image-dialog');
imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => { if (event.target === imageDialog) imageDialog.close(); });
imageDialog.addEventListener('close', () => { document.body.classList.remove('has-image-dialog'); });

document.querySelectorAll('[data-setup]').forEach((entry) => {
  const app = entry.dataset.setup, config = setupCatalog[app];
  const panel = entry.querySelector('.setup-panel'), toggle = entry.querySelector('.install-toggle');
  let os = null, processor = 'apple', chapter = 0, stepIndex = 0;
  panel.innerHTML = `
    <div class="setup-controls">
      <section class="setup-system" aria-labelledby="${app}-system-title">
        <h3 id="${app}-system-title">Ваш компьютер</h3>
        <div class="system-switch" role="group" aria-label="Система для ${config.name}">
          <button type="button" data-system="windows" aria-pressed="false">Windows</button>
          <button type="button" data-system="macos" aria-pressed="false">macOS</button>
        </div>
        <div class="setup-architecture" hidden><p>Процессор Mac</p><div class="system-switch" role="group" aria-label="Процессор Mac для ${config.name}"><button type="button" data-chip="apple" aria-pressed="true">Apple Silicon</button><button type="button" data-chip="intel" aria-pressed="false">Intel</button></div><small>Меню Apple → «Об этом Mac»</small></div>
        <p class="setup-prerequisite">${app === 'pycharm' ? 'Сначала установите <a href="#python" data-open-python>Python 3.13.16</a>.' : 'Сначала Python, затем PyCharm. Обе программы нужны для занятий.'}</p>
      </section>
      <section class="setup-download" aria-label="Загрузка ${config.name}">
        <div class="setup-empty"><h3>Выберите систему</h3><p>Здесь появится официальный установщик и инструкция для вашего компьютера.</p></div>
        <div class="setup-ready" hidden>
          <a class="download-row" download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"/></svg><span><strong></strong><small></small></span><span class="download-action">Скачать</span></a>
          <p class="download-note"></p>
          <p class="download-source"><a href="${config.source}" target="_blank" rel="noopener noreferrer">Официальный сайт ↗</a><span>Если загрузка не началась</span></p>
          ${app === 'pycharm' ? '<p class="free-note">Для занятий достаточно бесплатных базовых функций. Покупать Pro не нужно.</p>' : ''}
        </div>
      </section>
    </div>
    <section class="setup-guide" aria-labelledby="${app}-guide-title" hidden>
      <div class="guide-heading"><h3 id="${app}-guide-title">Пошаговая инструкция</h3><span class="guide-platform"></span></div>
      <p class="guide-version-note" ${app === 'python' ? 'hidden' : ''}>На скриншотах PyCharm 2025.2. В новой версии расположение и названия отдельных пунктов могут отличаться.</p>
      <div class="guide-sections" role="group" aria-label="Разделы инструкции ${config.name}"></div>
      <div class="guide-layout">
        <nav class="guide-step-list" aria-label="Шаги текущего раздела"></nav>
        <div class="guide-main">
          <label class="mobile-step-picker">Перейти к шагу<select aria-label="Шаг инструкции ${config.name}"></select></label>
          <div class="guide-step-content"></div>
          <div class="guide-navigation"><button type="button" data-direction="previous">← Назад</button><span class="guide-counter" role="status" aria-live="polite" aria-atomic="true"></span><button type="button" data-direction="next">Дальше →</button></div>
        </div>
      </div>
    </section>`;

  const guide = panel.querySelector('.setup-guide');
  const sectionsElement = panel.querySelector('.guide-sections');
  const list = panel.querySelector('.guide-step-list');
  const picker = panel.querySelector('select');
  const content = panel.querySelector('.guide-step-content');
  const previous = panel.querySelector('[data-direction="previous"]');
  const next = panel.querySelector('[data-direction="next"]');

  function renderStep() {
    const sections = guideSections(app, os), current = sections[chapter], step = current.steps[stepIndex];
    sectionsElement.innerHTML = sections.map((section, index) => `<button type="button" data-chapter="${index}" aria-pressed="${index === chapter}">${section.title}</button>`).join('');
    sectionsElement.hidden = sections.length === 1;
    list.innerHTML = `<ol>${current.steps.map((item, index) => `<li><button type="button" data-step="${index}" ${index === stepIndex ? 'aria-current="step"' : ''}><span>${index + 1}</span>${item.title}</button></li>`).join('')}</ol>`;
    picker.innerHTML = current.steps.map((item, index) => `<option value="${index}" ${index === stepIndex ? 'selected' : ''}>${index + 1}. ${item.title}</option>`).join('');
    content.innerHTML = `<p class="step-label">${current.title} · Шаг ${stepIndex + 1}</p><h4 tabindex="-1">${step.title}</h4><p class="guide-instruction">${step.text}</p>${step.tip ? `<p class="guide-tip">${step.tip}</p>` : ''}${step.code ? `<div class="guide-code"><code></code><button type="button" class="copy-code">Копировать</button><span class="copy-status" role="status"></span></div>` : ''}${step.image ? `<button type="button" class="shot-zoom" aria-label="Увеличить скриншот: ${step.title}">${annotatedImage(step.image, step.title + '. Стрелки указывают на элементы, описанные в шаге.')}<span class="zoom-hint">Нажмите на скриншот, чтобы увеличить ↗</span></button><p class="shot-error" role="status" hidden>Не удалось загрузить скриншот. Все действия описаны выше. Попробуйте обновить страницу.</p>` : ''}${step.expected ? '<div class="expected-output"><p>Ожидаемый результат</p><pre></pre></div>' : ''}`;
    if (step.code) {
      content.querySelector('code').textContent = step.code;
      content.querySelector('.copy-code').addEventListener('click', async (event) => {
        try {
          await navigator.clipboard.writeText(step.code);
          event.target.textContent = 'Скопировано';
          content.querySelector('.copy-status').textContent = 'Команда скопирована';
        } catch {
          content.querySelector('.copy-status').textContent = 'Выделите и скопируйте команду вручную.';
        }
      });
    }
    if (step.expected) content.querySelector('pre').textContent = step.expected;
    if (step.image) {
      const img = content.querySelector('img');
      img.addEventListener('error', () => { content.querySelector('.shot-error').hidden = false; });
      content.querySelector('.shot-zoom').addEventListener('click', () => {
        imageDialog.querySelector('h2').textContent = step.title;
        imageDialog.querySelector('.image-dialog-content').innerHTML = annotatedImage(step.image, step.title);
        imageDialog.querySelector('.image-dialog-description').textContent = step.text;
        document.body.classList.add('has-image-dialog');
        imageDialog.showModal();
        imageDialog.querySelector('.image-dialog-scroll').scrollTo(0, 0);
      });
    }
    previous.disabled = chapter === 0 && stepIndex === 0;
    next.disabled = chapter === sections.length - 1 && stepIndex === current.steps.length - 1;
    next.textContent = stepIndex === current.steps.length - 1 && chapter < sections.length - 1 ? 'Следующий раздел →' : 'Дальше →';
    panel.querySelector('.guide-counter').textContent = `${stepIndex + 1} из ${current.steps.length}`;
  }

  function renderDownload() {
    const download = config[os === 'macos' && app === 'pycharm' ? processor : os];
    panel.querySelector('.setup-empty').hidden = true;
    panel.querySelector('.setup-ready').hidden = false;
    panel.querySelector('.setup-architecture').hidden = !(os === 'macos' && app === 'pycharm');
    const link = panel.querySelector('.download-row');
    link.href = download.href;
    link.querySelector('strong').textContent = `${config.name} ${config.version} для ${os === 'windows' ? 'Windows' : 'macOS'}`;
    link.querySelector('small').textContent = `${download.label} · ${download.size} · ${download.href.endsWith('.exe') ? '.exe' : download.href.endsWith('.pkg') ? '.pkg' : '.dmg'}`;
    panel.querySelector('.download-note').textContent = download.note;
    panel.querySelector('.guide-platform').textContent = os === 'windows' ? 'Windows' : 'macOS';
    guide.hidden = false;
    renderStep();
  }

  function moveToStep(newChapter, newStep, moveFocus = false) {
    chapter = newChapter;
    stepIndex = newStep;
    renderStep();
    if (moveFocus) {
      content.querySelector('h4').focus({ preventScroll: true });
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? 'Свернуть' : 'Установить';
    if (open && matchMedia('(max-width: 600px)').matches) panel.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !imageDialog.open) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('span').textContent = 'Установить'; toggle.focus(); }
  });
  panel.querySelectorAll('[data-system]').forEach((button) => button.addEventListener('click', () => {
    if (os !== button.dataset.system) { chapter = 0; stepIndex = 0; }
    os = button.dataset.system;
    panel.querySelectorAll('[data-system]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderDownload();
  }));
  panel.querySelectorAll('[data-chip]').forEach((button) => button.addEventListener('click', () => {
    processor = button.dataset.chip;
    panel.querySelectorAll('[data-chip]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderDownload();
  }));
  sectionsElement.addEventListener('click', (event) => { const button = event.target.closest('[data-chapter]'); if (button) moveToStep(Number(button.dataset.chapter), 0, true); });
  list.addEventListener('click', (event) => { const button = event.target.closest('[data-step]'); if (button) moveToStep(chapter, Number(button.dataset.step), true); });
  picker.addEventListener('change', () => moveToStep(chapter, Number(picker.value)));
  previous.addEventListener('click', () => {
    if (stepIndex > 0) moveToStep(chapter, stepIndex - 1, true);
    else if (chapter > 0) moveToStep(chapter - 1, guideSections(app, os)[chapter - 1].steps.length - 1, true);
  });
  next.addEventListener('click', () => {
    const sections = guideSections(app, os);
    if (stepIndex < sections[chapter].steps.length - 1) moveToStep(chapter, stepIndex + 1, true);
    else if (chapter < sections.length - 1) moveToStep(chapter + 1, 0, true);
  });
  panel.querySelector('[data-open-python]')?.addEventListener('click', () => {
    const pythonToggle = document.querySelector('#python .install-toggle');
    if (pythonToggle.getAttribute('aria-expanded') !== 'true') pythonToggle.click();
    pythonToggle.focus({ preventScroll: true });
  });
});
