SQLD.add({
  id: 'q4',
  title: 'WHERE 절',
  minutes: 16,
  weight: 3,
  lead: 'WHERE 는 행을 거르는 절이에요. 시험은 조건을 주고 몇 건이 남는지 세게 하는데, AND 와 OR 의 순서, NOT IN 과 NULL, BETWEEN 의 끝 값에서 답이 갈립니다.',
  goals: [
    'AND 와 OR 가 섞인 조건을 우선순위대로 묶어 결과 건수를 센다',
    'IN, NOT IN, BETWEEN, LIKE 조건을 통과하는 행을 고른다',
    'NULL 이 낀 조건이 왜 행을 통과시키지 않는지 설명한다',
    'CHAR 와 VARCHAR2 의 비교 규칙, 형변환이 일어나는 방향을 말한다'
  ],
  blocks: [
    { t: 'h', x: 'WHERE 는 참인 행만 통과시켜요' },
    { t: 'p', x: '엑셀의 필터처럼, 조건에 맞는 행만 남기는 절이에요. FROM 다음에 쓰고, 행마다 조건을 따져서 결과가 ==참(TRUE)인 행만== 남깁니다. 거짓인 행과, NULL 때문에 알 수 없음(UNKNOWN)이 된 행은 모두 빠져요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'JOB', 'SAL', 'COMM'], rows: [
      ['KIM', 10, 'MANAGER', 2450, null],
      ['LEE', 10, 'CLERK', 1300, null],
      ['PARK', 20, 'CLERK', 1100, null],
      ['CHOI', 20, 'ANALYST', 3000, null],
      ['JUNG', 30, 'SALES', 1600, 300],
      ['HAN', 30, 'SALES', 1250, 500]
    ] },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 WHERE SAL >= 1600;`, result: { head: ['ENAME', 'SAL'], rows: [['KIM', 2450], ['CHOI', 3000], ['JUNG', 1600]] } },

    { t: 'h', x: '연산자 한눈에 보기' },
    { t: 'table', head: ['종류', '연산자', '뜻'], rows: [
      ['비교', '`=`, `>`, `>=`, `<`, `<=`', '같다, 크다, 크거나 같다, 작다, 작거나 같다'],
      ['부정 비교', '`!=`, `<>`, `^=`', '같지 않다. 셋 다 같은 뜻'],
      ['SQL 연산자', '`BETWEEN a AND b`', 'a 이상 b 이하'],
      ['SQL 연산자', '`IN (목록)`', '목록 중 하나와 같다'],
      ['SQL 연산자', '`LIKE \'패턴\'`', '패턴과 모양이 맞다'],
      ['SQL 연산자', '`IS NULL`', 'NULL 이다'],
      ['부정 SQL 연산자', '`NOT BETWEEN`, `NOT IN`, `NOT LIKE`, `IS NOT NULL`', '위 넷의 반대'],
      ['논리', '`AND`, `OR`, `NOT`', '둘 다 참, 하나라도 참, 뒤집기']
    ] },
    { t: 'p', x: '같지 않다는 `!=`, `<>`, `^=` 세 가지로 쓸 수 있고 `NOT SAL = 3000` 처럼 `NOT` 을 앞에 붙여도 돼요. `=!` 나 `><` 같은 연산자는 없습니다.' },

    { t: 'h', x: '문자와 날짜에는 작은따옴표' },
    { t: 'p', x: '조건에 문자나 날짜 값을 쓸 때는 반드시 작은따옴표로 감싸요. 숫자는 그냥 씁니다. 따옴표를 빼면 DBMS 가 그 낱말을 컬럼 이름으로 읽어요.' },
    { t: 'sql', code: `SELECT * FROM EMP WHERE ENAME = 'KIM';   -- 가능
SELECT * FROM EMP WHERE ENAME = KIM;     -- 오류: KIM 이라는 컬럼을 찾는다
SELECT * FROM EMP WHERE ENAME = "KIM";   -- 오류: 큰따옴표는 이름(식별자)을 감싼다
SELECT * FROM EMP WHERE ENAME = 'kim';   -- 실행되지만 0건` },
    { t: 'trap', title: '데이터 값은 대소문자를 가려요', x: 'SQL 의 예약어와 컬럼 이름은 대소문자를 구분하지 않지만, Oracle 에서 따옴표 안의 ==문자 값은 구분==해요. 테이블에 `KIM` 으로 들어 있으면 `WHERE ENAME = \'kim\'` 은 오류 없이 0건입니다. SQL Server 는 기본 설정에서 문자 값의 대소문자를 구분하지 않아요.' },

    { t: 'h', x: 'NOT, AND, OR 의 순서' },
    { t: 'p', x: '조건을 여러 개 이으면 계산 순서가 정해져 있어요. ==NOT 이 가장 먼저, 그다음 AND, 마지막이 OR== 입니다. 곱셈이 덧셈보다 먼저인 것처럼, AND 로 이은 조건이 먼저 한 덩어리로 묶여요.' },
    { t: 'table', head: ['순서', '연산자'], rows: [
      ['1', '괄호 `( )`'],
      ['2', '비교 연산자, SQL 연산자(`=`, `>`, `IN`, `LIKE`, `BETWEEN`, `IS NULL`)'],
      ['3', '`NOT`'],
      ['4', '`AND`'],
      ['5', '`OR`']
    ] },
    { t: 'sql', code: `SELECT ENAME, DEPTNO, JOB
  FROM EMP
 WHERE DEPTNO = 10
    OR DEPTNO = 20 AND JOB = 'CLERK';`, result: { head: ['ENAME', 'DEPTNO', 'JOB'], rows: [['KIM', 10, 'MANAGER'], ['LEE', 10, 'CLERK'], ['PARK', 20, 'CLERK']] },
      note: 'AND 가 먼저 묶여서 "10번 부서 전부" 또는 "20번이면서 CLERK" 이에요. 10번의 MANAGER 인 KIM 도 나옵니다.' },
    { t: 'sql', code: `SELECT ENAME, DEPTNO, JOB
  FROM EMP
 WHERE (DEPTNO = 10 OR DEPTNO = 20)
   AND JOB = 'CLERK';`, result: { head: ['ENAME', 'DEPTNO', 'JOB'], rows: [['LEE', 10, 'CLERK'], ['PARK', 20, 'CLERK']] },
      note: '괄호를 치면 "10번이나 20번" 중에서 CLERK 만 남아요.' },
    { t: 'trap', title: '왼쪽부터 읽으면 틀려요', x: '`A OR B AND C` 를 쓰인 순서대로 `(A OR B) AND C` 로 읽으면 건수가 달라져요. 괄호가 없으면 ==`A OR (B AND C)`== 입니다. 결과 건수를 묻는 문제는 이 두 가지 읽기에서 나오는 숫자를 보기로 나란히 놓아요. 문제를 보면 AND 부분에 먼저 괄호를 쳐 두고 세면 됩니다.' },

    { t: 'h', x: 'NULL 이 낀 조건' },
    { t: 'p', x: 'NULL 과 비교하면 결과는 참도 거짓도 아닌 UNKNOWN 이에요. 이 UNKNOWN 이 AND, OR, NOT 을 만나면 아래처럼 됩니다. 한쪽만 봐도 답이 정해지면 그 답, 아니면 UNKNOWN 이라고 기억하면 돼요.' },
    { t: 'table', head: ['식', '결과', '이유'], rows: [
      ['참 AND UNKNOWN', 'UNKNOWN', '나머지 한쪽이 참인지 몰라서 모른다'],
      ['거짓 AND UNKNOWN', '거짓', '한쪽이 거짓이면 AND 는 무조건 거짓'],
      ['참 OR UNKNOWN', '참', '한쪽이 참이면 OR 는 무조건 참'],
      ['거짓 OR UNKNOWN', 'UNKNOWN', '나머지 한쪽이 참인지 몰라서 모른다'],
      ['NOT UNKNOWN', 'UNKNOWN', '모르는 것을 뒤집어도 모른다']
    ] },
    { t: 'sql', code: `SELECT ENAME, SAL, COMM
  FROM EMP
 WHERE COMM > 400 OR SAL > 2000;`, result: { head: ['ENAME', 'SAL', 'COMM'], rows: [['KIM', 2450, null], ['CHOI', 3000, null], ['HAN', 1250, 500]] },
      note: 'KIM 은 COMM > 400 이 UNKNOWN 이지만 SAL > 2000 이 참이라 통과해요. LEE 와 PARK 은 UNKNOWN OR 거짓이라 빠집니다.' },
    { t: 'sql', code: `SELECT ENAME, COMM
  FROM EMP
 WHERE COMM <> 300;`, result: { head: ['ENAME', 'COMM'], rows: [['HAN', 500]] },
      note: 'COMM 이 NULL 인 네 명은 "300 이 아닌 행"에 들어가지 않아요. NULL <> 300 은 UNKNOWN 입니다.' },
    { t: 'trap', title: '"아닌 것"에 NULL 은 안 들어가요', x: '`WHERE COMM <> 300` 이나 `WHERE NOT (COMM = 300)` 의 결과에 COMM 이 NULL 인 행은 없어요. NULL 인 행까지 가져오려면 `WHERE COMM <> 300 OR COMM IS NULL` 처럼 따로 적어야 합니다. NULL 을 찾는 방법은 `IS NULL`, `IS NOT NULL` 뿐이고 `= NULL` 은 0건이에요.' },

    { t: 'h', x: 'IN 과 NOT IN' },
    { t: 'p', x: '`IN` 은 같은 컬럼에 대한 `=` 조건 여러 개를 OR 로 이은 것을 줄여 쓴 거예요. 목록의 문자와 날짜에는 작은따옴표를 붙입니다.' },
    { t: 'vs',
      a: { title: "JOB IN ('CLERK', 'SALES')", items: ["`JOB = 'CLERK' OR JOB = 'SALES'` 와 같다", '목록 중 하나만 같아도 참'] },
      b: { title: "JOB NOT IN ('CLERK', 'SALES')", items: ["`JOB <> 'CLERK' AND JOB <> 'SALES'` 와 같다", '목록의 모든 값과 달라야 참'] } },
    { t: 'sql', code: `SELECT ENAME, JOB
  FROM EMP
 WHERE JOB IN ('CLERK', 'SALES');`, result: { head: ['ENAME', 'JOB'], rows: [['LEE', 'CLERK'], ['PARK', 'CLERK'], ['JUNG', 'SALES'], ['HAN', 'SALES']] } },
    { t: 'p', x: '목록에 NULL 이 들어가면 `IN` 과 `NOT IN` 의 결과가 크게 갈려요. 풀어 쓴 모양으로 따져 보면 이유가 보입니다.' },
    { t: 'table', head: ['조건', '풀어 쓰면', '결과'], rows: [
      ['`DEPTNO IN (10, NULL)`', '`DEPTNO = 10 OR DEPTNO = NULL`', '10번 부서 2건. 뒤쪽은 UNKNOWN 이지만 OR 라서 앞이 참이면 통과'],
      ['`DEPTNO NOT IN (10, NULL)`', '`DEPTNO <> 10 AND DEPTNO <> NULL`', '==0건.== 뒤쪽이 항상 UNKNOWN 이라 AND 전체가 참이 될 수 없다']
    ] },
    { t: 'trap', title: 'NOT IN 목록에 NULL 이 있으면 0건', x: '`NOT IN (10, NULL)` 을 "10 이 아닌 행"으로 읽으면 4건이라고 답하게 돼요. 목록에 NULL 이 하나라도 있으면 `NOT IN` 은 ==한 건도 돌려주지 않아요.== 오류가 아니라 0건입니다. `IN` 은 목록의 NULL 을 무시하는 것처럼 동작해요. 다만 `IN (10, NULL)` 이 DEPTNO 가 NULL 인 행을 찾아 주지는 않습니다.' },

    { t: 'h', x: 'BETWEEN a AND b 는 양 끝을 포함해요' },
    { t: 'fig', caption: 'BETWEEN 은 두 끝 값을 포함하고, NOT BETWEEN 은 두 끝 값을 뺀 바깥쪽이에요.', svg: `<svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="30" class="tx-a" text-anchor="middle">SAL BETWEEN 1000 AND 2000</text>
  <text x="320" y="52" class="tx-s" text-anchor="middle">1000 이상 2000 이하 (양 끝 포함)</text>
  <line x1="60" y1="80" x2="580" y2="80" class="ln"/>
  <line x1="220" y1="80" x2="420" y2="80" class="ln-a"/>
  <circle cx="220" cy="80" r="7" class="bx-a"/>
  <circle cx="420" cy="80" r="7" class="bx-a"/>
  <text x="220" y="108" class="tx-m" text-anchor="middle">1000</text>
  <text x="420" y="108" class="tx-m" text-anchor="middle">2000</text>
  <line x1="204" y1="128" x2="72" y2="128" class="ln-r" marker-end="url(#arr-r)"/>
  <line x1="436" y1="128" x2="568" y2="128" class="ln-r" marker-end="url(#arr-r)"/>
  <text x="138" y="152" class="tx-r" text-anchor="middle">NOT BETWEEN: 1000 미만</text>
  <text x="502" y="152" class="tx-r" text-anchor="middle">NOT BETWEEN: 2000 초과</text>
</svg>` },
    { t: 'table', head: ['조건', '같은 뜻'], rows: [
      ['`SAL BETWEEN 1000 AND 2000`', '`SAL >= 1000 AND SAL <= 2000`'],
      ['`SAL NOT BETWEEN 1000 AND 2000`', '`SAL < 1000 OR SAL > 2000`']
    ] },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 WHERE SAL BETWEEN 1100 AND 1600;`, result: { head: ['ENAME', 'SAL'], rows: [['LEE', 1300], ['PARK', 1100], ['JUNG', 1600], ['HAN', 1250]] },
      note: '끝 값인 1100(PARK) 과 1600(JUNG) 도 포함돼요.' },
    { t: 'trap', title: '작은 값을 앞에', x: '`BETWEEN 1600 AND 1100` 처럼 큰 값을 앞에 쓰면 오류가 아니라 ==0건==이에요. `SAL >= 1600 AND SAL <= 1100` 을 만족하는 값이 없기 때문입니다. 그리고 끝 값을 빼고 세는 보기(`>` 와 `<`)가 오답으로 나와요. BETWEEN 은 숫자뿐 아니라 문자와 날짜에도 쓸 수 있습니다.' },

    { t: 'h', x: 'LIKE: % 와 _' },
    { t: 'p', x: '정확히 같지 않아도, 모양이 맞는 값을 찾을 때 써요. `%` 는 ==0글자 이상의 아무 글자==, `_` 는 ==정확히 한 글자==예요.' },
    { t: 'table', head: ['조건', '뜻', 'EMP 에서 통과하는 이름'], rows: [
      ["`ENAME LIKE 'K%'`", 'K 로 시작', 'KIM'],
      ["`ENAME LIKE '%N'`", 'N 으로 끝남', 'HAN'],
      ["`ENAME LIKE '%A%'`", 'A 가 어디든 들어 있음', 'PARK, HAN'],
      ["`ENAME LIKE '_A%'`", '둘째 글자가 A', 'PARK, HAN'],
      ["`ENAME LIKE '___'`", '정확히 세 글자', 'KIM, LEE, HAN'],
      ["`ENAME LIKE 'KIM'`", '와일드카드가 없으면 `=` 와 같다', 'KIM']
    ] },
    { t: 'trap', title: "'%A%' 와 '_A%' 는 달라요", x: '`\'%A%\'` 는 A 가 어느 자리에 있든 통과하고, `\'_A%\'` 는 A 가 ==정확히 둘째 자리==에 있어야 해요. 앞에 `_` 가 몇 개인지 세면 됩니다. `\'__A%\'` 는 셋째 글자가 A 예요. `%` 는 0글자도 되기 때문에 `\'A%\'` 는 A 한 글자짜리 값도 통과시켜요.' },
    { t: 'p', x: '값 안에 진짜 `%` 나 `_` 글자가 들어 있어서 그 글자 자체를 찾고 싶을 때는 `ESCAPE` 를 써요. 아무 글자나 하나 골라 ESCAPE 문자로 정하면, 그 글자 바로 뒤의 `%` 나 `_` 는 와일드카드가 아니라 보통 글자로 읽힙니다.' },
    { t: 'sql', code: `-- CODE 가 'A_' 로 시작하는 행 (둘째 글자가 진짜 밑줄)
SELECT *
  FROM ITEM
 WHERE CODE LIKE 'A#_%' ESCAPE '#';`, note: "ESCAPE 가 없는 `LIKE 'A_%'` 는 A 로 시작하는 두 글자 이상의 모든 값이에요. `AB01` 도 통과합니다." },

    { t: 'h', x: '문자를 비교하는 규칙' },
    { t: 'p', x: '`CHAR(5)` 컬럼에 `AB` 를 넣으면 남는 세 칸이 공백으로 채워져 `AB   ` 로 저장돼요. `VARCHAR2(5)` 는 넣은 그대로 `AB` 만 저장합니다. 그래서 둘을 비교할 때 규칙이 달라요.' },
    { t: 'table', head: ['비교하는 양쪽', '규칙', "`'AB'` 와 `'AB   '`"], rows: [
      ['양쪽 모두 CHAR (문자 상수 포함)', '짧은 쪽 뒤에 공백을 채워 길이를 맞춘 뒤 비교', '같다'],
      ['한쪽이라도 VARCHAR2', '공백도 글자 하나로 보고 그대로 비교', '다르다']
    ] },
    { t: 'p', x: '따옴표로 쓴 문자 상수는 CHAR 처럼 다뤄져요. 그래서 CHAR 컬럼을 `WHERE C1 = \'AB\'` 로 찾으면 뒤 공백이 맞춰져 조회됩니다. 반대로 VARCHAR2 컬럼에 `AB` 가 들어 있을 때 `WHERE V1 = \'AB \'` 는 공백 하나 때문에 조회되지 않아요.' },
    { t: 'trap', title: 'CHAR 컬럼 = VARCHAR2 컬럼', x: '`CHAR(5)` 컬럼의 `AB` 와 `VARCHAR2(5)` 컬럼의 `AB` 를 `WHERE C1 = V1` 로 비교하면 ==같지 않아요.== 한쪽이 VARCHAR2 라서 공백을 채우지 않고 `AB   ` 와 `AB` 를 그대로 비교하기 때문입니다. 글자를 비교할 때는 앞 글자부터 하나씩 비교하다가 처음 다른 글자에서 크기가 정해져요. 한쪽이 끝날 때까지 전부 같으면 ==더 긴 쪽이 커요.== 그래서 문자로 비교하면 `\'AB\' < \'ABC\'` 이고, `\'9\' > \'10\'` 입니다. 첫 글자 9 가 1 보다 크기 때문이에요.' },

    { t: 'h', x: '타입이 다른 값을 비교하면' },
    { t: 'p', x: '숫자 컬럼을 문자 상수와 비교해도 대부분 실행돼요. DBMS 가 한쪽을 알아서 바꾸는 묵시적 형변환이 일어나기 때문이에요. 바뀌는 방향이 정해져 있습니다. ==문자와 숫자가 만나면 문자가 숫자로, 문자와 날짜가 만나면 문자가 날짜로== 바뀌어요.' },
    { t: 'table', head: ['조건', '일어나는 일', '결과'], rows: [
      ["`WHERE DEPTNO = '10'` (DEPTNO 는 숫자)", "상수 `'10'` 이 숫자 10 으로 바뀐다", '10번 부서 조회'],
      ['`WHERE ENAME = 100` (ENAME 은 문자)', '컬럼 ENAME 값이 숫자로 바뀌려 한다', "`KIM` 을 숫자로 못 바꿔 오류"],
      ["`WHERE HIREDATE = '2026-11-14'` (HIREDATE 는 날짜)", '상수가 날짜로 바뀐다', '날짜 표시 형식 설정이 맞을 때만 조회']
    ] },
    { t: 'p', x: '컬럼 쪽이 변환되면 그 컬럼의 인덱스를 쓰지 못해 느려지고, 변환할 수 없는 값이 있으면 오류가 나요. 그래서 "비교하는 양쪽의 데이터 타입을 맞춰 쓰는 것이 좋다"가 옳은 설명으로 나옵니다. 날짜는 `TO_DATE(\'2026-11-14\', \'YYYY-MM-DD\')` 로 직접 바꿔 비교해요.' },

    { t: 'h', x: 'ROWNUM 맛보기' },
    { t: 'p', x: '`ROWNUM` 은 Oracle 이 결과 행에 1 부터 차례로 붙이는 번호예요. WHERE 를 통과한 행에만 번호가 붙고, 통과하지 못하면 다음 행이 다시 같은 번호를 받습니다. 그래서 1 을 건너뛰는 조건은 한 건도 나오지 않아요.' },
    { t: 'table', head: ['조건', '결과'], rows: [
      ['`WHERE ROWNUM <= 3`', '3건'],
      ['`WHERE ROWNUM < 3`', '2건'],
      ['`WHERE ROWNUM = 1`', '1건'],
      ['`WHERE ROWNUM = 2`', '0건. 첫 행이 1번을 받고 탈락하면 다음 행이 또 1번'],
      ['`WHERE ROWNUM > 1`', '0건']
    ] },
    { t: 'p', x: 'WHERE 가 ORDER BY 보다 먼저 실행되니 `ROWNUM` 은 정렬하기 전에 붙어요. 상위 N 건을 뽑는 방법은 Top N 쿼리 장에서 다룹니다. SQL Server 는 `ROWNUM` 대신 `SELECT TOP (3) …` 을 써요.' },
    { t: 'check', q: 'EMP 에서 WHERE NOT DEPTNO = 10 AND JOB = \'CLERK\' 를 통과하는 사람은 누구일까요?', a: 'PARK 한 명이에요. NOT 이 AND 보다 먼저라서 `(NOT DEPTNO = 10) AND JOB = \'CLERK\'` 로 묶입니다. 10번이 아닌 사람 중 CLERK 은 PARK 뿐이에요.' },
    { t: 'check', q: 'EMP 에서 WHERE COMM NOT IN (300, 500) 은 몇 건일까요?', a: '0건이에요. JUNG(300) 과 HAN(500) 은 목록에 있어서 빠지고, 나머지 네 명은 COMM 이 NULL 이라 비교 결과가 UNKNOWN 입니다. 목록에 NULL 이 없어도 컬럼 값이 NULL 인 행은 통과하지 못해요.' }
  ],
  keys: [
    'WHERE 는 조건이 참인 행만 남긴다. 거짓과 UNKNOWN 은 빠진다',
    '논리 연산자 우선순위는 NOT > AND > OR. A OR B AND C 는 A OR (B AND C)',
    'BETWEEN a AND b 는 a 이상 b 이하(양 끝 포함). 큰 값을 앞에 쓰면 0건',
    'IN 은 OR 로, NOT IN 은 AND 로 풀린다. NOT IN 목록에 NULL 이 있으면 0건',
    'LIKE 의 % 는 0글자 이상, _ 는 정확히 한 글자. 글자 자체를 찾을 때는 ESCAPE',
    '같지 않다는 !=, <>, ^=. 결과에 NULL 인 행은 들어가지 않는다',
    'CHAR 끼리는 공백을 채워 비교, 한쪽이라도 VARCHAR2 면 공백도 글자로 비교',
    '문자와 숫자를 비교하면 문자가 숫자로 바뀐다. 문자와 날짜 상수에는 작은따옴표'
  ],
  cards: [
    { q: 'NOT, AND, OR 의 계산 순서는?', a: 'NOT → AND → OR. 괄호가 있으면 괄호가 가장 먼저예요.' },
    { q: '`SAL BETWEEN 1000 AND 2000` 에 1000 과 2000 이 포함되나요?', a: '포함돼요. `SAL >= 1000 AND SAL <= 2000` 과 같습니다.' },
    { q: '`WHERE DEPTNO NOT IN (10, NULL)` 의 결과는?', a: '0건. `DEPTNO <> 10 AND DEPTNO <> NULL` 로 풀리는데 뒤쪽이 항상 UNKNOWN 이에요.' },
    { q: "`LIKE '_A%'` 는 어떤 값을 찾나요?", a: '둘째 글자가 A 인 값. `_` 는 정확히 한 글자, `%` 는 0글자 이상.' },
    { q: '값 안의 진짜 `_` 글자를 LIKE 로 찾으려면?', a: "`LIKE 'A#_%' ESCAPE '#'` 처럼 ESCAPE 문자를 정하고 그 뒤에 `_` 를 써요." },
    { q: '같지 않다를 뜻하는 연산자 세 가지는?', a: '`!=`, `<>`, `^=`.' },
    { q: "CHAR(5) 컬럼의 'AB' 와 VARCHAR2(5) 컬럼의 'AB' 를 = 로 비교하면?", a: '같지 않아요. 한쪽이 VARCHAR2 면 공백을 채우지 않고 그대로 비교합니다.' },
    { q: '`WHERE ROWNUM = 2` 의 결과는?', a: '0건. ROWNUM 은 조건을 통과한 행에만 1 부터 붙어서, 1 을 건너뛰는 조건은 아무것도 통과하지 못해요.' }
  ],
  quiz: [
    { id: 'q4-01', level: 1, tag: '연산자',
      q: 'WHERE 절의 연산자에 대한 설명으로 적절하지 않은 것은?',
      choices: [
        'NULL 인지 확인할 때는 `IS NULL` 을 쓴다.',
        '`BETWEEN 10 AND 20` 은 10 과 20 을 포함하지 않는다.',
        '`LIKE` 에서 `%` 는 0글자 이상의 문자열, `_` 는 한 글자를 뜻한다.',
        '문자 상수와 날짜 상수는 작은따옴표로 감싸야 한다.'
      ],
      answer: 2,
      why: '`BETWEEN 10 AND 20` 은 10 이상 20 이하라서 양 끝 값을 포함해요. 나머지는 모두 옳은 설명입니다.' },
    { id: 'q4-02', level: 1, tag: '연산자',
      q: '"SAL 이 1000 과 같지 않다"는 조건으로 쓸 수 없는 것은?',
      choices: [
        '`SAL != 1000`',
        '`SAL ^= 1000`',
        '`SAL =! 1000`',
        '`SAL <> 1000`'
      ],
      answer: 3,
      why: '같지 않다는 `!=`, `<>`, `^=` 세 가지예요. `=!` 는 없는 연산자라 오류가 납니다. 느낌표의 위치를 바꿔 놓은 보기를 조심하세요.' },
    { id: 'q4-03', level: 2, tag: '논리 연산자',
      q: '아래 테이블에서 SQL 을 실행했을 때 결과 건수는?',
      tables: [{ name: 'MEMBER', head: ['ID', 'GRADE', 'AMT'], rows: [[1, 'A', 100], [2, 'A', 300], [3, 'B', 200], [4, 'B', 50], [5, 'C', 400]] }],
      code: `SELECT *
  FROM MEMBER
 WHERE GRADE = 'A'
    OR GRADE = 'B' AND AMT >= 200;`,
      choices: ['2건', '3건', '4건', '5건'],
      answer: 2,
      why: 'AND 가 OR 보다 먼저 묶여요. "GRADE 가 A" 또는 "GRADE 가 B 이면서 AMT 가 200 이상"이라서 ID 1, 2(A 전부)와 ID 3 이 나와 3건입니다. 2건은 (A 또는 B) 이면서 200 이상으로, 왼쪽부터 묶었을 때 나오는 답이에요.' },
    { id: 'q4-04', level: 3, tag: 'IN 과 NULL',
      q: '아래 테이블에서 두 SQL 을 차례로 실행했을 때 결과 값을 순서대로 적은 것은?',
      tables: [{ name: 'M', head: ['ID', 'CODE'], rows: [[1, 'A'], [2, 'B'], [3, 'B'], [4, 'C'], [5, null]] }],
      code: `SELECT COUNT(*) FROM M WHERE CODE IN ('A', NULL);

SELECT COUNT(*) FROM M WHERE CODE NOT IN ('A', NULL);`,
      choices: ['2, 3', '1, 3', '1, 4', '1, 0'],
      answer: 4,
      why: "IN 은 `CODE = 'A' OR CODE = NULL` 이라 A 인 ID 1 한 건만 통과해요. CODE 가 NULL 인 ID 5 는 `= NULL` 이 UNKNOWN 이라 못 들어옵니다. NOT IN 은 `CODE <> 'A' AND CODE <> NULL` 인데 뒤쪽이 항상 UNKNOWN 이라 어떤 행도 참이 되지 못해 0건이에요. 3 은 NULL 을 무시하고 A 가 아닌 행만 셌을 때 나오는 값입니다." },
    { id: 'q4-05', level: 2, tag: 'LIKE',
      q: '아래 테이블에서 SQL 을 실행했을 때 조회되는 이름을 모두 고른 것은?',
      tables: [{ name: 'STUDENT', head: ['NAME'], rows: [['DANA'], ['ADAM'], ['MARK'], ['ALAN'], ['BRAD'], ['SARA']] }],
      code: `SELECT NAME
  FROM STUDENT
 WHERE NAME LIKE '_A%';`,
      choices: [
        'DANA, MARK, SARA',
        'ADAM, ALAN',
        'ADAM, ALAN, BRAD',
        'DANA, ADAM, MARK, ALAN, BRAD, SARA'
      ],
      answer: 1,
      why: "`_` 는 정확히 한 글자라서 `'_A%'` 는 둘째 글자가 A 인 이름이에요. DANA, MARK, SARA 가 해당합니다. 2번은 `'A%'`(A 로 시작), 3번은 `'__A%'`(셋째 글자가 A), 4번은 `'%A%'`(A 를 포함)일 때의 결과예요." },
    { id: 'q4-06', level: 3, tag: 'LIKE',
      q: '아래 테이블에서 SQL 을 실행했을 때 조회되는 CODE 를 모두 고른 것은?',
      tables: [{ name: 'ITEM', head: ['CODE'], rows: [['A_01'], ['AB01'], ['A_B1'], ['AX_1'], ['BA_1']] }],
      code: `SELECT CODE
  FROM ITEM
 WHERE CODE LIKE 'A#_%' ESCAPE '#';`,
      choices: [
        'A_01, AB01, A_B1, AX_1',
        'A_01, A_B1, AX_1',
        'A_01, A_B1',
        'A_01, A_B1, AX_1, BA_1'
      ],
      answer: 3,
      why: "ESCAPE 문자 `#` 바로 뒤의 `_` 는 와일드카드가 아니라 밑줄 글자 자체예요. 그래서 패턴은 \"A 로 시작하고 둘째 글자가 밑줄\"이고 A_01 과 A_B1 만 맞습니다. 1번은 ESCAPE 가 없는 `'A_%'` 의 결과이고, AX_1 은 밑줄이 셋째 자리라서 맞지 않아요." },
    { id: 'q4-07', level: 2, tag: 'BETWEEN',
      q: 'SAL 컬럼에 NULL 이 없을 때, 아래 SQL 과 결과가 같지 않은 것은?',
      code: `SELECT *
  FROM EMP
 WHERE SAL BETWEEN 1000 AND 2000;`,
      choices: [
        { code: `SELECT *
  FROM EMP
 WHERE SAL > 1000 AND SAL < 2000;` },
        { code: `SELECT *
  FROM EMP
 WHERE SAL >= 1000 AND SAL <= 2000;` },
        { code: `SELECT *
  FROM EMP
 WHERE NOT (SAL < 1000 OR SAL > 2000);` },
        { code: `SELECT *
  FROM EMP
 WHERE NOT (SAL NOT BETWEEN 1000 AND 2000);` }
      ],
      answer: 1,
      why: 'BETWEEN 은 양 끝을 포함하니 `>=` 와 `<=` 로 풀어야 해요. 1번은 SAL 이 정확히 1000 이거나 2000 인 행을 빼 버립니다. 3번은 "1000 미만이거나 2000 초과"의 반대라서 같은 범위이고, 4번은 NOT BETWEEN 을 다시 뒤집었으니 원래 조건과 같아요.' },
    { id: 'q4-08', level: 3, tag: '문자 비교',
      q: '아래 테이블에는 행이 하나 있고, C1 과 V1 에 똑같이 AB 를 입력했다. 다음 중 이 행이 조회되지 않는 SQL 은? (Oracle)',
      tables: [{ name: 'T', head: ['C1 (CHAR(5))', 'V1 (VARCHAR2(5))'], rows: [['AB', 'AB']] }],
      choices: [
        { code: `SELECT * FROM T WHERE C1 = 'AB';` },
        { code: `SELECT * FROM T WHERE V1 = 'AB';` },
        { code: `SELECT * FROM T WHERE C1 = 'AB   ';` },
        { code: `SELECT * FROM T WHERE C1 = V1;` }
      ],
      answer: 4,
      why: "CHAR(5) 인 C1 에는 뒤에 공백 세 칸이 채워져 저장돼요. 문자 상수와 비교할 때는 양쪽을 CHAR 로 보고 공백을 맞춰 비교하니 1번과 3번은 조회됩니다. V1 은 AB 그대로 저장돼 2번도 조회돼요. 4번은 한쪽이 VARCHAR2 라서 공백을 채우지 않고 `'AB   '` 와 `'AB'` 를 그대로 비교해 같지 않습니다." },
    { id: 'q4-09', level: 2, tag: 'ROWNUM',
      q: 'EMP 테이블에 6건이 들어 있다. 다음 중 실행했을 때 한 건도 조회되지 않는 SQL 은? (Oracle)',
      choices: [
        { code: `SELECT * FROM EMP WHERE ROWNUM = 1;` },
        { code: `SELECT * FROM EMP WHERE ROWNUM <= 3;` },
        { code: `SELECT * FROM EMP WHERE ROWNUM = 2;` },
        { code: `SELECT * FROM EMP WHERE ROWNUM < 2;` }
      ],
      answer: 3,
      why: 'ROWNUM 은 조건을 통과한 행에만 1 부터 차례로 붙어요. `ROWNUM = 2` 는 첫 행이 1번을 받고 탈락하고, 다음 행도 다시 1번을 받아 탈락하기를 되풀이해서 0건입니다. `= 1` 과 `< 2` 는 1건, `<= 3` 은 3건이 나와요.' }
  ]
});
