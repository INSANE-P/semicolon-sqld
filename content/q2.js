SQLD.add({
  id: 'q2',
  title: 'SELECT 문',
  minutes: 14,
  weight: 3,
  lead: '2과목 문제의 대부분은 SELECT 문을 읽고 결과를 맞히는 문제예요. 절이 실행되는 순서와 별칭을 쓸 수 있는 자리만 정확히 알아도, 오류가 나는 SQL 을 고르는 문제를 바로 풉니다.',
  goals: [
    'SELECT 문 여섯 절의 작성 순서와 실행 순서를 구분해서 말한다',
    '컬럼 별칭을 쓸 수 있는 절과 큰따옴표가 필요한 경우를 가린다',
    '테이블 별칭을 붙인 뒤 오류가 나는 SQL 을 찾는다',
    'DISTINCT, 산술 연산, 연결 연산의 결과를 계산한다'
  ],
  blocks: [
    { t: 'h', x: '여섯 절, 쓰는 순서와 도는 순서' },
    { t: 'p', x: 'SELECT 문은 절 여섯 개로 이루어져요. 쓸 때는 정해진 순서대로 써야 하는데, DBMS 가 실제로 처리하는 순서는 달라요. ==쓰는 순서는 SELECT 가 맨 앞이지만 실행은 FROM 부터== 입니다.' },
    { t: 'sql', code: `SELECT   컬럼 또는 표현식      -- 5
  FROM   테이블               -- 1
 WHERE   행을 거르는 조건       -- 2
 GROUP BY 묶을 기준            -- 3
HAVING   그룹을 거르는 조건     -- 4
 ORDER BY 정렬 기준;           -- 6` },
    { t: 'fig', caption: '위는 쓰는 순서, 아래 숫자는 실행 순서예요. SELECT 가 다섯 번째라서 그보다 먼저 도는 절은 SELECT 에서 지은 별칭을 모릅니다.', svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="22" class="tx-s" text-anchor="middle">작성 순서 (왼쪽에서 오른쪽)</text>
  <rect x="19" y="36" width="92" height="40" class="bx-a"/><text x="65" y="61" class="tx-m" text-anchor="middle">SELECT</text>
  <rect x="121" y="36" width="92" height="40" class="bx"/><text x="167" y="61" class="tx-m" text-anchor="middle">FROM</text>
  <rect x="223" y="36" width="92" height="40" class="bx"/><text x="269" y="61" class="tx-m" text-anchor="middle">WHERE</text>
  <rect x="325" y="36" width="92" height="40" class="bx"/><text x="371" y="61" class="tx-m" text-anchor="middle">GROUP BY</text>
  <rect x="427" y="36" width="92" height="40" class="bx"/><text x="473" y="61" class="tx-m" text-anchor="middle">HAVING</text>
  <rect x="529" y="36" width="92" height="40" class="bx"/><text x="575" y="61" class="tx-m" text-anchor="middle">ORDER BY</text>
  <line x1="65" y1="76" x2="65" y2="100" class="ln-a"/>
  <line x1="167" y1="76" x2="167" y2="100" class="ln"/>
  <line x1="269" y1="76" x2="269" y2="100" class="ln"/>
  <line x1="371" y1="76" x2="371" y2="100" class="ln"/>
  <line x1="473" y1="76" x2="473" y2="100" class="ln"/>
  <line x1="575" y1="76" x2="575" y2="100" class="ln"/>
  <rect x="45" y="100" width="40" height="34" class="bx-a"/><text x="65" y="123" class="tx-a" text-anchor="middle">5</text>
  <rect x="147" y="100" width="40" height="34" class="bx"/><text x="167" y="123" class="tx-b" text-anchor="middle">1</text>
  <rect x="249" y="100" width="40" height="34" class="bx"/><text x="269" y="123" class="tx-b" text-anchor="middle">2</text>
  <rect x="351" y="100" width="40" height="34" class="bx"/><text x="371" y="123" class="tx-b" text-anchor="middle">3</text>
  <rect x="453" y="100" width="40" height="34" class="bx"/><text x="473" y="123" class="tx-b" text-anchor="middle">4</text>
  <rect x="555" y="100" width="40" height="34" class="bx"/><text x="575" y="123" class="tx-b" text-anchor="middle">6</text>
  <text x="320" y="160" class="tx-s" text-anchor="middle">실행 순서</text>
  <text x="320" y="184" class="tx-m" text-anchor="middle">FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</text>
</svg>` },
    { t: 'p', x: '순서를 말로 풀면 이래요. 어느 테이블인지 정하고(FROM), 행을 거르고(WHERE), 묶고(GROUP BY), 묶음을 거르고(HAVING), 보여 줄 컬럼을 만들고(SELECT), 마지막에 정렬해요(ORDER BY). 쓰는 순서에서 GROUP BY 와 HAVING 은 서로 자리를 바꿔 써도 실행되지만, 실행 순서는 그대로예요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'JOB', 'SAL', 'COMM'], rows: [
      ['KIM', 10, 'MANAGER', 500, null],
      ['LEE', 10, 'CLERK', 300, 50],
      ['PARK', 20, 'CLERK', 300, null],
      ['CHOI', 20, 'SALES', 400, 100],
      ['JUNG', 20, 'CLERK', 250, null]
    ] },
    { t: 'sql', code: `SELECT DEPTNO, SUM(SAL) AS TOTAL
  FROM EMP
 WHERE SAL >= 300
 GROUP BY DEPTNO
HAVING SUM(SAL) >= 700
 ORDER BY TOTAL DESC;`, result: { head: ['DEPTNO', 'TOTAL'], rows: [[10, 800], [20, 700]] },
      note: 'WHERE 에서 JUNG(250) 이 먼저 빠져요. 그다음 10번은 500+300, 20번은 300+400 으로 묶이고, 둘 다 700 이상이라 HAVING 을 통과합니다.' },
    { t: 'tip', title: '이렇게 외워요', x: '실행 순서는 "프웨그해셀오"로 외워요. **F**ROM, **W**HERE, **G**ROUP BY, **H**AVING, **S**ELECT, **O**RDER BY. 작성 순서에서 SELECT 만 뒤에서 두 번째로 옮긴 모양이에요.' },

    { t: 'h', x: 'SELECT 절에 쓸 수 있는 것' },
    { t: 'ul', items: [
      '`*` 는 테이블의 모든 컬럼이에요. 컬럼이 테이블에 정의된 순서대로 나옵니다.',
      '컬럼을 쉼표로 나열하면 적은 순서대로 나와요.',
      '`SAL * 12` 같은 계산식, 함수, `\'원\'` 같은 상수도 쓸 수 있어요. 컬럼 이름이 아닌 이런 것들을 표현식이라고 부릅니다. 테이블의 원래 값은 바뀌지 않아요.',
      '문자 상수와 날짜 상수는 작은따옴표로 감싸요.'
    ] },
    { t: 'trap', title: '* 옆에 다른 컬럼을 붙이면', x: 'Oracle 에서 `SELECT *, ENAME FROM EMP` 는 오류예요. `*` 와 다른 컬럼을 같이 쓰려면 `SELECT E.*, E.ENAME FROM EMP E` 처럼 `*` 앞에 테이블 이름이나 별칭을 붙여야 합니다.' },

    { t: 'h', x: 'DISTINCT 는 조합으로 중복을 없애요' },
    { t: 'p', x: '`DISTINCT` 는 결과에서 똑같은 행을 하나만 남겨요. SELECT 바로 뒤에 한 번만 쓰고, 뒤에 컬럼이 여러 개 오면 ==컬럼 값의 조합==이 같은 행을 하나로 줄입니다. 아무것도 안 쓰면 중복을 그대로 두는 `ALL` 이 기본이에요.' },
    { t: 'sql', code: `SELECT DISTINCT DEPTNO
  FROM EMP;`, result: { head: ['DEPTNO'], rows: [[10], [20]] } },
    { t: 'sql', code: `SELECT DISTINCT DEPTNO, JOB
  FROM EMP;`, result: { head: ['DEPTNO', 'JOB'], rows: [[10, 'MANAGER'], [10, 'CLERK'], [20, 'CLERK'], [20, 'SALES']] },
      note: '(20, CLERK) 는 PARK 과 JUNG 두 명이지만 한 줄로 줄어요. (10, CLERK) 과 (20, CLERK) 은 조합이 달라서 둘 다 남습니다.' },
    { t: 'trap', title: 'DISTINCT 는 첫 컬럼에만 걸리지 않아요', x: '`SELECT DISTINCT DEPTNO, JOB` 을 "DEPTNO 만 중복 제거"로 읽으면 2행이라고 답하게 돼요. DISTINCT 는 뒤에 오는 컬럼 전체에 걸려서 위 결과는 4행입니다. `SELECT DEPTNO, DISTINCT JOB` 처럼 중간에 쓰면 오류예요. 그리고 DISTINCT 는 NULL 끼리를 같은 값으로 보고 하나만 남깁니다.' },

    { t: 'h', x: '컬럼 별칭' },
    { t: 'p', x: '`SAL * 12` 를 그대로 출력하면 머리글도 `SAL*12` 로 나와요. 여기에 이름표를 붙이는 것이 컬럼 별칭(Alias)이에요. 컬럼이나 표현식 뒤에 `AS 별칭` 을 쓰고, ==AS 는 생략할 수 있어요.== 출력할 때의 이름만 바뀌고 테이블의 컬럼 이름은 그대로입니다.' },
    { t: 'sql', code: `SELECT ENAME, SAL * 12 AS YSAL, SAL + 100 BONUS_SAL
  FROM EMP
 WHERE DEPTNO = 10;`, result: { head: ['ENAME', 'YSAL', 'BONUS_SAL'], rows: [['KIM', 6000, 600], ['LEE', 3600, 400]] } },
    { t: 'p', x: '별칭을 쓸 수 있는 절은 실행 순서로 정해져요. 별칭은 SELECT 절에서 만들어지니, SELECT 보다 먼저 도는 WHERE, GROUP BY, HAVING 은 그 이름을 모릅니다. SELECT 뒤에 도는 ORDER BY 만 알아요.' },
    { t: 'table', head: ['절', 'SELECT 에서 지은 컬럼 별칭', '이유'], rows: [
      ['WHERE', '못 쓴다(오류)', 'SELECT 보다 먼저 실행'],
      ['GROUP BY', '못 쓴다(오류)', 'SELECT 보다 먼저 실행'],
      ['HAVING', '못 쓴다(오류)', 'SELECT 보다 먼저 실행'],
      ['ORDER BY', '쓸 수 있다', 'SELECT 보다 나중에 실행']
    ] },
    { t: 'sql', code: `SELECT ENAME, SAL * 12 AS YSAL
  FROM EMP
 WHERE YSAL >= 4800;        -- 오류: YSAL 을 아직 모른다`, note: 'WHERE 에서는 `WHERE SAL * 12 >= 4800` 처럼 원래 식을 다시 써야 해요.' },
    { t: 'sql', code: `SELECT ENAME, SAL * 12 AS YSAL
  FROM EMP
 WHERE SAL * 12 >= 4800
 ORDER BY YSAL DESC;`, result: { head: ['ENAME', 'YSAL'], rows: [['KIM', 6000], ['CHOI', 4800]] } },
    { t: 'p', x: '별칭에 큰따옴표가 꼭 필요한 경우가 있어요. 따옴표 없이 쓴 별칭은 대문자로 바뀌어 출력됩니다.' },
    { t: 'table', head: ['경우', '예', '따옴표가 없으면'], rows: [
      ['별칭에 공백이 있다', '`SAL AS "월 급여"`', '오류'],
      ['별칭에 특수문자가 있다(`_` 는 예외)', '`SAL AS "급여(원)"`', '오류'],
      ['입력한 대소문자를 그대로 보여 주고 싶다', '`SAL AS "Salary"`', '`SALARY` 로 출력'],
      ['예약어를 별칭으로 쓰고 싶다', '`SAL AS "SELECT"`', '오류']
    ] },
    { t: 'trap', title: '큰따옴표와 작은따옴표', x: '별칭을 감싸는 것은 ==큰따옴표==예요. 작은따옴표는 문자 값을 감쌀 때 씁니다. Oracle 에서 `SELECT SAL AS \'월급\' FROM EMP` 는 오류예요. 그리고 `SAL AS 월 급여` 처럼 공백이 든 별칭을 따옴표 없이 쓰면, 공백 뒤 낱말을 해석하지 못해 오류가 납니다. `_` 는 특수문자지만 따옴표 없이 쓸 수 있어요.' },

    { t: 'h', x: 'FROM 절과 테이블 별칭' },
    { t: 'p', x: 'FROM 에는 데이터를 가져올 테이블이나 뷰(SELECT 문에 이름을 붙여 테이블처럼 조회하는 객체)를 적어요. 테이블에도 별칭을 붙일 수 있는데, 조인에서 `EMP.DEPTNO` 를 `E.DEPTNO` 로 줄여 쓰려고 붙입니다.' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['컬럼 별칭의 AS', '써도 되고 생략해도 된다', '써도 되고 생략해도 된다'],
      ['테이블 별칭의 AS', '쓰면 오류. `FROM EMP E` 만 가능', '써도 되고 생략해도 된다'],
      ['FROM 절 생략', '할 수 없다. 테이블이 필요 없으면 `FROM DUAL`', '할 수 있다. `SELECT GETDATE();`']
    ] },
    { t: 'trap', title: '별칭을 붙였으면 별칭으로만 불러요', x: '테이블에 별칭을 붙인 뒤에는 그 SQL 안에서 원래 테이블 이름을 컬럼 앞에 붙일 수 없어요. `SELECT EMP.ENAME FROM EMP E` 는 오류이고 `SELECT E.ENAME FROM EMP E` 가 맞습니다. 앞에 아무것도 안 붙인 `SELECT ENAME FROM EMP E` 는 괜찮아요.' },
    { t: 'sql', code: `SELECT E.ENAME, E.SAL      -- 가능
  FROM EMP E;

SELECT ENAME, SAL          -- 가능
  FROM EMP E;

SELECT EMP.ENAME, EMP.SAL  -- 오류
  FROM EMP E;` },
    { t: 'p', x: '테이블 별칭은 테이블에 있는 컬럼 앞에만 붙일 수 있어요. SELECT 에서 지은 컬럼 별칭은 테이블의 컬럼이 아니라서, `SELECT E.SAL * 12 AS YSAL FROM EMP E ORDER BY E.YSAL` 처럼 컬럼 별칭 앞에 테이블 별칭을 붙이면 오류예요. `ORDER BY YSAL` 로 별칭만 씁니다.' },
    { t: 'p', x: 'FROM 에 테이블을 쉼표로 여러 개 나열할 수도 있어요. 이때 조인 조건을 안 주면 모든 행끼리 짝을 짓는 카티시안 곱이 생깁니다. 조인 장에서 다뤄요.' },

    { t: 'h', x: 'DUAL 테이블' },
    { t: 'p', x: 'Oracle 은 `SELECT 1 + 1` 만 쓰면 오류가 나요. FROM 이 반드시 있어야 하기 때문이에요. 테이블이 필요 없는 계산이나 함수 결과를 보고 싶을 때 쓰라고 Oracle 이 미리 만들어 둔 ==행 하나, 컬럼 하나짜리 테이블==이 `DUAL` 입니다. 행이 하나라서 결과도 한 줄만 나와요.' },
    { t: 'sql', code: `SELECT 1 + 1 AS A, SYSDATE AS TODAY
  FROM DUAL;`, result: { head: ['A', 'TODAY'], rows: [[2, '2026-11-11']] }, note: 'SYSDATE 는 실행한 날짜라서 그날그날 달라져요.' },

    { t: 'h', x: '산술 연산자' },
    { t: 'p', x: '숫자와 날짜에는 `+`, `-`, `*`, `/` 를 쓸 수 있어요. 수학과 똑같이 ==괄호가 먼저, 그다음 곱셈과 나눗셈, 마지막이 덧셈과 뺄셈==이에요.' },
    { t: 'sql', code: `SELECT ENAME,
       SAL + COMM * 2    AS A,
       (SAL + COMM) * 2  AS B
  FROM EMP
 WHERE DEPTNO = 10;`, result: { head: ['ENAME', 'A', 'B'], rows: [['KIM', null, null], ['LEE', 400, 700]] },
      note: 'LEE: A 는 300 + (50 × 2), B 는 (300 + 50) × 2. KIM 은 COMM 이 NULL 이라 계산 결과가 전부 NULL 이에요.' },
    { t: 'trap', title: 'NULL 이 섞인 계산', x: '`SAL + COMM` 에서 COMM 이 NULL 이면 결과는 SAL 이 아니라 NULL 이에요. 결과 표를 고르는 문제에서 NULL 자리에 SAL 값을 그대로 적은 보기가 오답으로 나옵니다. SAL 을 살리려면 `SAL + NVL(COMM, 0)` 처럼 NULL 을 먼저 바꿔야 해요.' },

    { t: 'h', x: '연결 연산자' },
    { t: 'p', x: '문자열을 이어 붙이는 연산자예요. Oracle 은 `||`, SQL Server 는 `+` 를 씁니다. 함수 `CONCAT` 도 같은 일을 해요.' },
    { t: 'sql', code: `SELECT ENAME || ' 의 직무는 ' || JOB AS INFO
  FROM EMP
 WHERE DEPTNO = 10;`, result: { head: ['INFO'], rows: [['KIM 의 직무는 MANAGER'], ['LEE 의 직무는 CLERK']] } },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['연결 연산자', "`'A' || 'B'` → AB", "`'A' + 'B'` → AB"],
      ['CONCAT 함수', "`CONCAT('A', 'B')` 인자는 2개만", "`CONCAT('A', 'B', 'C')` 여러 개 가능"],
      ['NULL 과 연결', "`'A' || NULL` → A (NULL 을 없는 글자처럼 다룬다)", "`'A' + NULL` → NULL"]
    ] },
    { t: 'trap', title: 'Oracle 에서 + 는 덧셈뿐이에요', x: "Oracle 에서 `'10' + '20'` 은 글자를 잇지 않고 숫자로 바꿔 더해서 30 이 돼요. `'A' + 'B'` 는 숫자로 못 바꾸니 오류입니다. 이어 붙이려면 `||` 를 써야 해요. 그리고 Oracle 의 `||` 는 한쪽이 NULL 이어도 결과가 NULL 이 되지 않아요. 산술 연산과 반대라서 한 문제 안에 둘을 같이 넣어 헷갈리게 합니다." },
    { t: 'check', q: 'Oracle 에서 SELECT ENAME || COMM, SAL + COMM FROM EMP 를 실행하면 KIM(SAL 500, COMM NULL) 행은 어떻게 나올까요?', a: '첫 컬럼은 `KIM`, 둘째 컬럼은 NULL 이에요. 연결 연산은 NULL 을 없는 글자처럼 다루고, 산술 연산은 NULL 이 섞이면 결과가 NULL 입니다.' },
    { t: 'check', q: 'SELECT DEPTNO AS D, COUNT(*) FROM EMP GROUP BY D 는 왜 오류일까요?', a: 'GROUP BY 가 SELECT 보다 먼저 실행돼서 별칭 D 를 아직 모르기 때문이에요. `GROUP BY DEPTNO` 로 써야 합니다. ORDER BY 에서는 D 를 쓸 수 있어요.' }
  ],
  keys: [
    '작성 순서: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY',
    '실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
    '컬럼 별칭은 ORDER BY 에서만 쓸 수 있다. WHERE, GROUP BY, HAVING 에서는 오류',
    '별칭에 공백, 특수문자(_ 제외), 대소문자 유지가 필요하면 큰따옴표',
    '테이블 별칭을 붙이면 원래 테이블 이름으로 컬럼을 부를 수 없다. 컬럼 별칭 앞에 테이블 별칭을 붙여도 오류. Oracle 은 테이블 별칭에 AS 를 못 쓴다',
    'DISTINCT 는 SELECT 바로 뒤에 한 번, 뒤따르는 컬럼 조합 전체로 중복 제거',
    'Oracle 은 FROM 을 생략할 수 없어 DUAL 을 쓴다. SQL Server 는 생략 가능',
    '연결 연산자는 Oracle ||, SQL Server +. 산술 연산에 NULL 이 섞이면 NULL'
  ],
  cards: [
    { q: 'SELECT 문의 실행 순서는?', a: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.' },
    { q: 'SELECT 에서 지은 컬럼 별칭을 쓸 수 있는 절은?', a: 'ORDER BY 뿐이에요. WHERE, GROUP BY, HAVING 은 SELECT 보다 먼저 실행돼서 별칭을 모릅니다.' },
    { q: '컬럼 별칭에 큰따옴표가 필요한 경우는?', a: '공백이 있을 때, `_` 가 아닌 특수문자가 있을 때, 대소문자를 그대로 보여 주고 싶을 때.' },
    { q: '`SELECT EMP.ENAME FROM EMP E` 의 결과는?', a: '오류예요. 테이블 별칭을 붙인 뒤에는 `E.ENAME` 처럼 별칭으로만 부를 수 있어요.' },
    { q: '`SELECT DISTINCT A, B` 는 무엇을 기준으로 중복을 없애나요?', a: 'A 와 B 값의 조합이에요. A 만 따로 중복 제거하지 않습니다.' },
    { q: 'DUAL 은 무엇인가요?', a: 'Oracle 이 만들어 둔 행 하나, 컬럼 하나짜리 테이블. FROM 을 생략할 수 없어서 계산이나 함수 결과를 볼 때 써요.' },
    { q: 'Oracle 과 SQL Server 의 문자열 연결 연산자는?', a: 'Oracle 은 `||`, SQL Server 는 `+`.' },
    { q: 'Oracle 에서 테이블 별칭 앞에 AS 를 쓰면?', a: '오류예요. `FROM EMP E` 처럼 AS 없이 씁니다. 컬럼 별칭의 AS 는 써도 되고 생략해도 돼요.' }
  ],
  quiz: [
    { id: 'q2-01', level: 1, tag: '실행 순서',
      q: 'SELECT 문이 실행되는 순서로 알맞은 것은?',
      choices: [
        'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY',
        'FROM → WHERE → GROUP BY → SELECT → HAVING → ORDER BY',
        'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
        'FROM → GROUP BY → WHERE → HAVING → SELECT → ORDER BY'
      ],
      answer: 3,
      why: '테이블을 정하고(FROM), 행을 거르고(WHERE), 묶고(GROUP BY), 묶음을 거른(HAVING) 다음에 SELECT 가 실행되고 마지막이 ORDER BY 예요. 1번은 작성 순서입니다. HAVING 은 SELECT 보다 먼저, WHERE 는 GROUP BY 보다 먼저예요.' },
    { id: 'q2-02', level: 1, tag: 'SELECT 절',
      q: 'SELECT 문에 대한 설명으로 적절하지 않은 것은? (Oracle)',
      choices: [
        '테이블이 필요 없는 계산 결과를 볼 때는 `FROM DUAL` 을 쓴다.',
        '컬럼 별칭 앞의 AS 는 생략할 수 있다.',
        '`DISTINCT` 뒤에 컬럼을 여러 개 쓰면 컬럼 값의 조합이 같은 행을 하나로 줄인다.',
        '컬럼에 별칭을 붙이면 테이블에 정의된 컬럼 이름도 함께 바뀐다.'
      ],
      answer: 4,
      why: '별칭은 그 SQL 의 출력에만 쓰이는 임시 이름이에요. 테이블의 컬럼 이름은 바뀌지 않습니다. Oracle 은 FROM 을 생략할 수 없어 DUAL 을 쓰고, 컬럼 별칭의 AS 는 생략할 수 있으며, DISTINCT 는 뒤따르는 컬럼 조합으로 중복을 없애요.' },
    { id: 'q2-03', level: 2, tag: 'DISTINCT',
      q: '아래 테이블에서 SQL 을 실행했을 때 결과 행의 수는?',
      tables: [{ name: 'T', head: ['DEPTNO', 'JOB'], rows: [[10, 'CLERK'], [10, 'CLERK'], [10, null], [20, 'CLERK'], [20, null], [20, null]] }],
      code: `SELECT DISTINCT DEPTNO, JOB
  FROM T;`,
      choices: ['2행', '4행', '5행', '6행'],
      answer: 2,
      why: '조합으로 보면 (10, CLERK), (10, NULL), (20, CLERK), (20, NULL) 네 가지예요. DISTINCT 는 NULL 끼리도 같은 값으로 보고 하나만 남기니 (20, NULL) 두 줄이 한 줄이 됩니다. 2행은 DEPTNO 만 중복 제거했을 때, 5행은 NULL 을 서로 다른 값으로 봤을 때 나오는 답이에요.' },
    { id: 'q2-04', level: 2, tag: '컬럼 별칭',
      q: '다음 중 실행하면 오류가 발생하는 SQL 은? (EMP 테이블에 ENAME, SAL 컬럼이 있다)',
      choices: [
        { code: `SELECT ENAME, SAL * 12 AS YSAL
  FROM EMP
 WHERE YSAL > 3000;` },
        { code: `SELECT ENAME, SAL * 12 AS YSAL
  FROM EMP
 ORDER BY YSAL;` },
        { code: `SELECT ENAME, SAL * 12 YSAL
  FROM EMP
 WHERE SAL * 12 > 3000;` },
        { code: `SELECT ENAME, SAL * 12 AS "Y SAL"
  FROM EMP
 ORDER BY "Y SAL";` }
      ],
      answer: 1,
      why: 'WHERE 는 SELECT 보다 먼저 실행돼서 별칭 YSAL 을 모릅니다. 그래서 1번이 오류예요. ORDER BY 는 SELECT 뒤에 실행되니 별칭을 쓸 수 있고(2번, 4번), AS 는 생략할 수 있으며(3번), 공백이 든 별칭은 큰따옴표로 감싸면 됩니다(4번).' },
    { id: 'q2-05', level: 2, tag: '컬럼 별칭',
      q: '다음 중 오류 없이 실행되는 SQL 은? (Oracle)',
      choices: [
        { code: `SELECT SAL AS 월 급여
  FROM EMP;` },
        { code: `SELECT SAL AS '월급여'
  FROM EMP;` },
        { code: `SELECT SAL AS "월 급여"
  FROM EMP;` },
        { code: `SELECT SAL AS 급여(월)
  FROM EMP;` }
      ],
      answer: 3,
      why: '별칭에 공백이나 특수문자가 있으면 큰따옴표로 감싸야 해요. 1번은 공백, 4번은 괄호가 따옴표 없이 들어가 오류입니다. 2번은 작은따옴표를 썼는데, 작은따옴표는 문자 값을 감싸는 것이라 Oracle 에서 별칭으로 쓸 수 없어요.' },
    { id: 'q2-06', level: 2, tag: '테이블 별칭',
      q: '다음 중 실행하면 오류가 발생하는 SQL 은? (Oracle)',
      choices: [
        { code: `SELECT ENAME
  FROM EMP E;` },
        { code: `SELECT E.ENAME
  FROM EMP E;` },
        { code: `SELECT EMP.ENAME
  FROM EMP;` },
        { code: `SELECT EMP.ENAME
  FROM EMP E;` }
      ],
      answer: 4,
      why: '테이블에 별칭 E 를 붙였으면 컬럼 앞에는 E 만 붙일 수 있어요. 원래 이름 EMP 를 붙인 4번이 오류입니다. 별칭이 없는 3번은 테이블 이름을 그대로 쓸 수 있고, 1번처럼 아무것도 안 붙이는 것도 됩니다.' },
    { id: 'q2-07', level: 3, tag: '연산자와 NULL',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은? (Oracle)',
      tables: [{ name: 'EMP', head: ['ENAME', 'SAL', 'COMM'], rows: [['KIM', 300, null]] }],
      code: `SELECT ENAME || COMM AS A,
       SAL + COMM    AS B
  FROM EMP;`,
      choices: [
        'A 는 NULL, B 는 NULL',
        'A 는 KIM, B 는 NULL',
        'A 는 KIM, B 는 300',
        'A 는 NULL, B 는 300'
      ],
      answer: 2,
      why: 'Oracle 의 연결 연산자 `||` 는 NULL 을 없는 글자처럼 다뤄서 A 는 KIM 이에요. 산술 연산은 NULL 이 섞이면 결과가 NULL 이라 B 는 NULL 입니다. 300 이 나오려면 `SAL + NVL(COMM, 0)` 이어야 해요.' },
    { id: 'q2-08', level: 3, tag: '산술 연산',
      q: '아래 테이블에서 SQL 을 실행했을 때 결과의 첫 번째 행으로 알맞은 것은?',
      tables: [{ name: 'PAY', head: ['ENAME', 'SAL', 'BONUS'], rows: [['A', 300, 50], ['B', 250, 100], ['C', 320, 20]] }],
      code: `SELECT ENAME, SAL + BONUS * 2 AS TOTAL
  FROM PAY
 ORDER BY TOTAL DESC;`,
      choices: ['B, 450', 'A, 700', 'B, 700', 'A, 400'],
      answer: 1,
      why: '곱셈이 덧셈보다 먼저예요. A 는 300 + 100 = 400, B 는 250 + 200 = 450, C 는 320 + 40 = 360 이고, 별칭 TOTAL 로 내림차순 정렬하면 B(450) 가 맨 위에 옵니다. 700 은 (SAL + BONUS) × 2 로 괄호를 넣어 계산했을 때 나오는 값이에요.' }
  ]
});
