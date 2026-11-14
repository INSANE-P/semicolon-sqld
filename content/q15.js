SQLD.add({
  id: 'q15',
  title: 'PIVOT 과 UNPIVOT',
  minutes: 10,
  weight: 2,
  lead: '행으로 쌓인 데이터를 교차표로 펴고, 교차표를 다시 행으로 쌓는 문법이에요. 문법 자리(무엇이 FOR 앞이고 무엇이 IN 안인지)와 결과 행 수를 묻는 문제가 나와요.',
  goals: [
    'LONG 데이터와 WIDE 데이터를 구분하고 어느 쪽이 테이블 설계에 맞는지 말할 수 있다',
    'PIVOT 절의 세 자리(집계 함수, FOR 컬럼, IN 값 목록)를 채울 수 있다',
    'FROM 절에서 컬럼을 줄이지 않으면 결과 행 수가 왜 늘어나는지 설명한다',
    'UNPIVOT 결과의 행 수를 NULL 까지 따져서 센다'
  ],
  blocks: [
    { t: 'h', x: '세로로 긴 표와 가로로 긴 표' },
    { t: 'p', x: '주문 테이블에 성별, 연도, 수량이 한 줄씩 쌓여 있다고 해 볼게요. 조회하기는 좋은데, "성별마다 연도별 수량 합계"를 한눈에 보고 싶으면 연도가 옆으로 펼쳐진 교차표가 더 편해요. 같은 데이터를 두 가지 모양으로 담을 수 있는 거예요.' },
    { t: 'vs',
      a: { title: 'LONG 데이터', items: ['속성 하나가 컬럼 하나, 값은 행으로 쌓인다', '관계형 데이터베이스의 테이블 설계 방식', '다른 테이블과 조인하기 좋다', '값의 종류가 늘어도 행만 추가하면 된다'] },
      b: { title: 'WIDE 데이터', items: ['한 속성의 값들이 여러 컬럼으로 펼쳐진 교차표', '요약해서 보여 줄 때 쓴다', '값의 종류가 늘면 컬럼을 추가해야 해서 테이블 설계로는 비효율적', '조인에 쓰기 어렵다'] } },
    { t: 'fig', caption: 'YR 컬럼에 들어 있던 값(2023, 2024)이 PIVOT 뒤에는 컬럼 이름이 돼요. UNPIVOT 은 그 반대 방향이에요.', svg: `<svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg">
  <text x="125" y="20" class="tx-b" text-anchor="middle">LONG</text>
  <rect x="20" y="32" width="70" height="28" class="bx"/><text x="55" y="51" class="tx-b" text-anchor="middle">GENDER</text>
  <rect x="90" y="32" width="70" height="28" class="bx-y"/><text x="125" y="51" class="tx-b" text-anchor="middle">YR</text>
  <rect x="160" y="32" width="70" height="28" class="bx"/><text x="195" y="51" class="tx-b" text-anchor="middle">QTY</text>
  <rect x="20" y="60" width="70" height="28" class="bx"/><text x="55" y="79" class="tx-m" text-anchor="middle">F</text>
  <rect x="90" y="60" width="70" height="28" class="bx-y"/><text x="125" y="79" class="tx-m" text-anchor="middle">2023</text>
  <rect x="160" y="60" width="70" height="28" class="bx"/><text x="195" y="79" class="tx-m" text-anchor="middle">30</text>
  <rect x="20" y="88" width="70" height="28" class="bx"/><text x="55" y="107" class="tx-m" text-anchor="middle">F</text>
  <rect x="90" y="88" width="70" height="28" class="bx-y"/><text x="125" y="107" class="tx-m" text-anchor="middle">2024</text>
  <rect x="160" y="88" width="70" height="28" class="bx"/><text x="195" y="107" class="tx-m" text-anchor="middle">55</text>
  <rect x="20" y="116" width="70" height="28" class="bx"/><text x="55" y="135" class="tx-m" text-anchor="middle">M</text>
  <rect x="90" y="116" width="70" height="28" class="bx-y"/><text x="125" y="135" class="tx-m" text-anchor="middle">2023</text>
  <rect x="160" y="116" width="70" height="28" class="bx"/><text x="195" y="135" class="tx-m" text-anchor="middle">15</text>
  <rect x="20" y="144" width="70" height="28" class="bx"/><text x="55" y="163" class="tx-m" text-anchor="middle">M</text>
  <rect x="90" y="144" width="70" height="28" class="bx-y"/><text x="125" y="163" class="tx-m" text-anchor="middle">2024</text>
  <rect x="160" y="144" width="70" height="28" class="bx"/><text x="195" y="163" class="tx-m" text-anchor="middle">20</text>
  <text x="315" y="66" class="tx-a" text-anchor="middle">PIVOT</text>
  <line x1="255" y1="76" x2="372" y2="76" class="ln-a" marker-end="url(#arr-a)"/>
  <line x1="375" y1="116" x2="258" y2="116" class="ln" marker-end="url(#arr)"/>
  <text x="315" y="138" class="tx" text-anchor="middle">UNPIVOT</text>
  <text x="505" y="20" class="tx-b" text-anchor="middle">WIDE</text>
  <rect x="400" y="32" width="70" height="28" class="bx"/><text x="435" y="51" class="tx-b" text-anchor="middle">GENDER</text>
  <rect x="470" y="32" width="70" height="28" class="bx-y"/><text x="505" y="51" class="tx-b" text-anchor="middle">2023</text>
  <rect x="540" y="32" width="70" height="28" class="bx-y"/><text x="575" y="51" class="tx-b" text-anchor="middle">2024</text>
  <rect x="400" y="60" width="70" height="28" class="bx"/><text x="435" y="79" class="tx-m" text-anchor="middle">F</text>
  <rect x="470" y="60" width="70" height="28" class="bx"/><text x="505" y="79" class="tx-m" text-anchor="middle">30</text>
  <rect x="540" y="60" width="70" height="28" class="bx"/><text x="575" y="79" class="tx-m" text-anchor="middle">55</text>
  <rect x="400" y="88" width="70" height="28" class="bx"/><text x="435" y="107" class="tx-m" text-anchor="middle">M</text>
  <rect x="470" y="88" width="70" height="28" class="bx"/><text x="505" y="107" class="tx-m" text-anchor="middle">15</text>
  <rect x="540" y="88" width="70" height="28" class="bx"/><text x="575" y="107" class="tx-m" text-anchor="middle">20</text>
  <text x="505" y="140" class="tx-s" text-anchor="middle">YR 의 값이 컬럼 이름으로</text>
</svg>` },
    { t: 'table', head: ['문법', '방향', '하는 일'], rows: [
      ['PIVOT', 'LONG → WIDE', '행으로 쌓인 값을 컬럼으로 펼치면서 집계한다'],
      ['UNPIVOT', 'WIDE → LONG', '여러 컬럼을 한 컬럼 아래 행으로 쌓는다']
    ] },

    { t: 'h', x: 'PIVOT 문법의 세 자리' },
    { t: 'p', x: 'PIVOT 절에는 자리가 셋 있어요. 셀에 넣을 값을 만드는 ==집계 함수==, 컬럼으로 펼칠 대상인 `FOR 컬럼`, 그 컬럼의 값 가운데 무엇을 컬럼으로 만들지 적는 `IN (값 목록)` 이에요.' },
    { t: 'sql', code: `SELECT *
  FROM (조회할 컬럼만 고른 인라인 뷰)
 PIVOT (집계함수(값 컬럼)
        FOR 펼칠 컬럼
        IN (값1, 값2, …));` },
    { t: 'data', name: 'ORD', head: ['ONO', 'GENDER', 'YR', 'QTY'], rows: [[1, 'M', 2023, 10], [2, 'M', 2024, 20], [3, 'F', 2023, 30], [4, 'F', 2024, 40], [5, 'M', 2023, 5], [6, 'F', 2024, 15]] },
    { t: 'sql', code: `SELECT *
  FROM (SELECT GENDER, YR, QTY FROM ORD)
 PIVOT (SUM(QTY) FOR YR IN (2023, 2024))
 ORDER BY GENDER;`, result: { head: ['GENDER', '2023', '2024'], rows: [['F', 30, 55], ['M', 15, 20]] },
      note: 'F 의 2024 는 40 + 15, M 의 2023 은 10 + 5 예요. GROUP BY 를 쓰지 않았는데도 GENDER 별로 묶였어요.' },
    { t: 'p', x: 'GROUP BY 를 안 썼는데 왜 GENDER 로 묶였을까요. PIVOT 은 FROM 절에서 넘어온 컬럼 가운데 ==PIVOT 절에 쓰지 않은 나머지 전부를 그룹 기준==으로 삼아요. 여기서는 QTY(집계)와 YR(FOR)을 빼면 GENDER 만 남으니 GENDER 별로 한 행씩 나온 거예요.' },
    { t: 'table', caption: '교재에 따라 이렇게 부르기도 해요', head: ['이름', '위 예에서', '역할'], rows: [
      ['VALUE 컬럼', 'QTY', '집계 함수 안에 들어가 셀 값이 된다'],
      ['UNSTACK 컬럼', 'YR', 'FOR 뒤에 쓴다. 값이 컬럼 이름으로 펼쳐진다'],
      ['STACK 컬럼', 'GENDER', '아무 데도 안 썼다. 행 기준으로 남는다']
    ] },

    { t: 'h', x: '인라인 뷰로 컬럼을 줄여야 하는 이유' },
    { t: 'p', x: '같은 PIVOT 을 인라인 뷰 없이 ORD 테이블에 바로 걸어 볼게요. 이번에는 ONO 도 FROM 절에 있어요. PIVOT 절에 안 쓴 컬럼이 ONO, GENDER 둘이라 둘 다 그룹 기준이 돼요.' },
    { t: 'sql', code: `SELECT *
  FROM ORD
 PIVOT (SUM(QTY) FOR YR IN (2023, 2024))
 ORDER BY ONO;`, result: { head: ['ONO', 'GENDER', '2023', '2024'], rows: [[1, 'M', 10, null], [2, 'M', null, 20], [3, 'F', 30, null], [4, 'F', null, 40], [5, 'M', 5, null], [6, 'F', null, 15]] },
      note: 'ONO 가 행마다 달라서 묶이는 것이 없어요. 6행이 그대로 나오고 칸만 좌우로 흩어져요.' },
    { t: 'trap', title: '나머지 컬럼은 전부 그룹 기준', x: 'PIVOT 문제에서 FROM 절이 테이블 그대로인지, 컬럼을 고른 인라인 뷰인지부터 봐요. 테이블 그대로면 PK 같은 컬럼까지 그룹 기준에 끼어서 행이 묶이지 않아요. 반대로 인라인 뷰에서 GENDER 까지 빼고 `SELECT YR, QTY` 만 넘기면 그룹 기준이 하나도 없어서 전체 합계 한 행(45, 75)만 나와요.' },
    { t: 'check', q: 'FROM (SELECT YR, QTY FROM ORD) PIVOT (SUM(QTY) FOR YR IN (2023, 2024)) 의 결과는 몇 행이고 값은 무엇일까요?', a: '한 행이에요. 그룹 기준으로 남는 컬럼이 없어서 전체가 한 묶음이 되고, 2023 은 10 + 30 + 5 = 45, 2024 는 20 + 40 + 15 = 75 예요.' },

    { t: 'h', x: 'IN 목록과 별칭' },
    { t: 'p', x: 'IN 안에 적은 값만 컬럼으로 만들어져요. YR 에 2022 가 있어도 IN 에 안 적으면 그 컬럼은 생기지 않아요. 그리고 그냥 두면 컬럼 이름이 `2023` 처럼 값 그대로라서, 보통 별칭을 붙여요.' },
    { t: 'sql', code: `SELECT *
  FROM (SELECT GENDER, YR, QTY FROM ORD)
 PIVOT (SUM(QTY) FOR YR IN (2023 AS Y23, 2024 AS Y24))
 ORDER BY GENDER;`, result: { head: ['GENDER', 'Y23', 'Y24'], rows: [['F', 30, 55], ['M', 15, 20]] } },
    { t: 'ul', items: [
      '펼칠 컬럼이 문자면 IN 안의 값에 작은따옴표를 붙여요. 예: `FOR JOB IN (\'CLERK\', \'MGR\')`',
      '집계 함수에도 별칭을 주면 컬럼 이름이 `IN별칭_집계별칭` 으로 붙어요. 예: `SUM(QTY) AS TOT` 와 `2023 AS Y23` 이면 `Y23_TOT`',
      '해당하는 행이 없는 칸은 SUM, MAX, AVG 면 NULL, COUNT 면 0 이에요'
    ] },
    { t: 'trap', title: '빈 칸은 0 이 아니라 NULL', x: '어떤 그룹에 해당 값의 행이 하나도 없으면 `SUM` 으로 만든 칸은 NULL 이에요. 결과 표 보기에서 그 칸을 0 으로 채운 것이 오답으로 나와요. 0 이 나오는 건 `COUNT` 로 피벗했을 때뿐이에요.' },

    { t: 'h', x: 'PIVOT 없이 같은 결과 만들기' },
    { t: 'p', x: 'PIVOT 이 하는 일은 "값이 2023 인 행만 골라 더하기"를 컬럼마다 반복하는 거예요. 그래서 CASE 나 DECODE 를 집계 함수 안에 넣고 GROUP BY 를 쓰면 똑같은 결과가 나와요. "결과가 같은 SQL 을 고르라"는 문제로 나와요.' },
    { t: 'sql', code: `SELECT GENDER,
       SUM(CASE WHEN YR = 2023 THEN QTY END) AS Y23,
       SUM(DECODE(YR, 2024, QTY))            AS Y24
  FROM ORD
 GROUP BY GENDER
 ORDER BY GENDER;`, result: { head: ['GENDER', 'Y23', 'Y24'], rows: [['F', 30, 55], ['M', 15, 20]] },
      note: '조건에 안 맞는 행은 CASE 가 NULL 을 돌려주고, SUM 은 NULL 을 건너뛰어요.' },
    { t: 'tip', title: 'PIVOT 을 CASE 로 읽기', x: '`PIVOT (SUM(QTY) FOR YR IN (2023, 2024))` 를 보면 머릿속으로 `SUM(CASE WHEN YR = 2023 THEN QTY END)`, `SUM(CASE WHEN YR = 2024 THEN QTY END)` 두 컬럼에 `GROUP BY 나머지 컬럼` 으로 바꿔 읽어요. 행 수와 빈 칸 문제가 전부 이 한 줄로 풀려요.' },

    { t: 'h', x: 'UNPIVOT 문법' },
    { t: 'p', x: '이번에는 반대예요. 연도가 컬럼으로 펼쳐진 표를 다시 행으로 쌓아요. 자리는 셋인데 뜻이 PIVOT 과 달라요. 맨 앞은 값이 들어갈 ==새 컬럼 이름==, FOR 뒤는 원래 컬럼 이름이 들어갈 ==새 컬럼 이름==, IN 안은 쌓을 ==기존 컬럼들==이에요.' },
    { t: 'sql', code: `SELECT *
  FROM 테이블
UNPIVOT (값을 담을 새 컬럼
         FOR 컬럼 이름을 담을 새 컬럼
         IN (컬럼1, 컬럼2, …));` },
    { t: 'data', name: 'ORD_W', head: ['GENDER', 'Y23', 'Y24'], rows: [['F', 30, 55], ['M', 15, null]] },
    { t: 'sql', code: `SELECT *
  FROM ORD_W
UNPIVOT (QTY FOR YR IN (Y23, Y24));`, result: { head: ['GENDER', 'YR', 'QTY'], rows: [['F', 'Y23', 30], ['F', 'Y24', 55], ['M', 'Y23', 15]] },
      note: 'YR 에는 컬럼 이름이 글자로 들어가요. M 의 Y24 는 NULL 이라 행이 만들어지지 않았어요.' },
    { t: 'trap', title: 'UNPIVOT 은 NULL 을 버려요', x: '2행 × 2컬럼이니 4행이 나올 것 같지만 3행이에요. UNPIVOT 은 값이 NULL 인 칸을 기본으로 제외해요(`EXCLUDE NULLS` 가 기본값). NULL 칸까지 행으로 만들려면 `UNPIVOT INCLUDE NULLS (…)` 라고 써야 해요. 행 수를 묻는 문제는 NULL 칸 개수를 세는 문제예요.' },
    { t: 'sql', code: `SELECT *
  FROM ORD_W
UNPIVOT INCLUDE NULLS (QTY FOR YR IN (Y23 AS 2023, Y24 AS 2024));`, result: { head: ['GENDER', 'YR', 'QTY'], rows: [['F', 2023, 30], ['F', 2024, 55], ['M', 2023, 15], ['M', 2024, null]] },
      note: 'IN 안에서 AS 로 별칭을 주면 YR 에 컬럼 이름 대신 그 값이 들어가요.' },
    { t: 'vs',
      a: { title: 'PIVOT 의 IN', items: ['펼칠 컬럼에 들어 있는 **값**을 적는다', '문자 값이면 작은따옴표', '예: `IN (\'CLERK\', \'MGR\')`'] },
      b: { title: 'UNPIVOT 의 IN', items: ['쌓을 **컬럼 이름**을 적는다', '컬럼 이름이라 작은따옴표를 붙이지 않는다', '예: `IN (Y23, Y24)`'] } },
    { t: 'trap', title: 'IN 안의 따옴표', x: 'UNPIVOT 의 IN 에는 컬럼 이름이 오니까 `IN (\'Y23\', \'Y24\')` 처럼 작은따옴표를 붙이면 오류예요. 다만 컬럼 이름이 `2023` 처럼 숫자로 시작하면 이름을 큰따옴표로 감싸 `IN ("2023", "2024")` 라고 써야 해요. 작은따옴표는 값, 큰따옴표는 이름이에요.' },
    { t: 'check', q: '3행짜리 표에서 컬럼 4개를 UNPIVOT 했어요. 12칸 가운데 NULL 이 5칸이면 결과는 몇 행일까요?', a: '7행이에요. UNPIVOT 은 기본으로 NULL 칸을 빼요. INCLUDE NULLS 를 쓰면 12행이에요.' },
    { t: 'p', x: 'SQL Server 에도 PIVOT 과 UNPIVOT 이 있지만 세부 문법이 달라요. SQLD 는 여기서 본 Oracle 문법으로 물어요.' }
  ],
  keys: [
    'PIVOT 은 LONG → WIDE, UNPIVOT 은 WIDE → LONG',
    'PIVOT (집계함수(값 컬럼) FOR 펼칠 컬럼 IN (값 목록))',
    'PIVOT 절에 안 쓴 FROM 절 컬럼은 전부 그룹 기준. 그래서 인라인 뷰로 컬럼을 줄인다',
    'PIVOT 의 빈 칸은 SUM 이면 NULL, COUNT 면 0',
    'PIVOT 은 SUM(CASE WHEN … THEN … END) + GROUP BY 로 바꿔 쓸 수 있다',
    'UNPIVOT (값 컬럼 FOR 이름 컬럼 IN (컬럼 목록)). 앞의 둘은 새로 짓는 이름',
    'UNPIVOT 은 NULL 칸을 기본 제외. 넣으려면 INCLUDE NULLS',
    'PIVOT 의 IN 은 값(문자면 작은따옴표), UNPIVOT 의 IN 은 컬럼 이름(따옴표 없음)'
  ],
  cards: [
    { q: 'RDBMS 테이블 설계에 맞는 쪽은 LONG 과 WIDE 중 어디?', a: 'LONG. 값의 종류가 늘어도 행만 추가하면 되고 조인하기 좋아요. WIDE 는 컬럼을 추가해야 해요.' },
    { q: 'PIVOT 절의 FOR 뒤에는 무엇을 쓰나요?', a: '컬럼으로 펼칠 컬럼. 그 컬럼의 값 가운데 무엇을 컬럼으로 만들지는 IN 안에 적어요.' },
    { q: 'PIVOT 에서 GROUP BY 없이 그룹 기준이 정해지는 방법은?', a: 'FROM 절 컬럼 가운데 집계 함수와 FOR 에 쓰지 않은 나머지 전부가 그룹 기준이 돼요.' },
    { q: 'FROM 절에 테이블을 그대로 쓰고 PIVOT 하면 생기는 일은?', a: 'PK 같은 컬럼까지 그룹 기준이 돼서 행이 묶이지 않아요. 인라인 뷰로 필요한 컬럼만 넘겨야 해요.' },
    { q: 'UNPIVOT (A FOR B IN (C1, C2)) 에서 A 와 B 는?', a: 'A 는 값이 들어갈 새 컬럼, B 는 원래 컬럼 이름(C1, C2)이 들어갈 새 컬럼이에요.' },
    { q: 'UNPIVOT 결과에 NULL 칸도 행으로 넣으려면?', a: '`UNPIVOT INCLUDE NULLS (…)`. 안 쓰면 NULL 칸은 빠져요.' },
    { q: '`PIVOT (COUNT(*) FOR …)` 에서 해당 행이 없는 칸의 값은?', a: '0. SUM 이나 MAX 였다면 NULL 이에요.' }
  ],
  quiz: [
    { id: 'q15-01', level: 1, tag: 'LONG 과 WIDE',
      q: '데이터 구조와 PIVOT, UNPIVOT 에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'PIVOT 은 행으로 쌓인 LONG 데이터를 교차표 모양의 WIDE 데이터로 바꾼다.',
        'UNPIVOT 은 여러 컬럼으로 펼쳐진 값을 하나의 컬럼 아래 행으로 쌓는다.',
        'WIDE 데이터는 값의 종류가 늘어도 컬럼을 추가할 필요가 없어 관계형 데이터베이스의 테이블 설계에 알맞다.',
        'PIVOT 절에는 셀 값을 만들 집계 함수를 써야 한다.'
      ],
      answer: 3,
      why: 'WIDE 데이터는 값의 종류가 하나 늘 때마다 컬럼을 추가해야 해서 테이블 설계로는 비효율적이에요. 테이블 설계에 맞는 쪽은 행만 추가하면 되는 LONG 데이터예요. 나머지 셋은 맞는 설명이에요.' },
    { id: 'q15-02', level: 2, tag: 'PIVOT 결과',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENO', 'DEPT', 'JOB', 'SAL'], rows: [[1, 10, 'CLERK', 100], [2, 10, 'MGR', 300], [3, 20, 'CLERK', 200], [4, 20, 'CLERK', 150], [5, 30, 'MGR', 400]] }],
      code: `SELECT *
  FROM (SELECT DEPT, JOB, SAL FROM EMP)
 PIVOT (SUM(SAL) FOR JOB IN ('CLERK' AS C, 'MGR' AS M))
 ORDER BY DEPT;`,
      choices: [
        { head: ['DEPT', 'C', 'M'], rows: [[10, 100, 300], [20, 350, null], [30, null, 400]] },
        { head: ['DEPT', 'C', 'M'], rows: [[10, 100, 300], [20, 350, 0], [30, 0, 400]] },
        { head: ['DEPT', 'C', 'M'], rows: [[10, 1, 1], [20, 2, 0], [30, 0, 1]] },
        { head: ['DEPT', 'C', 'M'], rows: [[10, 100, null], [10, null, 300], [20, 200, null], [20, 150, null], [30, null, 400]] }
      ],
      answer: 1,
      why: '인라인 뷰가 DEPT, JOB, SAL 만 넘기니 PIVOT 절에 안 쓴 DEPT 가 그룹 기준이에요. 20번 부서의 CLERK 은 200 + 150 = 350 이고, 해당 행이 없는 칸은 SUM 이라 0 이 아니라 NULL 이에요. 2번은 빈 칸을 0 으로 채웠고, 3번은 COUNT 로 피벗한 결과, 4번은 ENO 까지 그룹 기준에 들어갔을 때의 모양이에요.' },
    { id: 'q15-03', level: 2, tag: '그룹 기준',
      q: '아래 테이블에서 SQL 을 실행했을 때 결과의 행 수와 컬럼 수로 알맞은 것은?',
      tables: [{ name: 'T', head: ['ID', 'TEAM', 'MON', 'AMT'], rows: [[1, 'A', 1, 10], [2, 'A', 2, 20], [3, 'B', 1, 30], [4, 'B', 1, 40], [5, 'A', 1, 50]] }],
      code: `SELECT *
  FROM T
 PIVOT (SUM(AMT) FOR MON IN (1 AS M1, 2 AS M2));`,
      choices: ['2행 3컬럼', '5행 3컬럼', '2행 4컬럼', '5행 4컬럼'],
      answer: 4,
      why: 'FROM 절이 테이블 그대로라서 PIVOT 절에 안 쓴 ID 와 TEAM 이 모두 그룹 기준이에요. ID 가 행마다 달라 하나도 묶이지 않으니 5행이고, 컬럼은 ID, TEAM, M1, M2 로 4개예요. 2행 3컬럼은 `SELECT TEAM, MON, AMT` 인라인 뷰를 썼을 때의 결과예요.' },
    { id: 'q15-04', level: 2, tag: 'UNPIVOT 과 NULL',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'W', head: ['NAME', 'KOR', 'ENG', 'MATH'], rows: [['KIM', 90, null, 70], ['LEE', null, null, 80], ['PARK', 60, 50, null]] }],
      code: `SELECT COUNT(*)
  FROM W
UNPIVOT (SCORE FOR SUBJ IN (KOR, ENG, MATH));`,
      choices: ['3', '5', '6', '9'],
      answer: 2,
      why: 'UNPIVOT 은 값이 NULL 인 칸을 기본으로 제외해요. 9칸 가운데 NULL 이 아닌 칸은 KIM 2개, LEE 1개, PARK 2개로 5개라서 5행이에요. 9 는 INCLUDE NULLS 를 썼을 때, 3 은 원래 테이블의 행 수예요.' },
    { id: 'q15-05', level: 3, tag: 'CASE 로 바꿔 쓰기',
      q: '아래 테이블에서 [SQL] 과 실행 결과가 같지 않은 것은? (SAL 에는 NULL 이 없다)',
      tables: [{ name: 'EMP', head: ['ENO', 'DEPT', 'JOB', 'SAL'], rows: [[1, 10, 'CLERK', 100], [2, 10, 'MGR', 300], [3, 20, 'CLERK', 200], [4, 20, 'CLERK', 150], [5, 30, 'MGR', 400]] }],
      code: `[SQL]
SELECT *
  FROM (SELECT DEPT, JOB, SAL FROM EMP)
 PIVOT (COUNT(SAL) FOR JOB IN ('CLERK' AS C, 'MGR' AS M))
 ORDER BY DEPT;`,
      choices: [
        { code: `SELECT DEPT,
       COUNT(CASE WHEN JOB = 'CLERK' THEN SAL END) AS C,
       COUNT(CASE WHEN JOB = 'MGR' THEN SAL END)   AS M
  FROM EMP GROUP BY DEPT ORDER BY DEPT;` },
        { code: `SELECT DEPT,
       SUM(CASE WHEN JOB = 'CLERK' THEN 1 ELSE 0 END) AS C,
       SUM(CASE WHEN JOB = 'MGR' THEN 1 ELSE 0 END)   AS M
  FROM EMP GROUP BY DEPT ORDER BY DEPT;` },
        { code: `SELECT DEPT,
       COUNT(DECODE(JOB, 'CLERK', 1)) AS C,
       COUNT(DECODE(JOB, 'MGR', 1))   AS M
  FROM EMP GROUP BY DEPT ORDER BY DEPT;` },
        { code: `SELECT DEPT,
       SUM(DECODE(JOB, 'CLERK', 1)) AS C,
       SUM(DECODE(JOB, 'MGR', 1))   AS M
  FROM EMP GROUP BY DEPT ORDER BY DEPT;` }
      ],
      answer: 4,
      why: '[SQL] 의 결과는 (10, 1, 1), (20, 2, 0), (30, 0, 1) 이에요. COUNT 는 셀 것이 없으면 0 이에요. 1번과 3번은 조건에 안 맞는 행이 NULL 이 되고 COUNT 가 그것을 빼니 같은 결과예요. 2번은 0 과 1 을 더하니 역시 같아요. 4번은 DECODE 에 기본값이 없어서 안 맞는 행이 NULL 이고, 더할 값이 하나도 없는 SUM 은 0 이 아니라 NULL 이라 20번 부서의 M 과 30번 부서의 C 가 NULL 로 나와요.' },
    { id: 'q15-06', level: 3, tag: 'UNPIVOT 문법',
      q: '아래 테이블 STOCK 에서 [결과] 를 얻으려고 한다. 알맞은 SQL 은? (행 순서는 따지지 않는다)',
      tables: [
        { name: 'STOCK', head: ['ITEM', 'Q1', 'Q2'], rows: [['PEN', 10, 20], ['INK', null, 5]] },
        { name: '[결과]', head: ['ITEM', 'QTR', 'QTY'], rows: [['PEN', 'Q1', 10], ['PEN', 'Q2', 20], ['INK', 'Q1', null], ['INK', 'Q2', 5]] }
      ],
      choices: [
        { code: `SELECT * FROM STOCK
UNPIVOT INCLUDE NULLS (QTY FOR QTR IN (Q1, Q2));` },
        { code: `SELECT * FROM STOCK
UNPIVOT (QTY FOR QTR IN (Q1, Q2));` },
        { code: `SELECT * FROM STOCK
UNPIVOT INCLUDE NULLS (QTR FOR QTY IN (Q1, Q2));` },
        { code: `SELECT * FROM STOCK
UNPIVOT INCLUDE NULLS (QTY FOR QTR IN ('Q1', 'Q2'));` }
      ],
      answer: 1,
      why: '[결과] 에 INK 의 Q1 이 NULL 인 채로 들어 있으니 INCLUDE NULLS 가 필요해요. 맨 앞 자리는 값을 담을 컬럼(QTY), FOR 뒤는 컬럼 이름을 담을 컬럼(QTR)이에요. 2번은 NULL 칸이 빠져 3행이고, 3번은 두 자리를 바꿔 써서 QTY 에 Q1, Q2 글자가, QTR 에 숫자가 들어가요. 4번은 IN 안에 컬럼 이름 대신 작은따옴표 문자열을 써서 오류예요.' }
  ]
});
