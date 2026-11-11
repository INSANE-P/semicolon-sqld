SQLD.add({
  id: 'q7',
  title: '조인',
  minutes: 14,
  weight: 3,
  lead: '두 테이블을 주고 "조인 결과가 몇 건이냐"를 묻는 문제가 거의 매회 나와요. 키가 중복되면 곱해지고 NULL 은 짝이 없다는 두 가지만 지키면 셀 수 있습니다.',
  goals: [
    'EQUI JOIN 과 NON-EQUI JOIN 을 구분하고 결과를 따라간다',
    '중복 키와 NULL 키가 있는 두 테이블의 조인 결과 건수를 계산한다',
    '조인 조건이 빠졌을 때 생기는 카티시안 곱의 건수를 말한다',
    'Oracle 의 (+) 가 어느 쪽에 붙어야 하는지 정한다'
  ],
  blocks: [
    { t: 'h', x: '테이블이 나뉘어 있어서 조인이 필요해요' },
    { t: 'p', x: '사원 테이블에는 부서 번호만 있고 부서 이름은 부서 테이블에 있어요. "사원 이름과 부서 이름을 같이 보여 달라"고 하면 두 테이블의 행을 짝지어 한 행으로 붙여야 합니다. 이렇게 여러 테이블의 행을 연결하는 것이 조인이에요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['LEE', 10, 300], ['PARK', 20, 400], ['CHOI', 40, 200], ['JUNG', null, 350]] },
    { t: 'data', name: 'DEPT', head: ['DEPTNO', 'DNAME'], rows: [[10, '영업'], [20, '개발'], [30, '인사']] },
    { t: 'p', x: 'Oracle 의 전통 문법은 FROM 절에 테이블을 쉼표로 나열하고, 어떤 행끼리 짝인지를 WHERE 절에 적어요. 이 짝짓기 조건을 조인 조건이라고 합니다.' },
    { t: 'sql', code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO;`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업'], ['PARK', '개발']] },
      note: '부서 40 은 DEPT 에 없고, JUNG 은 부서가 NULL 이라 짝이 없어요. 인사 부서도 사원이 없어 빠집니다.' },
    { t: 'p', x: '이렇게 조건에 맞는 짝이 있는 행만 나오는 조인을 INNER JOIN(내부 조인)이라고 해요. Oracle 에서 따로 적지 않으면 기본이 이것입니다.' },
    { t: 'ul', items: [
      '두 테이블에 같은 이름의 컬럼이 있으면 `E.DEPTNO` 처럼 어느 테이블 것인지 밝혀야 해요. 그냥 `DEPTNO` 라고 쓰면 어느 쪽인지 몰라 오류입니다.',
      '한쪽에만 있는 컬럼(ENAME, DNAME)은 앞에 아무것도 안 붙여도 돼요.',
      'FROM 절에서 `EMP E` 처럼 별칭을 붙였으면 그 SQL 안에서는 `EMP.ENAME` 이 아니라 `E.ENAME` 으로 써야 해요. 별칭을 정한 뒤 원래 테이블 이름을 쓰면 오류입니다.'
    ] },

    { t: 'h', x: 'EQUI JOIN 과 NON-EQUI JOIN' },
    { t: 'vs',
      a: { title: 'EQUI JOIN (등가 조인)', items: ['조인 조건이 `=`', '값이 같은 행끼리 연결', '대부분 PK 와 FK 로 연결'] },
      b: { title: 'NON-EQUI JOIN (비등가 조인)', items: ['조인 조건이 `=` 가 아님', '`BETWEEN`, `>`, `<`, `>=`, `<=` 등', '값이 범위 안에 들어가는 행과 연결'] } },
    { t: 'p', x: '급여에 등급을 붙이는 경우가 NON-EQUI JOIN 의 대표예요. 등급 테이블에는 급여 값이 아니라 구간이 들어 있어서 `=` 로는 짝을 찾을 수 없습니다.' },
    { t: 'data', name: 'SALGRADE', head: ['GRADE', 'LOSAL', 'HISAL'], rows: [[1, 100, 299], [2, 300, 449], [3, 450, 600]] },
    { t: 'sql', code: `SELECT E.ENAME, E.SAL, S.GRADE
  FROM EMP E, SALGRADE S
 WHERE E.SAL BETWEEN S.LOSAL AND S.HISAL;`, result: { head: ['ENAME', 'SAL', 'GRADE'], rows: [['KIM', 500, 3], ['LEE', 300, 2], ['PARK', 400, 2], ['CHOI', 200, 1], ['JUNG', 350, 2]] },
      note: 'BETWEEN 은 양 끝 값을 포함해요. LEE 의 300 은 2등급 구간(300~449)에 들어갑니다.' },
    { t: 'trap', title: '구간 밖의 값', x: 'NON-EQUI JOIN 도 내부 조인이에요. 급여가 어느 구간에도 들지 않는 사원은 결과에서 빠집니다. 등급이 NULL 로 나오는 것이 아니에요. 구간이 겹치게 만들어져 있으면 한 사원이 두 등급과 짝지어져 두 행이 나옵니다.' },
    { t: 'p', x: '조인 조건에는 `LIKE` 나 `<>` 도 쓸 수 있어요. `WHERE E.ENAME LIKE P.PREFIX || \'%\'` 는 이름이 그 글자로 시작하는 행끼리 짝짓고, `WHERE A.K <> B.K` 는 값이 서로 다른 행끼리 전부 짝짓습니다. 풀 때는 왼쪽 행 하나를 잡고 오른쪽 행을 하나씩 대어 조건이 참인 짝을 세요.' },
    { t: 'trap', title: '<> 조인과 NULL', x: 'NULL 은 `=` 로도 짝이 안 되지만 `<>` 로도 짝이 안 돼요. NULL 과의 비교는 결과가 언제나 참이 아니기 때문입니다. A 의 K 가 1, 2, NULL 이고 B 의 K 가 1, 3, NULL 일 때 `A.K <> B.K` 의 결과는 (1, 3), (2, 1), (2, 3) 3건이에요. NULL 이 낀 짝은 하나도 없습니다.' },

    { t: 'h', x: '조인 조건이 빠지면: 카티시안 곱' },
    { t: 'p', x: '조인 조건 없이 `SELECT * FROM EMP, DEPT` 라고만 쓰면 EMP 의 모든 행이 DEPT 의 모든 행과 짝지어져요. 5행 × 3행 = 15행입니다. 이렇게 가능한 모든 조합이 나오는 것을 ==카티시안 곱==(Cartesian Product)이라고 해요.' },
    { t: 'p', x: '테이블이 늘어나면 조인 조건도 늘어야 해요. ==N 개 테이블을 조인하려면 조인 조건이 최소 N-1 개== 필요합니다. 3개를 조인하면서 조건을 1개만 적으면, 조건으로 이어진 두 테이블의 결과에 나머지 테이블이 통째로 곱해져요.' },
    { t: 'trap', title: 'N-1 을 N 으로 바꾼 보기', x: '"3개 테이블을 조인하려면 조인 조건이 최소 3개 필요하다"는 틀린 설명이에요. 최소 2개입니다. 계산 문제로 나오면 조건이 빠진 테이블의 행 수를 그대로 곱해 주세요.' },

    { t: 'h', x: '조인 결과 건수 세기' },
    { t: 'p', x: '건수 문제에는 일부러 키를 중복시키고 NULL 을 넣어 둬요. 규칙은 두 가지입니다.' },
    { t: 'ol', items: [
      '같은 키 값이 왼쪽에 m 건, 오른쪽에 n 건 있으면 그 값에서 ==m × n 건==이 나와요.',
      '==NULL 은 어떤 값과도 조인되지 않아요.== `NULL = NULL` 은 참이 아니라서 양쪽에 NULL 이 있어도 서로 짝이 되지 않습니다.'
    ] },
    { t: 'p', x: 'A 의 K 가 1, 1, 2, NULL 이고 B 의 K 가 1, 2, 2, 3, NULL 일 때 `A.K = B.K` 로 조인해 볼게요.' },
    { t: 'fig', caption: '같은 값끼리 선을 그어 보면 선의 수가 결과 건수예요. NULL 과 한쪽에만 있는 값에는 선이 없습니다.', svg: `<svg viewBox="0 0 640 265" xmlns="http://www.w3.org/2000/svg">
  <text x="200" y="30" class="tx-b" text-anchor="middle">A.K</text>
  <text x="440" y="30" class="tx-b" text-anchor="middle">B.K</text>
  <rect x="150" y="44" width="100" height="30" class="bx"/><text x="200" y="64" class="tx-m" text-anchor="middle">1</text>
  <rect x="150" y="80" width="100" height="30" class="bx"/><text x="200" y="100" class="tx-m" text-anchor="middle">1</text>
  <rect x="150" y="116" width="100" height="30" class="bx"/><text x="200" y="136" class="tx-m" text-anchor="middle">2</text>
  <rect x="150" y="152" width="100" height="30" class="bx-r"/><text x="200" y="172" class="tx-r" text-anchor="middle">NULL</text>
  <rect x="390" y="44" width="100" height="30" class="bx"/><text x="440" y="64" class="tx-m" text-anchor="middle">1</text>
  <rect x="390" y="80" width="100" height="30" class="bx"/><text x="440" y="100" class="tx-m" text-anchor="middle">2</text>
  <rect x="390" y="116" width="100" height="30" class="bx"/><text x="440" y="136" class="tx-m" text-anchor="middle">2</text>
  <rect x="390" y="152" width="100" height="30" class="bx-y"/><text x="440" y="172" class="tx-m" text-anchor="middle">3</text>
  <rect x="390" y="188" width="100" height="30" class="bx-r"/><text x="440" y="208" class="tx-r" text-anchor="middle">NULL</text>
  <line x1="250" y1="59" x2="390" y2="59" class="ln-a"/>
  <line x1="250" y1="95" x2="390" y2="59" class="ln-a"/>
  <line x1="250" y1="131" x2="390" y2="95" class="ln-a"/>
  <line x1="250" y1="131" x2="390" y2="131" class="ln-a"/>
  <text x="140" y="172" class="tx-s" text-anchor="end">NULL 은 짝이 없음</text>
  <text x="500" y="172" class="tx-s">A 에 없는 값</text>
  <text x="500" y="208" class="tx-s">NULL 은 짝이 없음</text>
  <text x="320" y="250" class="tx-a" text-anchor="middle">1 은 2 × 1 = 2건, 2 는 1 × 2 = 2건, 합쳐서 4건</text>
</svg>` },
    { t: 'tip', title: '값별로 표를 만들어 세요', x: '키 값마다 "왼쪽 몇 건, 오른쪽 몇 건"을 적고 곱한 다음 더하면 돼요. 위 예는 1: 2×1, 2: 1×2, 3: 0×1, NULL: 세지 않음. 한쪽이 0 건이면 그 값은 0 건입니다.' },
    { t: 'trap', title: 'NULL 끼리 짝지어 주기', x: '양쪽에 NULL 이 하나씩 있으면 한 건 더 세고 싶어지는데, 세면 안 돼요. 오답 보기에는 NULL 을 짝지었을 때의 건수가 꼭 들어 있습니다. GROUP BY 는 NULL 끼리 한 그룹으로 묶지만 조인은 NULL 끼리 연결하지 않아요.' },
    { t: 'check', q: 'T1 의 K 가 5, 5, 5 이고 T2 의 K 가 5, 5, NULL 이에요. `T1.K = T2.K` 로 조인하면 몇 건일까요?', a: '6건이에요. 값 5 가 왼쪽에 3건, 오른쪽에 2건이라 3 × 2 = 6 이고, T2 의 NULL 은 짝이 없어요.' },

    { t: 'h', x: 'SELF JOIN' },
    { t: 'p', x: '사원 테이블에 "내 관리자의 사번"이 들어 있다고 해 볼게요. 사원 이름 옆에 관리자 이름을 보여 주려면 사원 테이블을 한 번은 사원으로, 한 번은 관리자로 두 번 읽어 서로 조인해야 해요. 같은 테이블끼리 하는 조인이 SELF JOIN 입니다.' },
    { t: 'data', name: 'EMP2', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[1, 'KIM', null], [2, 'LEE', 1], [3, 'PARK', 1], [4, 'CHOI', 2]] },
    { t: 'sql', code: `SELECT E.ENAME AS 사원, M.ENAME AS 관리자
  FROM EMP2 E, EMP2 M
 WHERE E.MGR = M.EMPNO;`, result: { head: ['사원', '관리자'], rows: [['LEE', 'KIM'], ['PARK', 'KIM'], ['CHOI', 'LEE']] },
      note: 'KIM 은 MGR 이 NULL 이라 짝이 없어 빠져요. 4행이 아니라 3행입니다.' },
    { t: 'ul', items: [
      '같은 테이블 이름이 두 번 나오므로 ==별칭이 반드시 필요==해요. 컬럼 앞에도 전부 별칭을 붙여 구분합니다.',
      '조건의 방향을 잘 봐야 해요. `E.MGR = M.EMPNO` 는 "E 의 관리자가 M" 이고, E 가 사원 쪽입니다.'
    ] },
    { t: 'p', x: 'SELF JOIN 에 `>=` 같은 비등가 조건을 쓰면 누적 합계나 순번을 구할 수 있어요. 한 행에 "나보다 앞이거나 같은 행"을 전부 붙인 다음 묶어서 더하는 방식입니다.' },
    { t: 'data', name: 'DAILY', head: ['DT', 'AMT'], rows: [[1, 100], [2, 200], [3, 300]] },
    { t: 'sql', code: `SELECT A.DT, COUNT(*) AS 순번, SUM(B.AMT) AS 누적
  FROM DAILY A, DAILY B
 WHERE A.DT >= B.DT
 GROUP BY A.DT
 ORDER BY A.DT;`, result: { head: ['DT', '순번', '누적'], rows: [[1, 1, 100], [2, 2, 300], [3, 3, 600]] },
      note: '묶기 전 조인 결과는 1 + 2 + 3 = 6행이에요. DT 가 3 인 행에는 B 의 1, 2, 3 이 붙어 100 + 200 + 300 = 600 입니다. 더하는 값은 B 쪽이에요.' },

    { t: 'h', x: '짝이 없는 행도 보고 싶을 때: (+)' },
    { t: 'p', x: '맨 처음 조인에서 CHOI 와 JUNG 은 맞는 부서가 없어 빠졌어요. 짝이 없는 행도 결과에 남기고 빈자리를 NULL 로 채우는 조인을 OUTER JOIN(외부 조인)이라고 합니다. Oracle 전통 문법에서는 조인 조건에 `(+)` 를 붙여 표시해요.' },
    { t: 'sql', code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO(+);`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업'], ['PARK', '개발'], ['CHOI', null], ['JUNG', null]] },
      note: 'EMP 는 5행이 전부 나오고, 짝이 없는 CHOI 와 JUNG 의 DNAME 은 NULL 로 채워져요.' },
    { t: 'p', x: '`(+)` 는 ==데이터가 모자란 쪽, NULL 로 채워질 쪽==에 붙여요. 전부 나와야 하는 기준 테이블의 반대쪽입니다. 위에서는 사원이 전부 나와야 하니 DEPT 쪽 컬럼에 붙였어요.' },
    { t: 'table', head: ['조인 조건', '전부 나오는 테이블', '결과 건수(위 예)'], rows: [
      ['`E.DEPTNO = D.DEPTNO`', '없음(짝이 있는 행만)', '3'],
      ['`E.DEPTNO = D.DEPTNO(+)`', 'EMP', '5 (짝 3 + EMP 에만 있는 2)'],
      ['`E.DEPTNO(+) = D.DEPTNO`', 'DEPT', '4 (짝 3 + DEPT 에만 있는 인사 1)'],
      ['`E.DEPTNO(+) = D.DEPTNO(+)`', '오류', '(+) 는 양쪽에 동시에 붙일 수 없다']
    ] },
    { t: 'p', x: '테이블이 셋이면 (+) 를 끝까지 이어 붙여야 해요. 고객은 전부 나오게 하고 주문과 결제는 있으면 붙이는 SQL 은 이렇게 씁니다.' },
    { t: 'sql', code: `SELECT C.CNAME, O.ONO, P.AMT
  FROM CUST C, ORD O, PAY P
 WHERE C.CID = O.CID(+)
   AND O.ONO = P.ONO(+);`, note: '둘째 조건의 (+) 를 빼면 주문이 없는 고객은 O.ONO 가 NULL 이라 PAY 와 짝을 못 찾고 결과에서 사라져요.' },
    { t: 'trap', title: '(+) 를 기준 테이블에 붙이기', x: '"모든 사원이 나오게"라는 말을 보고 사원 쪽에 (+) 를 붙이면 반대가 돼요. (+) 가 붙은 쪽은 "없으면 NULL 로 채워 줄 쪽"입니다. 보기를 볼 때는 (+) 가 없는 쪽 테이블이 전부 나온다고 읽으세요. (+) 는 Oracle 전용 문법이라 SQL Server 에서는 쓸 수 없어요.' },
    { t: 'check', q: '사원이 한 명도 없는 부서까지 모두 나오게 하려면 `E.DEPTNO = D.DEPTNO` 의 어느 쪽에 (+) 를 붙일까요?', a: 'E 쪽이에요. `E.DEPTNO(+) = D.DEPTNO`. 부서(DEPT)가 전부 나와야 하니, 모자란 쪽인 사원(EMP) 컬럼에 붙입니다.' }
  ],
  keys: [
    'EQUI JOIN 은 = 조건, NON-EQUI JOIN 은 BETWEEN, >, < 같은 = 아닌 조건',
    'N 개 테이블 조인에는 조인 조건이 최소 N-1 개. 빠지면 카티시안 곱(행 수의 곱)',
    '조인 건수는 키 값마다 왼쪽 건수 × 오른쪽 건수를 더한다',
    'NULL 은 NULL 과도 조인되지 않는다. = 조인에서도 <> 조인에서도 짝이 없다',
    'SELF JOIN 은 같은 테이블을 두 번 쓰므로 별칭이 필수',
    'Oracle 의 (+) 는 NULL 로 채워질 쪽에 붙인다. (+) 가 없는 쪽이 전부 나온다',
    '(+) 는 양쪽에 동시에 못 붙인다',
    '양쪽 테이블에 같은 이름의 컬럼은 테이블 이름이나 별칭을 붙여야 한다. 별칭을 정했으면 별칭으로만 쓴다'
  ],
  cards: [
    { q: '4개 테이블을 조인할 때 필요한 조인 조건의 최소 개수는?', a: '3개. N-1 개예요.' },
    { q: '10행 테이블과 4행 테이블을 조인 조건 없이 조인하면?', a: '40행. 모든 조합이 나오는 카티시안 곱이에요.' },
    { q: '양쪽 테이블의 조인 컬럼에 NULL 이 하나씩 있으면 서로 조인될까요?', a: '안 돼요. NULL = NULL 은 참이 아니에요.' },
    { q: '키 값 7 이 왼쪽에 2건, 오른쪽에 3건이면 조인 결과는?', a: '6건. 2 × 3.' },
    { q: '`WHERE A.K = B.K(+)` 에서 전부 나오는 테이블은?', a: 'A. (+) 가 붙은 B 는 짝이 없으면 NULL 로 채워지는 쪽이에요.' },
    { q: '급여 구간으로 등급을 붙이는 조인의 종류는?', a: 'NON-EQUI JOIN. `SAL BETWEEN LOSAL AND HISAL` 처럼 = 가 아닌 조건을 써요.' },
    { q: 'SELF JOIN 에서 꼭 필요한 것은?', a: '테이블 별칭. 같은 테이블이 두 번 나와서 구분해야 해요.' },
    { q: '`FROM T A, T B WHERE A.DT >= B.DT GROUP BY A.DT` 에서 `SUM(B.AMT)` 는?', a: '누적 합계. A 의 한 행에 날짜가 같거나 앞선 B 의 행이 전부 붙어서 더해져요. `COUNT(*)` 는 순번이 됩니다.' }
  ],
  quiz: [
    { id: 'q7-01', level: 1, tag: '조인 개념',
      q: '조인에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'EQUI JOIN 은 조인 조건에 = 연산자를 쓰는 조인이다.',
        'NON-EQUI JOIN 은 BETWEEN, >, < 처럼 = 가 아닌 연산자로 조인한다.',
        'SELF JOIN 은 같은 테이블을 두 번 참조하므로 테이블 별칭을 써야 한다.',
        '3개의 테이블을 조인하려면 조인 조건이 최소 3개 필요하다.'
      ],
      answer: 4,
      why: 'N 개 테이블을 조인할 때 필요한 조인 조건은 최소 N-1 개예요. 3개 테이블이면 최소 2개입니다.' },
    { id: 'q7-02', level: 1, tag: '카티시안 곱',
      q: 'EMP 테이블이 14행, DEPT 테이블이 4행일 때 아래 SQL 의 결과 건수는?',
      code: `SELECT *
  FROM EMP, DEPT;`,
      choices: ['14', '56', '18', '4'],
      answer: 2,
      why: '조인 조건이 없으면 모든 조합이 나오는 카티시안 곱이에요. 14 × 4 = 56 입니다. 18 은 더했을 때 나오는 값이에요.' },
    { id: 'q7-03', level: 2, tag: '조인 건수',
      q: '아래 두 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'T1', head: ['COL'], rows: [[1], [1], [2], [3], [null]] },
        { name: 'T2', head: ['COL'], rows: [[1], [2], [2], [null], [4]] }],
      code: `SELECT COUNT(*)
  FROM T1 A, T2 B
 WHERE A.COL = B.COL;`,
      choices: ['4', '5', '2', '25'],
      answer: 1,
      why: '값 1 은 왼쪽 2건, 오른쪽 1건이라 2건이에요. 값 2 는 왼쪽 1건, 오른쪽 2건이라 2건입니다. 3 과 4 는 한쪽에만 있고 NULL 은 조인되지 않아 합계는 4 예요. 5 는 NULL 끼리 짝지었을 때, 25 는 조인 조건을 무시했을 때 나옵니다.' },
    { id: 'q7-04', level: 2, tag: '(+) 방향',
      q: '부서가 정해지지 않았거나 부서 테이블에 없는 부서 번호를 가진 사원까지 모든 사원이 출력되도록 할 때, 빈칸에 들어갈 조건으로 알맞은 것은? (Oracle)',
      code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE (          );`,
      choices: [
        '`E.DEPTNO(+) = D.DEPTNO`',
        '`E.DEPTNO(+) = D.DEPTNO(+)`',
        '`E.DEPTNO = D.DEPTNO(+)`',
        '`E.DEPTNO = D.DEPTNO`'
      ],
      answer: 3,
      why: '(+) 는 짝이 없을 때 NULL 로 채워질 쪽에 붙여요. 사원이 전부 나와야 하니 반대쪽인 DEPT 컬럼에 붙입니다. 1번은 부서가 전부 나오는 조인이고, 2번처럼 양쪽에 붙이면 오류예요. 4번은 내부 조인이라 짝이 없는 사원이 빠집니다.' },
    { id: 'q7-05', level: 2, tag: 'NON-EQUI JOIN',
      q: '아래 두 테이블에서 SQL 을 실행한 결과에 대한 설명으로 알맞은 것은?',
      tables: [
        { name: 'EMP', head: ['ENAME', 'SAL'], rows: [['A', 150], ['B', 300], ['C', 450], ['D', 700]] },
        { name: 'GRADE', head: ['GRD', 'LO', 'HI'], rows: [[1, 100, 299], [2, 300, 499], [3, 500, 599]] }],
      code: `SELECT E.ENAME, G.GRD
  FROM EMP E, GRADE G
 WHERE E.SAL BETWEEN G.LO AND G.HI;`,
      choices: [
        '4행이 나오고, D 의 GRD 는 NULL 이다.',
        '3행이 나오고, B 의 GRD 는 1 이다.',
        '3행이 나오고, B 와 C 의 GRD 는 모두 2 이다.',
        '12행이 나온다.'
      ],
      answer: 3,
      why: 'A(150) 는 1등급, B(300) 와 C(450) 는 300~499 구간이라 2등급이에요. BETWEEN 은 경계 값 300 을 포함합니다. D(700) 는 어느 구간에도 들지 않아 결과에서 빠져요. 내부 조인이라 NULL 로 채워져 나오지 않습니다. 12행은 조건이 없을 때의 카티시안 곱이에요.' },
    { id: 'q7-06', level: 3, tag: 'SELF JOIN',
      q: '아래 테이블에서 SQL 을 실행했을 때 출력되는 ENAME 을 모두 고른 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR', 'SAL'], rows: [[1, 'KIM', null, 900], [2, 'LEE', 1, 600], [3, 'PARK', 1, 950], [4, 'CHOI', 2, 700], [5, 'JUNG', 2, 500]] }],
      code: `SELECT E.ENAME
  FROM EMP E, EMP M
 WHERE E.MGR = M.EMPNO
   AND E.SAL > M.SAL;`,
      choices: ['PARK, CHOI', 'KIM, PARK, CHOI', 'KIM, LEE', 'PARK'],
      answer: 1,
      why: 'E 가 사원, M 이 그 관리자예요. PARK(950) 의 관리자 KIM 은 900, CHOI(700) 의 관리자 LEE 는 600 이라 둘이 조건에 맞습니다. LEE(600) 는 KIM(900) 보다 적고 JUNG(500) 은 LEE(600) 보다 적어요. KIM 은 MGR 이 NULL 이라 조인에서 빠집니다. 3번은 E 와 M 을 거꾸로 읽어 관리자 쪽 이름을 고른 경우예요.' },
    { id: 'q7-07', level: 3, tag: '조인 건수',
      q: '아래 두 테이블에서 SQL 을 실행한 결과로 알맞은 것은? (Oracle)',
      tables: [
        { name: 'T1', head: ['ID', 'K'], rows: [[1, 10], [2, 10], [3, 20], [4, null], [5, 40]] },
        { name: 'T2', head: ['K', 'NM'], rows: [[10, 'a'], [20, 'b'], [20, 'c'], [30, 'd'], [null, 'e']] }],
      code: `SELECT COUNT(*)
  FROM T1 A, T2 B
 WHERE A.K = B.K(+);`,
      choices: ['4', '6', '5', '8'],
      answer: 2,
      why: '(+) 가 B 쪽이라 T1 이 전부 나와요. 짝이 있는 건수는 10 이 2 × 1 = 2건, 20 이 1 × 2 = 2건으로 4건입니다. 여기에 짝이 없는 T1 의 NULL 행과 40 행이 한 건씩 더해져 6건이에요. 4 는 내부 조인, 5 는 NULL 행을 버린 경우, 8 은 T2 에만 있는 두 행까지 더한 경우입니다.' },
    { id: 'q7-08', level: 3, tag: '조인 조건 누락',
      q: '아래 세 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'CUST', head: ['CID'], rows: [[1], [2], [3]] },
        { name: 'ORD', head: ['ONO', 'CID'], rows: [[101, 1], [102, 1], [103, 2], [104, null]] },
        { name: 'ITEM', head: ['ONO', 'PNAME'], rows: [[101, '펜'], [101, '공책'], [103, '자'], [105, '풀']] }],
      code: `SELECT COUNT(*)
  FROM CUST C, ORD O, ITEM I
 WHERE C.CID = O.CID;`,
      choices: ['3', '48', '16', '12'],
      answer: 4,
      why: '테이블이 3개인데 조인 조건이 하나뿐이에요. CUST 와 ORD 는 조건으로 이어져 3건(101, 102, 103. CID 가 NULL 인 104 는 빠짐)이 되고, 조건이 없는 ITEM 4행이 여기에 통째로 곱해져 3 × 4 = 12건입니다. 48 은 세 테이블을 전부 곱한 값이고, 3 은 `O.ONO = I.ONO` 조건까지 있을 때의 건수예요.' },
    { id: 'q7-09', level: 2, tag: '컬럼 이름 구분',
      q: 'EMP(ENAME, DEPTNO), DEPT(DEPTNO, DNAME) 테이블에 대해 실행했을 때 오류가 발생하는 SQL 은? (Oracle)',
      choices: [
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT ENAME, DEPTNO, DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT ENAME, DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO;` },
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E, DEPT D
 WHERE E.DEPTNO = D.DEPTNO(+);` }
      ],
      answer: 2,
      why: 'DEPTNO 는 두 테이블에 모두 있어서 SELECT 절에 그냥 쓰면 어느 쪽인지 정할 수 없어 오류예요. `E.DEPTNO` 나 `D.DEPTNO` 로 써야 합니다. 3번의 ENAME 과 DNAME 은 한쪽에만 있는 컬럼이라 앞에 아무것도 안 붙여도 돼요.' },
    { id: 'q7-10', level: 3, tag: 'SELF JOIN',
      q: '아래 테이블에서 SQL 을 실행한 결과에 대한 설명으로 알맞은 것은?',
      tables: [{ name: 'T', head: ['ID', 'AMT'], rows: [[1, 10], [2, 20], [3, 30], [4, 40]] }],
      code: `SELECT A.ID, SUM(B.AMT) AS S
  FROM T A, T B
 WHERE A.ID >= B.ID
 GROUP BY A.ID
HAVING SUM(B.AMT) >= 30;`,
      choices: [
        '4행이 나오고, ID 가 1 인 행의 S 는 10 이다.',
        '2행이 나오고, ID 가 3 인 행의 S 는 30 이다.',
        '3행이 나오고, ID 가 4 인 행의 S 는 40 이다.',
        '3행이 나오고, ID 가 3 인 행의 S 는 60 이다.'
      ],
      answer: 4,
      why: 'A 의 한 행에 ID 가 같거나 작은 B 의 행이 전부 붙어요. A.ID 별로 B.AMT 를 더하면 1 은 10, 2 는 10 + 20 = 30, 3 은 60, 4 는 100 으로 누적 합계가 됩니다. HAVING 에서 10 인 ID 1 이 빠져 3행이에요. 2번은 누적하지 않고 자기 AMT 만 본 경우입니다.' }
  ]
});
