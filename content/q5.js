SQLD.add({
  id: 'q5',
  title: 'GROUP BY 와 HAVING',
  minutes: 14,
  weight: 3,
  lead: '"오류가 나는 SQL 을 고르라"와 "결과가 몇 행이냐"가 이 장에서 거의 매회 나와요. 규칙은 SELECT 에 쓸 수 있는 것, WHERE 와 HAVING 의 자리, 실행 순서 세 가지로 정리됩니다.',
  goals: [
    'GROUP BY 를 쓴 SQL 에서 SELECT 절에 올 수 있는 것과 없는 것을 가른다',
    'WHERE 와 HAVING 이 각각 언제 무엇을 거르는지 따라가며 결과 행 수를 센다',
    'GROUP BY 없는 HAVING, 집계함수 중첩이 어떤 결과를 내는지 말한다',
    'SELECT 문의 실행 순서로 별칭을 쓸 수 있는 절을 설명한다'
  ],
  blocks: [
    { t: 'h', x: '부서별로 묶어서 계산하고 싶을 때' },
    { t: 'p', x: '사원 6명의 급여 합계는 `SUM(SAL)` 한 번이면 나와요. 그런데 "부서별" 합계가 필요하면 먼저 같은 부서끼리 묶어야 합니다. 이 묶음을 그룹이라 하고, 무엇으로 묶을지 적는 곳이 GROUP BY 절이에요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'JOB', 'SAL'], rows: [
      ['KIM', 10, 'MGR', 500], ['LEE', 10, 'CLERK', 300], ['PARK', 20, 'CLERK', 200],
      ['CHOI', 20, 'CLERK', 400], ['JUNG', 20, 'MGR', 600], ['HAN', 30, 'CLERK', 250]] },
    { t: 'sql', code: `SELECT DEPTNO, COUNT(*) AS CNT, SUM(SAL) AS TOT, AVG(SAL) AS AVG_SAL
  FROM EMP
 GROUP BY DEPTNO;`, result: { head: ['DEPTNO', 'CNT', 'TOT', 'AVG_SAL'], rows: [[10, 2, 800, 400], [20, 3, 1200, 400], [30, 1, 250, 250]] },
      note: '6행이 부서 3개로 줄었어요. 결과는 ==그룹마다 한 행==입니다. ORDER BY 가 없으면 행의 순서는 보장되지 않아요.' },
    { t: 'p', x: 'GROUP BY 에는 컬럼을 여러 개 적을 수 있어요. `GROUP BY DEPTNO, JOB` 이면 부서와 직무가 둘 다 같은 행끼리 한 그룹이 됩니다. 위 표라면 (10, MGR), (10, CLERK), (20, CLERK), (20, MGR), (30, CLERK) 다섯 그룹이에요. `GROUP BY JOB, DEPTNO` 로 컬럼 순서를 바꿔 적어도 묶이는 그룹은 똑같이 다섯 개입니다.' },

    { t: 'h', x: 'SELECT 절에 쓸 수 있는 것' },
    { t: 'p', x: '부서 10 은 KIM 과 LEE 두 명이 한 행으로 합쳐졌어요. 이 행에 ENAME 을 보여 달라고 하면 KIM 인지 LEE 인지 정할 수 없습니다. 그래서 GROUP BY 를 쓰면 SELECT 절에는 ==GROUP BY 에 적은 컬럼과 집계함수만== 올 수 있어요.' },
    { t: 'table', head: ['SQL', '실행', '이유'], rows: [
      ['`SELECT DEPTNO, SUM(SAL) … GROUP BY DEPTNO`', '됨', '그룹 컬럼과 집계함수'],
      ['`SELECT SUM(SAL) … GROUP BY DEPTNO`', '됨', 'GROUP BY 컬럼을 SELECT 에 안 써도 된다'],
      ['`SELECT JOB, MAX(SAL) … GROUP BY DEPTNO, JOB`', '됨', 'GROUP BY 컬럼 중 일부만 써도 된다'],
      ['`SELECT DEPTNO, ENAME, SUM(SAL) … GROUP BY DEPTNO`', '오류', 'ENAME 은 GROUP BY 에 없다'],
      ['`SELECT DEPTNO, SUM(SAL) FROM EMP` (GROUP BY 없음)', '오류', '집계함수와 일반 컬럼을 같이 쓰려면 그 컬럼으로 GROUP BY 해야 한다'],
      ['`SELECT DEPTNO AS D, SUM(SAL) … GROUP BY D`', '오류', 'GROUP BY 에는 별칭을 못 쓴다']
    ] },
    { t: 'trap', title: 'GROUP BY 에 없는 컬럼', x: '"오류가 발생하는 SQL" 문제의 정답은 대개 SELECT 절에 GROUP BY 에 없는 컬럼이 끼어 있는 보기예요. 보기마다 SELECT 의 컬럼을 하나씩 짚으면서 GROUP BY 에 있는지, 아니면 집계함수 안에 들어 있는지 확인하세요. 반대로 GROUP BY 에 적은 컬럼이 SELECT 에 없는 것은 오류가 아닙니다.' },
    { t: 'trap', title: 'GROUP BY 에 별칭', x: 'GROUP BY 는 SELECT 보다 먼저 실행돼요. SELECT 에서 붙인 별칭은 아직 만들어지기 전이라 `GROUP BY D` 처럼 별칭을 쓰면 오류입니다. 식으로 묶고 싶으면 `GROUP BY SUBSTR(ENAME, 1, 1)` 처럼 식을 그대로 다시 적어요.' },

    { t: 'h', x: '집계함수와 NULL' },
    { t: 'p', x: '집계함수(여러 행을 받아 값 하나를 돌려주는 함수)는 COUNT, SUM, AVG, MAX, MIN 이 기본이에요. `COUNT(*)` 만 행 수를 그대로 세고, 나머지는 NULL 을 건너뜁니다.' },
    { t: 'table', head: ['함수', 'NULL 처리', '10, NULL, 30 일 때'], rows: [
      ['`COUNT(*)`', 'NULL 인 행도 센다', '3'],
      ['`COUNT(컬럼)`', 'NULL 은 빼고 센다', '2'],
      ['`COUNT(DISTINCT 컬럼)`', 'NULL 을 빼고 서로 다른 값의 수', '2'],
      ['`SUM(컬럼)`', 'NULL 은 빼고 더한다', '40'],
      ['`AVG(컬럼)`', 'NULL 이 아닌 건수로 나눈다', '20'],
      ['`MAX(컬럼)`, `MIN(컬럼)`', 'NULL 은 빼고 비교한다', '30, 10']
    ] },
    { t: 'p', x: 'GROUP BY 컬럼 자체에 NULL 이 있으면 어떻게 될까요. ==NULL 인 행끼리 한 그룹==으로 묶여서 결과에 한 행으로 나와요. 조인이나 WHERE 에서 NULL 끼리는 같다고 보지 않는 것과 달라서 헷갈리기 쉽습니다.' },
    { t: 'trap', title: 'NULL 그룹을 빼먹고 세기', x: '결과 행 수를 묻는 문제에서 GROUP BY 컬럼에 NULL 이 섞여 있으면 NULL 그룹 한 행을 더해야 해요. 값이 A, B, NULL, NULL 이면 그룹은 A, B, NULL 세 개입니다. NULL 두 건이 각각 다른 그룹이 되지도 않고, 결과에서 빠지지도 않아요.' },
    { t: 'p', x: 'NULL 그룹의 건수를 셀 때는 무엇을 세는지 봐야 해요. `COUNT(*)` 는 그 그룹의 행 수가 그대로 나오지만, `GROUP BY GRP` 에서 `COUNT(GRP)` 처럼 그룹 컬럼 자체를 세면 NULL 그룹은 값이 전부 NULL 이라 ==0== 이 나옵니다.' },

    { t: 'h', x: '조건에 맞는 행만 세기' },
    { t: 'p', x: '부서별로 "CLERK 이 몇 명인지"처럼 그룹 안에서 조건에 맞는 행만 세고 싶을 때는 집계함수 안에 CASE 를 넣어요. 이때 COUNT 와 SUM 의 쓰는 법이 달라서 결과를 묻는 문제로 나옵니다.' },
    { t: 'sql', code: `SELECT DEPTNO,
       COUNT(CASE WHEN JOB = 'CLERK' THEN 1 END)        AS C1,
       COUNT(CASE WHEN JOB = 'CLERK' THEN 1 ELSE 0 END) AS C2,
       SUM(CASE WHEN JOB = 'CLERK' THEN 1 ELSE 0 END)   AS C3
  FROM EMP
 GROUP BY DEPTNO;`, result: { head: ['DEPTNO', 'C1', 'C2', 'C3'], rows: [[10, 1, 2, 1], [20, 2, 3, 2], [30, 1, 1, 1]] },
      note: 'C1 과 C3 이 CLERK 의 수예요. C2 는 부서의 전체 행 수가 나옵니다.' },
    { t: 'trap', title: 'COUNT 안의 ELSE 0', x: 'COUNT 는 NULL 이 아니면 값이 무엇이든 세요. 0 도 NULL 이 아니라서 `COUNT(CASE … THEN 1 ELSE 0 END)` 는 조건과 상관없이 모든 행을 셉니다. COUNT 로 조건부 건수를 구하려면 ELSE 를 빼서 조건에 안 맞는 행이 NULL 이 되게 해야 해요. SUM 은 1 과 0 을 더하는 것이라 ELSE 0 을 그대로 둡니다.' },

    { t: 'h', x: 'WHERE 와 HAVING' },
    { t: 'p', x: '"급여 합계가 300 이상인 부서만 보고 싶다"고 해 볼게요. 합계는 그룹으로 묶은 뒤에야 나오는 값인데 WHERE 는 묶기 전에 실행돼요. 그래서 WHERE 에는 집계함수를 쓸 수 없고, 묶은 뒤의 조건을 적는 자리로 HAVING 이 따로 있습니다.' },
    { t: 'vs',
      a: { title: 'WHERE', items: ['그룹으로 묶기 전에 행을 거른다', '집계함수를 쓸 수 없다(`WHERE SUM(SAL) > 300` 은 오류)', '걸러진 행은 집계에 들어가지 않는다'] },
      b: { title: 'HAVING', items: ['그룹으로 묶은 뒤에 그룹을 거른다', '집계함수를 조건으로 쓴다', 'SELECT 에 없는 집계함수도 쓸 수 있다', 'GROUP BY 컬럼에 대한 조건도 쓸 수 있다'] } },
    { t: 'sql', code: `SELECT DEPTNO, SUM(SAL) AS TOT
  FROM EMP
 WHERE JOB = 'CLERK'
 GROUP BY DEPTNO
HAVING SUM(SAL) >= 300;`, result: { head: ['DEPTNO', 'TOT'], rows: [[10, 300], [20, 600]] },
      note: 'WHERE 로 CLERK 4명만 남김 → 부서별 합계 10: 300, 20: 600, 30: 250 → HAVING 으로 30 탈락.' },
    { t: 'fig', caption: '위 SQL 이 실행되는 순서. 절마다 행이 얼마나 남는지 따라가면 결과 행 수 문제가 풀려요.', svg: `<svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
  <rect x="16" y="30" width="88" height="44" class="bx"/><text x="60" y="57" class="tx-m" text-anchor="middle">FROM</text>
  <rect x="120" y="30" width="88" height="44" class="bx"/><text x="164" y="57" class="tx-m" text-anchor="middle">WHERE</text>
  <rect x="224" y="30" width="88" height="44" class="bx"/><text x="268" y="57" class="tx-m" text-anchor="middle">GROUP BY</text>
  <rect x="328" y="30" width="88" height="44" class="bx"/><text x="372" y="57" class="tx-m" text-anchor="middle">HAVING</text>
  <rect x="432" y="30" width="88" height="44" class="bx-a"/><text x="476" y="57" class="tx-m" text-anchor="middle">SELECT</text>
  <rect x="536" y="30" width="88" height="44" class="bx"/><text x="580" y="57" class="tx-m" text-anchor="middle">ORDER BY</text>
  <line x1="104" y1="52" x2="116" y2="52" class="ln" marker-end="url(#arr)"/>
  <line x1="208" y1="52" x2="220" y2="52" class="ln" marker-end="url(#arr)"/>
  <line x1="312" y1="52" x2="324" y2="52" class="ln" marker-end="url(#arr)"/>
  <line x1="416" y1="52" x2="428" y2="52" class="ln" marker-end="url(#arr)"/>
  <line x1="520" y1="52" x2="532" y2="52" class="ln" marker-end="url(#arr)"/>
  <text x="60" y="20" class="tx-s" text-anchor="middle">1</text>
  <text x="164" y="20" class="tx-s" text-anchor="middle">2</text>
  <text x="268" y="20" class="tx-s" text-anchor="middle">3</text>
  <text x="372" y="20" class="tx-s" text-anchor="middle">4</text>
  <text x="476" y="20" class="tx-s" text-anchor="middle">5</text>
  <text x="580" y="20" class="tx-s" text-anchor="middle">6</text>
  <text x="60" y="96" class="tx-b" text-anchor="middle">6행</text>
  <text x="164" y="96" class="tx-b" text-anchor="middle">4행</text>
  <text x="268" y="96" class="tx-b" text-anchor="middle">3그룹</text>
  <text x="372" y="96" class="tx-b" text-anchor="middle">2그룹</text>
  <text x="476" y="96" class="tx-b" text-anchor="middle">2행</text>
  <text x="580" y="96" class="tx-b" text-anchor="middle">2행</text>
  <text x="476" y="118" class="tx-a" text-anchor="middle">별칭이 생김</text>
  <text x="580" y="118" class="tx-a" text-anchor="middle">별칭 사용 가능</text>
  <text x="216" y="140" class="tx-s" text-anchor="middle">SELECT 보다 앞선 절에서는 별칭을 쓸 수 없어요</text>
</svg>` },
    { t: 'trap', title: 'WHERE 를 먼저 적용했는지', x: '결과 행 수 문제는 WHERE 와 HAVING 을 둘 다 넣어서 내요. HAVING 조건을 원본 테이블에 대고 세면 틀립니다. 먼저 WHERE 로 행을 지우고, 남은 행으로 그룹을 만들고, 그 그룹에 HAVING 을 적용하세요. WHERE 에서 행이 전부 지워진 그룹은 아예 생기지 않아요.' },
    { t: 'trap', title: 'HAVING 에 별칭', x: 'HAVING 도 SELECT 보다 먼저 실행돼요. `SELECT SUM(SAL) AS TOT … HAVING TOT > 500` 은 오류이고, `HAVING SUM(SAL) > 500` 으로 집계함수를 다시 적어야 합니다. SELECT 에서 만든 별칭을 쓸 수 있는 절은 ORDER BY 하나예요.' },
    { t: 'p', x: 'HAVING 에 집계함수가 아닌 조건을 쓸 수도 있어요. `HAVING DEPTNO < 30` 처럼 GROUP BY 컬럼에 대한 조건은 됩니다. `HAVING JOB = \'CLERK\'` 처럼 GROUP BY 에 없는 컬럼을 그냥 쓰면 SELECT 절과 같은 이유로 오류예요. 그리고 Oracle 은 HAVING 을 GROUP BY 앞에 적어도 실행되지만, 실행 순서는 그대로 GROUP BY 다음입니다.' },
    { t: 'check', q: '`SELECT DEPTNO, COUNT(*) FROM EMP WHERE COUNT(*) >= 2 GROUP BY DEPTNO;` 는 어떻게 될까요?', a: '오류예요. WHERE 는 그룹을 만들기 전에 실행되니 집계함수를 쓸 수 없어요. `GROUP BY DEPTNO HAVING COUNT(*) >= 2` 로 옮겨야 합니다.' },

    { t: 'h', x: 'GROUP BY 없이 HAVING 만 쓰면' },
    { t: 'p', x: 'GROUP BY 가 없으면 테이블 전체가 한 그룹이에요. 여기에 HAVING 을 붙이면 그 한 그룹을 통과시키거나 버립니다. 결과는 1행 아니면 0행이에요.' },
    { t: 'sql', code: `SELECT SUM(SAL) AS TOT
  FROM EMP
HAVING COUNT(*) > 5;`, result: { head: ['TOT'], rows: [[2250]] },
      note: '전체가 6행이라 조건이 참. 조건을 COUNT(*) > 6 으로 바꾸면 결과는 0행이에요(NULL 한 행이 아니에요).' },
    { t: 'trap', title: 'HAVING 은 GROUP BY 가 있어야 한다는 보기', x: '"HAVING 절은 GROUP BY 절 없이는 사용할 수 없다"는 틀린 설명이에요. GROUP BY 가 없으면 전체를 한 그룹으로 보고 HAVING 을 적용합니다.' },

    { t: 'h', x: '집계함수 중첩' },
    { t: 'p', x: '"부서별 급여 합계 중에서 가장 큰 값"은 집계를 두 번 해야 나와요. Oracle 은 `MAX(SUM(SAL))` 처럼 집계함수 안에 집계함수를 넣을 수 있습니다. 안쪽이 그룹마다 값을 만들고, 바깥쪽이 그 값들을 다시 하나로 모아요.' },
    { t: 'sql', code: `SELECT MAX(SUM(SAL)) AS TOP_TOT
  FROM EMP
 GROUP BY DEPTNO;`, result: { head: ['TOP_TOT'], rows: [[1200]] },
      note: '부서별 합계 800, 1200, 250 중 최댓값. GROUP BY 가 있어도 결과는 1행이에요.' },
    { t: 'ul', items: [
      '중첩은 ==최대 2단==까지예요. `MAX(SUM(AVG(SAL)))` 은 오류입니다.',
      '중첩하려면 GROUP BY 가 있어야 해요. 안쪽 집계가 그룹별 값을 여러 개 만들어 줘야 바깥쪽이 모을 수 있습니다.',
      '중첩하면 결과가 한 행으로 합쳐지므로 ==GROUP BY 컬럼을 SELECT 에 쓸 수 없어요==. `SELECT DEPTNO, MAX(SUM(SAL)) … GROUP BY DEPTNO` 는 오류입니다.'
    ] },
    { t: 'check', q: '`SELECT DEPTNO, MAX(SUM(SAL)) FROM EMP GROUP BY DEPTNO;` 는 부서 3개가 나올까요?', a: '오류예요. 집계함수를 중첩하면 결과가 한 행인데, 그 한 행에 어느 DEPTNO 를 보여 줄지 정할 수 없어요. DEPTNO 를 빼면 1200 한 행이 나옵니다.' },

    { t: 'h', x: '적는 순서와 실행 순서' },
    { t: 'table', head: ['', '순서'], rows: [
      ['적는 순서', 'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY'],
      ['실행 순서', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY']
    ] },
    { t: 'tip', title: '별칭 규칙은 실행 순서에서 나와요', x: 'SELECT 가 다섯 번째로 실행된다는 것만 기억하면 돼요. 그 앞에 있는 WHERE, GROUP BY, HAVING 은 별칭을 모르고, 뒤에 있는 ORDER BY 만 별칭을 압니다. GROUP BY 를 쓴 SQL 의 ORDER BY 에도 그룹 컬럼과 집계함수만 올 수 있어요.' }
  ],
  keys: [
    'GROUP BY 를 쓰면 SELECT 에는 GROUP BY 컬럼과 집계함수만. GROUP BY 컬럼을 SELECT 에 안 쓰는 것은 괜찮다',
    'GROUP BY, HAVING, WHERE 에는 SELECT 별칭을 못 쓴다. 쓸 수 있는 절은 ORDER BY 뿐',
    'WHERE 는 묶기 전 행 필터(집계함수 불가), HAVING 은 묶은 뒤 그룹 필터',
    '실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
    'GROUP BY 컬럼의 NULL 은 한 그룹으로 묶여 결과에 한 행으로 나온다. 그 그룹의 COUNT(그룹 컬럼) 은 0',
    'GROUP BY 없는 HAVING 은 전체를 한 그룹으로 본다. 결과는 1행 또는 0행',
    '집계함수 중첩은 2단까지, GROUP BY 필요, 결과 1행, SELECT 에 GROUP BY 컬럼 불가',
    'COUNT(*) 만 NULL 행을 세고 COUNT(컬럼), SUM, AVG, MAX, MIN 은 NULL 을 뺀다. COUNT(CASE … ELSE 0 END) 는 0 도 세어 전체 행 수가 된다'
  ],
  cards: [
    { q: 'GROUP BY 를 쓴 SQL 의 SELECT 절에 올 수 있는 것은?', a: 'GROUP BY 에 적은 컬럼(식)과 집계함수. 그 밖의 컬럼을 쓰면 오류예요.' },
    { q: 'WHERE 에 `SUM(SAL) > 500` 을 쓰면?', a: '오류. WHERE 는 그룹을 만들기 전에 실행돼서 집계함수를 쓸 수 없어요. HAVING 으로 옮깁니다.' },
    { q: 'SELECT 문의 실행 순서는?', a: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.' },
    { q: 'GROUP BY 없이 HAVING 을 쓰면?', a: '오류가 아니에요. 테이블 전체를 한 그룹으로 보고, 조건이 참이면 1행, 아니면 0행이 나옵니다.' },
    { q: '`SELECT MAX(SUM(SAL)) FROM EMP GROUP BY DEPTNO` 의 결과 행 수는?', a: '1행. 부서별 합계 중 최댓값 하나만 나와요.' },
    { q: 'GROUP BY 컬럼 값이 A, NULL, B, NULL 이면 결과는 몇 행?', a: '3행. NULL 끼리 한 그룹으로 묶여요.' },
    { q: '`HAVING TOT > 500` (TOT 는 SELECT 별칭) 은 실행될까요?', a: '오류. HAVING 은 SELECT 보다 먼저 실행돼요. `HAVING SUM(SAL) > 500` 으로 적습니다.' },
    { q: '`COUNT(CASE WHEN JOB = \'CLERK\' THEN 1 ELSE 0 END)` 는 무엇을 세나요?', a: '전체 행 수. 0 도 NULL 이 아니라서 세어져요. CLERK 만 세려면 ELSE 를 빼거나 SUM 으로 바꿉니다.' }
  ],
  quiz: [
    { id: 'q5-01', level: 1, tag: '실행 순서',
      q: 'SELECT 문이 실행되는 순서로 알맞은 것은?',
      choices: [
        'FROM → WHERE → GROUP BY → SELECT → HAVING → ORDER BY',
        'FROM → GROUP BY → WHERE → HAVING → SELECT → ORDER BY',
        'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
        'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY'
      ],
      answer: 3,
      why: '테이블을 읽고(FROM), 행을 거르고(WHERE), 묶고(GROUP BY), 그룹을 거른(HAVING) 다음에야 SELECT 가 실행돼요. ORDER BY 가 맨 마지막입니다. 4번은 적는 순서예요.' },
    { id: 'q5-02', level: 1, tag: 'WHERE 와 HAVING',
      q: 'WHERE 절과 HAVING 절에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'HAVING 절은 GROUP BY 절이 없으면 사용할 수 없다.',
        'WHERE 절에는 집계함수를 조건으로 쓸 수 없다.',
        'WHERE 절은 그룹으로 묶기 전에 행을 거르고, HAVING 절은 묶은 뒤에 그룹을 거른다.',
        'HAVING 절에는 SELECT 절에 쓰지 않은 집계함수도 조건으로 쓸 수 있다.'
      ],
      answer: 1,
      why: 'GROUP BY 가 없어도 HAVING 을 쓸 수 있어요. 이때는 테이블 전체가 한 그룹이고 결과는 1행 또는 0행입니다. 나머지 셋은 모두 맞는 설명이에요.' },
    { id: 'q5-03', level: 2, tag: 'GROUP BY 규칙',
      q: 'EMP(ENAME, DEPTNO, JOB, SAL) 테이블에 대해 실행했을 때 오류가 발생하는 SQL 은?',
      choices: [
        { code: `SELECT DEPTNO, COUNT(*)
  FROM EMP
 GROUP BY DEPTNO;` },
        { code: `SELECT DEPTNO, ENAME, SUM(SAL)
  FROM EMP
 GROUP BY DEPTNO;` },
        { code: `SELECT JOB, MAX(SAL)
  FROM EMP
 GROUP BY DEPTNO, JOB;` },
        { code: `SELECT COUNT(*)
  FROM EMP
 GROUP BY DEPTNO;` }
      ],
      answer: 2,
      why: '2번의 ENAME 은 GROUP BY 에 없고 집계함수 안에도 없어요. 한 부서에 사원이 여럿이라 한 행에 보여 줄 이름을 정할 수 없습니다. 3번처럼 GROUP BY 컬럼 중 일부만 SELECT 에 쓰거나 4번처럼 하나도 안 쓰는 것은 괜찮아요.' },
    { id: 'q5-04', level: 2, tag: '결과 행 수',
      q: '아래 테이블에서 SQL 을 실행한 결과는 몇 행인가?',
      tables: [{ name: 'SALES', head: ['SNO', 'REGION', 'AMT'], rows: [
        [1, '서울', 100], [2, '서울', 300], [3, '부산', 200], [4, '부산', 50], [5, '대구', 400], [6, '대구', null], [7, '인천', 80]] }],
      code: `SELECT REGION, SUM(AMT)
  FROM SALES
 WHERE AMT >= 100
 GROUP BY REGION
HAVING COUNT(*) >= 2;`,
      choices: ['1행', '2행', '3행', '4행'],
      answer: 1,
      why: 'WHERE 를 먼저 적용하면 SNO 1, 2, 3, 5 만 남아요(50, 80 은 탈락, NULL 은 비교 결과가 UNKNOWN 이라 탈락). 그룹은 서울 2건, 부산 1건, 대구 1건이고 COUNT(*) >= 2 인 그룹은 서울 하나입니다. 3행은 WHERE 를 건너뛰고 원본에서 지역별 건수를 셌을 때 나오는 값이에요.' },
    { id: 'q5-05', level: 2, tag: 'NULL 그룹',
      q: '아래 테이블에서 SQL 을 실행한 결과에 대한 설명으로 알맞은 것은?',
      tables: [{ name: 'T', head: ['GRP', 'VAL'], rows: [['A', 10], ['A', null], ['B', 20], [null, 30], [null, null], ['B', 40]] }],
      code: `SELECT GRP, COUNT(*) AS C1, COUNT(VAL) AS C2, SUM(VAL) AS S
  FROM T
 GROUP BY GRP;`,
      choices: [
        'GRP 가 NULL 인 행은 그룹에서 빠지므로 결과는 2행이다.',
        '결과는 3행이고, GRP 가 NULL 인 행의 C1 은 2, C2 는 1 이다.',
        '결과는 3행이고, GRP 가 A 인 행의 S 는 NULL 이다.',
        'GRP 가 NULL 인 두 행은 서로 다른 그룹이 되어 결과는 4행이다.'
      ],
      answer: 2,
      why: 'GROUP BY 컬럼의 NULL 은 한 그룹으로 묶여서 A, B, NULL 세 행이 나와요. NULL 그룹은 (30), (NULL) 두 행이라 COUNT(*) 는 2, COUNT(VAL) 은 1, SUM 은 30 입니다. A 그룹의 SUM 은 NULL 을 건너뛴 10 이에요.' },
    { id: 'q5-06', level: 2, tag: '별칭과 집계 조건',
      q: 'EMP(ENAME, DEPTNO, JOB, SAL) 테이블에 대해 오류 없이 실행되는 SQL 은? (Oracle)',
      choices: [
        { code: `SELECT DEPTNO AS D, SUM(SAL)
  FROM EMP
 GROUP BY D;` },
        { code: `SELECT DEPTNO, SUM(SAL)
  FROM EMP
 WHERE SUM(SAL) > 500
 GROUP BY DEPTNO;` },
        { code: `SELECT DEPTNO, SUM(SAL) AS TOT
  FROM EMP
 GROUP BY DEPTNO
HAVING TOT > 500;` },
        { code: `SELECT DEPTNO
  FROM EMP
 GROUP BY DEPTNO
HAVING MAX(SAL) > 500
 ORDER BY DEPTNO;` }
      ],
      answer: 4,
      why: 'HAVING 에는 SELECT 에 없는 집계함수도 쓸 수 있어서 4번은 실행돼요. 1번은 GROUP BY 에 별칭, 2번은 WHERE 에 집계함수, 3번은 HAVING 에 별칭을 써서 오류입니다. 셋 다 SELECT 보다 먼저 실행되는 절이에요.' },
    { id: 'q5-07', level: 3, tag: '집계함수 중첩',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은? (Oracle)',
      tables: [{ name: 'EMP', head: ['DEPTNO', 'SAL'], rows: [[10, 300], [10, 500], [20, 400], [20, null], [30, 200], [30, 100], [30, 300]] }],
      code: `SELECT MAX(SUM(SAL)) AS M, MIN(COUNT(SAL)) AS C
  FROM EMP
 GROUP BY DEPTNO;`,
      choices: [
        '3행이 나오고, 부서마다 M 과 C 가 표시된다.',
        '1행이 나오고, M 은 1800, C 는 1 이다.',
        '1행이 나오고, M 은 800, C 는 2 이다.',
        '1행이 나오고, M 은 800, C 는 1 이다.'
      ],
      answer: 4,
      why: '안쪽 집계가 부서별로 SUM 800, 400, 600 과 COUNT(SAL) 2, 1, 3 을 만들고, 바깥쪽이 그중 최댓값 800 과 최솟값 1 을 골라요. 중첩하면 GROUP BY 가 있어도 결과는 1행입니다. 부서 20 의 COUNT(SAL) 은 NULL 을 빼서 1 이에요. 1800 은 전체 합계입니다.' },
    { id: 'q5-08', level: 3, tag: 'GROUP BY 없는 HAVING',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'ORD', head: ['ONO', 'AMT'], rows: [[1, 100], [2, 200], [3, null], [4, 300]] }],
      code: `SELECT COUNT(*) AS C, SUM(AMT) AS S
  FROM ORD
HAVING AVG(AMT) > 150;`,
      choices: [
        'GROUP BY 절이 없어 오류가 발생한다.',
        '결과 행이 없다.',
        '1행이 나오고, C 는 4, S 는 600 이다.',
        '1행이 나오고, C 는 3, S 는 600 이다.'
      ],
      answer: 3,
      why: 'GROUP BY 가 없으면 전체가 한 그룹이에요. AVG(AMT) 는 NULL 을 뺀 600 ÷ 3 = 200 이라 조건이 참이고 한 행이 나옵니다. COUNT(*) 는 NULL 행도 세어 4 예요. 평균을 600 ÷ 4 = 150 으로 계산하면 조건이 거짓이 되어 2번을 고르게 됩니다.' },
    { id: 'q5-09', level: 3, tag: 'WHERE 와 HAVING',
      q: '아래 테이블에 대해 실행했을 때 나머지 셋과 결과가 다른 SQL 은? (행의 순서는 따지지 않는다)',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 10, 500], ['B', 10, 300], ['C', 20, 200], ['D', 20, 400], ['E', 30, 250]] }],
      choices: [
        { code: `SELECT DEPTNO, SUM(SAL)
  FROM EMP
 WHERE DEPTNO IN (10, 20)
 GROUP BY DEPTNO;` },
        { code: `SELECT DEPTNO, SUM(SAL)
  FROM EMP
 GROUP BY DEPTNO
HAVING DEPTNO IN (10, 20);` },
        { code: `SELECT DEPTNO, SUM(SAL)
  FROM EMP
 WHERE SAL >= 300
 GROUP BY DEPTNO
HAVING DEPTNO < 30;` },
        { code: `SELECT DEPTNO, SUM(SAL)
  FROM EMP
 WHERE DEPTNO < 30
 GROUP BY DEPTNO
HAVING COUNT(*) >= 1;` }
      ],
      answer: 3,
      why: '1, 2, 4번은 모두 (10, 800), (20, 600) 이에요. GROUP BY 컬럼에 대한 조건은 WHERE 에 써도 HAVING 에 써도 같은 그룹이 남습니다. 3번은 WHERE 에서 급여 200 인 C 가 집계 전에 빠져서 (10, 800), (20, 400) 이 돼요.' },
    { id: 'q5-10', level: 3, tag: '조건부 집계',
      q: '아래 테이블에서 SQL 을 실행했을 때 DEPTNO 가 20 인 행의 C1, C2, C3 으로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'JOB'], rows: [['A', 10, 'MGR'], ['B', 10, 'CLERK'], ['C', 10, 'CLERK'], ['D', 20, 'MGR'], ['E', 20, 'MGR']] }],
      code: `SELECT DEPTNO,
       COUNT(CASE WHEN JOB = 'CLERK' THEN 1 ELSE 0 END) AS C1,
       COUNT(CASE WHEN JOB = 'CLERK' THEN 1 END)        AS C2,
       SUM(CASE WHEN JOB = 'CLERK' THEN 1 ELSE 0 END)   AS C3
  FROM EMP
 GROUP BY DEPTNO;`,
      choices: ['0, 0, 0', '2, 0, NULL', '0, NULL, 0', '2, 0, 0'],
      answer: 4,
      why: '부서 20 은 D 와 E 두 행이고 둘 다 MGR 이에요. C1 의 CASE 는 두 행 모두 0 을 돌려주는데, 0 은 NULL 이 아니라서 COUNT 가 2 로 셉니다. C2 의 CASE 는 ELSE 가 없어 두 행 모두 NULL 이고, COUNT 는 셀 값이 없으면 NULL 이 아니라 0 을 돌려줘요. C3 은 0 + 0 = 0 입니다. SUM 이 NULL 이 되는 것은 더할 값이 전부 NULL 일 때뿐이에요.' }
  ]
});
