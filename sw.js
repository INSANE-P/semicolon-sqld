// 한 번 열어 두면 인터넷 없이도 열리게 한다.
// 온라인이면 새 파일을 먼저 받고(내용이 고쳐지면 바로 반영), 끊기면 저장해 둔 것을 쓴다.
const CACHE = 'semicolon-v10';
const IDS = ['_meta', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10',
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'];
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'assets/style.css', 'assets/app.js',
  'assets/brand/mark.svg', 'assets/og.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png'].concat(IDS.map(id => 'content/' + id + '.js'));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => {}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  const same = new URL(req.url).origin === location.origin;
  if (same) {
    // 우리 파일: 새것 먼저, 안 되면 저장본
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
  } else if (/^https:\/\/(cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)\//.test(req.url)) {
    // 글꼴: 저장본 먼저, 없으면 받아서 저장. 댓글과 프로필 사진은 늘 새로 받는다
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
