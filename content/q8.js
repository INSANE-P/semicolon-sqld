SQLD.add({
  id: 'q8',
  title: '표준 조인',
  minutes: 18,
  weight: 3,
  lead: 'LEFT, RIGHT, FULL 조인의 결과 건수, ON 과 WHERE 에 건 조건의 차이, (+) 를 표준 문법으로 바꾸기. 이 세 가지가 매회 번갈아 나오고, 한 회에 두세 문제씩 걸려 있어요.',
  goals: [
    'ON, USING, NATURAL JOIN 의 문법 제약을 구분해 오류가 나는 SQL 을 고른다',
    'INNER, LEFT, RIGHT, FULL, CROSS 조인의 결과 건수를 계산한다',
    '아우터 조인에서 조건을 ON 에 걸 때와 WHERE 에 걸 때의 결과 차이를 설명한다',
    'Oracle 의 (+) 조인을 ANSI 표준 문법으로 바꾼다'
  ],
  blocks: [
    { t: 'h', x: 'FROM 절에 조인을 적는 방식' },
    { t: 'p', x: '앞 장의 Oracle 문법은 조인 조건과 일반 조건이 WHERE 절에 섞여 있었어요. ANSI 표준 조인은 ==어떤 조인인지와 조인 조건을 FROM 절에== 적고, WHERE 절에는 일반 조건만 남겨요. Oracle 과 SQL Server 양쪽에서 쓸 수 있는 문법이에요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO'], rows: [['KIM', 10], ['LEE', 10], ['PARK', 20], ['CHOI', 40], ['JUNG', null]] },
    { t: 'data', name: 'DEPT', head: ['DEPTNO', 'DNAME', 'LOC'], rows: [[10, '영업', '서울'], [20, '개발', '부산'], [30, '인사', '서울']] },
    { t: 'sql', code: `-- Oracle 문법
SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO;

-- ANSI 표준 문법(같은 결과)
SELECT E.ENAME, D.DNAME
  FROM EMP E INNER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO;`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업'], ['PARK', '개발']] },
      note: 'INNER 는 생략할 수 있어요. 그냥 JOIN 이라고 쓰면 INNER JOIN 이에요.' },
    { t: 'p', x: 'INNER JOIN 에는 조인 조건을 적는 ON 절이나 USING 절이 꼭 따라와야 해요. 일반 조건이 더 있으면 ON 절 뒤에 WHERE 절을 이어서 적어요.' },

    { t: 'h', x: '조인 조건을 적는 세 가지 방법' },
    { t: 'table', head: ['', 'ON 절', 'USING 절', 'NATURAL JOIN'], rows: [
      ['조인 컬럼', '직접 적는다. 이름이 달라도 된다', '이름이 같은 컬럼 중 골라서 적는다', '==이름이 같은 컬럼 전부==를 자동으로 쓴다'],
      ['쓰는 모양', '`ON E.DEPTNO = D.DEPTNO` 괄호는 써도 되고 안 써도 된다', '`USING (DEPTNO)` 괄호 필수', '`EMP NATURAL JOIN DEPT` 조건을 적지 않는다'],
      ['조인 컬럼에 별칭', '이름이 같으면 붙여야 한다', '==붙이면 오류==', '==붙이면 오류=='],
      ['`SELECT *` 의 조인 컬럼', '양쪽 것이 각각 나온다(2번)', '한 번만 나온다', '한 번만 나온다'],
      ['= 아닌 조건', '가능', '불가(같은 값 조인만)', '불가(같은 값 조인만)']
    ] },
    { t: 'sql', code: `SELECT E.ENAME, DEPTNO, D.DNAME
  FROM EMP E JOIN DEPT D USING (DEPTNO);

SELECT ENAME, DEPTNO, DNAME
  FROM EMP NATURAL JOIN DEPT;`, result: { head: ['ENAME', 'DEPTNO', 'DNAME'], rows: [['KIM', 10, '영업'], ['LEE', 10, '영업'], ['PARK', 20, '개발']] },
      note: '두 SQL 의 결과가 같아요. 조인 컬럼 DEPTNO 앞에는 E. 이나 D. 을 붙이지 않았어요.' },
    { t: 'trap', title: 'USING 과 NATURAL 의 조인 컬럼에 별칭', x: 'USING 이나 NATURAL JOIN 으로 조인하면 조인 컬럼은 결과에서 하나로 합쳐져요. 어느 테이블 것도 아니게 돼서 `E.DEPTNO` 처럼 쓰면 오류예요. SELECT 절뿐 아니라 WHERE 절에서도 마찬가지예요. 조인에 쓰이지 않은 컬럼(ENAME, DNAME)에는 별칭을 붙여도 돼요. ON 절은 반대로, 이름이 같은 컬럼이면 별칭을 붙여야 해요.' },
    { t: 'trap', title: 'NATURAL JOIN 은 같은 이름 전부', x: '두 테이블에 이름이 같은 컬럼이 둘이면 NATURAL JOIN 은 둘 다 같아야 짝으로 봐요. 건수 문제에서는 조인 키 말고 NAME, CITY 처럼 이름이 겹치는 컬럼을 하나 더 넣어 둬요. 한 컬럼만 보고 세면 건수가 많게 나와요. NATURAL JOIN 에는 ON, USING 을 함께 쓸 수 없어요.' },
    { t: 'p', x: '`SELECT *` 의 컬럼 순서도 달라요. NATURAL JOIN 과 USING 은 조인 컬럼이 맨 앞에 한 번 나오고 그 뒤에 왼쪽 테이블, 오른쪽 테이블의 나머지 컬럼이 이어져요. 위 예에서 `SELECT * FROM EMP NATURAL JOIN DEPT` 의 컬럼은 DEPTNO, ENAME, DNAME, LOC 네 개예요. ON 으로 조인하면 ENAME, DEPTNO, DEPTNO, DNAME, LOC 다섯 개예요.' },

    { t: 'h', x: 'CROSS JOIN' },
    { t: 'p', x: '조인 조건 없이 모든 조합을 만드는 조인이에요. 앞 장의 카티시안 곱을 표준 문법으로 적은 거예요. `SELECT * FROM EMP CROSS JOIN DEPT` 는 5 × 3 = 15행이에요. ON 절을 적지 않아요.' },

    { t: 'h', x: 'OUTER JOIN: 짝이 없는 행을 남기기' },
    { t: 'p', x: 'INNER JOIN 은 짝이 있는 행만 남겨요. OUTER JOIN 은 ==기준 테이블의 행을 전부 남기고==, 짝이 없으면 반대쪽 컬럼을 NULL 로 채워요. 어느 쪽이 기준인지에 따라 LEFT, RIGHT, FULL 로 나뉘어요. OUTER 라는 낱말은 생략할 수 있어서 `LEFT JOIN` 이라고만 써도 돼요.' },
    { t: 'fig', caption: 'EMP 와 DEPT 를 DEPTNO 로 이은 그림. 선이 내부 조인 결과이고, 조인 종류에 따라 선이 없는 행이 더해져요.', svg: `<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <text x="205" y="26" class="tx-b" text-anchor="middle">EMP (왼쪽)</text>
  <text x="425" y="26" class="tx-b" text-anchor="middle">DEPT (오른쪽)</text>
  <rect x="130" y="40" width="150" height="28" class="bx"/><text x="205" y="59" class="tx-m" text-anchor="middle">KIM  10</text>
  <rect x="130" y="74" width="150" height="28" class="bx"/><text x="205" y="93" class="tx-m" text-anchor="middle">LEE  10</text>
  <rect x="130" y="108" width="150" height="28" class="bx"/><text x="205" y="127" class="tx-m" text-anchor="middle">PARK  20</text>
  <rect x="130" y="142" width="150" height="28" class="bx-y"/><text x="205" y="161" class="tx-m" text-anchor="middle">CHOI  40</text>
  <rect x="130" y="176" width="150" height="28" class="bx-y"/><text x="205" y="195" class="tx-m" text-anchor="middle">JUNG  NULL</text>
  <rect x="350" y="40" width="150" height="28" class="bx"/><text x="425" y="59" class="tx" text-anchor="middle">10  영업</text>
  <rect x="350" y="74" width="150" height="28" class="bx"/><text x="425" y="93" class="tx" text-anchor="middle">20  개발</text>
  <rect x="350" y="108" width="150" height="28" class="bx-y"/><text x="425" y="127" class="tx" text-anchor="middle">30  인사</text>
  <line x1="280" y1="54" x2="350" y2="54" class="ln-a"/>
  <line x1="280" y1="88" x2="350" y2="54" class="ln-a"/>
  <line x1="280" y1="122" x2="350" y2="88" class="ln-a"/>
  <text x="122" y="161" class="tx-s" text-anchor="end">왼쪽에만 있음</text>
  <text x="122" y="195" class="tx-s" text-anchor="end">왼쪽에만 있음</text>
  <text x="508" y="127" class="tx-s">오른쪽에만 있음</text>
  <rect x="16" y="228" width="140" height="58" class="bx"/>
  <text x="86" y="251" class="tx-b" text-anchor="middle">INNER</text>
  <text x="86" y="273" class="tx-s" text-anchor="middle">선 3 = 3행</text>
  <rect x="172" y="228" width="140" height="58" class="bx"/>
  <text x="242" y="251" class="tx-b" text-anchor="middle">LEFT</text>
  <text x="242" y="273" class="tx-s" text-anchor="middle">3 + 왼쪽 2 = 5행</text>
  <rect x="328" y="228" width="140" height="58" class="bx"/>
  <text x="398" y="251" class="tx-b" text-anchor="middle">RIGHT</text>
  <text x="398" y="273" class="tx-s" text-anchor="middle">3 + 오른쪽 1 = 4행</text>
  <rect x="484" y="228" width="140" height="58" class="bx-a"/>
  <text x="554" y="251" class="tx-b" text-anchor="middle">FULL</text>
  <text x="554" y="273" class="tx-s" text-anchor="middle">3 + 2 + 1 = 6행</text>
</svg>` },
    { t: 'table', head: ['조인', '남는 행', '위 예의 건수'], rows: [
      ['`A INNER JOIN B`', '짝이 있는 행만', '3'],
      ['`A LEFT OUTER JOIN B`', '짝이 있는 행 + A 에만 있는 행', '5'],
      ['`A RIGHT OUTER JOIN B`', '짝이 있는 행 + B 에만 있는 행', '4'],
      ['`A FULL OUTER JOIN B`', '짝이 있는 행 + A 에만 있는 행 + B 에만 있는 행', '6'],
      ['`A CROSS JOIN B`', '모든 조합', '15']
    ] },
    { t: 'sql', code: `SELECT E.ENAME, D.DNAME
  FROM EMP E FULL OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO;`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업'], ['PARK', '개발'], ['CHOI', null], ['JUNG', null], [null, '인사']] },
      note: 'LEFT 결과 5행과 RIGHT 결과 4행을 UNION(중복 제거) 한 것과 같아요. 겹치는 3행은 한 번만 나와요.' },
    { t: 'ul', items: [
      'LEFT 와 RIGHT 는 FROM 절에 적은 순서로 정해져요. `EMP E LEFT JOIN DEPT D` 와 `DEPT D RIGHT JOIN EMP E` 는 같은 결과예요.',
      'Oracle 문법은 테이블을 쉼표로 나열하므로 순서가 결과에 영향을 주지 않지만, ANSI 의 LEFT 와 RIGHT 는 순서가 곧 기준이에요.',
      '==FULL OUTER JOIN = LEFT OUTER JOIN ∪ RIGHT OUTER JOIN== (UNION 이라 중복은 한 번만).',
      '"LEFT 와 RIGHT 의 결과는 항상 다르다"는 틀린 설명이에요. 양쪽 모두 짝이 없는 행이 하나도 없으면 LEFT, RIGHT, FULL, INNER 의 결과가 전부 같아요.'
    ] },
    { t: 'trap', title: '아우터 조인 건수에서 중복 키', x: '아우터 조인이라고 건수가 "기준 테이블 행 수"로 고정되지 않아요. 짝이 여러 개인 행은 그만큼 늘어나요. 순서를 정해 두세요. 먼저 내부 조인 건수(키 값마다 왼쪽 건수 × 오른쪽 건수)를 세고, 그다음 짝이 없는 기준 쪽 행을 한 건씩 더해요. 키가 NULL 인 행은 늘 짝이 없는 행이에요.' },
    { t: 'check', q: 'A 의 K 가 1, 1, 2 이고 B 의 K 가 1, 1, 3 이에요. A LEFT JOIN B, A FULL OUTER JOIN B 는 각각 몇 건일까요?', a: '내부 조인은 값 1 에서 2 × 2 = 4건이에요. LEFT 는 A 에만 있는 2 를 더해 5건, FULL 은 B 에만 있는 3 까지 더해 6건이에요.' },

    { t: 'h', x: '아우터 조인 뒤에 COUNT 를 하면' },
    { t: 'p', x: '부서별 사원 수를 사원이 없는 부서까지 보려면 DEPT 를 기준으로 아우터 조인한 뒤 묶어요. 이때 무엇을 세느냐에 따라 사원이 없는 부서의 숫자가 달라져요.' },
    { t: 'sql', code: `SELECT D.DNAME, COUNT(*) AS C1, COUNT(E.ENAME) AS C2
  FROM DEPT D LEFT OUTER JOIN EMP E
    ON D.DEPTNO = E.DEPTNO
 GROUP BY D.DNAME;`, result: { head: ['DNAME', 'C1', 'C2'], rows: [['영업', 2, 2], ['개발', 1, 1], ['인사', 1, 0]] },
      note: '인사 부서는 짝이 없어도 NULL 로 채워진 한 행으로 남아 있어요. COUNT(*) 는 그 행을 세어 1, COUNT(E.ENAME) 은 NULL 이라 0 이에요.' },
    { t: 'trap', title: '어느 쪽 컬럼을 세는지', x: '`COUNT(*)` 와 기준 테이블 컬럼을 센 `COUNT(D.DEPTNO)` 는 짝이 없는 행도 세어요. 반대쪽 테이블 컬럼을 센 `COUNT(E.ENAME)` 은 그 행을 세지 않아요. 사원이 없는 부서를 0 으로 보이게 하려면 반대쪽 컬럼을 세야 해요. `COUNT(DISTINCT E.DEPTNO)` 도 NULL 은 빼고 서로 다른 값만 세어요.' },

    { t: 'h', x: 'ON 에 건 조건과 WHERE 에 건 조건' },
    { t: 'p', x: '"서울에 있는 부서"라는 조건을 붙이고 싶을 때, ON 절에 `AND` 로 붙일 수도 있고 WHERE 절에 쓸 수도 있어요. INNER JOIN 에서는 둘의 결과가 같아요. 아우터 조인에서는 달라져요.' },
    { t: 'vs',
      a: { title: 'ON 에 건 조건', items: ['조인할 때 "짝으로 인정할지"를 정한다', '조건에 안 맞으면 짝이 없는 것으로 처리', '기준 테이블의 행은 그래도 남는다(NULL 로 채움)'] },
      b: { title: 'WHERE 에 건 조건', items: ['조인이 끝난 결과에서 행을 거른다', '조건에 안 맞는 행은 결과에서 사라진다', 'NULL 로 채워진 행도 비교가 참이 아니라 사라진다'] } },
    { t: 'sql', code: `SELECT E.ENAME, D.DNAME
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO
   AND D.LOC = '서울';`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업'], ['PARK', null], ['CHOI', null], ['JUNG', null]] },
      note: 'PARK 의 부서(개발)는 부산이라 짝으로 인정받지 못했어요. 그래도 왼쪽 행이라 남고 DNAME 이 NULL 이에요. 5행.' },
    { t: 'sql', code: `SELECT E.ENAME, D.DNAME
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO
 WHERE D.LOC = '서울';`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업']] },
      note: '조인 결과 5행에서 LOC 가 서울인 행만 남겨요. PARK 은 부산, CHOI 와 JUNG 은 LOC 가 NULL 이라 탈락. 2행.' },
    { t: 'trap', title: 'WHERE 가 아우터 조인을 내부 조인으로 만든다', x: 'LEFT JOIN 뒤에 WHERE 로 오른쪽 테이블 컬럼에 `D.LOC = \'서울\'` 같은 값 비교 조건을 걸면, NULL 로 채워진 행이 전부 떨어져 나가서 결과가 INNER JOIN 에 같은 조건을 건 것과 같아져요. 문제는 같은 조건을 ON 에 건 SQL 과 WHERE 에 건 SQL 을 나란히 주고 건수를 물어요. ON 이면 기준 테이블 행이 다 남고, WHERE 면 줄어들어요.' },
    { t: 'trap', title: 'ON 에 건 기준 테이블 조건', x: '`FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO AND E.ENAME = \'KIM\'` 처럼 ON 에 왼쪽 테이블 조건을 걸어도 왼쪽 행은 하나도 줄지 않아요. KIM 만 부서와 짝지어지고 나머지 사원은 DNAME 이 NULL 인 채로 전부 나와요. 왼쪽 행을 줄이려면 WHERE 에 써야 해요.' },
    { t: 'check', q: '`EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO WHERE D.DEPTNO IS NULL` 은 무엇을 찾는 SQL 일까요?', a: '맞는 부서가 없는 사원이에요. 조인 뒤에 오른쪽이 NULL 로 채워진 행만 남기니 CHOI 와 JUNG 2행이 나와요. 이 조건을 ON 에 붙이면 뜻이 완전히 달라져요.' },

    { t: 'h', x: 'Oracle 의 (+) 를 표준 문법으로' },
    { t: 'p', x: '`(+)` 가 붙은 쪽은 NULL 로 채워지는 쪽이고, ==(+) 가 없는 쪽이 기준 테이블==이에요. 기준 테이블이 FROM 절에서 왼쪽에 있으면 LEFT, 오른쪽에 있으면 RIGHT 예요.' },
    { t: 'table', head: ['Oracle 문법 (FROM EMP E, DEPT D)', 'ANSI 표준 문법'], rows: [
      ['`WHERE E.DEPTNO = D.DEPTNO`', '`EMP E INNER JOIN DEPT D ON E.DEPTNO = D.DEPTNO`'],
      ['`WHERE E.DEPTNO = D.DEPTNO(+)`', '`EMP E LEFT OUTER JOIN DEPT D ON E.DEPTNO = D.DEPTNO`'],
      ['`WHERE E.DEPTNO(+) = D.DEPTNO`', '`EMP E RIGHT OUTER JOIN DEPT D ON E.DEPTNO = D.DEPTNO`\n(= `DEPT D LEFT OUTER JOIN EMP E ON …`)'],
      ['`WHERE E.DEPTNO = D.DEPTNO(+)`\n`AND D.LOC(+) = \'서울\'`', '`EMP E LEFT OUTER JOIN DEPT D`\n`ON E.DEPTNO = D.DEPTNO AND D.LOC = \'서울\'`'],
      ['`WHERE E.DEPTNO = D.DEPTNO(+)`\n`AND D.LOC = \'서울\'`', '`EMP E LEFT OUTER JOIN DEPT D ON E.DEPTNO = D.DEPTNO`\n`WHERE D.LOC = \'서울\'`'],
      ['양쪽에 (+)', '오류. FULL OUTER JOIN 은 표준 문법으로만 쓴다']
    ] },
    { t: 'p', x: '넷째와 다섯째 줄이 변환 문제의 승부처예요. 조건에 (+) 가 붙어 있으면 ON 절로 들어가는 조인 조건이고, (+) 가 없으면 조인이 끝난 뒤에 거르는 WHERE 조건이에요.' },
    { t: 'table', caption: 'DBMS 별로 쓸 수 있는 문법', head: ['문법', 'Oracle', 'SQL Server'], rows: [
      ['INNER / LEFT / RIGHT / FULL / CROSS JOIN, ON 절', '가능', '가능'],
      ['USING 절, NATURAL JOIN', '가능', '지원하지 않음'],
      ['`(+)` 아우터 조인', '가능', '지원하지 않음']
    ] },

    { t: 'h', x: '테이블 세 개를 이어서 조인' },
    { t: 'p', x: '표준 문법에서는 조인을 왼쪽부터 차례로 이어 적어요. 앞의 두 테이블을 조인한 결과가 다음 조인의 왼쪽이 돼요.' },
    { t: 'sql', code: `SELECT C.CNAME, O.ONO, P.AMT
  FROM CUST C
  LEFT OUTER JOIN ORD O ON C.CID = O.CID
  LEFT OUTER JOIN PAY P ON O.ONO = P.ONO;` },
    { t: 'trap', title: 'LEFT 뒤에 INNER 를 이으면', x: '첫 조인을 LEFT 로 해서 주문이 없는 고객을 살려 놓아도, 그 뒤 조인이 INNER 이고 조건이 `O.ONO = P.ONO` 면 주문이 없는 고객은 O.ONO 가 NULL 이라 짝을 못 찾고 다시 사라져요. 끝까지 남기려면 뒤의 조인도 LEFT 여야 해요. Oracle 문법으로는 `C.CID = O.CID(+) AND O.ONO = P.ONO(+)` 처럼 뒤 조건에도 (+) 를 붙이는 것과 같아요. 건수 문제는 조인을 한 단계씩 끊어서 중간 결과를 적어 가며 세세요.' }
  ],
  keys: [
    'USING 절과 NATURAL JOIN 의 조인 컬럼에는 테이블 이름이나 별칭을 못 붙인다. ON 절은 이름이 같으면 붙여야 한다',
    'NATURAL JOIN 은 이름이 같은 컬럼 전부로 조인하고, 조인 컬럼은 한 번만 출력한다',
    'LEFT 는 왼쪽 전부, RIGHT 는 오른쪽 전부, FULL 은 양쪽 전부. 짝이 없으면 NULL 로 채우고, 그 행은 COUNT(*) 에는 세어지지만 COUNT(반대쪽 컬럼) 에는 안 세어진다',
    'FULL OUTER JOIN = LEFT ∪ RIGHT = 내부 조인 건수 + 왼쪽에만 있는 행 + 오른쪽에만 있는 행',
    '아우터 조인 건수는 내부 조인 건수(값별 곱의 합)에 짝 없는 기준 쪽 행을 더한다',
    '아우터 조인에서 ON 의 조건은 짝을 정할 뿐 기준 행을 지우지 않는다. WHERE 의 조건은 조인 뒤에 행을 지운다',
    '(+) 가 없는 쪽이 기준 테이블. `A.K = B.K(+)` 는 A LEFT OUTER JOIN B',
    'CROSS JOIN 은 행 수의 곱. SQL Server 는 USING, NATURAL JOIN, (+) 를 지원하지 않는다'
  ],
  cards: [
    { q: '`EMP E JOIN DEPT D USING (DEPTNO)` 에서 `SELECT E.DEPTNO` 는?', a: '오류. USING 에 쓴 조인 컬럼에는 별칭을 붙일 수 없어요. `DEPTNO` 라고만 써요.' },
    { q: 'NATURAL JOIN 은 어떤 컬럼으로 조인하나요?', a: '두 테이블에서 이름이 같은 모든 컬럼. 전부 값이 같아야 짝이 돼요.' },
    { q: 'FULL OUTER JOIN 의 건수를 구하는 식은?', a: '내부 조인 건수 + 왼쪽에만 있는 행 + 오른쪽에만 있는 행. LEFT 결과와 RIGHT 결과의 UNION 과 같아요.' },
    { q: 'LEFT JOIN 에서 오른쪽 테이블 컬럼의 값 비교 조건을 WHERE 에 걸면?', a: 'NULL 로 채워진 행이 걸러져서 INNER JOIN 과 같은 결과가 돼요.' },
    { q: 'LEFT JOIN 의 ON 에 왼쪽 테이블 조건을 걸면 왼쪽 행이 줄어드나요?', a: '안 줄어요. 조건에 안 맞는 왼쪽 행은 짝 없이 NULL 로 채워져 그대로 나와요.' },
    { q: '`WHERE A.K(+) = B.K` 를 표준 문법으로 바꾸면?', a: '`A RIGHT OUTER JOIN B ON A.K = B.K`. (+) 가 없는 B 가 기준이에요.' },
    { q: '`WHERE A.K = B.K(+) AND B.X(+) = 1` 을 표준 문법으로 바꾸면?', a: '`A LEFT OUTER JOIN B ON A.K = B.K AND B.X = 1`. (+) 가 붙은 조건은 ON 절로 가요.' },
    { q: '`SELECT * FROM EMP NATURAL JOIN DEPT` 에서 DEPTNO 는 몇 번 나오나요?', a: '한 번, 맨 앞에. ON 으로 조인하면 양쪽 것이 두 번 나와요.' }
  ],
  quiz: [
    { id: 'q8-01', level: 1, tag: '조인 문법',
      q: 'ANSI 표준 조인에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'NATURAL JOIN 은 두 테이블에서 이름이 같은 모든 컬럼으로 조인한다.',
        'USING 절로 조인할 때 조인 컬럼은 `E.DEPTNO` 처럼 테이블 별칭을 붙여서 써야 한다.',
        'ON 절은 조인할 두 컬럼의 이름이 달라도 쓸 수 있다.',
        'CROSS JOIN 의 결과 건수는 두 테이블 행 수의 곱이다.'
      ],
      answer: 2,
      why: 'USING 절에 쓴 조인 컬럼에는 테이블 이름이나 별칭을 붙일 수 없어요. 붙이면 오류예요. NATURAL JOIN 의 조인 컬럼도 마찬가지예요.' },
    { id: 'q8-02', level: 1, tag: 'OUTER JOIN',
      q: 'OUTER JOIN 에 대한 설명으로 적절한 것은?',
      choices: [
        'LEFT OUTER JOIN 은 오른쪽 테이블의 모든 행을 결과에 남긴다.',
        'LEFT OUTER JOIN 에서 OUTER 는 생략할 수 없다.',
        'FULL OUTER JOIN 의 결과는 LEFT OUTER JOIN 결과와 RIGHT OUTER JOIN 결과를 UNION 한 것과 같다.',
        'Oracle 에서 조인 조건의 양쪽에 (+) 를 붙이면 FULL OUTER JOIN 이 된다.'
      ],
      answer: 3,
      why: 'FULL OUTER JOIN 은 양쪽 테이블의 행을 모두 남기는 조인이고, LEFT 결과와 RIGHT 결과를 중복 없이 합친 것과 같아요. LEFT 는 왼쪽 테이블이 기준이고, OUTER 는 생략할 수 있어요. (+) 를 양쪽에 붙이면 오류예요.' },
    { id: 'q8-03', level: 2, tag: '조인 건수',
      q: '아래 두 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'T1', head: ['K', 'V'], rows: [[1, 'a'], [2, 'b'], [2, 'c'], [3, 'd'], [null, 'e']] },
        { name: 'T2', head: ['K', 'W'], rows: [[2, 'x'], [3, 'y'], [3, 'z'], [4, 'w'], [5, 'u'], [null, 'v']] }],
      code: `SELECT COUNT(*)
  FROM T1 A LEFT OUTER JOIN T2 B
    ON A.K = B.K;`,
      choices: ['6', '4', '5', '7'],
      answer: 1,
      why: '내부 조인 건수는 값 2 가 2 × 1 = 2건, 값 3 이 1 × 2 = 2건으로 4건이에요. 여기에 짝이 없는 T1 의 1 과 NULL 행이 한 건씩 더해져 6건이에요. 4 는 INNER JOIN, 5 는 NULL 행을 버린 경우, 7 은 RIGHT OUTER JOIN(4 + T2 에만 있는 4, 5, NULL)의 건수예요.' },
    { id: 'q8-04', level: 2, tag: '조인 건수',
      q: '아래 두 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'A', head: ['K'], rows: [[1], [1], [2], [null]] },
        { name: 'B', head: ['K'], rows: [[1], [3], [null], [null]] }],
      code: `SELECT COUNT(*)
  FROM A FULL OUTER JOIN B
    ON A.K = B.K;`,
      choices: ['2', '4', '5', '7'],
      answer: 4,
      why: '짝이 있는 것은 값 1 뿐이고 2 × 1 = 2건이에요. A 에만 있는 행이 2 와 NULL 로 2건, B 에만 있는 행이 3, NULL, NULL 로 3건이에요. 2 + 2 + 3 = 7 이에요. NULL 끼리는 조인되지 않아서 양쪽의 NULL 행이 각각 따로 나와요. 4 는 LEFT, 5 는 RIGHT 의 건수예요.' },
    { id: 'q8-05', level: 2, tag: 'ON 과 WHERE',
      q: '아래 두 테이블에서 (가), (나) SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'EMP', head: ['ENAME', 'DEPTNO'], rows: [['A', 10], ['B', 20], ['C', 30], ['D', null]] },
        { name: 'DEPT', head: ['DEPTNO', 'LOC'], rows: [[10, '서울'], [20, '부산'], [40, '서울']] }],
      code: `-- (가)
SELECT COUNT(*)
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO AND D.LOC = '서울';

-- (나)
SELECT COUNT(*)
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO
 WHERE D.LOC = '서울';`,
      choices: ['(가) 1, (나) 1', '(가) 4, (나) 4', '(가) 4, (나) 1', '(가) 1, (나) 4'],
      answer: 3,
      why: '(가) 는 조건이 ON 에 있어서 짝을 정하는 데만 쓰여요. A 만 부서와 짝지어지고 B, C, D 는 NULL 로 채워진 채 남아 4건이에요. (나) 는 조인 결과 4건에서 LOC 가 서울인 행만 남겨요. B 는 부산, C 와 D 는 LOC 가 NULL 이라 떨어지고 A 한 건만 남아요.' },
    { id: 'q8-06', level: 2, tag: '(+) 변환',
      q: '아래 SQL 과 같은 결과를 내는 것은?',
      code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO(+) = D.DEPTNO;`,
      choices: [
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E RIGHT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM DEPT D RIGHT OUTER JOIN EMP E
    ON E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E INNER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO;` }
      ],
      answer: 1,
      why: '(+) 가 EMP 쪽에 붙었으니 (+) 가 없는 DEPT 가 기준이에요. FROM 절에서 DEPT 가 오른쪽에 있는 1번은 RIGHT OUTER JOIN 이라 DEPT 가 전부 나와요. 2번과 3번은 둘 다 EMP 가 기준인 조인이에요.' },
    { id: 'q8-07', level: 2, tag: 'USING 과 NATURAL',
      q: 'EMP(EMPNO, ENAME, DEPTNO), DEPT(DEPTNO, DNAME) 테이블에 대해 실행했을 때 오류가 발생하는 SQL 은? (Oracle)',
      choices: [
        { code: `SELECT ENAME, DEPTNO, DNAME
  FROM EMP NATURAL JOIN DEPT;` },
        { code: `SELECT E.ENAME, E.DEPTNO, D.DNAME
  FROM EMP E JOIN DEPT D USING (DEPTNO);` },
        { code: `SELECT E.ENAME, D.DEPTNO, D.DNAME
  FROM EMP E JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT E.ENAME, DEPTNO, D.DNAME
  FROM EMP E JOIN DEPT D USING (DEPTNO);` }
      ],
      answer: 2,
      why: 'USING 절에 쓴 조인 컬럼 DEPTNO 에 별칭을 붙인 `E.DEPTNO` 가 오류예요. 4번처럼 조인 컬럼은 그냥 쓰고, 조인에 쓰이지 않은 ENAME 과 DNAME 에는 별칭을 붙여도 돼요. ON 절로 조인한 3번은 반대로 별칭을 붙여야 해요.' },
    { id: 'q8-08', level: 2, tag: 'NATURAL JOIN',
      q: '아래 두 테이블에서 SQL 을 실행한 결과로 알맞은 것은? (Oracle)',
      tables: [
        { name: 'MEMBER', head: ['MNO', 'CITY', 'TEAM_ID'], rows: [[1, '서울', 10], [2, '부산', 20], [3, '부산', 10]] },
        { name: 'TEAM', head: ['TEAM_ID', 'CITY'], rows: [[10, '서울'], [20, '부산']] }],
      code: `SELECT COUNT(*)
  FROM MEMBER NATURAL JOIN TEAM;`,
      choices: ['3', '6', '1', '2'],
      answer: 4,
      why: '두 테이블에 이름이 같은 컬럼이 TEAM_ID 와 CITY 두 개라서 NATURAL JOIN 은 둘 다 같은 행만 짝으로 봐요. 회원 1 (서울, 10) 과 회원 2 (부산, 20) 는 짝이 있고, 회원 3 (부산, 10) 은 팀 10 의 CITY 가 서울이라 짝이 없어요. 3 은 TEAM_ID 만으로 조인했을 때의 건수예요.' },
    { id: 'q8-09', level: 3, tag: '(+) 변환',
      q: '아래 SQL 과 같은 결과를 내는 것은?',
      code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO(+)
   AND D.LOC(+) = '서울';`,
      choices: [
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO AND D.LOC = '서울';` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO
 WHERE D.LOC = '서울';` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E RIGHT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO AND D.LOC = '서울';` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E INNER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO AND D.LOC = '서울';` }
      ],
      answer: 1,
      why: '(+) 가 없는 EMP 가 기준이라 LEFT OUTER JOIN 이에요. `D.LOC(+) = \'서울\'` 처럼 (+) 가 붙은 조건은 조인 조건이라 ON 절로 들어가요. 2번은 조인 뒤에 WHERE 로 걸러서 서울 부서와 짝지어진 사원만 남아요. (+) 없이 `D.LOC = \'서울\'` 이라고 썼을 때의 변환이 2번이에요.' },
    { id: 'q8-10', level: 3, tag: '연속 조인',
      q: '아래 세 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'CUST', head: ['CID', 'CNAME'], rows: [[1, '가'], [2, '나'], [3, '다']] },
        { name: 'ORD', head: ['ONO', 'CID'], rows: [[101, 1], [102, 1], [103, 2]] },
        { name: 'PAY', head: ['ONO', 'AMT'], rows: [[101, 500], [103, 300]] }],
      code: `SELECT COUNT(*)
  FROM CUST C
  LEFT OUTER JOIN ORD O ON C.CID = O.CID
 INNER JOIN PAY P ON O.ONO = P.ONO;`,
      choices: ['4', '3', '2', '5'],
      answer: 3,
      why: '첫 조인(LEFT)의 결과는 (가, 101), (가, 102), (나, 103), (다, NULL) 4건이에요. 여기에 PAY 를 INNER JOIN 하면 101 과 103 만 짝이 있어 2건이 남아요. 주문이 없는 고객 다는 O.ONO 가 NULL 이라 짝을 찾지 못하고 빠져요. 둘째 조인도 LEFT 였다면 4건이에요.' },
    { id: 'q8-11', level: 3, tag: 'ON 과 WHERE',
      q: '아래 두 테이블에서 SQL 을 실행한 결과에 대한 설명으로 알맞은 것은?',
      tables: [
        { name: 'EMP', head: ['ENAME', 'DEPTNO', 'JOB'], rows: [['A', 10, 'MGR'], ['B', 10, 'CLERK'], ['C', 20, 'CLERK'], ['D', 30, 'MGR']] },
        { name: 'DEPT', head: ['DEPTNO', 'DNAME'], rows: [[10, '영업'], [20, '개발']] }],
      code: `SELECT E.ENAME, D.DNAME
  FROM EMP E LEFT OUTER JOIN DEPT D
    ON E.DEPTNO = D.DEPTNO
   AND E.JOB = 'MGR';`,
      choices: [
        '2행이 나오고, ENAME 은 A 와 D 이다.',
        '4행이 나오고, DNAME 이 NULL 이 아닌 행은 A 하나이다.',
        '4행이 나오고, DNAME 이 NULL 인 행은 D 하나이다.',
        '1행이 나오고, ENAME 은 A 이다.'
      ],
      answer: 2,
      why: 'ON 절의 조건은 짝을 정할 뿐 왼쪽 행을 지우지 않아요. A 는 JOB 이 MGR 이고 부서 10 이 있어 영업과 짝지어져요. B 와 C 는 JOB 조건에 안 맞고, D 는 부서 30 이 DEPT 에 없어서 셋 다 DNAME 이 NULL 인 채로 남아요. 1번은 `E.JOB = \'MGR\'` 을 WHERE 에 썼을 때의 결과예요.' },
    { id: 'q8-12', level: 3, tag: '아우터 조인과 COUNT',
      q: '아래 두 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'DEPT', head: ['DEPTNO'], rows: [[10], [20], [30]] },
        { name: 'EMP', head: ['ENAME', 'DEPTNO'], rows: [['A', 10], ['B', 10], ['C', 20], ['D', null]] }
      ],
      code: `SELECT COUNT(*) AS C1,
       COUNT(E.ENAME) AS C2,
       COUNT(DISTINCT E.DEPTNO) AS C3
  FROM DEPT D LEFT OUTER JOIN EMP E
    ON D.DEPTNO = E.DEPTNO;`,
      choices: [
        'C1 은 4, C2 는 3, C3 은 2',
        'C1 은 4, C2 는 4, C3 은 3',
        'C1 은 5, C2 는 4, C3 은 3',
        'C1 은 3, C2 는 3, C3 은 2'
      ],
      answer: 1,
      why: '조인 결과는 (10, A), (10, B), (20, C) 와 짝이 없는 부서 30 한 행으로 4행이에요. 부서 30 행은 EMP 쪽 컬럼이 전부 NULL 이라 COUNT(E.ENAME) 에서 빠져 3 이고, E.DEPTNO 의 서로 다른 값은 10 과 20 두 개예요. 사원 D 는 DEPTNO 가 NULL 이라 짝이 없고, 기준이 DEPT 라서 결과에 나오지 않아요. 4번은 INNER JOIN 일 때의 값이에요.' }
  ]
});
