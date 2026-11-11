SQLD.add({
  id: 'q11',
  title: '그룹 함수',
  minutes: 18,
  weight: 3,
  lead: 'ROLLUP, CUBE, GROUPING SETS 는 거의 매회 나와요. 어떤 소계를 만드는지 펼쳐 쓸 줄만 알면 결과 행 수 문제와 "같은 결과가 아닌 것" 문제를 계산으로 풀 수 있습니다.',
  goals: [
    'ROLLUP, CUBE, GROUPING SETS 가 만드는 그룹을 펼쳐 쓸 수 있다',
    '작은 테이블에서 결과 행 수를 계산한다',
    '세 문법을 서로 바꿔 쓰거나 UNION ALL 로 바꿔 쓴 것을 알아본다',
    'GROUPING 함수 값으로 소계 행을 가려내고 DECODE, CASE 로 이름을 붙인다'
  ],
  blocks: [
    { t: 'h', x: '집계 함수 다시 보기' },
    { t: 'p', x: '여러 행을 받아 값 하나로 줄여 주는 함수들이에요. GROUP BY 가 있으면 그룹마다 한 번씩 계산합니다. 공통 규칙은 하나예요. ==NULL 은 빼고 계산==하고, `COUNT(*)` 만 NULL 이 있어도 행을 셉니다.' },
    { t: 'table', head: ['함수', '하는 일', '넣을 수 있는 타입'], rows: [
      ['`COUNT(*)`', '행 수. NULL 이 있어도 센다', '-'],
      ['`COUNT(컬럼)`', '그 컬럼이 NULL 이 아닌 행 수', '숫자, 문자, 날짜'],
      ['`SUM(컬럼)`', '합계', '숫자'],
      ['`AVG(컬럼)`', '평균. NULL 이 아닌 건수로 나눈다', '숫자'],
      ['`MIN(컬럼)`, `MAX(컬럼)`', '최솟값, 최댓값', '숫자, 문자, 날짜'],
      ['`VARIANCE(컬럼)`', '분산', '숫자'],
      ['`STDDEV(컬럼)`', '표준편차(분산의 제곱근)', '숫자']
    ] },
    { t: 'p', x: '괄호 안에 `DISTINCT` 를 넣으면 같은 값을 한 번만 쳐요. 10, 10, NULL, 40 이 든 컬럼이라면 `COUNT(컬럼)` 은 3, `COUNT(DISTINCT 컬럼)` 은 2, `AVG(컬럼)` 은 60 ÷ 3 = 20 이에요.' },
    { t: 'table', caption: 'Oracle 과 SQL Server 의 이름 차이', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['분산', '`VARIANCE`', '`VAR`'],
      ['표준편차', '`STDDEV`', '`STDEV`']
    ] },

    { t: 'h', x: 'GROUP BY 만으로는 소계가 안 나와요' },
    { t: 'p', x: '지역별, 품목별 판매액 표를 만드는데 지역마다 소계를 넣고 맨 아래에 총계도 넣고 싶다고 해 볼게요. 이 장의 예시는 전부 아래 테이블로 따라갑니다.' },
    { t: 'data', name: 'SALES', head: ['REGION', 'ITEM', 'AMT'], rows: [['서울', '펜', 100], ['서울', '펜', 50], ['서울', '노트', 200], ['부산', '펜', 300], ['부산', '노트', 400]] },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT)
  FROM SALES
 GROUP BY REGION, ITEM;`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [['서울', '펜', 150], ['서울', '노트', 200], ['부산', '펜', 300], ['부산', '노트', 400]] },
      note: '(지역, 품목) 조합마다 한 행. 소계도 총계도 없어요.' },
    { t: 'p', x: '소계를 넣으려면 `GROUP BY REGION` 결과와 GROUP BY 없는 전체 합계를 따로 구해서 UNION ALL 로 붙여야 해요. 이걸 한 번에 해 주는 것이 ROLLUP, CUBE, GROUPING SETS 예요. 셋 다 GROUP BY 절 안에 씁니다. 아래 예시들의 결과는 보기 좋은 순서로 적었어요. ORDER BY 를 쓰지 않으면 행 순서는 정해져 있지 않습니다.' },
    { t: 'p', x: '앞으로 "어떤 컬럼으로 묶은 결과인지"를 괄호로 적을게요. `(REGION, ITEM)` 은 지역과 품목으로 묶은 상세 행, `(REGION)` 은 지역 소계, `()` 는 아무것으로도 묶지 않은 ==전체 합계==예요.' },

    { t: 'h', x: 'ROLLUP 은 오른쪽부터 하나씩 지워요' },
    { t: 'p', x: '`ROLLUP(A, B)` 는 적힌 컬럼을 오른쪽 끝에서부터 하나씩 지워 가며 그룹을 만들어요. `(A, B)` → `(A)` → `()` 순서입니다. 컬럼이 n 개면 그룹 수준이 n + 1 개 나와요.' },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT)
  FROM SALES
 GROUP BY ROLLUP(REGION, ITEM);`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [
        ['서울', '펜', 150], ['서울', '노트', 200], ['서울', null, 350],
        ['부산', '펜', 300], ['부산', '노트', 400], ['부산', null, 700],
        [null, null, 1050]] },
      note: '상세 4행 + 지역 소계 2행 + 전체 합계 1행 = 7행. 소계 행에서 뭉쳐진 컬럼은 NULL 로 나와요.' },
    { t: 'p', x: '`B` 만의 소계인 `(B)` 는 만들지 않아요. 그래서 ==인수 순서를 바꾸면 결과가 달라집니다==. `ROLLUP(ITEM, REGION)` 은 `(ITEM, REGION)`, `(ITEM)`, `()` 를 만들어서 지역 소계 대신 품목 소계가 나와요.' },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT)
  FROM SALES
 GROUP BY ROLLUP(ITEM, REGION);`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [
        ['서울', '펜', 150], ['부산', '펜', 300], [null, '펜', 450],
        ['서울', '노트', 200], ['부산', '노트', 400], [null, '노트', 600],
        [null, null, 1050]] },
      note: '행 수는 똑같이 7행이지만 소계 행의 내용이 달라요.' },

    { t: 'h', x: 'CUBE 는 가능한 조합 전부' },
    { t: 'p', x: '`CUBE(A, B)` 는 컬럼을 넣고 빼는 모든 경우를 만들어요. `(A, B)`, `(A)`, `(B)`, `()` 네 가지입니다. 컬럼이 n 개면 2 의 n 제곱 개예요. 모든 조합을 다 만드니 ==인수 순서를 바꿔도 결과가 같아요==.' },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT)
  FROM SALES
 GROUP BY CUBE(REGION, ITEM);`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [
        ['서울', '펜', 150], ['서울', '노트', 200], ['부산', '펜', 300], ['부산', '노트', 400],
        ['서울', null, 350], ['부산', null, 700],
        [null, '펜', 450], [null, '노트', 600],
        [null, null, 1050]] },
      note: '상세 4행 + 지역 소계 2행 + 품목 소계 2행 + 전체 합계 1행 = 9행.' },

    { t: 'h', x: 'GROUPING SETS 는 적은 것만' },
    { t: 'p', x: '`GROUPING SETS(A, B)` 는 괄호 안에 나열한 그룹만 따로따로 만들어요. `(A)` 와 `(B)` 뿐이에요. 상세 행 `(A, B)` 도 없고 ==전체 합계도 없습니다==. 전체 합계가 필요하면 `()` 를 직접 적어 줘야 해요(`()` 자리에 `NULL` 을 적어도 같아요). 나열한 순서는 결과에 영향이 없어요.' },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT)
  FROM SALES
 GROUP BY GROUPING SETS(REGION, ITEM);`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [
        ['서울', null, 350], ['부산', null, 700],
        [null, '펜', 450], [null, '노트', 600]] },
      note: '지역 소계 2행 + 품목 소계 2행 = 4행. GROUPING SETS(REGION, ITEM, ()) 로 쓰면 전체 합계 1050 한 행이 더 붙어 5행.' },
    { t: 'p', x: '여러 컬럼을 한 그룹으로 묶으려면 괄호를 한 번 더 써요. `GROUPING SETS((A, B), A, ())` 는 `(A, B)`, `(A)`, `()` 라서 `ROLLUP(A, B)` 와 같습니다.' },
    { t: 'fig', caption: '문법마다 만드는 소계 수준. 색칠된 칸이 결과에 나오는 그룹이에요.', svg: `<svg viewBox="0 0 640 262" xmlns="http://www.w3.org/2000/svg">
  <text x="305" y="20" class="tx-b" text-anchor="middle">(a, b)</text>
  <text x="395" y="20" class="tx-b" text-anchor="middle">(a)</text>
  <text x="485" y="20" class="tx-b" text-anchor="middle">(b)</text>
  <text x="575" y="20" class="tx-b" text-anchor="middle">()</text>
  <text x="305" y="38" class="tx-s" text-anchor="middle">상세</text>
  <text x="395" y="38" class="tx-s" text-anchor="middle">a 소계</text>
  <text x="485" y="38" class="tx-s" text-anchor="middle">b 소계</text>
  <text x="575" y="38" class="tx-s" text-anchor="middle">전체 합계</text>
  <line x1="20" y1="46" x2="620" y2="46" class="ln"/>

  <text x="24" y="72" class="tx-m">GROUP BY a, b</text>
  <rect x="266" y="54" width="78" height="26" class="bx-a"/>
  <rect x="356" y="54" width="78" height="26" class="bx"/>
  <rect x="446" y="54" width="78" height="26" class="bx"/>
  <rect x="536" y="54" width="78" height="26" class="bx"/>

  <text x="24" y="106" class="tx-m">ROLLUP(a, b)</text>
  <rect x="266" y="88" width="78" height="26" class="bx-a"/>
  <rect x="356" y="88" width="78" height="26" class="bx-a"/>
  <rect x="446" y="88" width="78" height="26" class="bx"/>
  <rect x="536" y="88" width="78" height="26" class="bx-a"/>

  <text x="24" y="140" class="tx-m">ROLLUP(b, a)</text>
  <rect x="266" y="122" width="78" height="26" class="bx-a"/>
  <rect x="356" y="122" width="78" height="26" class="bx"/>
  <rect x="446" y="122" width="78" height="26" class="bx-a"/>
  <rect x="536" y="122" width="78" height="26" class="bx-a"/>

  <text x="24" y="174" class="tx-m">CUBE(a, b)</text>
  <rect x="266" y="156" width="78" height="26" class="bx-a"/>
  <rect x="356" y="156" width="78" height="26" class="bx-a"/>
  <rect x="446" y="156" width="78" height="26" class="bx-a"/>
  <rect x="536" y="156" width="78" height="26" class="bx-a"/>

  <text x="24" y="208" class="tx-m">GROUPING SETS(a, b)</text>
  <rect x="266" y="190" width="78" height="26" class="bx"/>
  <rect x="356" y="190" width="78" height="26" class="bx-a"/>
  <rect x="446" y="190" width="78" height="26" class="bx-a"/>
  <rect x="536" y="190" width="78" height="26" class="bx"/>

  <text x="24" y="242" class="tx-m">GROUP BY a, ROLLUP(b)</text>
  <rect x="266" y="224" width="78" height="26" class="bx-a"/>
  <rect x="356" y="224" width="78" height="26" class="bx-a"/>
  <rect x="446" y="224" width="78" height="26" class="bx"/>
  <rect x="536" y="224" width="78" height="26" class="bx"/>
