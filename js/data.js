// 단어 데이터: [그림 파일 이름, 영어, 한글, (읽을 소리: 영어와 다를 때만)]
// 출처: 앱/나와우리집/기획서.md 3장 (테마와 단어), 5장 (문장 규칙), 6장 (테마별 게임 배정)
// 주제 하나에 단어 5의 배수를 넣는다. 지금은 주제 6개 × 20개 = 120개 (묶음 4개씩, 묶음마다 5개).
window.A = window.A || {};

// 모든 주제가 같은 게임 8개를 같은 순서로 쓴다 (카드는 맨 위, 묻고 답하기는 맨 아래 가로 한 줄)
const ALL_GAMES = [
  ['card', 1], ['pick', 1], ['balloon', 1], ['match', 1],
  ['ox', 2], ['scratch', 2], ['maze', 3], ['qa', 3],
];

// 복수형 단어: "These are ..." 로 말한다 (기획서 5장)
const PLURAL_IDS = new Set(['footprints', 'scissors', 'bubbles', 'headphones', 'skis', 'lips', 'lungs']);

// 관사(a/an)를 붙이지 않는 셀 수 없는 말: "This is soap." (기획서 5장)
const NO_ART_IDS = new Set(['soap', 'confetti', 'yarn', 'music']);

// 문장 종류 (기획서 5장). core.js 의 A.isLine·A.askLine·A.itLine·A.whatLine·A.whereLine 이 종류대로 문장을 만든다
//  item: 몸·물건·놀이 물건·악기 → "This is a ball." / "These are skis."
//  number: 숫자 → "This is one."
//  time: 시각 → "It's one o'clock."
//  sport: 운동 이름 → "It's bowling."
//  feeling: 기분 얼굴 (주제 전체) → "This face is happy."
const NUMBER_IDS = new Set(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
const TIME_IDS = new Set(['oneoclock', 'twooclock', 'threeoclock', 'fouroclock', 'fiveoclock',
  'sixoclock', 'sevenoclock', 'eightoclock', 'nineoclock', 'tenoclock']);
const SPORT_IDS = new Set(['tennis', 'bowling', 'pingpong', 'badminton', 'swimming', 'hockey', 'pool']);
const kindOf = (id, themeId) => {
  if (themeId === 'feel') return 'feeling';
  if (NUMBER_IDS.has(id)) return 'number';
  if (TIME_IDS.has(id)) return 'time';
  if (SPORT_IDS.has(id)) return 'sport';
  return 'item';
};

// 화면 밖 미션 (기획서 7장). 놀이 끝 화면에 보여 준다
const BODY_MISSION = '오늘 내 몸 한 곳을 영어로 말해 보기';
const FEEL_MISSION = '오늘 내 기분을 영어로 말해 보기';
const HOUSE_MISSION = '오늘 집에서 본 물건 하나를 영어로 말해 보기';
const TOY_MISSION = '오늘 가지고 논 장난감 하나를 영어로 말해 보기';
const SPORT_MISSION = '오늘 한 운동이나 악기를 영어로 말해 보기';
const TIME_MISSION = '오늘 본 시계 시각을 영어로 말해 보기';

A.THEMES = [
  { id: 'toys', ko: '장난감·놀이', en: 'Toys and Play', icon: '🧸', cover: 'teddybear', color: '#c9dcff',
    games: ALL_GAMES, mission: TOY_MISSION,
    words: [
      ['teddybear', 'teddy bear', '곰인형'], ['puzzle', 'puzzle', '퍼즐'], ['robot', 'robot', '로봇'], ['yoyo', 'yo-yo', '요요'], ['gift', 'gift', '선물'],
      ['partypopper', 'party popper', '폭죽'], ['ribbon', 'ribbon', '리본'], ['crayon', 'crayon', '크레파스'], ['magicwand', 'magic wand', '마법봉'], ['bubbles', 'bubbles', '비눗방울'],
      ['paintbrush', 'paintbrush', '붓'], ['palette', 'palette', '물감 팔레트'], ['joystick', 'joystick', '조이스틱'], ['pencil', 'pencil', '연필'], ['confetti', 'confetti', '색종이'],
      ['headphones', 'headphones', '헤드폰'], ['camera', 'camera', '카메라'], ['radio', 'radio', '라디오'], ['yarn', 'yarn', '실'], ['duck', 'duck', '오리'],
    ] },
];

// 5개씩 묶음으로 나누기 (맨 끝 묶음은 5개보다 적을 수 있음)
A.GROUP_SIZE = 5;
A.THEMES.forEach(t => {
  t.words = t.words.map(([id, en, ko, say]) => ({
    id, en, ko, say: say || en,
    kind: kindOf(id, t.id),
    art: NO_ART_IDS.has(id) ? '' : (/^[aeiou]/i.test(en) ? 'an' : 'a'),
    plural: PLURAL_IDS.has(id),
  }));
  t.groups = [];
  for (let i = 0; i < t.words.length; i += A.GROUP_SIZE) {
    t.groups.push(t.words.slice(i, i + A.GROUP_SIZE));
  }
});
