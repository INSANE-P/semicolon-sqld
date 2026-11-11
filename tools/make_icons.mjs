// 세미콜론 마크를 SVG 와 PNG 아이콘으로 만든다. node tools/make_icons.mjs
// sharp 가 필요하다. 다른 폴더에 깔린 것을 쓰려면 SHARP_FROM 에 그 폴더를 준다.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sharp = createRequire(path.join(process.env.SHARP_FROM || process.cwd(), 'x.js'))('sharp');

const DOT = '<circle cx="32" cy="16.5" r="7.4" fill="#ffc93c"/>';
const COMMA = '<path d="M24.6 35a7.4 7.4 0 1 1 14.8 0c0 7.4-3.7 12.6-9.9 15.8a1.7 1.7 0 0 1-2.2-.5l-.9-1.5a1.7 1.7 0 0 1 .4-2.2c2.5-1.8 4-3.7 4.7-5.4A7.4 7.4 0 0 1 24.6 35z" fill="#fff"/>';
// tile: 두께 있는 타일(화면 로고, 파비콘). full: 꽉 찬 바탕(앱 아이콘, 운영체제가 모서리를 깎는다)
const svg = (kind, pad = 0) => {
  let inner = DOT + COMMA;
  if (kind === 'full') inner = `<g transform="translate(${pad} ${pad + 2.5}) scale(${(64 - 2 * pad) / 64})">${inner}</g>`;
  const bg = kind === 'tile' ? '<rect y="5" width="64" height="59" rx="17" fill="#2238c9"/><rect width="64" height="59" rx="17" fill="#3b5bfd"/>' : '<rect width="64" height="64" fill="#3b5bfd"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${bg}${inner}</svg>\n`;
};
fs.mkdirSync(path.join(root, 'assets/brand'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/icons'), { recursive: true });
fs.writeFileSync(path.join(root, 'assets/brand/mark.svg'), svg('tile'));
const png = (s, size, name) => sharp(Buffer.from(s), { density: 72 * size / 64 }).resize(size, size).png().toFile(path.join(root, 'assets/icons', name));
await Promise.all([
  png(svg('tile'), 32, 'favicon-32.png'),
  png(svg('full', 6), 192, 'icon-192.png'), png(svg('full', 6), 512, 'icon-512.png'),
  png(svg('full', 12), 512, 'maskable-512.png'), png(svg('full', 8), 180, 'apple-touch-icon.png')
]);
console.log('ok');