</svg>` },
    { t: 'trap', title: '전체 합계가 있는지부터 보세요', x: 'ROLLUP 과 CUBE 는 전체 합계 행을 기본으로 만들고, GROUPING SETS 는 `()` 를 적지 않으면 만들지 않아요. 결과 표에 REGION 과 ITEM 이 둘 다 NULL 인 행이 있는지 없는지로 보기를 먼저 가를 수 있습니다. 전체 합계가 있는 쪽에서는 `(a)` 소계와 `(b)` 소계가 둘 다 있으면 CUBE, 하나만 있으면 ROLLUP 이에요.' },

    { t: 'h', x: '괄호로 묶으면 한 덩어리' },
    { t: 'p', x: 'ROLLUP 이나 CUBE 안에서 컬럼을 괄호로 묶으면 그 묶음을 컬럼 하나처럼 다뤄요. 지울 때도 같이 지워집니다.' },
    { t: 'table', head: ['문법', '만드는 그룹', '빠진 것'], rows: [
      ['`ROLLUP(A, B)`', '(A, B), (A), ()', '-'],
      ['`ROLLUP((A, B))`', '(A, B), ()', '(A) 가 없다. 덩어리가 하나라 지우면 바로 ()'],
      ['`ROLLUP(A, B, C)`', '(A, B, C), (A, B), (A), ()', '-'],
      ['`ROLLUP(A, (B, C))`', '(A, B, C), (A), ()', '(A, B) 가 없다. B 와 C 가 함께 지워진다'],
      ['`ROLLUP((A, B), C)`', '(A, B, C), (A, B), ()', '(A) 가 없다']
    ] },
    { t: 'p', x: 'SALES 로 세어 보면 `ROLLUP((REGION, ITEM))` 은 상세 4행과 전체 합계 1행으로 5행이에요. 지역 소계가 빠져서 `ROLLUP(REGION, ITEM)` 의 7행보다 적습니다.' },

    { t: 'h', x: 'ROLLUP 밖에 나와 있는 컬럼' },
    { t: 'p', x: '`GROUP BY A, ROLLUP(B)` 처럼 일부 컬럼을 ROLLUP 밖에 두면, 밖에 있는 컬럼은 ==모든 그룹에 항상 붙어요==. `ROLLUP(B)` 가 만드는 `(B)`, `()` 앞에 A 를 붙여서 `(A, B)`, `(A)` 가 됩니다. A 가 빠지는 일이 없으니 전체 합계는 나오지 않아요.' },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT)
  FROM SALES
 GROUP BY REGION, ROLLUP(ITEM);`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [
        ['서울', '펜', 150], ['서울', '노트', 200], ['서울', null, 350],
        ['부산', '펜', 300], ['부산', '노트', 400], ['부산', null, 700]] },
      note: '상세 4행 + 지역 소계 2행 = 6행. ROLLUP(REGION, ITEM) 에서 전체 합계 한 행만 빠진 결과예요.' },
    { t: 'table', head: ['문법', '만드는 그룹'], rows: [
      ['`GROUP BY A, ROLLUP(B)`', '(A, B), (A)'],
      ['`GROUP BY A, ROLLUP(B, C)`', '(A, B, C), (A, B), (A)'],
      ['`GROUP BY A, CUBE(B, C)`', '(A, B, C), (A, B), (A, C), (A)'],
      ['`GROUP BY ROLLUP(A), ROLLUP(B)`', '(A, B), (A), (B), ()  — 각자 만든 그룹을 서로 곱한다. CUBE(A, B) 와 같다']
    ] },
    { t: 'trap', title: 'ROLLUP 이 있으면 전체 합계가 있다는 착각', x: '`GROUP BY A, ROLLUP(B)` 를 `ROLLUP(A, B)` 와 같다고 적은 보기가 나와요. 밖에 나온 A 는 지워지지 않으니 전체 합계 행이 없고, 행 수가 하나 적습니다. 같은 결과를 만들려면 전체 합계를 UNION ALL 로 따로 붙여야 해요.' },

    { t: 'h', x: 'GROUPING 함수로 소계 행 가려내기' },
    { t: 'p', x: '소계 행에서는 뭉쳐진 컬럼이 NULL 로 나와요. 그런데 원래 데이터에 NULL 이 있으면 어느 쪽 NULL 인지 구분이 안 됩니다. `GROUPING(컬럼)` 은 그 행이 ==그 컬럼을 뭉쳐서 만든 소계 행이면 1==, 아니면 0 을 돌려줘요.' },
    { t: 'sql', code: `SELECT REGION, ITEM,
       GROUPING(REGION) AS G1,
       GROUPING(ITEM)   AS G2,
       SUM(AMT)
  FROM SALES
 GROUP BY ROLLUP(REGION, ITEM);`, result: { head: ['REGION', 'ITEM', 'G1', 'G2', 'SUM(AMT)'], rows: [
        ['서울', '펜', 0, 0, 150], ['서울', '노트', 0, 0, 200], ['서울', null, 0, 1, 350],
        ['부산', '펜', 0, 0, 300], ['부산', '노트', 0, 0, 400], ['부산', null, 0, 1, 700],
        [null, null, 1, 1, 1050]] },
      note: '지역 소계 행은 ITEM 만 뭉쳤으니 (0, 1), 전체 합계 행은 둘 다 뭉쳤으니 (1, 1).' },
    { t: 'p', x: '이 값을 DECODE 나 CASE 에 넣어 NULL 자리에 이름을 붙여요.' },
    { t: 'sql', code: `SELECT DECODE(GROUPING(REGION), 1, '전체', REGION) AS REGION,
       CASE GROUPING(ITEM) WHEN 1 THEN '소계' ELSE ITEM END AS ITEM,
       SUM(AMT)
  FROM SALES
 GROUP BY ROLLUP(REGION, ITEM);`, result: { head: ['REGION', 'ITEM', 'SUM(AMT)'], rows: [
        ['서울', '펜', 150], ['서울', '노트', 200], ['서울', '소계', 350],
        ['부산', '펜', 300], ['부산', '노트', 400], ['부산', '소계', 700],
        ['전체', '소계', 1050]] },
      note: 'GROUPING 값이 1 인 자리만 글자로 바뀌어요.' },
    { t: 'trap', title: 'GROUPING 값 0 과 1 을 뒤집기', x: '"소계 행이면 0 을 돌려준다"거나 `DECODE(GROUPING(REGION), 0, \'전체\', REGION)` 처럼 0 과 1 을 바꿔 놓은 보기가 나와요. 뭉쳐서 만든 행이 1 이에요. 그리고 `NVL(REGION, \'전체\')` 는 원래 데이터가 NULL 인 행까지 \'전체\' 로 바꿔 버리니 GROUPING 과 같은 결과가 아닐 수 있어요.' },

    { t: 'h', x: '서로 바꿔 쓰기' },
    { t: 'p', x: '"같은 결과가 아닌 것"을 고르는 문제는 보기를 전부 그룹 목록으로 펼쳐 놓고 비교하면 풀려요.' },
    { t: 'table', head: ['문법', 'GROUPING SETS 로 쓰면', '그룹 수준'], rows: [
      ['`ROLLUP(A, B)`', '`GROUPING SETS((A, B), A, ())`', '3'],
      ['`CUBE(A, B)`', '`GROUPING SETS((A, B), A, B, ())`', '4'],
      ['`ROLLUP(A)` , `CUBE(A)`', '`GROUPING SETS(A, ())`', '2'],
      ['`ROLLUP((A, B))`', '`GROUPING SETS((A, B), ())`', '2'],
      ['`GROUP BY A, ROLLUP(B)`', '`GROUPING SETS((A, B), A)`', '2'],
      ['`GROUP BY A, B`', '`GROUPING SETS((A, B))`', '1']
    ] },
    { t: 'p', x: 'UNION ALL 로도 똑같이 만들 수 있어요. 그룹 수준 하나가 SELECT 문 하나이고, 뭉쳐진 컬럼 자리에는 NULL 을 적어 컬럼 수를 맞춥니다.' },
    { t: 'sql', code: `SELECT REGION, ITEM, SUM(AMT) FROM SALES GROUP BY REGION, ITEM
UNION ALL
SELECT REGION, NULL, SUM(AMT) FROM SALES GROUP BY REGION
UNION ALL
SELECT NULL, NULL, SUM(AMT) FROM SALES;`, note: 'ROLLUP(REGION, ITEM) 과 같은 7행. 가운데 SELECT 문을 지우면 ROLLUP((REGION, ITEM)), 마지막 SELECT 문을 지우면 GROUP BY REGION, ROLLUP(ITEM) 과 같아요.' },

    { t: 'h', x: '결과 행 수 세는 법' },
    { t: 'ol', items: [
      '문법을 그룹 목록으로 펼친다. 예: ROLLUP(REGION, ITEM) → (REGION, ITEM), (REGION), ()',
      '그룹마다 테이블에 있는 서로 다른 값(조합)의 수를 센다. `()` 는 언제나 1행',
      '전부 더한다'
    ] },
    { t: 'table', caption: 'SALES 로 센 행 수. (REGION, ITEM) 조합 4가지, REGION 2가지, ITEM 2가지', head: ['문법', '계산', '행 수'], rows: [
      ['`GROUP BY REGION, ITEM`', '4', '4'],
      ['`ROLLUP(REGION, ITEM)`', '4 + 2 + 1', '7'],
      ['`CUBE(REGION, ITEM)`', '4 + 2 + 2 + 1', '9'],
      ['`GROUPING SETS(REGION, ITEM)`', '2 + 2', '4'],
      ['`GROUPING SETS(REGION, ITEM, ())`', '2 + 2 + 1', '5'],
      ['`ROLLUP((REGION, ITEM))`', '4 + 1', '5'],
      ['`GROUP BY REGION, ROLLUP(ITEM)`', '4 + 2', '6']
    ] },
    { t: 'tip', title: '조합 수는 곱하지 말고 세요', x: '(REGION, ITEM) 의 행 수는 "지역 수 × 품목 수"가 아니라 테이블에 실제로 있는 조합의 수예요. 어떤 지역에 없는 품목이 있으면 그 조합은 행이 안 생깁니다. 문제의 테이블에서 서로 다른 조합을 직접 세어야 해요. 그룹 컬럼에 NULL 인 데이터가 있으면 NULL 도 값 하나로 쳐서 한 그룹이 됩니다. 이 행은 소계 행과 똑같이 NULL 로 보이지만 따로 세어야 하고, GROUPING 값이 0 이라는 점으로 구분해요.' },
    { t: 'check', q: 'ROLLUP(A, B, C) 가 만드는 그룹은 몇 가지이고, CUBE(A, B, C) 는 몇 가지일까요?', a: 'ROLLUP 은 (A, B, C), (A, B), (A), () 로 n + 1 = 4가지예요. CUBE 는 2 의 3 제곱인 8가지입니다. (A, B, C), (A, B), (A, C), (B, C), (A), (B), (C), ().' },
    { t: 'check', q: '결과 표에 "ITEM 은 값이 있는데 REGION 이 NULL 인 소계 행"이 보여요. GROUP BY ROLLUP(REGION, ITEM) 의 결과일 수 있을까요? (원래 데이터에는 NULL 이 없어요)', a: '아니에요. 그 행은 품목 소계 (ITEM) 인데, ROLLUP(REGION, ITEM) 은 (REGION, ITEM), (REGION), () 만 만들어요. CUBE(REGION, ITEM) 이나 ROLLUP(ITEM, REGION), GROUPING SETS 에 ITEM 을 적은 경우에 나오는 행입니다.' }
  ],
  keys: [
    'ROLLUP(A, B) = (A, B), (A), (). 오른쪽부터 지운다. 인수 순서가 바뀌면 결과가 달라진다',
    'CUBE(A, B) = (A, B), (A), (B), (). 모든 조합 2^n 가지. 순서를 바꿔도 같다',
    'GROUPING SETS(A, B) = (A), (B). 적은 것만 만든다. 전체 합계는 () 를 적어야 나온다',
    'ROLLUP((A, B)) = (A, B), ().  ROLLUP(A, (B, C)) = (A, B, C), (A), (). 괄호 묶음은 함께 지워진다',
    'GROUP BY A, ROLLUP(B) = (A, B), (A). 전체 합계가 없다',
    'GROUPING(컬럼) 은 그 컬럼을 뭉친 소계 행이면 1, 아니면 0',
    '결과 행 수 = 그룹마다 서로 다른 조합 수를 세어 더한 값. () 는 1행',
    '집계 함수는 NULL 을 빼고 계산한다. COUNT(*) 만 NULL 행을 센다'
  ],
  cards: [
    { q: 'ROLLUP(A, B) 가 만드는 그룹은?', a: '(A, B), (A), (). B 만의 소계는 없어요.' },
    { q: 'CUBE(A, B) 가 만드는 그룹은?', a: '(A, B), (A), (B), (). 2^2 = 4가지.' },
    { q: 'GROUPING SETS(A, B) 에 전체 합계 행이 있나요?', a: '없어요. (A), (B) 만 만들어요. 필요하면 GROUPING SETS(A, B, ()) 로 써요.' },
    { q: 'ROLLUP(A, (B, C)) 가 만드는 그룹은?', a: '(A, B, C), (A), (). (A, B) 는 없어요.' },
    { q: 'GROUP BY A, ROLLUP(B) 가 만드는 그룹은?', a: '(A, B), (A). A 는 항상 붙어 있어서 전체 합계가 없어요.' },
    { q: 'GROUPING(컬럼) 이 1 인 행은?', a: '그 컬럼을 뭉쳐서 만든 소계(합계) 행.' },
    { q: 'CUBE(A, B) 를 GROUPING SETS 로 쓰면?', a: 'GROUPING SETS((A, B), A, B, ()).' },
    { q: 'ROLLUP(A, B) 와 ROLLUP(B, A) 는 같은 결과인가요?', a: '아니에요. 앞은 A 소계, 뒤는 B 소계가 나와요. CUBE 는 순서를 바꿔도 같아요.' }
  ],
  quiz: [
    { id: 'q11-01', level: 1, tag: '그룹 함수 비교',
      q: '그룹 함수에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        '`GROUP BY ROLLUP(A, B)` 는 전체 합계 행을 만든다.',
        '`GROUP BY GROUPING SETS(A, B)` 는 전체 합계 행을 만들지 않는다.',
        '`ROLLUP(A, B)` 와 `ROLLUP(B, A)` 는 항상 같은 결과를 낸다.',
        '`CUBE(A, B)` 와 `CUBE(B, A)` 는 만드는 그룹이 같다.'
      ],
      answer: 3,
      why: 'ROLLUP 은 오른쪽 컬럼부터 지워 가기 때문에 순서가 중요해요. ROLLUP(A, B) 는 A 소계를, ROLLUP(B, A) 는 B 소계를 만듭니다. CUBE 는 모든 조합을 만들어서 순서를 바꿔도 같고, GROUPING SETS 는 `()` 를 적지 않으면 전체 합계가 없어요.' },
    { id: 'q11-02', level: 1, tag: 'ROLLUP',
      q: '`GROUP BY ROLLUP(A, B)` 가 만드는 그룹을 모두 적은 것은?',
      choices: [
        '(A, B), (A), ()',
        '(A, B), (B), ()',
        '(A, B), (A), (B), ()',
        '(A), (B), ()'
      ],
      answer: 1,
      why: 'ROLLUP 은 오른쪽부터 하나씩 지워서 (A, B) → (A) → () 를 만들어요. (B) 는 만들지 않습니다. (A, B), (A), (B), () 네 가지를 전부 만드는 것은 CUBE(A, B) 예요.' },
    { id: 'q11-03', level: 2, tag: '집계 함수와 NULL',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'T', head: ['ID', 'V'], rows: [[1, 10], [2, 10], [3, null], [4, 40]] }],
      code: `SELECT COUNT(V), COUNT(DISTINCT V), AVG(V)
  FROM T;`,
      choices: ['4, 2, 15', '3, 3, 20', '3, 2, 15', '3, 2, 20'],
      answer: 4,
      why: 'COUNT(V) 는 NULL 을 뺀 3 이에요. COUNT(DISTINCT V) 는 10 과 40 두 가지라 2 입니다. AVG(V) 는 (10 + 10 + 40) ÷ 3 = 20 이에요. 15 는 NULL 행까지 넣어 4 로 나눴을 때 나오는 값입니다.' },
    { id: 'q11-04', level: 2, tag: '결과 행 수',
      q: '아래 테이블에서 SQL 을 실행한 결과 행 수는?',
      tables: [{ name: 'EMP', head: ['DEPT', 'JOB', 'SAL'], rows: [[10, 'CLERK', 100], [10, 'CLERK', 200], [10, 'MGR', 300], [20, 'CLERK', 150], [20, 'MGR', 250], [20, 'SALES', 350], [30, 'SALES', 400]] }],
      code: `SELECT DEPT, JOB, SUM(SAL)
  FROM EMP
 GROUP BY ROLLUP(DEPT, JOB);`,
      choices: ['13', '10', '9', '7'],
      answer: 2,
      why: 'ROLLUP(DEPT, JOB) 는 (DEPT, JOB), (DEPT), () 를 만들어요. (DEPT, JOB) 조합은 (10, CLERK), (10, MGR), (20, CLERK), (20, MGR), (20, SALES), (30, SALES) 여섯 가지, DEPT 는 세 가지, 전체 합계 한 행이라 6 + 3 + 1 = 10 입니다. 13 은 JOB 소계 3행까지 더한 CUBE 의 행 수, 9 는 전체 합계를 빠뜨린 값이에요.' },
    { id: 'q11-05', level: 2, tag: '결과 행 수',
      q: '아래 테이블에서 SQL 을 실행한 결과 행 수는?',
      tables: [{ name: 'SALE', head: ['REGION', 'ITEM', 'QTY'], rows: [['E', 'A', 1], ['E', 'B', 2], ['W', 'A', 3], ['W', 'A', 4], ['S', 'C', 5]] }],
      code: `SELECT REGION, ITEM, SUM(QTY)
  FROM SALE
 GROUP BY CUBE(REGION, ITEM);`,
      choices: ['8', '11', '16', '10'],
      answer: 2,
      why: 'CUBE 는 (REGION, ITEM), (REGION), (ITEM), () 를 만들어요. 조합은 (E, A), (E, B), (W, A), (S, C) 네 가지, REGION 은 E, W, S 세 가지, ITEM 은 A, B, C 세 가지, 전체 합계 한 행이라 4 + 3 + 3 + 1 = 11 입니다. 8 은 ROLLUP 의 행 수이고, 10 은 전체 합계를 빠뜨린 값이에요.' },
    { id: 'q11-06', level: 2, tag: '바꿔 쓰기',
      q: '아래 테이블에서 `GROUP BY ROLLUP(DEPT, JOB)` 을 쓴 SQL 과 같은 결과가 아닌 것은? (행 순서는 따지지 않는다)',
      tables: [{ name: 'EMP', head: ['DEPT', 'JOB', 'SAL'], rows: [[10, 'CLERK', 100], [10, 'MGR', 300], [20, 'CLERK', 150], [20, 'SALES', 350]] }],
      code: `SELECT DEPT, JOB, SUM(SAL)
  FROM EMP
 GROUP BY ROLLUP(DEPT, JOB);`,
      choices: [
        { code: `SELECT DEPT, JOB, SUM(SAL)
  FROM EMP
 GROUP BY GROUPING SETS((DEPT, JOB), DEPT, ());` },
        { code: `SELECT DEPT, JOB, SUM(SAL) FROM EMP GROUP BY DEPT, JOB
UNION ALL
SELECT DEPT, NULL, SUM(SAL) FROM EMP GROUP BY DEPT
UNION ALL
SELECT NULL, NULL, SUM(SAL) FROM EMP;` },
        { code: `SELECT DEPT, JOB, SUM(SAL)
  FROM EMP
 GROUP BY GROUPING SETS((DEPT, JOB), JOB, ());` },
        { code: `SELECT DEPT, JOB, SUM(SAL)
  FROM EMP
 GROUP BY DEPT, ROLLUP(JOB)
UNION ALL
SELECT NULL, NULL, SUM(SAL) FROM EMP;` }
      ],
      answer: 3,
      why: 'ROLLUP(DEPT, JOB) 는 (DEPT, JOB), (DEPT), () 예요. 3번은 (DEPT) 자리에 (JOB) 을 적어서 부서 소계 대신 직무 소계가 나옵니다. 1번은 같은 그룹을 그대로 나열했고, 2번은 세 그룹을 UNION ALL 로 붙였어요. 4번은 `DEPT, ROLLUP(JOB)` 이 (DEPT, JOB), (DEPT) 를 만들고 빠진 전체 합계를 UNION ALL 로 붙여서 같습니다.' },
    { id: 'q11-07', level: 2, tag: 'GROUPING 함수',
      q: '아래 SQL 의 결과에서 부서별 소계 행과 전체 합계 행의 (G1, G2) 값을 순서대로 적은 것은?',
      code: `SELECT DEPT, JOB,
       GROUPING(DEPT) AS G1,
       GROUPING(JOB)  AS G2,
       SUM(SAL)
  FROM EMP
 GROUP BY ROLLUP(DEPT, JOB);`,
      choices: [
        '(0, 1) 과 (1, 1)',
        '(1, 0) 과 (1, 1)',
        '(0, 1) 과 (0, 0)',
        '(1, 0) 과 (0, 0)'
      ],
      answer: 1,
      why: 'GROUPING 은 그 컬럼을 뭉쳐서 만든 행이면 1 이에요. 부서별 소계 행은 DEPT 는 살아 있고 JOB 만 뭉쳤으니 (0, 1), 전체 합계 행은 둘 다 뭉쳤으니 (1, 1) 입니다. (0, 0) 은 소계가 아닌 상세 행의 값이에요.' },
    { id: 'q11-08', level: 3, tag: 'GROUPING SETS',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은? (행 순서는 따지지 않는다)',
      tables: [{ name: 'PLAYER', head: ['TEAM', 'POS', 'PAY'], rows: [['A', 'FW', 10], ['A', 'DF', 20], ['B', 'FW', 30], ['B', 'FW', 40]] }],
      code: `SELECT TEAM, POS, SUM(PAY)
  FROM PLAYER
 GROUP BY GROUPING SETS(TEAM, POS);`,
      choices: [
        { head: ['TEAM', 'POS', 'SUM(PAY)'], rows: [['A', 'DF', 20], ['A', 'FW', 10], ['B', 'FW', 70]] },
        { head: ['TEAM', 'POS', 'SUM(PAY)'], rows: [['A', 'DF', 20], ['A', 'FW', 10], ['A', null, 30], ['B', 'FW', 70], ['B', null, 70], [null, null, 100]] },
        { head: ['TEAM', 'POS', 'SUM(PAY)'], rows: [['A', null, 30], ['B', null, 70], [null, 'DF', 20], [null, 'FW', 80], [null, null, 100]] },
        { head: ['TEAM', 'POS', 'SUM(PAY)'], rows: [['A', null, 30], ['B', null, 70], [null, 'DF', 20], [null, 'FW', 80]] }
      ],
      answer: 4,
      why: 'GROUPING SETS(TEAM, POS) 는 팀별 합계와 포지션별 합계만 만들어요. 팀은 A 30, B 70, 포지션은 DF 20, FW 10 + 30 + 40 = 80 입니다. 1번은 GROUP BY TEAM, POS, 2번은 ROLLUP(TEAM, POS) 의 결과예요. 3번은 전체 합계 행이 붙어 있는데, `()` 를 적지 않았으니 나오지 않습니다.' },
    { id: 'q11-09', level: 2, tag: '괄호 묶음',
      q: '`GROUP BY ROLLUP(A, (B, C))` 가 만드는 그룹을 모두 적은 것은?',
      choices: [
        '(A, B, C), (A, B), (A), ()',
        '(A, B, C), (A), ()',
        '(A, B, C), (B, C), ()',
        '(A, B, C), (A), (B, C), ()'
      ],
      answer: 2,
      why: '괄호로 묶은 (B, C) 는 컬럼 하나처럼 다뤄져서 지울 때 함께 지워져요. (A, B, C) 에서 (B, C) 를 지우면 (A), 그다음 () 입니다. (A, B) 가 들어간 1번은 괄호 없이 ROLLUP(A, B, C) 로 썼을 때의 그룹이고, 4번은 CUBE(A, (B, C)) 의 그룹이에요.' },
    { id: 'q11-10', level: 3, tag: '결과 행 수',
      q: '아래 테이블에서 SQL 을 실행한 결과 행 수는?',
      tables: [{ name: 'EMP', head: ['DEPT', 'JOB', 'SAL'], rows: [[10, 'CLERK', 100], [10, 'CLERK', 200], [10, 'MGR', 300], [20, 'CLERK', 150], [20, 'MGR', 250], [20, 'SALES', 350], [30, 'SALES', 400]] }],
      code: `SELECT DEPT, JOB, SUM(SAL)
  FROM EMP
 GROUP BY DEPT, ROLLUP(JOB);`,
      choices: ['10', '6', '9', '13'],
      answer: 3,
      why: 'ROLLUP 밖에 있는 DEPT 는 모든 그룹에 붙어요. ROLLUP(JOB) 이 만드는 (JOB), () 에 DEPT 를 붙이면 (DEPT, JOB), (DEPT) 입니다. 조합 6행에 부서 소계 3행을 더해 9행이에요. 전체 합계 행은 없습니다. 10 은 ROLLUP(DEPT, JOB) 처럼 전체 합계까지 셌을 때 나오는 값이에요.' },
    { id: 'q11-11', level: 3, tag: 'GROUPING 함수',
      q: '아래 테이블에서 SQL 을 실행했을 때, R1 이 \'합계\' 인 행 수와 R2 가 \'합계\' 인 행 수를 순서대로 적은 것은?',
      tables: [{ name: 'T', head: ['REGION', 'AMT'], rows: [['서울', 100], [null, 200], ['서울', 300]] }],
      code: `SELECT NVL(REGION, '합계') AS R1,
       DECODE(GROUPING(REGION), 1, '합계', REGION) AS R2,
       SUM(AMT)
  FROM T
 GROUP BY ROLLUP(REGION);`,
      choices: ['2, 1', '1, 1', '2, 2', '1, 2'],
      answer: 1,
      why: 'ROLLUP(REGION) 은 (REGION), () 를 만들어서 결과는 서울 400, NULL 200, 전체 합계 600 세 행이에요. NVL 은 원래 데이터가 NULL 인 그룹과 전체 합계 행을 구분하지 못해 둘 다 \'합계\' 로 바꾸니 2행입니다. GROUPING(REGION) 은 전체 합계 행에서만 1 이라 R2 는 1행만 \'합계\' 예요.' },
    { id: 'q11-12', level: 2, tag: '바꿔 쓰기',
      q: '`GROUP BY CUBE(A, B)` 와 같은 결과를 내는 것은?',
      choices: [
        { code: `GROUP BY GROUPING SETS(A, B, ())` },
        { code: `GROUP BY GROUPING SETS((A, B), A, B)` },
        { code: `GROUP BY ROLLUP(A, B)` },
        { code: `GROUP BY GROUPING SETS((A, B), A, B, ())` }
      ],
      answer: 4,
      why: 'CUBE(A, B) 는 (A, B), (A), (B), () 네 그룹을 만들어요. 4번이 이 넷을 그대로 나열했습니다. 1번은 상세 행 (A, B) 가 없고, 2번은 전체 합계 () 가 없고, 3번 ROLLUP 은 (B) 소계가 없어요.' }
  ]
});
