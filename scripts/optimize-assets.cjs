// Lossy compression/resizing only; the supplied portrait and transparency are preserved.
const sharp = require('sharp');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  for (const width of [320, 640]) {
    const result = await sharp(path.join(root, 'assets/im-ion-cutout-final.png'))
      .resize({ width }).webp({ quality: 86, alphaQuality: 100, effort: 6 })
      .toFile(path.join(root, `assets/portrait-${width}.webp`));
    console.log(width, result.size);
  }
})();
