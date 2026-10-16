import { interpolate } from './model.js';

const shot = (number, width, height, marks) => ({
  src: `assets/guides/step-${String(number).padStart(2, '0')}.jpg`, width, height, marks
});
// Each mark: highlighted rectangle, numbered arrow origin. Labels live in the step text.
const mark = (box, from) => ({ box, from });

const pythonWindowsSteps = [
  { title: 'Откройте установщик', text: 'Нажмите «Скачать» выше и дождитесь окончания загрузки. Нажмите на файл python-{{python.version}}-amd64.exe в загрузках браузера. Если Windows запросит разрешение, проверьте, что издатель — Python Software Foundation.',
    image: shot(1, 455, 267, [mark([58, 40, 317, 68], [225, 180])]) },
  { title: 'Включите PATH и установите', text: '1 — обязательно поставьте галочку Add python.exe to PATH внизу окна. 2 — затем нажмите Install Now. Остальные настройки оставьте как есть.',
    tip: 'Сначала галочка, потом установка. PATH позволяет запускать Python из командной строки.',
    image: shot(2, 654, 401, [mark([183, 367, 195, 24], [442, 320]), mark([185, 136, 143, 33], [421, 113])]) },
  { title: 'Дождитесь установки', text: 'Пока заполняется зелёная полоса, ничего нажимать не нужно. Не закрывайте окно и не нажимайте Cancel.',
    image: shot(3, 651, 402, [mark([182, 200, 460, 25], [492, 292])]) },
  { title: 'Закройте установщик', text: 'Надпись Setup was successful означает, что установка закончена. Нажмите Close. Если появится Disable path length limit, это дополнительная настройка; для первых занятий она не обязательна.',
    image: shot(4, 656, 399, [mark([558, 363, 86, 28], [493, 313])]) },
  { title: 'Проверьте Python', text: 'Откройте новую командную строку: нажмите Win + R, введите cmd и нажмите Enter. Выполните команду ниже. Должно появиться Python {{python.version}}. После этого можно устанавливать PyCharm.', code: 'py -{{python.series}} --version', expected: 'Python {{python.version}}',
    tip: 'Если команда не найдена, закройте и заново откройте командную строку. Если не помогло — повторно запустите установщик и проверьте установку Python Launcher.' }
];

const pythonMacSteps = [
  { title: 'Откройте файл .pkg', text: 'Скачайте Python кнопкой выше. В Finder откройте «Загрузки» и дважды нажмите python-{{python.version}}-macos11.pkg. Это обычный установщик, распаковывать архив не нужно.' },
  { title: 'Установите Python', text: 'Нажимайте «Продолжить» (Continue), прочитайте лицензию и подтвердите её, затем нажмите «Установить» (Install). При необходимости введите пароль пользователя Mac. Дождитесь окончания и нажмите «Закрыть».' },
  { title: 'Установите сертификаты', text: 'В Finder откройте «Программы» → Python {{python.series}} и дважды нажмите Install Certificates.command. Дождитесь завершения в открывшемся окне Terminal: это нужно для защищённых интернет-соединений Python.' },
  { title: 'Проверьте Python', text: 'Откройте Terminal через Spotlight (⌘ + пробел) и выполните команду ниже. Ожидаемый ответ — Python {{python.version}}. Теперь переходите к PyCharm.', code: 'python{{python.series}} --version', expected: 'Python {{python.version}}' }
];

