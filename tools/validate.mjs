// 내용 파일 검사. node tools/validate.mjs [장id ...]
// --export 를 주면 정답과 해설을 뺀 문제지를 tools/out/ 에 쓴다(검산용).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, 'content');
const args = process.argv.slice(2);
const doExport = args.includes('--export');
const only = args.filter(a => !a.startsWith('--'));

const chapters = [];
const ctx = { SQLD: { add: c => chapters.push(c), meta: null }, console };
ctx.window = ctx;
vm.createContext(ctx);

const errs = [];
const warn = [];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
for (const f of files) {
  const before = chapters.length;
  try {
    vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
  } catch (e) {
    errs.push(`${f}: 실행 오류 ${e.message}`);
    continue;
  }
  if (f !== '_meta.js') {
    if (chapters.length !== before + 1) errs.push(`${f}: SQLD.add 가 한 번 불려야 함`);
    else if (chapters[before].id + '.js' !== f) errs.push(`${f}: id(${chapters[before].id}) 가 파일 이름과 다름`);
  }
}

const BLOCKS = new Set(['h', 'p', 'ul', 'ol', 'table', 'data', 'sql', 'trap', 'tip', 'vs', 'fig', 'check']);
const str = v => typeof v === 'string' && v.trim().length > 0;
const isGrid = g => g && Array.isArray(g.head) && Array.isArray(g.rows) && g.rows.every(r => Array.isArray(r) && r.length === g.head.length);
const seen = new Set();
const dist = [0, 0, 0, 0];

