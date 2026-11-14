SQLD.add({
  id: 'm9',
  title: 'NULL 속성의 이해',
  minutes: 12,
  weight: 3,
  lead: 'NULL 은 1과목에서 한 번, 2과목 집계와 조인과 서브쿼리에서 또 나와요. 규칙은 몇 개 안 되는데, 결과를 계산시키는 문제에 섞여 나와서 점수를 깎아요.',
  goals: [
    'NULL 이 들어간 계산과 비교의 결과를 바로 말할 수 있다',
    'COUNT(*), COUNT(컬럼), SUM, AVG 가 NULL 을 어떻게 다루는지 구분한다',
    'SUM(A+B) 와 SUM(A)+SUM(B) 가 왜 다른지 설명한다',
    'ERD 에서 NULL 허용 여부를 읽는다'
  ],
  blocks: [
    { t: 'h', x: 'NULL 은 "모른다"예요' },
    { t: 'p', x: '회원가입할 때 전화번호를 안 적은 사람이 있다고 해 볼게요. 그 칸은 0 도 아니고 빈 글자도 아니에요. ==아직 정해지지 않았거나 모르는 값==이고, 이걸 NULL 이라고 불러요.' },
    { t: 'p', x: '"모른다"라고 읽으면 나머지 규칙이 다 따라 나와요. 모르는 값에 100 을 더하면 얼마일까요. 몰라요. 모르는 값이 100 보다 큰가요. 그것도 몰라요.' },
    { t: 'table', head: ['하려는 일', '결과', '이유'], rows: [
      ['`NULL + 100`, `NULL * 0`', 'NULL', '모르는 값이 섞인 계산은 모른다'],
      ['`NULL = NULL`, `NULL > 10`', 'UNKNOWN(참이 아님)', '모르는 값끼리는 같은지도 모른다'],
      ['`컬럼 IS NULL`', '참 또는 거짓', 'NULL 인지 묻는 방법은 이것뿐']
    ] },
    { t: 'trap', title: '= NULL 은 한 건도 안 나와요', x: '`WHERE COMM = NULL` 은 오류가 아니에요. 실행은 되는데 결과가 0건이에요. 비교 결과가 UNKNOWN 이라 어떤 행도 통과하지 못해요. `WHERE COMM <> NULL` 도 똑같이 0건이에요. NULL 을 찾으려면 `IS NULL`, 빼려면 `IS NOT NULL` 만 써요.' },

    { t: 'h', x: '가로로 더할 때와 세로로 더할 때' },
    { t: 'p', x: '여기가 계산 문제의 단골이에요. 한 행 안에서 컬럼끼리 더하는 건 가로 계산, SUM 처럼 여러 행을 모으는 건 세로 계산이라고 부를게요.' },
    { t: 'vs',
      a: { title: '가로 계산  A + B', items: ['한쪽이라도 NULL 이면 그 행 결과가 NULL', '10 + NULL = NULL'] },
      b: { title: '세로 계산  SUM(A)', items: ['NULL 인 행은 건너뛰고 나머지만 계산', '10, NULL, 30 의 합 = 40'] } },
    { t: 'data', name: 'T', head: ['A', 'B'], rows: [[10, 20], [null, 30], [40, null]] },
    { t: 'sql', code: `SELECT SUM(A + B)       AS 가로먼저,
       SUM(A) + SUM(B)  AS 세로먼저
  FROM T;`, result: { head: ['가로먼저', '세로먼저'], rows: [[30, 100]] },
      note: '가로 먼저: 1행만 30 이고 2, 3행은 NULL 이라 건너뜀. 세로 먼저: (10+40) + (20+30).' },
    { t: 'fig', caption: '같은 표인데 더하는 순서에 따라 30 과 100 으로 갈려요.', svg: `<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg">
  <text x="150" y="22" class="tx-b" text-anchor="middle">SUM(A + B)</text>
  <g>
    <rect x="40" y="36" width="70" height="34" class="bx"/><text x="75" y="58" class="tx-m" text-anchor="middle">10</text>
    <rect x="110" y="36" width="70" height="34" class="bx"/><text x="145" y="58" class="tx-m" text-anchor="middle">20</text>
    <rect x="40" y="70" width="70" height="34" class="bx-r"/><text x="75" y="92" class="tx-r" text-anchor="middle">NULL</text>
    <rect x="110" y="70" width="70" height="34" class="bx"/><text x="145" y="92" class="tx-m" text-anchor="middle">30</text>
    <rect x="40" y="104" width="70" height="34" class="bx"/><text x="75" y="126" class="tx-m" text-anchor="middle">40</text>
    <rect x="110" y="104" width="70" height="34" class="bx-r"/><text x="145" y="126" class="tx-r" text-anchor="middle">NULL</text>
    <line x1="186" y1="53" x2="216" y2="53" class="ln" marker-end="url(#arr)"/>
    <line x1="186" y1="87" x2="216" y2="87" class="ln" marker-end="url(#arr)"/>
    <line x1="186" y1="121" x2="216" y2="121" class="ln" marker-end="url(#arr)"/>
    <text x="246" y="58" class="tx-m" text-anchor="middle">30</text>
    <text x="246" y="92" class="tx-r" text-anchor="middle">NULL</text>
    <text x="246" y="126" class="tx-r" text-anchor="middle">NULL</text>
    <line x1="246" y1="138" x2="246" y2="170" class="ln-a" marker-end="url(#arr-a)"/>
    <rect x="206" y="176" width="80" height="36" class="bx-a"/><text x="246" y="199" class="tx-a" text-anchor="middle">30</text>
  </g>
  <line x1="320" y1="10" x2="320" y2="220" class="ln-d"/>
  <text x="480" y="22" class="tx-b" text-anchor="middle">SUM(A) + SUM(B)</text>
  <g>
    <rect x="400" y="36" width="70" height="34" class="bx"/><text x="435" y="58" class="tx-m" text-anchor="middle">10</text>
    <rect x="490" y="36" width="70" height="34" class="bx"/><text x="525" y="58" class="tx-m" text-anchor="middle">20</text>
    <rect x="400" y="70" width="70" height="34" class="bx-r"/><text x="435" y="92" class="tx-r" text-anchor="middle">NULL</text>
    <rect x="490" y="70" width="70" height="34" class="bx"/><text x="525" y="92" class="tx-m" text-anchor="middle">30</text>
    <rect x="400" y="104" width="70" height="34" class="bx"/><text x="435" y="126" class="tx-m" text-anchor="middle">40</text>
    <rect x="490" y="104" width="70" height="34" class="bx-r"/><text x="525" y="126" class="tx-r" text-anchor="middle">NULL</text>
    <line x1="435" y1="138" x2="435" y2="158" class="ln" marker-end="url(#arr)"/>
    <line x1="525" y1="138" x2="525" y2="158" class="ln" marker-end="url(#arr)"/>
    <text x="435" y="176" class="tx-m" text-anchor="middle">50</text>
    <text x="480" y="176" class="tx" text-anchor="middle">+</text>
    <text x="525" y="176" class="tx-m" text-anchor="middle">50</text>
    <rect x="440" y="186" width="80" height="34" class="bx-a"/><text x="480" y="208" class="tx-a" text-anchor="middle">100</text>
  </g>
</svg>` },

    { t: 'h', x: '집계 함수는 NULL 을 빼고 세어요' },
    { t: 'p', x: 'SUM, AVG, MIN, MAX, COUNT(컬럼) 은 NULL 인 행을 없는 셈 쳐요. 단 하나, ==COUNT(*) 만 NULL 이 있든 말든 행 수를 세어요.==' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'COMM'], rows: [['KIM', 100], ['LEE', null], ['PARK', 300], ['CHOI', null]] },
    { t: 'sql', code: `SELECT COUNT(*)          AS C1,
       COUNT(COMM)       AS C2,
       SUM(COMM)         AS S,
       AVG(COMM)         AS A1,
       AVG(NVL(COMM, 0)) AS A2
  FROM EMP;`, result: { head: ['C1', 'C2', 'S', 'A1', 'A2'], rows: [[4, 2, 400, 200, 100]] },
      note: 'AVG(COMM) 은 400 ÷ 2, AVG(NVL(COMM,0)) 은 400 ÷ 4 예요. 나누는 수가 달라져요.' },
    { t: 'trap', title: 'AVG 의 분모', x: '평균을 묻는 문제는 NULL 을 몇 건으로 나누는지 보는 문제예요. `AVG(COMM)` 은 NULL 이 아닌 건수로, `SUM(COMM) / COUNT(*)` 는 전체 건수로 나눠요. 둘은 다른 값이에요.' },
    { t: 'table', caption: '값이 하나도 없을 때', head: ['상황', 'COUNT', 'SUM / AVG / MIN / MAX'], rows: [
      ['컬럼 값이 전부 NULL', '`COUNT(컬럼)` 은 0', 'NULL'],
      ['조건에 맞는 행이 0건 (GROUP BY 없음)', '0 한 행', 'NULL 한 행'],
      ['조건에 맞는 행이 0건 (GROUP BY 있음)', '행 자체가 안 나옴', '행 자체가 안 나옴']
    ] },

    { t: 'h', x: 'NULL 을 다른 값으로 바꾸는 함수' },
    { t: 'table', head: ['함수', '하는 일', '예'], rows: [
      ['`NVL(a, b)`', 'a 가 NULL 이면 b, 아니면 a', '`NVL(NULL, 0)` → 0'],
      ['`NVL2(a, b, c)`', 'a 가 NULL 이 아니면 b, NULL 이면 c', '`NVL2(100, \'Y\', \'N\')` → Y'],
      ['`NULLIF(a, b)`', 'a 와 b 가 같으면 NULL, 다르면 a', '`NULLIF(10, 10)` → NULL'],
      ['`COALESCE(a, b, c, …)`', '왼쪽부터 보다가 처음 만나는 NULL 아닌 값', '`COALESCE(NULL, NULL, 3)` → 3'],
      ['`ISNULL(a, b)`', 'SQL Server 의 NVL', '`ISNULL(NULL, 0)` → 0']
    ] },
    { t: 'tip', title: 'NVL2 는 순서가 거꾸로', x: 'NVL 은 "NULL 이면 뒤의 값"인데 NVL2 는 "NULL 이 **아니면** 둘째, NULL 이면 셋째"예요. 보기에서 둘째와 셋째를 바꿔 놓는 식으로 나와요.' },

    { t: 'h', x: 'Oracle 과 SQL Server 가 갈리는 곳' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['빈 문자열 `\'\'`', 'NULL 로 저장', '빈 문자열 그대로(NULL 아님)'],
      ['오름차순 정렬에서 NULL', '맨 뒤(가장 큰 값 취급)', '맨 앞(가장 작은 값 취급)'],
      ['NULL 치환', '`NVL`', '`ISNULL`']
    ] },
    { t: 'p', x: 'Oracle 은 정렬할 때 NULL 위치를 직접 정할 수도 있어요. `ORDER BY COMM NULLS FIRST` 라고 쓰면 오름차순이어도 NULL 이 맨 앞에 오고, `NULLS LAST` 는 맨 뒤에 둬요.' },
    { t: 'check', q: 'Oracle 에서 이름 컬럼에 빈 문자열을 넣었어요. WHERE 이름 = \'\' 로 찾으면 나올까요?', a: '안 나와요. Oracle 은 빈 문자열을 NULL 로 저장하니 `= \'\'` 는 `= NULL` 과 같고, 결과는 0건이에요. `WHERE 이름 IS NULL` 로 찾아야 해요.' },

    { t: 'h', x: 'ERD 에서 NULL 읽기' },
    { t: 'p', x: '모델링 쪽에서는 "이 속성이 NULL 을 허용하는지 그림에서 알 수 있느냐"를 물어요. 표기법에 따라 답이 달라요.' },
    { t: 'vs',
      a: { title: 'IE 표기법', items: ['NULL 허용 여부를 그림으로 알 수 없다'] },
      b: { title: '바커(Barker) 표기법', items: ['속성 앞 `*` 는 필수(NOT NULL)', '속성 앞 `○` 는 선택(NULL 허용)', '`#` 는 식별자'] } }
  ],
  keys: [
    'NULL 이 섞인 가로 계산(A+B)은 NULL, 세로 계산(SUM, AVG)은 NULL 을 건너뛴다',
    'NULL 비교는 UNKNOWN. 찾을 때는 IS NULL, IS NOT NULL 만 쓴다',
    'COUNT(*) 만 NULL 행을 센다. COUNT(컬럼), SUM, AVG, MIN, MAX 는 뺀다',
    'AVG(컬럼) 의 분모는 NULL 이 아닌 건수',
    '전부 NULL 이면 SUM 은 NULL, COUNT(컬럼) 은 0',
    'NVL2(a, b, c): a 가 NULL 이 아니면 b, NULL 이면 c',
    'Oracle 은 빈 문자열이 NULL, 오름차순에서 NULL 이 맨 뒤. SQL Server 는 반대',
    '바커 표기법은 ○ 가 NULL 허용, IE 표기법은 NULL 여부를 알 수 없다'
  ],
  cards: [
    { q: '`NULL = NULL` 의 결과는?', a: 'UNKNOWN. 참이 아니라서 WHERE 를 통과하지 못해요.' },
    { q: '10, NULL, 30 이 든 컬럼의 AVG 는?', a: '20. NULL 은 빼고 40 ÷ 2.' },
    { q: 'COUNT(*) 와 COUNT(컬럼) 의 차이는?', a: 'COUNT(*) 는 모든 행, COUNT(컬럼) 은 그 컬럼이 NULL 이 아닌 행만.' },
    { q: '`NULLIF(A, B)` 는 언제 NULL 을 돌려주나요?', a: 'A 와 B 가 같을 때. 다르면 A.' },
    { q: 'Oracle 에서 ORDER BY 컬럼 ASC 일 때 NULL 은 어디에?', a: '맨 뒤. Oracle 은 NULL 을 가장 큰 값처럼 정렬해요. SQL Server 는 맨 앞.' },
    { q: '바커 표기법에서 NULL 허용 속성의 표시는?', a: '속성 앞의 ○. 필수는 *.' }
  ],
  quiz: [
    { id: 'm9-01', level: 1, tag: 'NULL 연산',
      q: 'NULL 에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'NULL 은 아직 정해지지 않았거나 알 수 없는 값을 뜻한다.',
        'NULL 과 숫자를 더하면 결과는 NULL 이다.',
        '`WHERE COL = NULL` 은 COL 이 NULL 인 행을 찾아 준다.',
        'NULL 인지 확인할 때는 `IS NULL` 을 쓴다.'
      ],
      answer: 3,
      why: '`= NULL` 비교는 결과가 UNKNOWN 이라 어떤 행도 통과하지 못해요. 오류 없이 0건이 나와요. NULL 을 찾는 방법은 `IS NULL` 뿐이에요.' },
    { id: 'm9-02', level: 2, tag: '집계와 NULL',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'SCORE', head: ['ID', 'PT'], rows: [[1, 80], [2, null], [3, 40], [4, null], [5, 60]] }],
      code: `SELECT COUNT(*), COUNT(PT), AVG(PT)
  FROM SCORE;`,
      choices: ['5, 5, 36', '5, 3, 60', '5, 3, 36', '3, 3, 60'],
      answer: 2,
      why: 'COUNT(*) 는 행 수라서 5, COUNT(PT) 는 NULL 을 뺀 3 이에요. AVG(PT) 는 (80+40+60) ÷ 3 = 60 이에요. 36 은 5 로 나눴을 때 나오는 값이라 오답 보기로 넣어 둔 거예요.' },
    { id: 'm9-03', level: 2, tag: '가로 계산과 세로 계산',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'T', head: ['C1', 'C2'], rows: [[5, 5], [null, 10], [20, null], [10, 10]] }],
      code: `SELECT SUM(C1 + C2), SUM(C1) + SUM(C2)
  FROM T;`,
      choices: ['60, 60', '30, 60', '30, 30', 'NULL, 60'],
      answer: 2,
      why: 'C1 + C2 는 행마다 10, NULL, NULL, 20 이고 SUM 이 NULL 을 건너뛰어 30 이에요. SUM(C1) 은 35, SUM(C2) 는 25 라서 합이 60 이에요. NULL 이 섞여도 SUM 결과 전체가 NULL 이 되지는 않아요.' },
    { id: 'm9-04', level: 2, tag: 'NULL 함수',
      q: '다음 중 결과가 NULL 인 것은? (Oracle)',
      choices: [
        '`NVL(NULL, 0)`',
        '`NVL2(NULL, 1, 2)`',
        '`COALESCE(NULL, NULL, 0)`',
        '`NULLIF(7, 7)`'
      ],
      answer: 4,
      why: 'NULLIF 는 두 값이 같으면 NULL 을 돌려줘요. NVL(NULL,0) 은 0, NVL2(NULL,1,2) 는 첫 인자가 NULL 이라 셋째 값 2, COALESCE 는 처음 만나는 NULL 아닌 값 0 이에요.' },
    { id: 'm9-05', level: 3, tag: '집계와 NULL',
      q: '아래 테이블에서 SQL 을 실행했을 때 결과에 대한 설명으로 알맞은 것은?',
      tables: [{ name: 'ORD', head: ['ONO', 'AMT'], rows: [[1, null], [2, null], [3, null]] }],
      code: `SELECT COUNT(AMT) AS C, SUM(AMT) AS S
  FROM ORD
 WHERE ONO > 0;`,
      choices: [
        '결과 행이 없다.',
        'C 는 0, S 는 0 이다.',
        'C 는 0, S 는 NULL 이다.',
        'C 는 3, S 는 NULL 이다.'
      ],
      answer: 3,
      why: 'GROUP BY 가 없는 집계는 항상 한 행이 나와요. AMT 가 전부 NULL 이라 셀 것이 없으니 COUNT(AMT) 는 0 이고, 더할 것이 없는 SUM 은 0 이 아니라 NULL 이에요.' },
    { id: 'm9-06', level: 2, tag: 'DBMS 차이',
      q: 'Oracle 과 SQL Server 의 NULL 처리에 대한 설명으로 적절하지 않은 것은?',
      choices: [
        'Oracle 은 길이가 0 인 문자열을 NULL 로 다룬다.',
        'SQL Server 는 빈 문자열과 NULL 을 서로 다른 값으로 다룬다.',
        'Oracle 에서 오름차순 정렬을 하면 NULL 이 맨 앞에 온다.',
        'SQL Server 에서는 NVL 대신 ISNULL 을 쓴다.'
      ],
      answer: 3,
      why: 'Oracle 은 NULL 을 가장 큰 값처럼 정렬해서 오름차순이면 맨 뒤에 와요. 맨 앞에 오는 쪽은 SQL Server 예요.' },
    { id: 'm9-07', level: 2, tag: 'ERD 와 NULL',
      q: 'ERD 표기법과 NULL 에 대한 설명으로 적절한 것은?',
      choices: [
        'IE 표기법에서는 속성 앞의 동그라미로 NULL 허용 여부를 나타낸다.',
        '바커 표기법에서는 속성 앞에 ○ 가 있으면 NULL 을 허용하는 속성이다.',
        '바커 표기법에서 * 는 NULL 을 허용한다는 뜻이다.',
        '두 표기법 모두 NULL 허용 여부를 그림에서 알 수 없다.'
      ],
      answer: 2,
      why: '바커 표기법은 # 식별자, * 필수, ○ 선택(NULL 허용)으로 표시해요. IE 표기법은 그림만으로 NULL 허용 여부를 알 수 없어요.' }
  ]
});
