// 한 번 열면 인터넷 없이도 열리도록 파일을 저장해 두는 서비스 워커
const CACHE = 'eng-toys-v2';
const CACHE_PREFIX = 'eng-toys-';   // 이 앱의 캐시만 정리한다 (같은 기기의 다른 앱 캐시는 건드리지 않는다)
const FILES = [
  './', 'index.html', 'manifest.json', 'css/style.css', 'fonts/Jua.woff2', 'libs/confetti.js',
  'js/app.config.js', 'js/data.js', 'js/scenes.js', 'js/core.js', 'js/games1.js', 'js/games2.js',
  'js/games3.js', 'js/stickers.js', 'js/parent.js', 'js/start.js', 'js/app.js', 'js/single.js', 'sounds/correct.mp3',
  'sounds/pop.mp3', 'sounds/sparkle.mp3', 'sounds/tap.mp3', 'sounds/try-again.mp3', 'sounds/win.mp3', 'icons/icon-192.png',
  'icons/icon-512.png', 'images/bg/beach.webp', 'images/bg/body.webp', 'images/bg/farm.webp', 'images/bg/feel.webp', 'images/bg/forest.webp',
  'images/bg/home.webp', 'images/bg/house.webp', 'images/bg/night.webp', 'images/bg/numbers.webp', 'images/bg/savanna.webp', 'images/bg/sports.webp',
  'images/bg/toys.webp', 'images/badminton.webp',
  'images/bowling.webp',
  'images/bubbles.webp', 'images/camera.webp',
  'images/confetti.webp', 'images/crayon.webp',
  'images/duck.webp', 'images/eight.webp',
  'images/eightoclock.webp', 'images/elephant.webp',
  'images/five.webp', 'images/fiveoclock.webp', 'images/footprints.webp', 'images/four.webp', 'images/fouroclock.webp',
  'images/gift.webp', 'images/girl.webp', 'images/headphones.webp',
  'images/hockey.webp', 'images/hot.webp', 'images/joystick.webp',
  'images/lips.webp', 'images/lungs.webp', 'images/magicwand.webp',
  'images/music.webp', 'images/nine.webp',
  'images/nineoclock.webp', 'images/one.webp', 'images/oneoclock.webp', 'images/paintbrush.webp', 'images/palette.webp',
  'images/partypopper.webp', 'images/pencil.webp', 'images/pingpong.webp', 'images/pool.webp', 'images/puzzle.webp',
  'images/radio.webp', 'images/ribbon.webp', 'images/robot.webp', 'images/scissors.webp',
  'images/seven.webp', 'images/sevenoclock.webp', 'images/six.webp',
  'images/sixoclock.webp', 'images/skis.webp', 'images/sleepy.webp', 'images/soap.webp',
  'images/swimming.webp', 'images/teddybear.webp', 'images/ten.webp', 'images/tennis.webp', 'images/tenoclock.webp',
  'images/three.webp', 'images/threeoclock.webp',
  'images/trophy.webp',
  'images/two.webp', 'images/twooclock.webp',
  'images/yarn.webp', 'images/yoyo.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // 인터넷이 되면 최신 파일, 안 되면 저장해 둔 파일을 쓴다
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => {   // 브라우저가 저장해 둔 옛 파일 대신 늘 새 파일을 확인한다
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match(e.request)));
});