for (const c of chapters) {
  const at = m => errs.push(`${c.id}: ${m}`);
  for (const k of ['id', 'title', 'lead']) if (!str(c[k])) at(`${k} 없음`);
  if (!(c.minutes > 0)) at('minutes 없음');
  if (![1, 2, 3].includes(c.weight)) at('weight 는 1~3');
  for (const k of ['goals', 'blocks', 'keys', 'cards', 'quiz']) if (!Array.isArray(c[k]) || !c[k].length) at(`${k} 비어 있음`);
  (c.blocks || []).forEach((b, i) => {
    const w = `blocks[${i}](${b && b.t})`;
    if (!b || !BLOCKS.has(b.t)) return at(`${w} 모르는 블록`);
    if (['h', 'p'].includes(b.t) && !str(b.x)) at(`${w} x 없음`);
    if (['ul', 'ol'].includes(b.t) && !(Array.isArray(b.items) && b.items.every(str))) at(`${w} items`);
    if (['table', 'data'].includes(b.t) && !isGrid(b)) at(`${w} head/rows 칸 수가 안 맞음`);
    if (b.t === 'data' && !str(b.name)) at(`${w} name 없음`);
    if (b.t === 'sql') { if (!str(b.code)) at(`${w} code 없음`); if (b.result && !isGrid(b.result)) at(`${w} result 칸 수`); }
    if (['trap', 'tip'].includes(b.t) && !(str(b.title) && str(b.x))) at(`${w} title/x`);
    if (b.t === 'vs') for (const k of ['a', 'b']) if (!(b[k] && str(b[k].title) && Array.isArray(b[k].items))) at(`${w} ${k}`);
    if (b.t === 'fig') {
      if (!str(b.svg) || !b.svg.trim().startsWith('<svg')) at(`${w} svg`);
      else {
        if (!/viewBox="0 0 640 \d+"/.test(b.svg)) at(`${w} viewBox 폭 640`);
        if (/#[0-9a-fA-F]{3,6}\b|rgb\(|fill="(?!none)[a-z]+"|stroke="[a-z]+"/.test(b.svg.replace(/url\(#[\w-]+\)/g, ''))) at(`${w} 색을 직접 쓰지 말 것`);
        const open = (b.svg.match(/<[a-zA-Z][^>]*>/g) || []).filter(t => !t.endsWith('/>')).length, close = (b.svg.match(/<\/[a-zA-Z]+>/g) || []).length;
        if (open !== close) at(`${w} 태그 짝이 안 맞음(${open}/${close})`);
      }
      if (!str(b.caption)) at(`${w} caption 없음`);
    }
    if (b.t === 'check' && !(str(b.q) && str(b.a))) at(`${w} q/a`);
  });
  (c.cards || []).forEach((k, i) => { if (!(str(k.q) && str(k.a))) at(`cards[${i}]`); });
  (c.keys || []).forEach((k, i) => { if (!str(k)) at(`keys[${i}]`); });
  (c.quiz || []).forEach((q, i) => {
    const w = `quiz[${i}](${q.id})`;
    if (!str(q.id) || !q.id.startsWith(c.id + '-')) at(`${w} id 는 ${c.id}-NN`);
    if (seen.has(q.id)) at(`${w} id 중복`); seen.add(q.id);
    if (![1, 2, 3].includes(q.level)) at(`${w} level`);
    if (!str(q.q) || !str(q.why) || !str(q.tag)) at(`${w} q/why/tag`);
    if (!Array.isArray(q.choices) || q.choices.length !== 4) at(`${w} 보기 4개`);
    else {
      q.choices.forEach((ch, j) => {
        if (!(str(ch) || (ch && str(ch.code)) || isGrid(ch))) at(`${w} 보기${j + 1}`);
      });
      const flat = q.choices.map(ch => JSON.stringify(ch));
      if (new Set(flat).size !== 4) at(`${w} 같은 보기가 있음`);
    }
    if (![1, 2, 3, 4].includes(q.answer)) at(`${w} answer 1~4`); else dist[q.answer - 1]++;
    if (q.tables && !q.tables.every(t => str(t.name) && isGrid(t))) at(`${w} tables`);
    if (q.code !== undefined && !str(q.code)) at(`${w} code`);
    if (q.why && q.why.length < 40) warn.push(`${c.id}: ${w} 해설이 짧음`);
  });
}

const pick = only.length ? chapters.filter(c => only.includes(c.id)) : chapters;
console.log(`장 ${chapters.length}개, 문제 ${chapters.reduce((n, c) => n + (c.quiz || []).length, 0)}개, 카드 ${chapters.reduce((n, c) => n + (c.cards || []).length, 0)}장`);
for (const c of pick) console.log(`  ${c.id.padEnd(4)} 블록 ${String((c.blocks || []).length).padStart(3)} 그림 ${(c.blocks || []).filter(b => b.t === 'fig').length} 문제 ${String((c.quiz || []).length).padStart(2)} 카드 ${(c.cards || []).length}  ${c.title}`);
console.log(`정답 번호 분포 ①${dist[0]} ②${dist[1]} ③${dist[2]} ④${dist[3]}`);
if (warn.length) console.log('\n주의\n' + warn.join('\n'));
if (errs.length) { console.log('\n오류\n' + errs.join('\n')); process.exitCode = 1; } else console.log('오류 없음');

if (doExport) {
  const out = path.join(root, 'tools', 'out');
  fs.mkdirSync(out, { recursive: true });
  const grid = g => [g.head.join(' | '), ...g.rows.map(r => r.map(v => v === null ? 'NULL' : v).join(' | '))].join('\n');
  for (const c of pick) {
    const lines = [];
    for (const q of c.quiz) {
      lines.push(`### ${q.id}`, q.q);
      for (const t of q.tables || []) lines.push(`[${t.name}]`, grid(t));
      if (q.code) lines.push('```sql', q.code, '```');
      q.choices.forEach((ch, j) => lines.push(`(${j + 1}) ` + (typeof ch === 'string' ? ch : ch.code ? '\n```sql\n' + ch.code + '\n```' : '\n' + grid(ch))));
      lines.push('');
    }
    fs.writeFileSync(path.join(out, c.id + '.questions.md'), lines.join('\n'));
    fs.writeFileSync(path.join(out, c.id + '.answers.json'), JSON.stringify(Object.fromEntries(c.quiz.map(q => [q.id, q.answer]))));
  }
  console.log(`문제지 ${pick.length}개를 tools/out 에 씀`);
}
