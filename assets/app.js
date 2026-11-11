/* 세미콜론 — 화면. 빌드 없이 file:// 에서도 돈다. */
(function () {
  'use strict';
  const META = SQLD.meta, CH = SQLD.chapters;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const main = $('#main'), side = $('#side'), tabs = $('#tabs'), scrim = $('#scrim');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 장 목록 ───────────────────────────────────────── */
  const ORDER = [], SUBJ = {}, PART = {}, PARTNAME = {}, NO = {};
  META.subjects.forEach((s, si) => {
    let n = 0;
    s.parts.forEach((p, pi) => p.ids.forEach(id => {
      n++; ORDER.push(id); SUBJ[id] = s; PART[id] = si === 0 ? 0 : pi + 1; PARTNAME[id] = p.title; NO[id] = (si + 1) + '-' + n;
    }));
  });
  const title = id => (CH[id] && CH[id].title) || META.titles[id] || id;
  const ready = id => !!CH[id];
  const QS = {}, QCH = {};
  ORDER.forEach(id => { if (CH[id]) CH[id].quiz.forEach(q => { QS[q.id] = q; QCH[q.id] = id; }); });
  const allQ = ids => (ids || ORDER).reduce((a, id) => CH[id] ? a.concat(CH[id].quiz) : a, []);
  const tc = id => 't' + PART[id];

  /* ── 저장 ──────────────────────────────────────────── */
  const KEY = 'sqld.v1';
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  S.done = S.done || {}; S.q = S.q || {}; S.cards = S.cards || {}; S.exams = S.exams || []; S.exam = S.exam || null;
  const ymd = d => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  const today = () => ymd(new Date());
  if (!S.start) S.start = today();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  save();
  const record = (qid, ok) => { const r = S.q[qid] || { n: 0, w: 0 }; r.n++; if (!ok) r.w++; r.ok = ok; r.t = Date.now(); S.q[qid] = r; save(); };
  const wrongIds = () => Object.keys(S.q).filter(id => QS[id] && S.q[id].ok === false).sort((a, b) => S.q[b].t - S.q[a].t);
  const chapStat = id => {
    const qs = CH[id] ? CH[id].quiz : []; let seen = 0, ok = 0;
    qs.forEach(q => { const r = S.q[q.id]; if (r) { seen++; if (r.ok) ok++; } });
    return { total: qs.length, seen, ok };
  };

  /* ── 글자 꾸밈 ─────────────────────────────────────── */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fmt = s => String(s).split(/(`[^`]+`)/).map(part => {
    if (part.length > 2 && part[0] === '`' && part[part.length - 1] === '`') return '<code>' + esc(part.slice(1, -1)) + '</code>';
    return esc(part).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/==([^=]+)==/g, '<mark>$1</mark>').replace(/\n/g, '<br>');
  }).join('');
  const KWS = {};
  ('SELECT FROM WHERE GROUP BY HAVING ORDER AND OR NOT IN IS NULL LIKE BETWEEN EXISTS ANY ALL SOME AS ON USING JOIN INNER LEFT RIGHT FULL OUTER CROSS NATURAL ' +
    'UNION INTERSECT MINUS EXCEPT DISTINCT CASE WHEN THEN ELSE END ASC DESC NULLS FIRST LAST INSERT INTO VALUES UPDATE SET DELETE MERGE MATCHED CREATE TABLE VIEW INDEX ' +
    'SEQUENCE SYNONYM ALTER DROP TRUNCATE RENAME ADD MODIFY COLUMN CONSTRAINT PRIMARY KEY FOREIGN REFERENCES UNIQUE CHECK DEFAULT CASCADE GRANT REVOKE TO WITH OPTION ADMIN ' +
    'ROLE PUBLIC COMMIT ROLLBACK SAVEPOINT OVER PARTITION ROWS RANGE UNBOUNDED PRECEDING FOLLOWING CURRENT ROW START CONNECT PRIOR NOCYCLE SIBLINGS LEVEL ROWNUM ' +
    'ROLLUP CUBE GROUPING SETS PIVOT UNPIVOT FOR FETCH NEXT ONLY TIES OFFSET TOP PURGE ESCAPE BEGIN TRAN TRANSACTION WITHIN INCLUDE EXCLUDE REPLACE USER IDENTIFIED').split(' ').forEach(k => { KWS[k] = 1; });
  const hl = code => {
    const re = /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_$#]*)/g;
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index)); last = re.lastIndex;
      if (m[1]) out += '<span class="c">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="s">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="n">' + m[3] + '</span>';
      else out += KWS[m[4].toUpperCase()] && m[4] === m[4].toUpperCase() ? '<span class="k">' + m[4] + '</span>' : esc(m[4]);
    }
    return out + esc(code.slice(last));
  };
  const cell = v => v === null || v === undefined ? '<td class="null">NULL</td>' : '<td' + (typeof v === 'number' ? ' class="num"' : '') + '>' + esc(v) + '</td>';
  // 가로로 넘칠 수 있는 상자는 키보드로도 밀 수 있게 초점을 받는다
  const scrollable = label => ' tabindex="0" role="group" aria-label="' + esc(label) + '"';
  const grid = (g, name) => '<div class="grid-wrap"' + scrollable(name ? name + ' 테이블' : '결과 테이블') + '>' + (name ? '<div class="grid-name" aria-hidden="true">' + esc(name) + '</div><br>' : '') + '<table class="grid"><thead><tr>' +
    g.head.map(h => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
    (g.rows.length ? g.rows.map(r => '<tr>' + r.map(cell).join('') + '</tr>').join('') : '<tr><td class="null" colspan="' + g.head.length + '">행 없음</td></tr>') +
    '</tbody></table></div>';
  let codeStore = [];
  const sqlBox = (code, result, note) => {
    const ci = codeStore.push(code) - 1;
    return '<div class="sql"><div class="sql-top"><span class="dots"><i></i><i></i><i></i></span><span class="lang">SQL</span>' +
      '<button class="copy" data-act="copy" data-c="' + ci + '" aria-label="SQL 복사">복사</button></div><pre' + scrollable('SQL') + '>' + hl(code) + '</pre>' +
      (result ? '<div class="res"><div class="lbl">' + I.check + '결과</div><br>' + grid(result) + '</div>' : '') +
      (note ? '<div class="note">' + fmt(note) + '</div>' : '') + '</div>';
  };
  // 출제 비중 별. 글자 대신 그림으로 그리고 뜻은 이름으로 읽어 준다
  const STAR = '<svg viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"/></svg>';
  const WEIGHT = ['', '가끔 나와요', '자주 나와요', '거의 매회 나와요'];
  const stars = w => '<span class="stars" role="img" aria-label="출제 비중 ' + w + '/3, ' + WEIGHT[w] + '" title="' + WEIGHT[w] + '">' + STAR.repeat(w) + '<i>' + STAR.repeat(3 - w) + '</i></span>';

  /* ── 아이콘 ────────────────────────────────────────── */
  const ic = (d, sw) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const I = {
    home: ic('<path d="M3.5 10.5 12 4l8.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-4v-6h-6v6H5A1.5 1.5 0 0 1 3.5 19z"/>'),
    book: ic('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7"/>'),
    pen: ic('<path d="M4 20l1.2-4.6L16.4 4.2a2.2 2.2 0 0 1 3.1 3.1L8.3 18.5z"/><path d="M14.5 6.2l3.1 3.1"/>'),
    cards: ic('<rect x="3" y="7.5" width="13.5" height="13" rx="2.5"/><path d="M7.5 7.5V6a2.5 2.5 0 0 1 2.5-2.5h8A2.5 2.5 0 0 1 20.5 6v8a2.5 2.5 0 0 1-2.5 2.5h-1.5"/>'),
    sheet: ic('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
    clock: ic('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/>'),
    redo: ic('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>'),
    shuffle: ic('<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
    bolt: ic('<path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12z"/>'),
    check: ic('<path d="M20 6 9 17l-5-5"/>', 2.6),
    x: ic('<path d="M18 6 6 18M6 6l12 12"/>', 2.4),
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>', 2.4),
    sun: ic('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'),
    moon: ic('<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>'),
    menu: ic('<path d="M4 7h16M4 12h16M4 17h10"/>', 2.2),
    alert: ic('<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.4v.1"/>', 2.3),
    bulb: ic('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
    target: ic('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>'),
    flame: ic('<path d="M12 22c4 0 7-2.7 7-6.8 0-3.4-2.2-5.6-3.6-7.6-.4 1.6-1.2 2.8-2.4 3.5C13 7.6 11.6 4.5 9 2.5c.2 3-1.8 5.4-3.3 7.4A8 8 0 0 0 5 15.2C5 19.3 8 22 12 22z"/>'),
    trophy: ic('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5.5h3a3 3 0 0 1-3 4.5M7 5.5H4a3 3 0 0 0 3 4.5"/>'),
    flag: ic('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    pin: ic('<path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v8"/>'),
    list: ic('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
    star: ic('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
    sparkle: ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>')
  };
  const MARK = '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><rect y="5" width="64" height="59" rx="17" fill="#2238c9"/><rect width="64" height="59" rx="17" fill="#3b5bfd"/>' +
    '<circle cx="32" cy="16.5" r="7.4" fill="#ffc93c"/><path d="M24.6 35a7.4 7.4 0 1 1 14.8 0c0 7.4-3.7 12.6-9.9 15.8a1.7 1.7 0 0 1-2.2-.5l-.9-1.5a1.7 1.7 0 0 1 .4-2.2c2.5-1.8 4-3.7 4.7-5.4A7.4 7.4 0 0 1 24.6 35z" fill="#fff"/></svg>';
  // 글자 로고: 글꼴 없이 선으로 그린 "세미콜론;"
  const WORD = '<svg class="wm" viewBox="-1 -0.5 255 65" role="img" aria-label="세미콜론"><g class="ws" fill="none" stroke-width="6.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M17 9Q15.5 34 4.5 54M15.6 32Q21.5 45 29.5 54M32.5 32H40.5M40.5 10V54M50.5 4V60"/>' +
    '<g transform="translate(60 0)"><rect x="5" y="13" width="25" height="37" rx="6"/><path d="M44 4V60"/></g>' +
    '<g transform="translate(116 0)"><path d="M9 3.5H40Q40.5 13.5 36 20M10 12.5H38.5M26 21.5V26M4 30.5H48M10 39.5H41V49.8H10V60H43"/></g>' +
    '<g transform="translate(176 0)"><path d="M10 3.5H41V13.4H10V23.2H43M26 24V27M4 31H48M10 39.5V59.5H44"/></g></g>' +
    '<g transform="translate(234 0)"><circle cx="9" cy="24" r="6.6" fill="#ffc93c"/><path class="wc" d="M2.6 42.5a6.4 6.4 0 1 1 12.8 0c0 6.4-3.2 10.9-8.6 13.7a1.5 1.5 0 0 1-1.9-.4l-.8-1.3a1.5 1.5 0 0 1 .3-1.9c2.2-1.6 3.5-3.2 4.1-4.7a6.4 6.4 0 0 1-5.9-5.4z"/></g></svg>';
  const brandHTML = sub => '<a class="brand" href="#/">' + MARK + '<span class="word">' + WORD + (sub ? '<small>SQLD 합격 노트</small>' : '') + '</span></a>';

  /* ── 마스코트 ──────────────────────────────────────── */
  const mascot = (mood, cls) => {
    let eyes = '<g class="eyes"><ellipse cx="27.4" cy="17" rx="1.7" ry="2.3" class="mf"/><ellipse cx="36.6" cy="17" rx="1.7" ry="2.3" class="mf"/></g>';
    let mouth = '<path d="M29 21.8q3 2.4 6 0" class="ml"/>', extra = '';
    if (mood === 'cheer') {
      eyes = '<path d="M25.4 17.8q2-2.6 4 0M34.6 17.8q2-2.6 4 0" class="ml"/>';
      mouth = '<path d="M28.2 21q3.8 4 7.6 0z" class="mf"/>';
      extra = '<path d="M49 12.5l3.2 3.4 6-7" class="my"/>';
    } else if (mood === 'sad') {
      mouth = '<path d="M29 23.4q3-2.2 6 0" class="ml"/>';
      extra = '<path d="M42.8 12.2q1.6 2.6 0 3.6-1.6-1 0-3.6z" class="mdrop"/>';
    } else if (mood === 'sleepy') {
      eyes = '<path d="M25.6 17.4h3.6M34.8 17.4h3.6" class="ml"/>';
      mouth = '<ellipse cx="32" cy="22.4" rx="1.5" ry="1.2" class="mf"/>';
      extra = '<path d="M48 13.5h5l-5 5.5h5" class="mz"/><path d="M55.5 5.5h3.4l-3.4 3.8h3.4" class="mz"/>';
    } else if (mood === 'think') {
      eyes = '<g class="eyes"><ellipse cx="28.4" cy="16" rx="1.7" ry="2.3" class="mf"/><ellipse cx="37.6" cy="16" rx="1.7" ry="2.3" class="mf"/></g>';
      mouth = '<path d="M30 22.4h4.6" class="ml"/>';
      extra = '<circle cx="50" cy="9" r="2.2" class="mz"/><circle cx="55" cy="4.5" r="1.3" class="mz"/>';
    }
    return '<svg class="mascot ' + (cls || '') + '" viewBox="0 0 64 68" aria-hidden="true">' +
      '<circle cx="32" cy="18" r="12.5" class="mb"/>' +
      '<path d="M20.5 44a11.5 11.5 0 1 1 23 0c0 9.2-5 16-13.6 20.2a2.1 2.1 0 0 1-2.8-1l-.7-1.5a2.1 2.1 0 0 1 .8-2.6c3.3-2.1 5.4-4.4 6.4-6.7A11.5 11.5 0 0 1 20.5 44z" class="mb"/>' +
      '<ellipse cx="23.6" cy="21.6" rx="2.3" ry="1.4" class="mc"/><ellipse cx="40.4" cy="21.6" rx="2.3" ry="1.4" class="mc"/>' + eyes + mouth + extra + '</svg>';
  };

  /* ── 원 진행 ──────────────────────────────────────── */
  const ring = (pct, o) => {
    o = o || {}; const size = o.size || 140, sw = o.sw || 10, r = (size - sw) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct)));
    return '<svg class="ringsvg" viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (o.track || 'var(--surface-3)') + '" stroke-width="' + sw + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (o.color || 'var(--ok)') + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"' +
      ' transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')" style="--c:' + c.toFixed(1) + ';animation:ring 1.1s .1s var(--ease) both"/></svg>';
  };

  /* ── 꽃가루 ───────────────────────────────────────── */
  const confetti = (x, y, n) => {
    if (reduce) return;
    const cv = document.createElement('canvas'); cv.className = 'confetti'; cv.setAttribute('aria-hidden', 'true'); cv.setAttribute('role', 'presentation'); document.body.appendChild(cv);
    const dpr = Math.min(2, window.devicePixelRatio || 1), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext('2d'); g.scale(dpr, dpr);
    const colors = ['#ffc93c', '#3b5bfd', '#0c9c8f', '#8b5cf6', '#f0802e', '#169c5a', '#ff6b8b'];
    x = x == null ? W / 2 : x; y = y == null ? H / 3 : y;
    const P = Array.from({ length: n || 90 }, () => {
      const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 8;
      return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[Math.random() * colors.length | 0], round: Math.random() < .3 };
    });
    const t0 = performance.now();
    const step = t => {
      const k = (t - t0) / 1600; g.clearRect(0, 0, W, H);
      P.forEach(p => {
        p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.globalAlpha = Math.max(0, 1 - k * k); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c;
        if (p.round) { g.beginPath(); g.arc(0, 0, p.h / 1.4, 0, 7); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        g.restore();
      });
      if (k < 1) requestAnimationFrame(step); else cv.remove();
    };
    requestAnimationFrame(step);
  };
  const burstFrom = el => { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, 46); };

  /* ── 숫자 올라가기 ────────────────────────────────── */
  const countUp = () => $$('[data-count]', main).forEach(el => {
    const to = +el.dataset.count, suf = el.dataset.suf || '';
    if (reduce || !to) { el.textContent = to + suf; return; }
    const t0 = performance.now(), d = 800;
    const f = t => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });

  /* ── 본문 블록 ─────────────────────────────────────── */
  const block = b => {
    switch (b.t) {
      case 'h': return '<h2>' + fmt(b.x) + '</h2>';
      case 'p': return '<p>' + fmt(b.x) + '</p>';
      case 'ul': case 'ol': return '<' + b.t + '>' + b.items.map(i => '<li>' + fmt(i) + '</li>').join('') + '</' + b.t + '>';
      case 'table': return '<div class="tbl-wrap"' + scrollable(b.caption || b.head.filter(Boolean).join(', ') + ' 표') + '><table>' + (b.caption ? '<caption>' + fmt(b.caption) + '</caption>' : '') + '<thead><tr>' +
        b.head.map(h => '<th scope="col">' + (String(h).trim() ? fmt(h) : '<span class="sr">구분</span>') + '</th>').join('') + '</tr></thead><tbody>' +
        b.rows.map(r => '<tr>' + r.map(c => '<td>' + fmt(c === null ? 'NULL' : c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
      case 'data': return '<div class="grids">' + grid(b, b.name) + '</div>';
      case 'sql': return sqlBox(b.code, b.result, b.note);
      case 'trap': return '<div class="box trap"><span class="bi">' + I.alert + '</span><div class="bt">함정<span>' + fmt(b.title) + '</span></div><p>' + fmt(b.x) + '</p></div>';
      case 'tip': return '<div class="box tip"><span class="bi">' + I.bulb + '</span><div class="bt"><span>' + fmt(b.title) + '</span></div><p>' + fmt(b.x) + '</p></div>';
      case 'vs': return '<div class="vs">' + ['a', 'b', 'c', 'd'].filter(k => b[k]).map(k =>
        '<div><h3 class="vs-t">' + fmt(b[k].title) + '</h3><ul>' + b[k].items.map(i => '<li>' + fmt(i) + '</li>').join('') + '</ul></div>').join('') + '</div>';
      case 'fig': return '<figure><div class="fig"' + scrollable('그림') + '>' + b.svg.replace('<svg ', '<svg role="img" aria-label="' + esc(b.caption.replace(/[`*=]/g, '')) + '" ') + '</div><figcaption>' + fmt(b.caption) + '</figcaption></figure>';
      case 'check': return '<details class="check"><summary><span class="qi">?</span><span>' + fmt(b.q) + '</span><span class="tg">답 보기</span></summary><div class="ans">' + fmt(b.a) + '</div></details>';
    }
    return '';
  };

  /* ── 문제 카드 ─────────────────────────────────────── */
  const LV = ['', '기본', '실전', '고난도'], CN = ['', '①', '②', '③', '④'];
  const qCard = (q, o) => {
    const cid = QCH[q.id], reveal = o.reveal, ok = reveal && o.picked === q.answer;
    let h = '<article class="q' + (reveal && o.picked ? (ok ? ' is-ok' : ' is-no') : '') + '" id="q-' + q.id + '" data-ctx="' + o.ctx + '">' +
      '<div class="q-meta">' + (o.n ? '<span class="qn">Q' + o.n + '</span>' : '') +
      (o.ctx === 'exam' ? '' : '<span class="lv l' + q.level + '">' + LV[q.level] + '</span>' +
        (o.showChap ? '<span class="tag">' + NO[cid] + ' ' + esc(title(cid)) + '</span>' : '<span class="tag">' + esc(q.tag) + '</span>')) + '</div>' +
      '<div class="q-text">' + fmt(q.q) + '</div>';
    if (q.tables) h += '<div class="grids">' + q.tables.map(t => grid(t, t.name)).join('') + '</div>';
    if (q.code) h += sqlBox(q.code);
    h += '<ol class="choices">' + q.choices.map((c, i) => {
      const n = i + 1; let cls = 'choice';
      if (reveal) { if (n === q.answer) cls += ' right'; else if (n === o.picked) cls += ' wrong'; else cls += ' dim'; }
      else if (n === o.picked) cls += ' sel';
      const body = typeof c === 'string' ? '<span>' + fmt(c) + '</span>' : c.code ? '<pre>' + hl(c.code) + '</pre>' : grid(c);
      return '<li><button class="' + cls + '" data-act="pick" data-q="' + q.id + '" data-i="' + n + '"' + (reveal ? ' disabled' : '') + '><span class="cn">' + n + '</span>' + body + '</button></li>';
    }).join('') + '</ol>';
    if (reveal && o.ctx !== 'sess') {
      const v = !o.picked ? ['skip', '안 푼 문제예요 · 정답 ' + CN[q.answer], I.target] : ok ? ['ok', '맞았어요', I.check] : ['no', '아쉬워요 · 정답은 ' + CN[q.answer], I.x];
      h += '<div class="why"><div class="verdict ' + v[0] + '">' + v[2] + v[1] + '</div>' + fmt(q.why) +
        (o.showChap ? '<br><a href="#/learn/' + cid + '">' + NO[cid] + ' ' + esc(title(cid)) + ' 다시 읽기 →</a>' : '') + '</div>';
    }
    return h + '</article>';
  };

  /* ── 날짜와 계획 ───────────────────────────────────── */
  const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);
  const addDay = (d, n) => { const x = new Date(d + 'T00:00:00'); x.setDate(x.getDate() + n); return ymd(x); };
  const examDate = () => S.examDate || META.examDate;
  const dLeft = () => dayDiff(today(), examDate());
  const dLabel = n => n > 0 ? 'D-' + n : n === 0 ? 'D-DAY' : '끝';
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const dateLabel = d => { const x = new Date(d + 'T00:00:00'); return (x.getMonth() + 1) + '/' + x.getDate() + ' ' + WD[x.getDay()]; };
  const cost = id => CH[id] ? CH[id].minutes + CH[id].quiz.length : 14;
  const buildPlan = () => {
    const ex = examDate(), start = S.start > ex ? ex : S.start, nDays = Math.max(1, dayDiff(start, ex)), days = [], w = [];
    for (let i = 0; i < nDays; i++) { days.push({ date: addDay(start, i), ids: [] }); w.push(nDays === 1 ? 1 : i === 0 ? .8 : i === nDays - 1 ? .7 : 1); }
    const total = ORDER.reduce((s, id) => s + cost(id), 0), wsum = w.reduce((a, b) => a + b, 0);
    let di = 0, acc = 0, quota = total * w[0] / wsum;
    ORDER.forEach(id => {
      if (acc + cost(id) / 2 > quota && di < nDays - 1) { di++; acc = 0; quota = total * w[di] / wsum; }
      days[di].ids.push(id); acc += cost(id);
    });
    days.push({ date: ex, ids: [], exam: true });
    return days;
  };

  /* ── 옆 목차와 아래 탭 ─────────────────────────────── */
  const route = () => (location.hash || '#/').slice(1).split('/').filter(Boolean);
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const renderNav = () => {
    const r = route(), sec = r[0] || '', cur = r[1], wn = wrongIds().length, d = dLeft();
    const doneN = ORDER.filter(id => S.done[id]).length;
    const link = (href, icon, label, on, extra) => '<a class="nav-a' + (on ? ' on" aria-current="page' : '') + '" href="' + href + '">' + icon + '<span>' + label + '</span>' + (extra || '') + '</a>';
    let h = '<div class="side-top">' + brandHTML(true) +
      '<button class="icon-btn" data-act="theme" aria-label="밝은 화면과 어두운 화면 바꾸기">' + (isDark() ? I.sun : I.moon) + '</button></div>' +
      '<a class="side-dday" href="#/"><small>SQLD 시험 ' + dateLabel(examDate()) + '</small><b>' + (d > 0 ? 'D-' + d : d === 0 ? '오늘 시험' : '시험 끝') + '</b>' +
      '<div class="bar"><i style="width:' + Math.round(doneN / ORDER.length * 100) + '%"></i></div><div class="sd-row"><span>읽은 장</span><span>' + doneN + ' / ' + ORDER.length + '</span></div></a>' +
      '<div class="nav-main">' +
      link('#/', I.home, '오늘 할 일', sec === '') +
      link('#/quiz', I.pen, '문제 풀기', sec === 'quiz' && cur !== 'wrong') +
      link('#/exam', I.clock, '모의고사', sec === 'exam') +
      link('#/quiz/wrong', I.redo, '오답 노트', sec === 'quiz' && cur === 'wrong', wn ? '<span class="badge">' + wn + '</span>' : '') +
      link('#/cards', I.cards, '암기 카드', sec === 'cards') +
      link('#/sheet', I.sheet, '한 장 요약', sec === 'sheet') + '</div>';
    META.subjects.forEach(s => {
      const ids = s.parts.reduce((a, p) => a.concat(p.ids), []), dn = ids.filter(id => S.done[id]).length;
      h += '<div class="nav-group"><h4>' + s.name + ' · ' + esc(s.title) + '<span class="gp">' + dn + '/' + ids.length + '</span></h4>';
      ids.forEach(id => {
        h += '<a class="nav-ch ' + tc(id) + (sec === 'learn' && cur === id ? ' on" aria-current="page' : '') + '" href="#/learn/' + id + '"><span class="nb">' + NO[id] + '</span><span>' + esc(title(id)) + (S.done[id] ? '<span class="sr">, 읽음</span>' : '') + '</span><span class="ck' + (S.done[id] ? ' done' : '') + '" aria-hidden="true"></span></a>';
      });
      h += '</div>';
    });
    side.innerHTML = h;
    const tab = (href, icon, label, on, dot) => '<a href="' + href + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + icon + '<span>' + label + '</span>' + (dot ? '<i class="dot" role="img" aria-label="틀린 문제 있음"></i>' : '') + '</a>';
    tabs.innerHTML = tab('#/', I.home, '오늘', sec === '') + tab('#/learn', I.book, '개념', sec === 'learn') +
      tab('#/quiz', I.pen, '문제', sec === 'quiz' || sec === 'exam', wn > 0) + tab('#/cards', I.cards, '카드', sec === 'cards') + tab('#/sheet', I.sheet, '요약', sec === 'sheet');
    $('#ddayTop').innerHTML = '시험 <b>' + dLabel(d) + '</b>';
    $('#brandTop').innerHTML = brandHTML(false);
  };
  const closeSide = () => {
    const was = side.classList.contains('open');
    side.classList.remove('open'); scrim.hidden = true; $('#menuBtn').setAttribute('aria-expanded', 'false');
    side.inert = innerWidth < 1040;
    return was;
  };

  /* ── 앱으로 설치 ───────────────────────────────────── */
  let installEvt = null;
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const installCard = () => {
    if (standalone() || S.noInstall || location.protocol === 'file:') return '';
    if (!installEvt && !isIOS) return '';
    return '<div class="card install">' + MARK + '<div><h3>앱처럼 깔아 두기</h3><p>' +
      (installEvt ? '홈 화면에 아이콘이 생기고, 인터넷이 끊긴 곳에서도 열려요.' : '사파리 아래의 공유 버튼에서 "홈 화면에 추가"를 고르면 돼요. 인터넷이 끊긴 곳에서도 열려요.') + '</p><div class="row">' +
      (installEvt ? '<button class="btn primary sm" data-act="install">설치하기</button>' : '') + '<button class="btn ghost sm" data-act="install-no">괜찮아요</button></div></div></div>';
  };
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!route()[0]) render(true); });
  addEventListener('appinstalled', () => { installEvt = null; toast('설치했어요. 홈 화면에서 열 수 있어요'); });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

  /* ── 오늘 ──────────────────────────────────────────── */
  let planDay = null;
  const viewHome = () => {
    main.className = 'wide';
    const d = dLeft(), plan = buildPlan(), t = today();
    const doneN = ORDER.filter(id => S.done[id]).length;
    const seen = Object.keys(S.q).filter(k => QS[k]), okN = seen.filter(k => S.q[k].ok).length;
    const totalQ = Object.keys(QS).length, wn = wrongIds().length;
    const next = ORDER.filter(id => !S.done[id] && ready(id))[0];
    let idx = plan.findIndex(p => p.date === t);
    if (idx < 0) idx = t > examDate() ? plan.length - 1 : 0;
    if (planDay === null || planDay >= plan.length) planDay = idx;
    const late = [];
    plan.slice(0, idx).forEach(p => p.ids.forEach(id => { if (!S.done[id]) late.push(id); }));
    const todayIds = late.concat(plan[idx].ids).filter(id => !S.done[id]);
    const todayMin = todayIds.reduce((s, id) => s + cost(id), 0);
    const pct = doneN / ORDER.length;

    let h = '<section class="hero"><div class="hero-grid"><div>' +
      '<div class="hero-date">' + dateLabel(t) + '요일 · 시험 ' + dateLabel(examDate()) + '요일 <button class="link-btn" data-act="examdate">날짜 바꾸기</button></div>' +
      '<h1 class="hero-title">' + (d > 0 ? '시험까지 <span class="num">' + d + '일</span>' : d === 0 ? '<span class="num">오늘</span> 시험이에요' : '시험이 끝났어요') + '</h1>' +
      '<p class="hero-sub">' + (todayIds.length ? '오늘 몫은 <b>' + todayIds.length + '개 장</b>, 대략 <b>' + todayMin + '분</b>이에요.' : doneN === ORDER.length ? '모든 장을 읽었어요. 모의고사로 마무리해요.' : '오늘 몫은 끝났어요. 오답만 비우면 돼요.') + '</p>' +
      '<div class="row">' + (next ? '<a class="btn sun lg" href="#/learn/' + next + '">' + (doneN ? '이어서 읽기' : '첫 장 시작하기') + ' · ' + NO[next] + I.arrow + '</a>' : '<a class="btn sun lg" href="#/exam">모의고사 풀기' + I.arrow + '</a>') +
      (wn ? '<a class="btn glass lg" href="#/quiz/wrong">오답 ' + wn + '개</a>' : '<a class="btn glass lg" href="#/quiz/random">섞어서 10문제</a>') + '</div></div>' +
      '<div class="hero-art">' + ring(pct, { size: 140, sw: 10, color: 'var(--sun)', track: 'rgba(255,255,255,.15)' }) + mascot(d <= 0 ? 'cheer' : 'happy', 'bob') + '<span class="pct">' + Math.round(pct * 100) + '% 읽음</span></div></div></section>';

    const stat = (cls, icon, val, sub, label) => '<div class="stat ' + cls + '"><span class="si">' + icon + '</span><b><span data-count="' + val + '">' + val + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</b><span class="sl">' + label + '</span></div>';
    h += '<div class="stats">' +
      stat('t0', I.book, doneN, '/ ' + ORDER.length, '읽은 장') +
      stat('t1', I.pen, seen.length, '/ ' + totalQ, '풀어 본 문제') +
      (seen.length ? stat('t2', I.target, Math.round(okN / seen.length * 100), '%', '정답률') : '<div class="stat t2"><span class="si">' + I.target + '</span><b>-</b><span class="sl">정답률</span></div>') +
      (S.exams.length ? stat('t3', I.trophy, S.exams[S.exams.length - 1].score, '점', '최근 모의고사') : '<div class="stat t3"><span class="si">' + I.trophy + '</span><b>-</b><span class="sl">최근 모의고사</span></div>') + '</div>';

    h += '<section class="sec"><div class="sec-head"><h2>날짜별 계획</h2><small>하루치를 끝내면 다음 날이 가벼워져요</small></div><div class="seg">' +
      plan.map((p, i) => '<button data-act="day" data-i="' + i + '" aria-pressed="' + (i === planDay) + '"' + (i === planDay ? ' class="on"' : '') + '>' + (p.date === t ? '오늘' : dateLabel(p.date)) + (p.exam ? ' <span class="ex">시험</span>' : '') + '</button>').join('') + '</div>';
    const p = plan[planDay];
    const li = (href, cls, icon, label, meta, done) => '<li' + (done ? ' class="done"' : '') + '><a href="' + href + '" class="' + cls + '"><span class="pi">' + icon + '</span><span class="pt"><b>' + label + '</b><small>' + meta + '</small></span><span class="go">' + (done ? I.check : I.arrow) + '</span></a></li>';
    const chLi = (id, isLate) => li('#/learn/' + id, tc(id), NO[id], esc(title(id)),
      (isLate ? '<span class="late">밀린 장</span>' : '') + (ready(id) ? stars(CH[id].weight) + '<span>읽기 ' + CH[id].minutes + '분</span><span>문제 ' + CH[id].quiz.length + '</span>' : '<span>준비 중</span>'), S.done[id]);
    let items = '';
    if (planDay === idx) late.forEach(id => { items += chLi(id, true); });
    p.ids.forEach(id => { items += chLi(id); });
    const last = planDay === plan.length - 2;
    if (p.exam) {
      items += li('#/sheet', 't0', I.sheet, '한 장 요약 처음부터 끝까지', '<span>20분</span>', false) + li('#/quiz/wrong', 't3', I.redo, '오답 노트 비우기', '<span>' + wn + '개 남음</span>', wn === 0 && seen.length > 0) +
        li('#/cards', 't2', I.cards, '모르는 카드만 넘겨 보기', '<span>10분</span>', false);
    } else {
      if (last) items += li('#/exam', 't2', I.clock, '모의고사 1회, 시간 재고', '<span>50문항 · 90분</span>', S.exams.length > 0);
      items += li('#/quiz/wrong', 't3', I.redo, '오늘 틀린 문제 다시 풀기', '<span>' + (wn ? wn + '개' : seen.length ? '다 비웠어요' : '아직 없어요') + '</span>', wn === 0 && seen.length > 0) +
        li('#/cards', 't2', I.cards, '자기 전에 암기 카드 한 바퀴', '<span>10분</span>', false);
    }
    h += '<ul class="plan">' + items + '</ul>';
    if (p.exam) h += '<p class="small muted" style="margin-top:12px">시험 날에는 새 내용을 읽지 않아요. 수험표, 신분증, 컴퓨터용 사인펜을 챙기고 입실 시간은 수험표에서 확인하세요.</p>';
    h += '</section>';

    const weak = ORDER.map(id => { const s = chapStat(id); return { id, s, r: s.seen ? s.ok / s.seen : 1 }; }).filter(x => x.s.seen >= 3 && x.r < .7).sort((a, b) => a.r - b.r).slice(0, 4);
    if (weak.length) h += '<section class="sec"><div class="sec-head"><h2>약한 장</h2><small>정답률이 낮은 순서예요</small></div><div class="weak">' + weak.map(x =>
      '<a href="#/learn/' + x.id + '"><div class="wt"><b>' + NO[x.id] + ' ' + esc(title(x.id)) + '</b><span>' + x.s.ok + ' / ' + x.s.seen + '</span></div><div class="bar"><i style="width:' + Math.round(x.r * 100) + '%"></i></div></a>').join('') + '</div></section>';

    h += installCard();
    h += '<section class="sec"><div class="sec-head"><h2>이렇게 쓰면 돼요</h2></div><div class="howto">' +
      '<div class="t0"><span class="hi">' + I.book + '</span><b>읽고 바로 풀어요</b><p>장마다 끝에 문제가 붙어 있어요. 한 번 꺼내 써 본 내용이 오래 남아요.</p></div>' +
      '<div class="t3"><span class="hi">' + I.redo + '</span><b>틀린 건 알아서 모여요</b><p>오답 노트에서 맞히면 빠지고 또 틀리면 남아요. 시험 전날엔 이것만 비우면 돼요.</p></div>' +
      '<div class="t1"><span class="hi">' + I.star + '</span><b>별 세 개부터</b><p>시간이 모자라면 별 세 개 장만 읽고 나머지는 한 장 요약으로 넘겨요.</p></div>' +
      '<div class="t2"><span class="hi">' + I.trophy + '</span><b>합격선은 60점</b><p>1과목 4개, 2과목 16개를 못 넘기면 총점이 높아도 떨어져요. 1과목을 버리면 안 돼요.</p></div></div></section>';
    h += '<p class="foot-note">공부 기록은 이 브라우저에만 저장돼요 · <button class="link-btn" data-act="reset">기록 지우기</button></p>';
    main.innerHTML = h;
  };

  /* ── 개념 목록 ─────────────────────────────────────── */
  const viewLearnList = () => {
    main.className = 'wide';
    let h = '<div class="page-head"><h1 class="page-title">개념</h1><p class="lead">별은 출제 비중이에요. 세 개는 거의 매회 나오는 장이에요.</p></div>';
    META.subjects.forEach(s => {
      const ids = s.parts.reduce((a, p) => a.concat(p.ids), []), dn = ids.filter(id => S.done[id]).length;
      h += '<section class="subj"><div class="subj-head"><h2>' + s.name + ' ' + esc(s.title) + '</h2><span class="sp">' + dn + ' / ' + ids.length + ' 읽음 · ' + s.count + '문항</span></div>';
      s.parts.forEach(p => {
        h += '<div class="part-name ' + tc(p.ids[0]) + '"><i></i>' + esc(p.title) + '</div><div class="ch-grid">' + p.ids.map(id => {
          const st = chapStat(id), c = CH[id];
          return '<a class="ch-card ' + tc(id) + (S.done[id] ? ' done' : '') + '" href="#/learn/' + id + '"><div class="ct"><span class="nb">' + NO[id] + '</span>' + (c ? stars(c.weight) : '') + '</div><b>' + esc(title(id)) + '</b>' +
            '<div class="cm">' + (S.done[id] ? '<span class="done-tag">읽음</span>' : '<span>' + (c ? c.minutes + '분' : '') + '</span>') + '<span class="bar"><i style="width:' + (st.total ? Math.round(st.ok / st.total * 100) : 0) + '%"></i></span><span>' + st.ok + '/' + st.total + '</span></div></a>';
        }).join('') + '</div>';
      });
      h += '</section>';
    });
    main.innerHTML = h;
  };

  /* ── 장 ────────────────────────────────────────────── */
  let picks = {};
  const viewChapter = id => {
    main.className = tc(id);
    const c = CH[id], i = ORDER.indexOf(id);
    if (i < 0) return viewHome();
    const prev = ORDER[i - 1], next = ORDER[i + 1];
    const navH = '<nav class="chap-nav">' + (prev ? '<a href="#/learn/' + prev + '"><small>← 이전 ' + NO[prev] + '</small>' + esc(title(prev)) + '</a>' : '<span></span>') +
      (next ? '<a class="next" href="#/learn/' + next + '"><small>다음 ' + NO[next] + ' →</small>' + esc(title(next)) + '</a>' : '<a class="next" href="#/exam"><small>다 읽었으면 →</small>모의고사</a>') + '</nav>';
    if (!c) { main.innerHTML = '<div class="empty">' + mascot('sleepy') + '<b>이 장은 아직 준비 중이에요</b></div>' + navH; return; }
    picks = {};
    main.innerHTML =
      '<header class="chap-hero"><div class="crumb"><span class="nb">' + NO[id] + '</span><span class="chip">' + SUBJ[id].name + ' · ' + esc(PARTNAME[id]) + '</span></div>' +
      mascot('happy', 'bob') + '<h1 class="page-title">' + esc(c.title) + '</h1><p class="lead">' + fmt(c.lead) + '</p>' +
      '<div class="row" style="margin-top:16px"><span class="chip">' + I.clock + '읽기 ' + c.minutes + '분</span><span class="chip">' + I.pen + '문제 ' + c.quiz.length + '</span><span class="chip">출제 ' + stars(c.weight) + '</span></div></header>' +
      '<div class="goals"><h2 class="goals-t">' + I.target + '이 장을 읽고 나면</h2><ul>' + c.goals.map(g => '<li><span>' + fmt(g) + '</span></li>').join('') + '</ul></div>' +
      '<article class="prose">' + c.blocks.map(block).join('') + '</article>' +
      '<section class="keys"><h2>' + I.pin + '시험 직전에 볼 것</h2><ol>' + c.keys.map(k => '<li><span>' + fmt(k) + '</span></li>').join('') + '</ol></section>' +
      '<div class="quiz-head"><span class="qh-i">' + I.pen + '</span><div><h2>바로 풀어 보기</h2><small>' + c.quiz.length + '문제 · 고르면 바로 해설이 나와요</small></div></div>' +
      '<div id="chapQuiz">' + c.quiz.map((q, n) => qCard(q, { n: n + 1, ctx: 'chap' })).join('') + '</div><div id="chapScore"></div>' +
      '<div class="chap-foot"><button class="btn lg ' + (S.done[id] ? '' : 'primary') + '" data-act="done" data-id="' + id + '">' + (S.done[id] ? '읽음 표시 풀기' : I.check + '다 읽었어요') + '</button>' +
      (next ? '<a class="btn lg" href="#/learn/' + next + '">다음 장 · ' + esc(title(next)) + I.arrow + '</a>' : '<a class="btn lg" href="#/exam">모의고사 풀기' + I.arrow + '</a>') + '</div>' + navH;
  };
  const chapScore = id => {
    const c = CH[id], n = c.quiz.filter(q => picks[q.id]).length;
    if (n < c.quiz.length) return;
    const ok = c.quiz.filter(q => picks[q.id] === q.answer).length, all = ok === c.quiz.length;
    const el = $('#chapScore');
    el.innerHTML = '<div class="card score-card">' + mascot(all ? 'cheer' : ok / c.quiz.length < .5 ? 'sad' : 'happy', 'hop') + '<div><h3>' + c.quiz.length + '문제 중 ' + ok + '개 맞았어요</h3><p>' +
      (all ? '이 장은 넘어가도 돼요.' : '틀린 ' + (c.quiz.length - ok) + '개는 오답 노트에 들어갔어요. 해설에서 걸린 부분만 위에서 다시 읽고 넘어가요.') + '</p></div></div>';
    if (all) burstFrom(el);
    if (!S.done[id]) {
      S.done[id] = true; save(); renderNav();
      const b = $('[data-act="done"]'); if (b) { b.textContent = '읽음 표시 풀기'; b.classList.remove('primary'); }
      toast('읽은 장으로 표시했어요');
    }
  };

  /* ── 문제 고르기 ──────────────────────────────────── */
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const freshFirst = qs => shuffle(qs).sort((a, b) => { const x = S.q[a.id], y = S.q[b.id]; return (x ? (x.ok ? 2 : 1) : 0) - (y ? (y.ok ? 2 : 1) : 0); });
  const viewQuizHub = () => {
    main.className = 'wide';
    const wn = wrongIds().length, total = Object.keys(QS).length, hard = allQ().filter(q => q.level === 3).length;
    let h = '<div class="page-head"><h1 class="page-title">문제 풀기</h1><p class="lead">전부 ' + total + '문제예요. 안 풀어 본 문제가 먼저 나와요.</p></div><div class="pick-grid">' +
      '<a class="pick t1" href="#/quiz/random"><span class="pk-i">' + I.shuffle + '</span><b>섞어서 10문제</b><span>장을 가리지 않고 뽑아요. 틈날 때 한 판씩.</span></a>' +
      '<a class="pick t3" href="#/quiz/hard"><span class="pk-i">' + I.flame + '</span><b>고난도 10문제</b><span>끝까지 계산해야 하는 ' + hard + '문제 중에서.</span></a>' +
      '<a class="pick t0" href="#/quiz/wrong">' + (wn ? '<span class="cnt">' + wn + '</span>' : '') + '<span class="pk-i">' + I.redo + '</span><b>오답 노트</b><span>' + (wn ? '맞히면 빠지고 틀리면 남아요.' : '아직 틀린 문제가 없어요.') + '</span></a>' +
      '<a class="pick t2" href="#/exam"><span class="pk-i">' + I.clock + '</span><b>모의고사</b><span>50문항 90분. 실제 시험과 같은 비율로.</span></a></div>';
    META.subjects.forEach(s => {
      h += '<section class="sec"><div class="sec-head"><h2>' + s.name + ' 장별로</h2></div><div class="topic-list">';
      s.parts.forEach(p => p.ids.forEach(id => {
        if (!CH[id]) return; const st = chapStat(id);
        h += '<a href="#/quiz/c/' + id + '" class="' + tc(id) + '"><span class="nb">' + NO[id] + '</span><span>' + esc(title(id)) + '</span><span class="rt">' +
          (st.seen ? '<span class="bar mini"><i style="width:' + Math.round(st.ok / st.total * 100) + '%"></i></span>' + st.ok + '/' + st.total : st.total + '문제') + '</span></a>';
      }));
      h += '</div></section>';
    });
    main.innerHTML = h;
  };

  /* ── 한 문제씩 ────────────────────────────────────── */
  let sess = null;
  const startSess = (key, name, qs, opt) => { sess = { key, name, qs, i: 0, picked: {}, opt: opt || {}, streak: 0 }; };
  const clearFb = () => { const f = $('.fb'); if (f) f.remove(); document.body.classList.remove('has-fb'); };
  const viewSess = r => {
    main.className = '';
    const key = r.join('/');
    if (!sess || sess.key !== key) {
      if (r[1] === 'c' && CH[r[2]]) startSess(key, NO[r[2]] + ' ' + title(r[2]), freshFirst(CH[r[2]].quiz));
      else if (r[1] === 'random') startSess(key, '섞어서 10문제', freshFirst(allQ()).slice(0, 10), { showChap: true });
      else if (r[1] === 'hard') startSess(key, '고난도 10문제', freshFirst(allQ().filter(q => q.level === 3)).slice(0, 10), { showChap: true });
      else if (r[1] === 'wrong') startSess(key, '오답 노트', wrongIds().map(id => QS[id]), { showChap: true });
      else return viewQuizHub();
    }
    const s = sess, n = s.qs.length;
    if (!n) {
      main.innerHTML = '<div class="empty">' + mascot(r[1] === 'wrong' ? 'cheer' : 'sleepy', 'bob') + '<b>' + (r[1] === 'wrong' ? '오답 노트가 비었어요' : '풀 문제가 없어요') + '</b>' +
        (r[1] === 'wrong' ? '틀린 문제가 생기면 여기에 모여요.' : '') + '<div style="margin-top:18px"><a class="btn primary" href="#/quiz">문제 고르러 가기</a></div></div>';
      sess = null; return;
    }
    if (s.i >= n) {
      const ok = s.qs.filter(q => s.picked[q.id] === q.answer).length, miss = s.qs.filter(q => s.picked[q.id] !== q.answer), pct = ok / n;
      main.innerHTML = '<section class="result"><div class="score-ring">' + ring(pct, { size: 196, sw: 14, color: pct >= .6 ? 'var(--ok)' : 'var(--no)' }) +
        '<div class="in"><b data-count="' + ok + '">' + ok + '</b><small>' + n + '문제 중</small></div></div>' + mascot(pct >= .8 ? 'cheer' : pct < .5 ? 'sad' : 'happy', 'hop') +
        '<h1>' + (pct === 1 ? '전부 맞혔어요' : pct >= .8 ? '거의 다 맞혔어요' : pct >= .6 ? '합격선은 넘었어요' : '한 번 더 보면 돼요') + '</h1>' +
        '<p>' + (miss.length ? '틀린 ' + miss.length + '개는 오답 노트에 들어갔어요. 지금 바로 다시 풀면 가장 잘 남아요.' : esc(s.name) + '을 깔끔하게 끝냈어요.') + '</p>' +
        '<div class="row">' + (miss.length ? '<button class="btn primary lg" data-act="retry">틀린 것만 다시</button>' : '') + '<button class="btn lg" data-act="again">새로 뽑아서</button><a class="btn ghost lg" href="#/quiz">목록으로</a></div></section>' +
        (miss.length ? '<section class="sec"><div class="sec-head"><h2>틀린 문제 해설</h2></div>' + miss.map(q => qCard(q, { ctx: 'review', reveal: true, picked: s.picked[q.id], showChap: true })).join('') + '</section>' : '');
      if (pct >= .8) setTimeout(() => confetti(null, innerHeight * .3, 120), 350);
      return;
    }
    const q = s.qs[s.i], pk = s.picked[q.id];
    main.innerHTML = '<div class="sess-top"><a class="icon-btn" href="#/quiz" aria-label="그만하기">' + I.x + '</a><div class="bar"><i style="width:' + ((s.i + (pk ? 1 : 0)) / n * 100) + '%"></i></div><span class="cnt">' + (s.i + 1) + ' / ' + n + '</span></div>' +
      '<h1 class="sess-label">' + esc(s.name) + '<span class="sr"> ' + (s.i + 1) + '번째 문제</span>' + (s.streak >= 3 ? ' · <span class="streak">' + s.streak + '연속 정답</span>' : '') + '</h1>' +
      qCard(q, { ctx: 'sess', picked: pk, reveal: !!pk, showChap: s.opt.showChap }) +
      (pk ? '' : '<div class="kbd-hint"><kbd>1</kbd>~<kbd>4</kbd> 로 고르고 <kbd>Enter</kbd> 로 넘어가요</div>');
    if (pk) showFb(q, pk);
  };
  const showFb = (q, pk) => {
    clearFb();
    const ok = pk === q.answer, cid = QCH[q.id], last = sess.i === sess.qs.length - 1;
    const praise = ['맞았어요', '정확해요', '좋아요', '바로 그거예요'][sess.streak % 4];
    const f = document.createElement('section');
    f.className = 'fb ' + (ok ? 'ok' : 'no');
    f.setAttribute('aria-label', '채점 결과');
    f.innerHTML = '<div class="fb-in"><div class="fb-head">' + mascot(ok ? 'cheer' : 'sad', 'hop') + '<div><h2 class="fb-t" tabindex="-1">' + (ok ? praise : '틀렸어요. 정답은 ' + CN[q.answer]) + '</h2>' +
      '<small>' + (ok ? (sess.streak >= 2 ? sess.streak + '문제 연속이에요' : esc(q.tag)) : '오답 노트에 넣어 뒀어요') + '</small></div></div>' +
      '<div class="fb-why">' + fmt(q.why) + (sess.opt.showChap || !ok ? '<br><a href="#/learn/' + cid + '">' + NO[cid] + ' ' + esc(title(cid)) + ' 다시 읽기 →</a>' : '') + '</div>' +
      '<button class="btn lg ' + (ok ? 'ok' : 'no') + '" data-act="next">' + (last ? '결과 보기' : '계속하기') + '</button></div>';
    document.body.appendChild(f); document.body.classList.add('has-fb');
    // 화면 읽기 프로그램이 결과부터 읽도록 제목에 초점을 둔다. Enter 로 바로 넘어갈 수 있다
    setTimeout(() => { const t = $('.fb-t', f); if (t) t.focus({ preventScroll: true }); }, 60);
  };

  /* ── 모의고사 ──────────────────────────────────────── */
  const QUOTA = { q1: 2, q2: 1, q3: 5, q4: 1, q5: 3, q6: 2, q7: 2, q8: 3, q9: 5, q10: 1, q11: 1, q12: 2, q13: 1, q14: 2, q15: 1, q16: 2, q17: 1, q18: 1, q19: 3, q20: 1 };
  const buildExam = () => {
    const take = (pool, n) => freshFirst(pool).slice(0, n).map(q => q.id);
    const fill = (list, want, pool) => list.length < want ? list.concat(take(pool.filter(q => list.indexOf(q.id) < 0), want - list.length)) : list;
    const s1 = META.subjects[0].parts.reduce((a, p) => a.concat(p.ids), []);
    let ids = []; s1.forEach(id => { if (CH[id]) ids = ids.concat(take(CH[id].quiz, 1)); });
    ids = fill(ids, 10, allQ(s1));
    let s2 = []; Object.keys(QUOTA).forEach(id => { if (CH[id]) s2 = s2.concat(take(CH[id].quiz, QUOTA[id])); });
    s2 = fill(s2, 40, allQ(Object.keys(QUOTA)));
    return ids.concat(s2);
  };
  let examTimer = null;
  const fmtTime = sec => { sec = Math.max(0, sec); return ('0' + Math.floor(sec / 60)).slice(-2) + ':' + ('0' + sec % 60).slice(-2); };
  const gradeExam = () => {
    const e = S.exam; let s1 = 0, s2 = 0;
    e.ids.forEach((id, i) => { const ok = e.ans[id] === QS[id].answer; record(id, ok); if (ok) { if (i < e.n1) s1++; else s2++; } });
    e.done = true; e.s1 = s1; e.s2 = s2; e.score = (s1 + s2) * 2; e.used = Math.min(e.dur, Math.round((Date.now() - e.start) / 1000)); e.celebrated = false;
    S.exams.push({ t: Date.now(), score: e.score, s1, s2, n1: e.n1, n2: e.ids.length - e.n1 }); save();
  };
  const viewExam = () => {
    main.className = '';
    clearInterval(examTimer);
    let e = S.exam;
    if (e && e.ids.some(id => !QS[id])) { S.exam = e = null; save(); }
    if (!e) {
      const total = Object.keys(QS).length;
      main.innerHTML = '<div class="page-head"><div class="exam-card"><span class="big-i">' + I.clock + '</span><div><h1 class="page-title" style="margin:0">모의고사</h1><p class="lead" style="font-size:16px">실제 시험처럼 50문항을 90분 안에 풀어요.</p></div></div></div>' +
        '<div class="rules"><div><b>50</b><span>문항</span></div><div><b>90분</b><span>시간</span></div><div><b>60점</b><span>합격선</span></div></div>' +
        '<div class="card"><p style="margin:0 0 6px"><b>어떻게 뽑나요?</b> 1과목 10문항은 장마다 하나씩, 2과목 40문항은 실제 출제 비중대로 뽑아요. 안 풀어 본 문제를 먼저 넣어요.</p>' +
        '<p class="muted small" style="margin:0">총점 60점 이상이어도 1과목 4개, 2과목 16개를 못 넘기면 과락이에요. 중간에 창을 닫아도 이어서 풀 수 있고, 시간은 계속 흘러요.</p></div>' +
        '<div class="row" style="margin-top:20px"><button class="btn primary lg" data-act="exam-start"' + (total < 50 ? ' disabled' : '') + '>시작하기' + I.arrow + '</button></div>' +
        (S.exams.length ? '<section class="sec"><div class="sec-head"><h2>지난 기록</h2></div><div class="topic-list">' + S.exams.slice().reverse().map((x, i) => {
          const d = new Date(x.t), pass = x.score >= 60 && x.s1 >= 4 && x.s2 >= 16;
          return '<a><span class="nb t2" style="width:auto;padding:0 8px">' + (S.exams.length - i) + '회</span><span>' + (d.getMonth() + 1) + '/' + d.getDate() + ' · 1과목 ' + x.s1 + '/' + x.n1 + ' · 2과목 ' + x.s2 + '/' + x.n2 + '</span><span class="rt ' + (pass ? 'pass-t' : 'fail-t') + '">' + x.score + '점</span></a>';
        }).join('') + '</div></section>' : '');
      return;
    }
    if (e.done) return viewExamResult();
    const left = () => e.dur - Math.round((Date.now() - e.start) / 1000);
    if (left() <= 0) { gradeExam(); return viewExamResult(); }
    const n = e.ids.length, q = QS[e.ids[e.i]], answered = e.ids.filter(id => e.ans[id]).length;
    main.innerHTML = '<div class="sess-top"><span class="cnt">' + (e.i < e.n1 ? '1과목' : '2과목') + '</span><div class="bar"><i style="width:' + (answered / n * 100) + '%"></i></div><span class="timer" id="timer" role="timer" aria-label="남은 시간">' + I.clock + fmtTime(left()) + '</span></div>' +
      '<h1 class="sess-label">모의고사 · ' + (e.i + 1) + ' / ' + n + ' · 푼 문제 ' + answered + '</h1>' +
      qCard(q, { ctx: 'exam', n: e.i + 1, picked: e.ans[q.id] }) +
      '<div class="sess-foot"><button class="btn" data-act="exam-go" data-i="' + (e.i - 1) + '"' + (e.i ? '' : ' disabled') + '>이전</button>' +
      '<button class="btn' + (e.flag[q.id] ? ' sun' : '') + '" data-act="exam-flag">' + I.flag + (e.flag[q.id] ? '표시됨' : '나중에') + '</button>' +
      (e.i < n - 1 ? '<button class="btn primary" data-act="exam-go" data-i="' + (e.i + 1) + '">다음</button>' : '<button class="btn primary" data-act="exam-submit">제출하기</button>') + '</div>' +
      '<details class="map" open><summary>' + I.list + '문제 지도 · 노란 점은 나중에 볼 문제</summary><div class="navi">' +
      e.ids.map((id, i) => '<button data-act="exam-go" data-i="' + i + '" class="' + (e.ans[id] ? 'ans ' : '') + (i === e.i ? 'cur ' : '') + (e.flag[id] ? 'flag' : '') + '">' + (i + 1) + '</button>').join('') + '</div></details>' +
      '<div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn sm" data-act="exam-submit">제출하기</button></div>';
    examTimer = setInterval(() => {
      const t = $('#timer'), l = left(); if (!t) return clearInterval(examTimer);
      t.innerHTML = I.clock + fmtTime(l); t.classList.toggle('low', l < 600);
      if (l <= 0) { clearInterval(examTimer); gradeExam(); toast('시간이 끝나서 제출했어요'); render(); }
    }, 1000);
  };
  const viewExamResult = () => {
    const e = S.exam, n = e.ids.length, n2 = n - e.n1, pass = e.score >= 60 && e.s1 >= 4 && e.s2 >= 16;
    const wrong = e.ids.filter(id => e.ans[id] !== QS[id].answer);
    let h = '<section class="result"><span class="badge-pass ' + (pass ? 'ok' : 'no') + '">' + (pass ? I.check + '합격선 통과' : e.score >= 60 ? I.alert + '과락' : I.alert + '합격선 60점') + '</span>' +
      '<div class="score-ring">' + ring(e.score / 100, { size: 196, sw: 14, color: pass ? 'var(--ok)' : 'var(--no)' }) + '<div class="in"><b data-count="' + e.score + '">' + e.score + '</b><small>점 · ' + Math.round(e.used / 60) + '분 걸림</small></div></div>' +
      '<h1>' + (pass ? '이대로면 붙어요' : '조금만 더 하면 돼요') + '</h1><p>' + (pass ? '틀린 문제만 다시 보고 한 번 더 풀어 봐요.' : '아래 많이 틀린 장부터 다시 읽고 오답 노트를 비워요.') + '</p></section>' +
      '<div class="subj-res"><div class="' + (e.s1 >= 4 ? '' : 'fail') + '"><div class="sr-t"><span>1과목</span><span>4개 이상</span></div><b>' + e.s1 + '<small> / ' + e.n1 + '</small></b><div class="bar"><i style="width:' + (e.s1 / e.n1 * 100) + '%"></i></div></div>' +
      '<div class="' + (e.s2 >= 16 ? '' : 'fail') + '"><div class="sr-t"><span>2과목</span><span>16개 이상</span></div><b>' + e.s2 + '<small> / ' + n2 + '</small></b><div class="bar"><i style="width:' + (e.s2 / n2 * 100) + '%"></i></div></div></div>';
    const by = {}; wrong.forEach(id => { const c = QCH[id]; by[c] = (by[c] || 0) + 1; });
    const worst = Object.keys(by).sort((a, b) => by[b] - by[a]).slice(0, 5);
    if (worst.length) h += '<section class="sec"><div class="sec-head"><h2>많이 틀린 장</h2><small>여기부터 다시 읽어요</small></div><div class="topic-list">' +
      worst.map(c => '<a href="#/learn/' + c + '" class="' + tc(c) + '"><span class="nb">' + NO[c] + '</span><span>' + esc(title(c)) + '</span><span class="rt fail-t">' + by[c] + '개 틀림</span></a>').join('') + '</div></section>';
    h += '<div class="row" style="margin:24px 0 8px"><button class="btn primary" data-act="exam-new">새 모의고사</button>' + (wrong.length ? '<a class="btn" href="#/quiz/wrong">틀린 문제 다시 풀기</a>' : '') + '</div>';
    h += '<section class="sec"><div class="sec-head"><h2>전체 해설</h2><small>번호를 누르면 그 문제로 가요</small></div><div class="navi">' +
      e.ids.map((id, i) => '<button data-act="scroll" data-q="' + id + '" class="' + (e.ans[id] === QS[id].answer ? 'r' : 'w') + '">' + (i + 1) + '</button>').join('') + '</div>' +
      e.ids.map((id, i) => qCard(QS[id], { ctx: 'review', n: i + 1, reveal: true, picked: e.ans[id], showChap: true })).join('') + '</section>';
    main.innerHTML = h;
    if (pass && !e.celebrated) { e.celebrated = true; save(); setTimeout(() => confetti(null, innerHeight * .3, 160), 400); }
  };

  /* ── 암기 카드 ─────────────────────────────────────── */
  let deck = null;
  const allCards = () => { const a = []; ORDER.forEach(id => { if (CH[id]) CH[id].cards.forEach((c, i) => a.push({ id: id + ':' + i, ch: id, q: c.q, a: c.a })); }); return a; };
  const buildDeck = f => {
    const cards = allCards().filter(c => f === 'all' || (f === 'dont' ? S.cards[c.id] === 0 : f === 'new' ? S.cards[c.id] === undefined : SUBJ[c.ch].id === f));
    deck = { f, cards: shuffle(cards), i: 0, flip: false, know: 0, total: cards.length };
  };
  const viewCards = anim => {
    main.className = '';
    if (!deck) buildDeck('all');
    const all = allCards(), dont = all.filter(c => S.cards[c.id] === 0).length, fresh = all.filter(c => S.cards[c.id] === undefined).length;
    const chip = (f, label) => '<button data-act="deck" data-f="' + f + '" aria-pressed="' + (deck.f === f) + '"' + (deck.f === f ? ' class="on"' : '') + '>' + label + '</button>';
    let h = '<div class="fc-wrap"><div class="page-head" style="margin-bottom:14px"><h1 class="page-title">암기 카드</h1></div><div class="chips">' +
      chip('all', '전체 ' + all.length) + chip('s1', '1과목') + chip('s2', '2과목') + chip('new', '안 본 것 ' + fresh) + chip('dont', '모르는 것 ' + dont) + '</div>';
    const c = deck.cards[deck.i];
    if (!c) {
      h += '<div class="empty">' + mascot(deck.total ? 'cheer' : 'sleepy', 'bob') + '<b>' + (deck.total ? '한 바퀴 돌았어요' : '카드가 없어요') + '</b>' + (deck.total ? deck.total + '장 중 ' + deck.know + '장을 알고 있어요.' : '') +
        '<div class="row" style="justify-content:center;margin-top:18px">' + (dont ? '<button class="btn primary" data-act="deck" data-f="dont">모르는 것만 다시</button>' : '') + '<button class="btn" data-act="deck" data-f="' + deck.f + '">다시 섞기</button></div></div>';
    } else {
      h += '<div class="sess-top" style="position:static;grid-template-columns:1fr auto"><div class="bar"><i style="width:' + (deck.i / deck.cards.length * 100) + '%"></i></div><span class="cnt">' + (deck.i + 1) + ' / ' + deck.cards.length + '</span></div>' +
        '<div class="fc-stack"><button class="fc' + (deck.flip ? ' flip' : '') + '" data-act="flip" aria-pressed="' + deck.flip + '">' +
        '<div class="face front"' + (deck.flip ? ' aria-hidden="true"' : '') + '><span class="side-lbl">' + NO[c.ch] + ' ' + esc(title(c.ch)) + '</span><div>' + fmt(c.q) + '</div><span class="hint">답을 떠올린 다음 눌러서 뒤집어요</span></div>' +
        '<div class="face back"' + (deck.flip ? '' : ' aria-hidden="true"') + '><span class="side-lbl">답</span><div>' + fmt(c.a) + '</div></div></button></div>' +
        '<div class="fc-btns"><button class="btn lg" data-act="card" data-v="0"' + (deck.flip ? '' : ' disabled') + '>' + I.x + '몰랐어요</button><button class="btn ok lg" data-act="card" data-v="1"' + (deck.flip ? '' : ' disabled') + '>' + I.check + '알았어요</button></div>' +
        '<div class="kbd-hint"><kbd>Space</kbd> 뒤집기 · <kbd>←</kbd> 몰랐어요 · <kbd>→</kbd> 알았어요</div>';
    }
    main.innerHTML = h + '</div>';
  };
  const flipCard = () => {
    deck.flip = !deck.flip;
    const f = $('.fc');
    if (f) {
      f.classList.toggle('flip', deck.flip); f.setAttribute('aria-pressed', deck.flip);
      $('.front', f).toggleAttribute('aria-hidden', deck.flip); $('.back', f).toggleAttribute('aria-hidden', !deck.flip);
      if (deck.flip) say('답: ' + $('.back div', f).textContent);
    }
    $$('[data-act="card"]').forEach(b => { b.disabled = !deck.flip; });
  };
  const answerCard = v => {
    const c = deck.cards[deck.i]; if (!c || !deck.flip) return;
    S.cards[c.id] = v; save(); if (v) deck.know++;
    const st = $('.fc-stack');
    const go = () => { deck.i++; deck.flip = false; viewCards(); };
    if (st && !reduce) { st.classList.add(v ? 'out-r' : 'out-l'); setTimeout(go, 260); } else go();
  };

  /* ── 한 장 요약 ────────────────────────────────────── */
  const viewSheet = () => {
    main.className = 'wide';
    let h = '<div class="page-head"><div class="row"><h1 class="page-title grow" style="margin:0">한 장 요약</h1><button class="btn sm no-print" data-act="print">' + I.sheet + '인쇄하기</button></div>' +
      '<p class="lead" style="margin-top:8px">장마다 시험 직전에 볼 줄만 모았어요. 막히는 줄이 있으면 제목을 눌러 그 장으로 가요.</p></div>';
    META.subjects.forEach(s => {
      h += '<h2 class="sheet-subj">' + s.name + ' ' + esc(s.title) + '</h2><div class="sheet-grid">';
      s.parts.forEach(p => p.ids.forEach(id => {
        if (!CH[id]) return;
        h += '<div class="sheet-card ' + tc(id) + '"><h3><span class="nb">' + NO[id] + '</span><a href="#/learn/' + id + '">' + esc(title(id)) + '</a>' + stars(CH[id].weight) + '</h3><ul>' + CH[id].keys.map(k => '<li>' + fmt(k) + '</li>').join('') + '</ul></div>';
      }));
      h += '</div>';
    });
    main.innerHTML = h;
  };

  /* ── 길 찾기 ───────────────────────────────────────── */
  let toastT;
  const focusTitle = () => { const h = $('h1', main); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } };
  // 화면 읽기 프로그램에 짧게 알린다. 같은 말을 두 번 해도 읽히도록 비웠다가 넣는다
  const say = msg => { const el = $('#live'); if (!el) return; el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 60); };
  const toast = msg => {
    say(msg);
    let t = $('.toast'); if (t) t.remove();
    t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2200);
  };
  let lastHash = null;
  const render = quiet => {
    const r = route(); clearInterval(examTimer); codeStore = [];
    if (!(r[0] === 'quiz' && r[1] && sess && sess.picked[sess.qs[sess.i] && sess.qs[sess.i].id])) clearFb();
    if (r[0] === 'learn') { if (r[1]) viewChapter(r[1]); else viewLearnList(); }
    else if (r[0] === 'quiz') { if (r[1]) viewSess(r); else { sess = null; viewQuizHub(); } }
    else if (r[0] === 'exam') viewExam();
    else if (r[0] === 'cards') viewCards();
    else if (r[0] === 'sheet') viewSheet();
    else viewHome();
    renderNav(); closeSide(); countUp();
    const moved = lastHash !== location.hash;
    if (moved && !quiet) {
      const first = lastHash === null;
      scrollTo(0, 0); lastHash = location.hash;
      main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
      const on = $('.nav-ch.on', side); if (on) on.scrollIntoView({ block: 'nearest' });
      // 화면이 바뀌면 새 화면의 제목으로 초점을 옮겨 어디에 왔는지 읽히게 한다
      if (!first) { const h1 = $('h1', main) || main; h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    }
    document.title = (r[0] === 'learn' && r[1] ? title(r[1]) + ' · ' : '') + '세미콜론';
    onScroll();
  };
  addEventListener('hashchange', () => render());

  const onScroll = () => {
    const y = scrollY, bar = $('.readbar i'), r = route();
    $('.topbar').classList.toggle('scrolled', y > 4);
    if (r[0] === 'learn' && r[1]) { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? Math.min(100, y / h * 100) : 0) + '%'; }
    else bar.style.width = '0';
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ── 누르기 ────────────────────────────────────────── */
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, r = route(), e = S.exam;
    if (act === 'pick') {
      const q = QS[el.dataset.q], i = +el.dataset.i, card = el.closest('.q'), ctx = card.dataset.ctx, ok = i === q.answer;
      if (ctx === 'chap') {
        if (picks[q.id]) return; picks[q.id] = i; record(q.id, ok);
        const n = CH[r[1]].quiz.indexOf(q) + 1;
        card.outerHTML = qCard(q, { n, ctx: 'chap', picked: i, reveal: true });
        const nc = $('#q-' + q.id);
        if (ok) burstFrom($('.choice.right', nc)); else nc.classList.add('shake');
        const w = $('.why', nc); if (w) { w.tabIndex = -1; w.focus({ preventScroll: true }); }
        chapScore(r[1]); renderNav();
      } else if (ctx === 'sess') {
        if (sess.picked[q.id]) return; sess.picked[q.id] = i; record(q.id, ok);
        sess.streak = ok ? sess.streak + 1 : 0;
        render(true);
        const nc = $('#q-' + q.id);
        if (ok) burstFrom($('.choice.right', nc)); else nc.classList.add('shake');
      } else if (ctx === 'exam') {
        if (e.ans[q.id] === i) delete e.ans[q.id]; else e.ans[q.id] = i;
        save(); render(true);
      }
    }
    else if (act === 'next') { sess.i++; clearFb(); render(true); scrollTo(0, 0); focusTitle(); }
    else if (act === 'retry') { const miss = sess.qs.filter(q => sess.picked[q.id] !== q.answer); startSess(sess.key, sess.name, shuffle(miss), sess.opt); render(true); scrollTo(0, 0); focusTitle(); }
    else if (act === 'again') { sess = null; render(true); scrollTo(0, 0); focusTitle(); }
    else if (act === 'done') { const id = el.dataset.id; if (S.done[id]) delete S.done[id]; else { S.done[id] = true; burstFrom(el); } save(); render(true); }
    else if (act === 'day') { planDay = +el.dataset.i; render(true); }
    else if (act === 'theme') { const t = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('sqld.theme', t); } catch (x) {} renderNav(); }
    else if (act === 'examdate') { const v = prompt('시험 날짜를 적어 주세요 (예: 2026-11-14)', examDate()); if (v && /^\d{4}-\d{2}-\d{2}$/.test(v.trim())) { S.examDate = v.trim(); save(); planDay = null; render(true); } }
    else if (act === 'reset') { if (confirm('읽은 장, 푼 문제, 오답 노트, 모의고사 기록을 모두 지울까요? 되돌릴 수 없어요.')) { localStorage.removeItem(KEY); location.hash = '#/'; location.reload(); } }
    else if (act === 'exam-start' || act === 'exam-new') {
      if (act === 'exam-new' && !confirm('지금 결과 화면은 사라지고 새 문제로 시작해요. 점수 기록은 남아요.')) return;
      const ids = buildExam(); S.exam = { ids, n1: Math.min(10, ids.length), ans: {}, flag: {}, i: 0, start: Date.now(), dur: 90 * 60 }; save();
      location.hash = '#/exam'; render(true); scrollTo(0, 0);
    }
    else if (act === 'exam-go') { e.i = Math.max(0, Math.min(e.ids.length - 1, +el.dataset.i)); save(); render(true); scrollTo(0, 0); focusTitle(); }
    else if (act === 'exam-flag') { const qid = e.ids[e.i]; if (e.flag[qid]) delete e.flag[qid]; else e.flag[qid] = 1; save(); render(true); }
    else if (act === 'exam-submit') {
      const blank = e.ids.filter(id => !e.ans[id]).length;
      if (!confirm(blank ? '안 푼 문제가 ' + blank + '개 있어요. 그래도 제출할까요?' : '제출하고 채점할까요?')) return;
      gradeExam(); render(true); scrollTo(0, 0); focusTitle();
    }
    else if (act === 'scroll') { const t2 = document.getElementById('q-' + el.dataset.q); if (t2) t2.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    else if (act === 'deck') { buildDeck(el.dataset.f); viewCards(); }
    else if (act === 'flip') flipCard();
    else if (act === 'card') answerCard(+el.dataset.v);
    else if (act === 'copy') {
      const code = codeStore[+el.dataset.c];
      const done = () => { el.textContent = '복사했어요'; setTimeout(() => { el.textContent = '복사'; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done();
    }
    else if (act === 'print') print();
    else if (act === 'install') { if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(() => { installEvt = null; render(true); }); } }
    else if (act === 'install-no') { S.noInstall = true; save(); render(true); }
  });
  // 휴대폰에서 닫힌 목차는 키보드와 화면 읽기 프로그램이 지나치게 한다
  const syncSide = () => { side.inert = innerWidth < 1040 && !side.classList.contains('open'); };
  $('#menuBtn').addEventListener('click', function () {
    const o = !side.classList.contains('open'); side.classList.toggle('open', o); scrim.hidden = !o; this.setAttribute('aria-expanded', o); syncSide();
    if (o) { const f = $('.nav-a.on', side) || $('a', side); if (f) setTimeout(() => f.focus(), 50); }
  });
  scrim.addEventListener('click', () => { closeSide(); $('#menuBtn').focus(); });
  addEventListener('resize', syncSide);
  $('#skip').addEventListener('click', ev => { ev.preventDefault(); const h = $('h1', main) || main; h.tabIndex = -1; h.focus(); });
  document.addEventListener('keydown', ev => {
    if (ev.target.matches('input, textarea') || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const r = route();
    if (ev.key === 'Escape') { if (closeSide()) $('#menuBtn').focus(); return; }
    if (r[0] === 'quiz' && r[1] && sess && sess.i < sess.qs.length) {
      if (/^[1-4]$/.test(ev.key)) { const b = $('.q[data-ctx="sess"] .choice[data-i="' + ev.key + '"]'); if (b && !b.disabled) b.click(); }
      else if (ev.key === 'Enter' || ev.key === 'ArrowRight') { const n = $('.fb [data-act="next"]'); if (n) { ev.preventDefault(); n.click(); } }
    } else if (r[0] === 'exam' && S.exam && !S.exam.done) {
      if (/^[1-4]$/.test(ev.key)) { const b = $('.q[data-ctx="exam"] .choice[data-i="' + ev.key + '"]'); if (b) b.click(); }
      else if (ev.key === 'ArrowRight') { const g = $('.sess-foot [data-act="exam-go"].primary'); if (g) g.click(); }
      else if (ev.key === 'ArrowLeft') { const p = $('.sess-foot [data-act="exam-go"]:not(.primary)'); if (p && !p.disabled) p.click(); }
    } else if (r[0] === 'cards' && deck && deck.cards[deck.i]) {
      if (ev.key === ' ') { ev.preventDefault(); flipCard(); }
      else if (ev.key === 'ArrowLeft') answerCard(0);
      else if (ev.key === 'ArrowRight') answerCard(1);
    }
  });

  render();
})();
