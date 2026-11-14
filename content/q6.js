SQLD.add({
  id: 'q6',
  title: 'ORDER BY 절',
  minutes: 10,
  weight: 2,
  lead: '정렬은 쉬워 보여서 넘기기 쉬운데, NULL 의 위치와 문자로 저장된 숫자, 순번 정렬을 섞어 "결과의 순서"를 묻는 문제가 꾸준히 나와요.',
  goals: [
    '컬럼명, 별칭, 순번을 섞은 복합 정렬의 결과 순서를 따라간다',
    'SELECT 절에 없는 컬럼으로 정렬할 수 있는 경우와 없는 경우를 가른다',
    'Oracle 과 SQL Server 에서 NULL 이 어디에 놓이는지 말한다',
    '문자로 저장된 숫자가 어떤 순서로 정렬되는지 설명한다'
  ],
  blocks: [
    { t: 'h', x: '순서를 정해 주지 않으면 순서는 없어요' },
    { t: 'p', x: 'SELECT 결과가 늘 넣은 순서대로 나오는 것처럼 보여도 DBMS 는 그 순서를 약속하지 않아요. 원하는 순서가 있으면 ORDER BY 절에 적어야 해요. ORDER BY 는 SELECT 문의 맨 끝에 적고, ==실행도 맨 마지막==이에요.' },
    { t: 'ul', items: [
      '`ASC` 는 오름차순(작은 값부터), `DESC` 는 내림차순(큰 값부터)이에요.',
      '아무것도 안 적으면 ==ASC==예요.',
      '숫자는 작은 수부터, 문자는 사전 순서(가나다, ABC), 날짜는 과거부터가 오름차순이에요.'
    ] },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL', 'COMM'], rows: [
      ['KIM', 10, 500, null], ['LEE', 20, 300, 100], ['PARK', 10, 300, null], ['CHOI', 30, 400, 50], ['JUNG', 20, 500, 200]] },

    { t: 'h', x: '정렬 기준을 적는 세 가지 방법' },
    { t: 'p', x: 'ORDER BY 에는 컬럼명, SELECT 절에서 붙인 별칭, SELECT 절에서의 순번을 쓸 수 있어요. 셋을 섞어 써도 돼요.' },
    { t: 'sql', code: `SELECT ENAME, SAL * 12 AS YSAL, DEPTNO
  FROM EMP
 ORDER BY DEPTNO, YSAL DESC;      -- 컬럼명, 별칭

SELECT ENAME, SAL * 12 AS YSAL, DEPTNO
  FROM EMP
 ORDER BY 3, 2 DESC;              -- 순번(같은 결과)`, result: { head: ['ENAME', 'YSAL', 'DEPTNO'], rows: [['KIM', 6000, 10], ['PARK', 3600, 10], ['JUNG', 6000, 20], ['LEE', 3600, 20], ['CHOI', 4800, 30]] },
      note: '부서 번호 오름차순으로 먼저 줄 세우고, 부서가 같은 행끼리만 연봉 내림차순으로 다시 정렬해요.' },
    { t: 'p', x: 'SELECT 에서 붙인 별칭을 쓸 수 있는 절은 ORDER BY 뿐이에요. ORDER BY 만 SELECT 보다 뒤에 실행되기 때문이에요. WHERE, GROUP BY, HAVING 에서는 별칭을 못 써요.' },
    { t: 'trap', title: '순번은 SELECT 절 기준', x: '`ORDER BY 2` 의 2 는 테이블의 둘째 컬럼이 아니라 ==SELECT 절에 적은 둘째 항목==이에요. `SELECT ENAME, COMM, SAL … ORDER BY 2` 는 COMM 으로 정렬해요. SELECT 절 항목 수보다 큰 순번을 쓰면 오류예요.' },
    { t: 'trap', title: 'DESC 는 바로 앞 컬럼에만', x: '`ORDER BY DEPTNO, SAL DESC` 는 DEPTNO 오름차순, SAL 내림차순이에요. DESC 가 앞의 DEPTNO 까지 내림차순으로 만들지 않아요. 둘 다 내림차순이려면 `ORDER BY DEPTNO DESC, SAL DESC` 로 각각 적어야 해요.' },

    { t: 'h', x: '복합 정렬' },
    { t: 'p', x: '기준을 쉼표로 여러 개 적으면 앞의 기준부터 정렬하고, ==앞 기준 값이 같은 행끼리만== 다음 기준으로 정렬해요. 앞 기준 값이 서로 다르면 뒤 기준은 보지 않아요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 ORDER BY SAL DESC, ENAME;`, result: { head: ['ENAME', 'SAL'], rows: [['JUNG', 500], ['KIM', 500], ['CHOI', 400], ['LEE', 300], ['PARK', 300]] },
      note: '급여 500 이 둘이라 그 안에서 이름 오름차순(JUNG, KIM), 300 도 둘이라 LEE, PARK.' },

    { t: 'h', x: '내가 정한 순서로 정렬' },
    { t: 'p', x: '부서를 20, 30, 10 순서로 보고 싶다면 오름차순으로도 내림차순으로도 안 돼요. 이럴 때는 ORDER BY 에 CASE 를 써서 값마다 순서 번호를 매기고 그 번호로 정렬해요.' },
    { t: 'sql', code: `SELECT ENAME, DEPTNO
  FROM EMP
 ORDER BY CASE DEPTNO WHEN 20 THEN 1
                      WHEN 30 THEN 2
                      ELSE 3 END,
          ENAME;`, result: { head: ['ENAME', 'DEPTNO'], rows: [['JUNG', 20], ['LEE', 20], ['CHOI', 30], ['KIM', 10], ['PARK', 10]] },
      note: 'CASE 가 돌려준 1, 2, 3 의 오름차순으로 줄 세우고, 번호가 같은 행끼리는 이름 오름차순이에요.' },

    { t: 'h', x: 'SELECT 절에 없는 컬럼으로 정렬' },
    { t: 'p', x: '`SELECT ENAME FROM EMP ORDER BY SAL` 처럼 보여 주지 않는 컬럼으로 정렬해도 돼요. ORDER BY 가 실행될 때 DBMS 는 아직 테이블의 다른 컬럼 값을 쥐고 있기 때문이에요. 그런데 앞 단계에서 행이 합쳐졌다면 이야기가 달라져요.' },
    { t: 'table', head: ['SQL', '실행', '이유'], rows: [
      ['`SELECT ENAME FROM EMP ORDER BY SAL`', '됨', '행마다 SAL 값이 하나씩 있다'],
      ['`SELECT DISTINCT DEPTNO FROM EMP ORDER BY SAL`', '오류', '중복을 없앤 한 행에 SAL 이 여러 개라 기준을 정할 수 없다'],
      ['`SELECT DEPTNO, SUM(SAL) FROM EMP GROUP BY DEPTNO ORDER BY ENAME`', '오류', '그룹 한 행에 ENAME 이 여러 개다'],
      ['`SELECT DEPTNO FROM EMP GROUP BY DEPTNO ORDER BY SUM(SAL) DESC`', '됨', '그룹마다 값이 하나로 정해지는 집계함수다']
    ] },
    { t: 'trap', title: 'DISTINCT, GROUP BY 뒤의 ORDER BY', x: '"SELECT 절에 없는 컬럼으로도 정렬할 수 있다"는 일반 SELECT 에서만 맞아요. DISTINCT 를 쓰면 SELECT 절에 적은 것으로만, GROUP BY 를 쓰면 GROUP BY 컬럼과 집계함수로만 정렬할 수 있어요. 오류가 나는 SQL 을 고르는 문제에서 이 두 경우가 보기로 나와요.' },

    { t: 'h', x: 'NULL 은 어디에 놓일까요' },
    { t: 'p', x: 'NULL 은 크기를 비교할 수 없는 값이라 DBMS 가 자리를 정해 둬요. ==Oracle 은 NULL 을 가장 큰 값==처럼, SQL Server 는 가장 작은 값처럼 다뤄요.' },
    { t: 'fig', caption: '값 100, 200, NULL 을 정렬했을 때. Oracle 과 SQL Server 는 NULL 의 자리가 정반대예요.', svg: `<svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg">
  <text x="167" y="20" class="tx-b" text-anchor="middle">Oracle (NULL 이 가장 큼)</text>
  <text x="477" y="20" class="tx-b" text-anchor="middle">SQL Server (NULL 이 가장 작음)</text>
  <line x1="322" y1="8" x2="322" y2="162" class="ln-d"/>
  <text x="90" y="42" class="tx-s" text-anchor="middle">ASC</text>
  <rect x="30" y="50" width="120" height="32" class="bx"/><text x="90" y="71" class="tx-m" text-anchor="middle">100</text>
  <rect x="30" y="84" width="120" height="32" class="bx"/><text x="90" y="105" class="tx-m" text-anchor="middle">200</text>
  <rect x="30" y="118" width="120" height="32" class="bx-r"/><text x="90" y="139" class="tx-r" text-anchor="middle">NULL</text>
  <text x="245" y="42" class="tx-s" text-anchor="middle">DESC</text>
  <rect x="185" y="50" width="120" height="32" class="bx-r"/><text x="245" y="71" class="tx-r" text-anchor="middle">NULL</text>
  <rect x="185" y="84" width="120" height="32" class="bx"/><text x="245" y="105" class="tx-m" text-anchor="middle">200</text>
  <rect x="185" y="118" width="120" height="32" class="bx"/><text x="245" y="139" class="tx-m" text-anchor="middle">100</text>
  <text x="400" y="42" class="tx-s" text-anchor="middle">ASC</text>
  <rect x="340" y="50" width="120" height="32" class="bx-r"/><text x="400" y="71" class="tx-r" text-anchor="middle">NULL</text>
  <rect x="340" y="84" width="120" height="32" class="bx"/><text x="400" y="105" class="tx-m" text-anchor="middle">100</text>
  <rect x="340" y="118" width="120" height="32" class="bx"/><text x="400" y="139" class="tx-m" text-anchor="middle">200</text>
  <text x="555" y="42" class="tx-s" text-anchor="middle">DESC</text>
  <rect x="495" y="50" width="120" height="32" class="bx"/><text x="555" y="71" class="tx-m" text-anchor="middle">200</text>
  <rect x="495" y="84" width="120" height="32" class="bx"/><text x="555" y="105" class="tx-m" text-anchor="middle">100</text>
  <rect x="495" y="118" width="120" height="32" class="bx-r"/><text x="555" y="139" class="tx-r" text-anchor="middle">NULL</text>
</svg>` },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['NULL 의 크기', '가장 큰 값', '가장 작은 값'],
      ['ASC 에서 NULL', '맨 뒤', '맨 앞'],
      ['DESC 에서 NULL', '맨 앞', '맨 뒤'],
      ['위치 바꾸기', '`NULLS FIRST`, `NULLS LAST`', '해당 구문 없음']
    ] },
    { t: 'p', x: '오름차순만 놓고 "Oracle 은 NULL 을 마지막에, SQL Server 는 처음에 둔다"고 적은 보기도 맞는 설명이에요. 방향이 적혀 있지 않으면 기본값인 오름차순 기준으로 읽으면 돼요.' },
    { t: 'p', x: 'Oracle 은 정렬 기준 뒤에 `NULLS FIRST` 나 `NULLS LAST` 를 붙여 NULL 의 자리를 바꿀 수 있어요. 수당이 큰 사람부터 보되 수당이 없는 사람은 뒤로 보내려면 이렇게 써요.' },
    { t: 'sql', code: `SELECT ENAME, COMM
  FROM EMP
 ORDER BY COMM DESC NULLS LAST, ENAME;`, result: { head: ['ENAME', 'COMM'], rows: [['JUNG', 200], ['LEE', 100], ['CHOI', 50], ['KIM', null], ['PARK', null]] },
      note: 'NULLS LAST 가 없으면 Oracle 에서는 KIM, PARK 이 맨 위에 와요.' },
    { t: 'trap', title: 'Oracle 의 DESC 는 NULL 이 먼저', x: '오름차순에서 NULL 이 맨 뒤라는 것만 외우면 내림차순 문제에서 틀려요. Oracle 에서 `ORDER BY COMM DESC` 의 첫 행은 COMM 이 NULL 인 행이에요. 결과의 첫 행이나 마지막 행을 묻는 문제는 대개 이걸 보는 거예요.' },
    { t: 'check', q: 'Oracle 에서 `ORDER BY COMM NULLS FIRST` 라고 쓰면 NULL 이 아닌 값들은 어떤 순서일까요?', a: '오름차순이에요. NULLS FIRST 는 NULL 의 자리만 맨 앞으로 옮기고, ASC/DESC 를 안 적었으니 나머지는 기본값 ASC 로 정렬돼요. 결과는 NULL, NULL, 50, 100, 200 순서예요.' },

    { t: 'h', x: '문자로 저장된 숫자' },
    { t: 'p', x: '숫자처럼 보여도 컬럼 타입이 문자(VARCHAR2, CHAR)면 문자 규칙으로 정렬돼요. 문자는 ==왼쪽 첫 글자부터 한 글자씩== 비교해요. \'10\' 과 \'9\' 는 첫 글자 \'1\' 과 \'9\' 에서 승부가 나서 \'10\' 이 앞에 와요.' },
    { t: 'table', head: ['컬럼 타입', '값', '오름차순 결과'], rows: [
      ['NUMBER', '9, 10, 100, 25', '9, 10, 25, 100'],
      ['VARCHAR2', '\'9\', \'10\', \'100\', \'25\'', '\'10\', \'100\', \'25\', \'9\'']
    ] },
    { t: 'p', x: '\'10\' 과 \'100\' 처럼 앞부분이 똑같으면 짧은 쪽이 먼저예요. 문자 컬럼을 숫자 순서로 정렬하려면 `ORDER BY TO_NUMBER(CODE)` 처럼 숫자로 바꿔서 정렬해요. ORDER BY 에는 이렇게 식이나 함수도 쓸 수 있어요.' },
    { t: 'p', x: '반대로 숫자 컬럼을 `ORDER BY TO_CHAR(SAL)` 처럼 문자로 바꿔 정렬해도 문자 규칙을 따라요. 급여 800, 1300, 300, 2500 을 이렇게 정렬하면 1300, 2500, 300, 800 순서예요.' },
    { t: 'check', q: 'VARCHAR2 컬럼에 \'2\', \'11\', \'100\' 이 있어요. 내림차순으로 정렬하면?', a: '\'2\', \'11\', \'100\' 이에요. 오름차순이 \'100\', \'11\', \'2\' 이고(첫 글자가 같은 \'100\' 과 \'11\' 은 둘째 글자 \'0\' 과 \'1\' 로 비교) 내림차순은 그 반대예요.' }
  ],
  keys: [
    'ORDER BY 는 맨 마지막에 실행. 그래서 SELECT 별칭을 쓸 수 있는 유일한 절',
    'ASC/DESC 를 생략하면 ASC. DESC 는 바로 앞 컬럼 하나에만 적용',
    '컬럼명, 별칭, 순번을 섞어 쓸 수 있다. 순번은 SELECT 절에 적은 순서. CASE 같은 식으로 순서를 직접 정할 수도 있다',
    '복합 정렬은 앞 기준 값이 같은 행끼리만 다음 기준으로 정렬',
    '일반 SELECT 는 SELECT 절에 없는 컬럼으로도 정렬 가능. DISTINCT 나 GROUP BY 를 쓰면 불가',
    'Oracle 은 NULL 이 가장 큼(ASC 맨 뒤, DESC 맨 앞). SQL Server 는 가장 작음',
    'Oracle 은 NULLS FIRST / NULLS LAST 로 NULL 위치를 바꾼다',
    '문자 타입 숫자는 한 글자씩 비교해서 \'10\' < \'9\''
  ],
  cards: [
    { q: 'ORDER BY 에서 ASC/DESC 를 안 적으면?', a: 'ASC(오름차순).' },
    { q: '`ORDER BY A, B DESC` 에서 A 의 정렬 방향은?', a: '오름차순. DESC 는 B 에만 붙어요.' },
    { q: 'Oracle 에서 `ORDER BY COMM DESC` 의 첫 행은?', a: 'COMM 이 NULL 인 행. Oracle 은 NULL 을 가장 큰 값으로 봐요.' },
    { q: 'SQL Server 에서 오름차순 정렬하면 NULL 은 어디에?', a: '맨 앞. SQL Server 는 NULL 을 가장 작은 값으로 봐요.' },
    { q: '`SELECT DISTINCT JOB FROM EMP ORDER BY SAL` 은 실행될까요?', a: '오류. DISTINCT 를 쓰면 SELECT 절에 있는 것으로만 정렬할 수 있어요.' },
    { q: '문자 컬럼의 \'9\', \'10\', \'100\' 을 오름차순으로 정렬하면?', a: '\'10\', \'100\', \'9\'. 왼쪽 글자부터 비교하고, 앞부분이 같으면 짧은 쪽이 먼저예요.' },
    { q: 'SELECT 별칭을 쓸 수 있는 절은?', a: 'ORDER BY 뿐. SELECT 보다 뒤에 실행되는 절이 ORDER BY 하나라서예요.' },
    { q: '부서를 20, 30, 10 순서로 정렬하려면?', a: '`ORDER BY CASE DEPTNO WHEN 20 THEN 1 WHEN 30 THEN 2 ELSE 3 END`. CASE 로 순서 번호를 매겨 그 번호로 정렬해요.' }
  ],
  quiz: [
    { id: 'q6-01', level: 1, tag: 'ORDER BY 기본',
      q: 'ORDER BY 절에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        '정렬 방향을 생략하면 오름차순으로 정렬한다.',
        'ORDER BY 절에는 SELECT 절에서 정의한 별칭을 쓸 수 없다.',
        'SELECT 절에 적은 항목의 순번으로 정렬 기준을 지정할 수 있다.',
        'ORDER BY 절은 SELECT 문에서 가장 마지막에 실행된다.'
      ],
      answer: 2,
      why: 'ORDER BY 는 SELECT 보다 뒤에 실행되기 때문에 별칭을 쓸 수 있어요. 별칭을 못 쓰는 쪽은 WHERE, GROUP BY, HAVING 이에요.' },
    { id: 'q6-02', level: 1, tag: 'NULL 정렬',
      q: 'NULL 의 정렬에 대한 설명으로 적절한 것은?',
      choices: [
        'Oracle 에서 오름차순으로 정렬하면 NULL 이 맨 앞에 온다.',
        'Oracle 에서 내림차순으로 정렬하면 NULL 이 맨 뒤에 온다.',
        'SQL Server 에서 오름차순으로 정렬하면 NULL 이 맨 뒤에 온다.',
        'Oracle 에서 `ORDER BY COMM DESC NULLS LAST` 라고 쓰면 내림차순에서도 NULL 을 맨 뒤에 둘 수 있다.'
      ],
      answer: 4,
      why: 'Oracle 은 NULL 을 가장 큰 값으로 봐서 오름차순이면 맨 뒤, 내림차순이면 맨 앞이에요. SQL Server 는 반대라서 오름차순에서 맨 앞이에요. Oracle 은 NULLS FIRST, NULLS LAST 로 이 위치를 바꿀 수 있어요.' },
    { id: 'q6-03', level: 2, tag: '복합 정렬',
      q: '아래 테이블에서 SQL 을 실행했을 때 ENAME 이 출력되는 순서로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 20, 300], ['B', 10, 500], ['C', 20, 500], ['D', 10, 300], ['E', 30, 400]] }],
      code: `SELECT ENAME
  FROM EMP
 ORDER BY DEPTNO, SAL DESC;`,
      choices: ['B, D, C, A, E', 'D, B, A, C, E', 'E, C, A, B, D', 'B, C, E, D, A'],
      answer: 1,
      why: 'DEPTNO 는 방향을 안 적었으니 오름차순, SAL 만 내림차순이에요. 부서 10 안에서 B(500), D(300), 부서 20 안에서 C(500), A(300), 마지막이 부서 30 의 E 예요. 3번은 DESC 를 DEPTNO 에도 적용했을 때, 2번은 DESC 를 무시했을 때 나오는 순서예요.' },
    { id: 'q6-04', level: 2, tag: 'SELECT 에 없는 컬럼',
      q: 'EMP(ENAME, DEPTNO, JOB, SAL) 테이블에 대해 실행했을 때 오류가 발생하는 SQL 은?',
      choices: [
        { code: `SELECT ENAME, SAL
  FROM EMP
 ORDER BY DEPTNO;` },
        { code: `SELECT ENAME, SAL * 12 AS YSAL
  FROM EMP
 ORDER BY YSAL DESC;` },
        { code: `SELECT DISTINCT JOB
  FROM EMP
 ORDER BY SAL;` },
        { code: `SELECT DEPTNO, COUNT(*)
  FROM EMP
 GROUP BY DEPTNO
 ORDER BY COUNT(*) DESC, 1;` }
      ],
      answer: 3,
      why: 'DISTINCT 로 JOB 의 중복을 없애면 한 행에 SAL 이 여러 개 걸려 있어서 정렬 기준을 정할 수 없어요. 1번처럼 일반 SELECT 는 SELECT 절에 없는 컬럼으로 정렬해도 되고, 4번처럼 GROUP BY 뒤에는 집계함수와 그룹 컬럼(순번 1)으로 정렬할 수 있어요.' },
    { id: 'q6-05', level: 2, tag: '문자 정렬',
      q: 'CODE 컬럼의 타입이 VARCHAR2 일 때, 아래 SQL 의 결과 순서로 알맞은 것은?',
      tables: [{ name: 'T', head: ['CODE'], rows: [['5'], ['12'], ['100'], ['31']] }],
      code: `SELECT CODE
  FROM T
 ORDER BY CODE DESC;`,
      choices: ['100, 31, 12, 5', '5, 31, 12, 100', '5, 12, 31, 100', '100, 12, 31, 5'],
      answer: 2,
      why: '문자는 왼쪽 글자부터 비교해요. 오름차순은 \'100\', \'12\', \'31\', \'5\' 이고(\'100\' 과 \'12\' 는 둘째 글자 0 과 2 로 비교) 내림차순은 그 반대인 5, 31, 12, 100 이에요. 1번은 숫자로 보고 내림차순 했을 때, 4번은 문자 오름차순이에요.' },
    { id: 'q6-06', level: 3, tag: '순번과 NULL',
      q: '아래 테이블에서 SQL 을 실행했을 때 ENAME 이 출력되는 순서로 알맞은 것은? (Oracle)',
      tables: [{ name: 'EMP', head: ['ENAME', 'SAL', 'COMM'], rows: [['A', 300, null], ['B', 500, 100], ['C', 300, 200], ['D', 300, null], ['E', 500, null]] }],
      code: `SELECT ENAME, COMM, SAL
  FROM EMP
 ORDER BY 2 DESC, 3, 1 DESC;`,
      choices: ['A, D, E, C, B', 'C, B, D, A, E', 'B, E, C, D, A', 'D, A, E, C, B'],
      answer: 4,
      why: '순번은 SELECT 절 기준이라 2 는 COMM, 3 은 SAL, 1 은 ENAME 이에요. COMM 내림차순이면 Oracle 은 NULL 이 먼저라 A, D, E 가 앞에 와요. 그 셋을 SAL 오름차순으로 놓으면 A, D(300) 다음 E(500) 이고, 300 으로 같은 A 와 D 는 ENAME 내림차순이라 D, A 예요. 뒤는 COMM 200 인 C, 100 인 B 예요. 2번은 NULL 을 맨 뒤에 둔 경우, 3번은 순번을 테이블의 컬럼 순서로 읽은 경우예요.' },
    { id: 'q6-07', level: 3, tag: 'DBMS 차이',
      q: '아래 SQL 을 Oracle 과 SQL Server 에서 각각 실행했을 때 첫 번째 행의 ENAME 으로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'COMM'], rows: [['A', 100], ['B', null], ['C', 300]] }],
      code: `SELECT ENAME
  FROM EMP
 ORDER BY COMM DESC;`,
      choices: [
        'Oracle 은 B, SQL Server 는 C',
        'Oracle 은 C, SQL Server 는 B',
        '둘 다 B',
        '둘 다 C'
      ],
      answer: 1,
      why: 'Oracle 은 NULL 을 가장 큰 값으로 봐서 내림차순의 첫 행이 NULL 인 B 예요. SQL Server 는 NULL 을 가장 작은 값으로 봐서 내림차순이면 NULL 이 맨 뒤로 가고 첫 행은 300 인 C 예요.' }
  ]
});