const pycharmWindowsSteps = [
  { title: 'Запустите установщик', text: 'Скачайте PyCharm кнопкой выше. Когда загрузка закончится, нажмите файл .exe в загрузках браузера. На фото старый номер версии — у вас в имени файла будет {{pycharm.version}}.',
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
  { title: 'Выберите Python {{python.series}}', text: 'В списке Python version выберите уже установленный Python {{python.series}} с пометкой system. Не выбирайте download and install для другой версии. Если Python не найден, сначала установите его из раздела выше и перезапустите PyCharm.',
    image: shot(17, 838, 198, [mark([122, 44, 705, 29], [652, 145])]) },
  { title: 'Проверьте параметры проекта', text: '1 — в Location задайте папку проекта, например PythonProject, без кириллицы. Слева оставьте Pure Python, а в Interpreter type — Project venv. 2 — проверьте Python {{python.series}}. 3 — нажмите Create и дождитесь создания окружения. Галочки Create Git repository и Create a welcome script для первого занятия не нужны.',
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
    tip: 'Нет кнопки Run или появилась ошибка? Проверьте, что файл называется main.py, код написан в точности как в примере, а для проекта выбран Python {{python.series}}.' }
];


const ids = {
  pythonWindowsSteps: ['download','path','wait','close','verify'],
  pythonMacSteps: ['download','install','certificates','verify'],
  pycharmWindowsSteps: ['download','welcome','location','options','install','wait','finish','launch'],
  pycharmMacSteps: ['download','install','launch'],
  projectSteps: ['skip-import','new-project','interpreter','create'],
  settingsSteps: ['open-settings','font-size','completion','save'],
  codeSteps: ['new-file','name-file','run','verify']
};
const sequences = { pythonWindowsSteps, pythonMacSteps, pycharmWindowsSteps, pycharmMacSteps, projectSteps, settingsSteps, codeSteps };
for (const [key, steps] of Object.entries(sequences)) {
  steps.forEach((step, i) => { step.id = ids[key][i]; });
}
const libreofficeWindowsSteps = [
  { id: 'download', title: 'Откройте установщик .msi', text: 'Скачайте файл кнопкой выше. Откройте папку «Загрузки» и дважды нажмите установщик LibreOffice. На компьютере должны быть права администратора.' },
  { id: 'setup', title: 'Выберите обычную установку', text: 'В мастере нажмите «Далее» (Next). Выберите «Обычная» (Typical), если предлагается тип установки, и снова «Далее». Настройку компонентов менять не нужно.' },
  { id: 'install', title: 'Начните установку', text: 'При желании оставьте ярлык на рабочем столе. Нажмите «Установить» (Install). Если Windows запросит разрешение, сначала проверьте издателя The Document Foundation, затем подтвердите. Не отключайте защиту Windows.' },
  { id: 'finish', title: 'Дождитесь завершения', text: 'Не закрывайте мастер, пока устанавливаются файлы. После завершения нажмите «Готово» (Finish). Если требуется перезагрузка, сначала сохраните документы.' },
  { id: 'verify', title: 'Откройте таблицу', text: 'В меню «Пуск» откройте LibreOffice Calc. Введите число 123 в ячейку A1 и сохраните документ. Если таблица открывается и сохраняется, программа готова к занятиям с таблицами.', expected: 'A1 → 123\nДокумент сохраняется в формате .ods' }
];
const libreofficeMacSteps = [
  { id: 'download', title: 'Выберите свой процессор', text: 'В меню Apple → «Об этом Mac» посмотрите строку «Чип» или «Процессор». Apple M1 и новее — Apple Silicon; Intel — Intel. Подтвердите этот вариант выше и скачайте .dmg.' },
  { id: 'install', title: 'Перенесите LibreOffice', text: 'Дважды нажмите скачанный .dmg в «Загрузках». Перетащите LibreOffice на значок Applications («Программы») и дождитесь копирования.' },
  { id: 'launch', title: 'Откройте приложение', text: 'Запустите LibreOffice из папки «Программы». Обычный запрос первого запуска можно подтвердить. При сообщении о повреждении или угрозе не обходите защиту: скачайте файл заново с официального сайта или напишите Иону.' },
  { id: 'verify', title: 'Проверьте таблицу', text: 'В стартовом окне выберите Calc («Таблица»), введите 123 в ячейку A1 и сохраните документ. LibreOffice нужен для отдельных занятий — Python и PyCharm он не заменяет.', expected: 'A1 → 123\nДокумент сохраняется в формате .ods' }
];
const freeStep = {
  id: 'free-or-trial', title: 'Платная подписка не нужна',
  text: 'PyCharm объединяет бесплатные базовые функции и платный Pro. После установки может начаться 30-дневный пробный период Pro. Для обычных Python-файлов и занятий подписка не требуется: после пробного периода можно продолжить с бесплатными базовыми функциями.',
  tip: 'Не вводите платёжные данные ради занятий. Если экран активации не похож на инструкцию и не удаётся продолжить — отправьте его Иону.',
  source: 'https://www.jetbrains.com/help/pycharm/unified-pycharm.html'
};
projectSteps.unshift(freeStep);

export function getSections(app, os, programs) {
  const install = app === 'python' ? (os === 'windows' ? pythonWindowsSteps : pythonMacSteps)
    : app === 'pycharm' ? (os === 'windows' ? pycharmWindowsSteps : pycharmMacSteps)
    : (os === 'windows' ? libreofficeWindowsSteps : libreofficeMacSteps);
  const sections = [{ id: 'install', title: 'Установка', steps: install }];
  if (app === 'pycharm') sections.push(
    { id: 'project', title: 'Первый проект', steps: projectSteps },
    { id: 'settings', title: 'Настройки', steps: settingsSteps },
    { id: 'run', title: 'Запуск кода', steps: codeSteps }
  );
  return sections.map(section => ({ ...section, steps: section.steps.map(item => {
    const step = { ...item };
    for (const key of ['title','text','tip','code','expected']) if (step[key]) step[key] = interpolate(step[key], programs);
    if (step.image) step.image = { ...step.image, os: 'Windows', version: app === 'python' ? '3.13.16' : '2025.2.1.1', provenance: 'Скриншот преподавателя', capturedAt: null, nativeVerifiedAt: null };
    if (app === 'pycharm' && os === 'macos' && section.id !== 'install') {
      step.platformNote = 'Снимок: Windows, PyCharm 2025.2.1.1. На Mac основные пункты те же, но расположение меню может отличаться.';
    }
    if (app === 'libreoffice') step.source = 'https://www.libreoffice.org/installation-instructions/';
    return step;
  }) }));
}
