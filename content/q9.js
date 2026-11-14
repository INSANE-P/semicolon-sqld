SQLD.add({
  id: 'q9',
  title: '서브쿼리',
  minutes: 20,
  weight: 3,
  lead: '서브쿼리는 거의 매회 두세 문제가 나와요. 이름과 위치를 묻는 문제, ANY 와 ALL 을 바꿔 읽는 문제, NOT IN 에 NULL 이 섞인 결과를 세는 문제가 많아요.',
  goals: [
    '서브쿼리를 쓸 수 있는 위치와 위치별 이름을 말할 수 있다',
    '단일행 연산자와 다중행 연산자(IN, ANY, ALL, EXISTS)를 구분하고 결과를 계산한다',
    '연관 서브쿼리가 메인쿼리 한 행마다 어떻게 도는지 따라갈 수 있다',
    'NOT IN 과 NULL, 스칼라 서브쿼리의 0건과 여러 건이 어떤 결과를 내는지 안다'
  ],
  blocks: [
    { t: 'h', x: '쿼리 안에 쿼리가 필요한 때' },
    { t: 'p', x: '"평균 급여보다 많이 받는 사원"을 뽑고 싶다고 해 볼게요. `WHERE SAL > AVG(SAL)` 이라고 쓰고 싶지만 WHERE 절에는 집계 함수를 쓸 수 없어서 오류가 나요. 평균을 먼저 구해 두고, 그 값을 비교 자리에 넣어야 해요.' },
    { t: 'p', x: '이렇게 ==SQL 문 안에 괄호로 감싸 넣은 또 다른 SELECT 문==을 서브쿼리라고 해요. 바깥쪽은 메인쿼리라고 불러요. 이 장의 예시는 아래 두 테이블로 따라갈게요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['LEE', 10, 300], ['PARK', 20, 400], ['CHOI', 20, 200], ['JUNG', 30, 600]] },
    { t: 'data', name: 'DEPT', head: ['DEPTNO', 'DNAME'], rows: [[10, '영업'], [20, '개발'], [30, '인사'], [40, '총무']] },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 WHERE SAL > (SELECT AVG(SAL) FROM EMP);`, result: { head: ['ENAME', 'SAL'], rows: [['KIM', 500], ['JUNG', 600]] },
      note: '서브쿼리가 먼저 평균 400 을 구하고, 메인쿼리는 SAL > 400 으로 걸러요.' },

    { t: 'h', x: '어디에 쓸 수 있고, 뭐라고 부르나' },
    { t: 'p', x: '서브쿼리는 SELECT 문의 거의 모든 절에 들어갈 수 있어요. 시험은 "쓸 수 없는 곳"을 묻는데, 답은 늘 ==GROUP BY 절==이에요.' },
    { t: 'fig', caption: 'SELECT 문에서 서브쿼리가 들어가는 자리와 이름. GROUP BY 절만 안 돼요.', svg: `<svg viewBox="0 0 640 248" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="14" width="140" height="30" class="bx"/><text x="100" y="34" class="tx-m" text-anchor="middle">SELECT</text>
  <rect x="190" y="14" width="170" height="30" class="bx-a"/><text x="275" y="34" class="tx-a" text-anchor="middle">스칼라 서브쿼리</text>
  <text x="376" y="34" class="tx-s">한 행 한 컬럼만 돌려준다</text>
  <rect x="30" y="52" width="140" height="30" class="bx"/><text x="100" y="72" class="tx-m" text-anchor="middle">FROM</text>
  <rect x="190" y="52" width="170" height="30" class="bx-a"/><text x="275" y="72" class="tx-a" text-anchor="middle">인라인 뷰</text>
  <text x="376" y="72" class="tx-s">결과를 테이블처럼 쓴다</text>
  <rect x="30" y="90" width="140" height="30" class="bx"/><text x="100" y="110" class="tx-m" text-anchor="middle">WHERE</text>
  <rect x="190" y="90" width="170" height="30" class="bx-a"/><text x="275" y="110" class="tx-a" text-anchor="middle">중첩 서브쿼리</text>
  <text x="376" y="110" class="tx-s">비교할 값을 넘겨준다</text>
  <rect x="30" y="128" width="140" height="30" class="bx"/><text x="100" y="148" class="tx-m" text-anchor="middle">GROUP BY</text>
  <rect x="190" y="128" width="170" height="30" class="bx-r"/><text x="275" y="148" class="tx-r" text-anchor="middle">쓸 수 없음</text>
  <text x="376" y="148" class="tx-s">시험이 고르라는 곳</text>
  <rect x="30" y="166" width="140" height="30" class="bx"/><text x="100" y="186" class="tx-m" text-anchor="middle">HAVING</text>
  <rect x="190" y="166" width="170" height="30" class="bx-a"/><text x="275" y="186" class="tx-a" text-anchor="middle">중첩 서브쿼리</text>
  <text x="376" y="186" class="tx-s">집계 결과와 비교할 값을 넘긴다</text>
  <rect x="30" y="204" width="140" height="30" class="bx"/><text x="100" y="224" class="tx-m" text-anchor="middle">ORDER BY</text>
  <rect x="190" y="204" width="170" height="30" class="bx"/><text x="275" y="224" class="tx" text-anchor="middle">쓸 수 있음</text>
  <text x="376" y="224" class="tx-s">정렬 기준 값으로 쓴다</text>
</svg>` },
    { t: 'p', x: 'SELECT 문 말고 DML 에도 들어가요. `INSERT` 의 VALUES 절, `UPDATE` 의 SET 절과 WHERE 절, `DELETE` 의 WHERE 절에 쓸 수 있어요.' },
    { t: 'sql', code: `UPDATE EMP E
   SET SAL = (SELECT MAX(SAL) FROM EMP WHERE DEPTNO = E.DEPTNO)
 WHERE ENAME = 'LEE';`, note: 'LEE 의 급여를 자기 부서의 최고 급여 500 으로 바꿔요. SET 절에 들어간 서브쿼리예요.' },
    { t: 'p', x: '분류 기준이 세 가지라 이름이 여러 개 붙어요. 한 서브쿼리가 "WHERE 절에 있는, 연관, 단일행 서브쿼리"처럼 세 이름을 동시에 가질 수 있어요.' },
    { t: 'table', head: ['나누는 기준', '이름', '뜻'], rows: [
      ['위치', '스칼라 서브쿼리', 'SELECT 절에 쓴다. 컬럼 하나처럼 쓴다'],
      ['위치', '인라인 뷰', 'FROM 절에 쓴다. 테이블처럼 쓴다'],
      ['위치', '중첩 서브쿼리', 'WHERE 절, HAVING 절에 쓴다'],
      ['메인쿼리와의 관계', '비연관 서브쿼리', '서브쿼리 안에 메인쿼리 컬럼이 없다. 혼자 한 번 실행해서 값을 넘긴다'],
      ['메인쿼리와의 관계', '연관 서브쿼리', '서브쿼리 안에 메인쿼리 컬럼이 있다. 메인쿼리 행마다 다시 계산한다'],
      ['돌려주는 모양', '단일행 서브쿼리', '결과가 한 행 이하'],
      ['돌려주는 모양', '다중행 서브쿼리', '결과가 여러 행'],
      ['돌려주는 모양', '다중컬럼 서브쿼리', '결과가 여러 컬럼']
    ] },
    { t: 'trap', title: '스칼라와 인라인 뷰를 바꿔 놓기', x: '"FROM 절에 쓰는 서브쿼리를 스칼라 서브쿼리라고 한다"처럼 이름과 위치를 엇갈리게 적은 보기가 나와요. SELECT 절은 스칼라, FROM 절은 인라인 뷰, WHERE 절과 HAVING 절은 중첩 서브쿼리예요. 그리고 서브쿼리를 쓸 수 없는 절은 GROUP BY 하나예요.' },

    { t: 'h', x: '한 행이 올 때와 여러 행이 올 때' },
    { t: 'p', x: '`SAL > (서브쿼리)` 에서 서브쿼리가 값 하나를 돌려주면 그냥 비교하면 돼요. 그런데 값이 여러 개 오면 `>` 는 무엇과 비교해야 할지 몰라서 오류가 나요. 그래서 여러 행을 받을 수 있는 연산자가 따로 있어요.' },
    { t: 'table', head: ['종류', '연산자', '서브쿼리 결과'], rows: [
      ['단일행 연산자', '`=`, `<>`, `>`, `>=`, `<`, `<=`', '반드시 한 행 이하여야 한다'],
      ['다중행 연산자', '`IN`, `ANY`(`SOME`), `ALL`, `EXISTS`', '여러 행이어도 된다. 한 행이어도 된다']
    ] },
    { t: 'trap', title: '단일행 연산자에 여러 행이 오면 오류', x: '`WHERE SAL = (SELECT MAX(SAL) FROM EMP GROUP BY DEPTNO)` 는 부서가 3개라 서브쿼리가 3행을 돌려줘서 실행 중에 오류가 나요. `=` 를 `IN` 으로 바꾸거나 서브쿼리가 한 행만 돌려주게 고쳐야 해요. 반대로 다중행 연산자에 한 행이 오는 것은 문제가 없어요.' },
    { t: 'p', x: 'ANY 와 ALL 은 비교 연산자 뒤에 붙여 써요. ANY 는 "하나라도 만족하면", ALL 은 "전부 만족해야"예요. SOME 은 ANY 와 같은 말이에요. 20번 부서의 급여 400, 200 과 비교해 볼게요.' },
    { t: 'table', head: ['조건', '바꿔 읽기', '뜻', 'EMP 에서 통과하는 사원'], rows: [
      ['`SAL > ANY (400, 200)`', '==최솟값==보다 크다', '200 보다 크면 된다', 'KIM, LEE, PARK, JUNG'],
      ['`SAL > ALL (400, 200)`', '==최댓값==보다 크다', '400 보다 커야 한다', 'KIM, JUNG'],
      ['`SAL < ANY (400, 200)`', '최댓값보다 작다', '400 보다 작으면 된다', 'LEE, CHOI'],
      ['`SAL < ALL (400, 200)`', '최솟값보다 작다', '200 보다 작아야 한다', '없음'],
      ['`SAL = ANY (400, 200)`', '`IN` 과 같다', '하나와 같으면 된다', 'PARK, CHOI'],
      ['`SAL <> ALL (400, 200)`', '`NOT IN` 과 같다', '전부와 달라야 한다', 'KIM, LEE, JUNG']
    ] },
    { t: 'fig', caption: '서브쿼리가 200 과 400 을 돌려줄 때 네 조건이 통과시키는 범위.', svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
  <text x="512" y="30" class="tx-a" text-anchor="middle">&gt; ALL  최댓값보다 큼</text>
  <line x1="420" y1="40" x2="590" y2="40" class="ln-a" marker-end="url(#arr-a)"/>
  <text x="320" y="62" class="tx-a" text-anchor="middle">&gt; ANY  최솟값보다 큼</text>
  <line x1="220" y1="72" x2="590" y2="72" class="ln-a" marker-end="url(#arr-a)"/>
  <line x1="40" y1="100" x2="600" y2="100" class="ln"/>
  <line x1="220" y1="40" x2="220" y2="184" class="ln-d"/>
  <line x1="420" y1="40" x2="420" y2="184" class="ln-d"/>
  <circle cx="220" cy="100" r="6" class="bx-a"/>
  <circle cx="420" cy="100" r="6" class="bx-a"/>
  <text x="244" y="120" class="tx-m" text-anchor="middle">200</text>
  <text x="444" y="120" class="tx-m" text-anchor="middle">400</text>
  <text x="320" y="140" class="tx-r" text-anchor="middle">&lt; ANY  최댓값보다 작음</text>
  <line x1="420" y1="150" x2="50" y2="150" class="ln-r" marker-end="url(#arr-r)"/>
  <text x="126" y="172" class="tx-r" text-anchor="middle">&lt; ALL  최솟값보다 작음</text>
  <line x1="220" y1="182" x2="50" y2="182" class="ln-r" marker-end="url(#arr-r)"/>
</svg>` },
    { t: 'tip', title: 'ANY 는 느슨한 쪽, ALL 은 빡빡한 쪽', x: '"크다"를 하나만 이기면 되니 ANY 는 가장 만만한 최솟값을, 전부 이겨야 하니 ALL 은 가장 센 최댓값을 상대해요. "작다"는 거꾸로예요. `> ANY` 는 `> (SELECT MIN(…))`, `> ALL` 은 `> (SELECT MAX(…))` 로 바꿔 쓴 보기가 그대로 나와요.' },

    { t: 'h', x: '여러 컬럼을 한꺼번에 비교하기' },
    { t: 'p', x: '"부서마다 급여를 가장 많이 받는 사원"을 찾으려면 부서 번호와 급여를 짝으로 비교해야 해요. 서브쿼리가 컬럼을 둘 이상 돌려주고 메인쿼리도 같은 수의 컬럼을 괄호로 묶어 비교하는 것을 다중컬럼 서브쿼리라고 해요.' },
    { t: 'sql', code: `SELECT ENAME, DEPTNO, SAL
  FROM EMP
 WHERE (DEPTNO, SAL) IN (SELECT DEPTNO, MAX(SAL)
                           FROM EMP
                          GROUP BY DEPTNO);`, result: { head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['PARK', 20, 400], ['JUNG', 30, 600]] },
      note: '서브쿼리 결과는 (10, 500), (20, 400), (30, 600). 두 값이 짝으로 같은 행만 통과해요.' },
    { t: 'trap', title: '짝을 풀면 다른 사람이 끼어들어요', x: '위 조건을 `SAL IN (SELECT MAX(SAL) FROM EMP GROUP BY DEPTNO)` 로 쓰면 부서를 따지지 않고 급여가 500, 400, 600 중 하나인 사원이 전부 나와요. 다른 부서의 최고 급여와 우연히 같은 사원까지 딸려 와요. 결과 건수를 묻는 문제에서 이 차이를 봐요. 그리고 다중컬럼 서브쿼리는 Oracle 에서는 되지만 SQL Server 에서는 지원하지 않아요.' },

    { t: 'h', x: '연관 서브쿼리는 행마다 다시 돌아요' },
    { t: 'p', x: '"자기 부서의 평균보다 많이 받는 사원"은 비교할 평균이 사원마다 달라요. 그래서 서브쿼리 안에서 메인쿼리의 컬럼을 가져다 써야 해요. 이렇게 ==서브쿼리가 메인쿼리의 컬럼을 참조하는 것==을 연관 서브쿼리(상호연관 서브쿼리)라고 해요.' },
    { t: 'sql', code: `SELECT E.ENAME, E.DEPTNO, E.SAL
  FROM EMP E
 WHERE E.SAL > (SELECT AVG(S.SAL)
                  FROM EMP S
                 WHERE S.DEPTNO = E.DEPTNO);`, result: { head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['PARK', 20, 400]] },
      note: '부서 평균은 10번 400, 20번 300, 30번 600. JUNG 은 600 > 600 이 거짓이라 빠져요.' },
    { t: 'p', x: '실행 순서를 묻는 문제가 나와요. 비연관 서브쿼리는 서브쿼리가 먼저 한 번 실행되지만, 연관 서브쿼리는 메인쿼리가 먼저 읽히고 그 행의 값을 받아 서브쿼리가 실행돼요.' },
    { t: 'ol', items: [
      '메인쿼리의 테이블에서 한 행을 읽는다(KIM, 10, 500)',
      '그 행의 `E.DEPTNO` 값 10 을 서브쿼리에 넘긴다',
      '서브쿼리가 `S.DEPTNO = 10` 인 행으로 평균 400 을 구한다',
      '그 결과를 메인쿼리에 돌려주고 `500 > 400` 을 판단한다',
      '메인쿼리의 다음 행으로 넘어가 같은 일을 되풀이한다'
    ] },
    { t: 'p', x: '서브쿼리 안에 GROUP BY 가 없는 것도 눈여겨보세요. `WHERE S.DEPTNO = E.DEPTNO` 가 이미 한 부서만 남겨 주기 때문에 부서별로 묶을 필요가 없어요.' },

    { t: 'h', x: 'EXISTS 는 있는지 없는지만 봐요' },
    { t: 'p', x: 'EXISTS 는 서브쿼리 결과가 ==한 건이라도 있으면 참==, 한 건도 없으면 거짓이에요. 무슨 값이 나오는지는 보지 않아요. 그래서 SELECT 절에 `1` 이나 `\'X\'` 를 아무렇게나 적어도 결과가 같고, 조건에 맞는 행을 하나 찾으면 더 찾지 않고 멈춰요. 보통 연관 서브쿼리와 함께 써요.' },
    { t: 'sql', code: `SELECT D.DNAME
  FROM DEPT D
 WHERE EXISTS (SELECT 1
                 FROM EMP E
                WHERE E.DEPTNO = D.DEPTNO);`, result: { head: ['DNAME'], rows: [['영업'], ['개발'], ['인사']] },
      note: 'NOT EXISTS 로 바꾸면 사원이 한 명도 없는 총무만 나와요.' },
    { t: 'trap', title: '연결 조건이 없는 EXISTS', x: '`WHERE EXISTS (SELECT 1 FROM EMP WHERE SAL >= 600)` 처럼 서브쿼리 안에 메인쿼리 컬럼이 없으면, 서브쿼리 결과는 메인쿼리의 어느 행에서나 똑같아요. 한 건이라도 있으면 메인쿼리의 모든 행이 나오고, 없으면 한 행도 안 나와요. "조건에 맞는 부서만 나온다"고 읽으면 틀려요.' },

    { t: 'h', x: '인라인 뷰와 컬럼을 볼 수 있는 방향' },
    { t: 'p', x: 'FROM 절에 쓴 서브쿼리는 그 자리에서 만들어 쓰는 임시 테이블 같은 것이에요. 뷰를 따로 만들어 두지 않고 쿼리 안에서 바로 쓴다고 해서 인라인 뷰라고 불러요. 인라인 뷰의 SELECT 절에 내놓은 컬럼은 메인쿼리의 어느 절에서든 쓸 수 있어요.' },
    { t: 'sql', code: `SELECT E.ENAME, E.SAL, V.AVG_SAL
  FROM EMP E,
       (SELECT DEPTNO, AVG(SAL) AS AVG_SAL
          FROM EMP
         GROUP BY DEPTNO) V
 WHERE E.DEPTNO = V.DEPTNO
   AND E.SAL > V.AVG_SAL;`, result: { head: ['ENAME', 'SAL', 'AVG_SAL'], rows: [['KIM', 500, 400], ['PARK', 400, 300]] },
      note: '앞의 연관 서브쿼리와 같은 사원이 나오는데, 이번에는 부서 평균까지 함께 보여 줄 수 있어요.' },
    { t: 'table', caption: '누가 누구의 컬럼을 쓸 수 있나', head: ['방향', '가능 여부'], rows: [
      ['서브쿼리 안에서 메인쿼리의 컬럼을 쓴다', '가능(연관 서브쿼리)'],
      ['메인쿼리에서 WHERE 절 서브쿼리의 컬럼을 쓴다', '불가능'],
      ['메인쿼리에서 인라인 뷰가 SELECT 절에 내놓은 컬럼을 쓴다', '가능'],
      ['메인쿼리에서 인라인 뷰가 내놓지 않은 컬럼을 쓴다', '불가능']
    ] },
    { t: 'p', x: '위 예에서 메인쿼리는 `V.AVG_SAL` 과 `V.DEPTNO` 는 쓸 수 있지만, 인라인 뷰가 내놓지 않은 `V.SAL` 은 쓸 수 없어요. 인라인 뷰를 다른 테이블과 조인할 때는 컬럼을 가리킬 이름이 필요하니 별칭을 붙여요.' },
    { t: 'check', q: '`SELECT E.ENAME, D.DNAME FROM EMP E WHERE E.DEPTNO IN (SELECT D.DEPTNO FROM DEPT D)` 는 실행될까요?', a: '오류가 나요. DEPT 는 WHERE 절 서브쿼리 안에만 있는 테이블이라 메인쿼리의 SELECT 절에서 `D.DNAME` 을 볼 수 없어요. 부서 이름까지 보여 주려면 조인을 하거나 스칼라 서브쿼리, 인라인 뷰로 써야 해요.' },

    { t: 'h', x: '부서별 최고 급여 사원, 세 가지로 쓰기' },
    { t: 'p', x: '"그룹마다 가장 큰 값을 가진 행"은 모양을 바꿔 가며 "결과가 같은 SQL 은, 다른 SQL 은" 하고 물어요. 앞에서 본 다중컬럼 IN 말고도 연관 서브쿼리와 인라인 뷰 조인으로 쓸 수 있고, 셋 다 KIM, PARK, JUNG 을 돌려줘요.' },
    { t: 'sql', code: `-- 연관 서브쿼리
SELECT E.ENAME, E.DEPTNO, E.SAL
  FROM EMP E
 WHERE E.SAL = (SELECT MAX(S.SAL)
                  FROM EMP S
                 WHERE S.DEPTNO = E.DEPTNO);

-- 인라인 뷰 조인
SELECT E.ENAME, E.DEPTNO, E.SAL
  FROM EMP E,
       (SELECT DEPTNO, MAX(SAL) AS MAX_SAL
          FROM EMP
         GROUP BY DEPTNO) V
 WHERE E.DEPTNO = V.DEPTNO
   AND E.SAL = V.MAX_SAL;`, result: { head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['PARK', 20, 400], ['JUNG', 30, 600]] },
      note: '연관 서브쿼리는 MAX 가 한 행만 돌려주니 = 로 받아도 돼요.' },
    { t: 'trap', title: '동점이면 둘 다 나와요', x: '10번 부서에 급여 500 인 사원이 한 명 더 있으면 세 SQL 모두 그 사원까지 돌려줘요. 부서가 3개라고 결과가 늘 3행인 것은 아니에요. 그리고 다른 보기 하나는 부서 조건을 뺀 `SAL IN (SELECT MAX(SAL) … GROUP BY DEPTNO)` 로 바꿔 놓는 경우가 많으니, 부서를 짝으로 비교하는지부터 보세요.' },

    { t: 'h', x: 'NOT IN 과 NULL' },
    { t: 'p', x: '부서가 아직 정해지지 않은 사원 HAN 이 들어왔다고 해 볼게요. 여기서부터는 EMP 가 여섯 행이에요.' },
    { t: 'data', name: 'EMP (HAN 추가)', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['LEE', 10, 300], ['PARK', 20, 400], ['CHOI', 20, 200], ['JUNG', 30, 600], ['HAN', null, 100]] },
    { t: 'sql', code: `SELECT DNAME
  FROM DEPT
 WHERE DEPTNO NOT IN (SELECT DEPTNO FROM EMP);`, result: { head: ['DNAME'], rows: [] },
      note: '사원이 없는 총무가 나올 것 같지만 한 건도 안 나와요.' },
    { t: 'p', x: '`DEPTNO NOT IN (10, 20, 30, NULL)` 은 `DEPTNO <> 10 AND DEPTNO <> 20 AND DEPTNO <> 30 AND DEPTNO <> NULL` 과 같아요. 마지막 `<> NULL` 이 언제나 UNKNOWN 이라, AND 로 묶인 전체가 참이 될 수 없어요. 그래서 ==서브쿼리 결과에 NULL 이 하나라도 있으면 NOT IN 은 0건==이에요.' },
    { t: 'vs',
      a: { title: 'IN (…, NULL)', items: ['OR 로 풀린다', '하나만 같아도 참이라 NULL 이 있어도 정상으로 나온다'] },
      b: { title: 'NOT IN (…, NULL)', items: ['AND 로 풀린다', '`<> NULL` 때문에 참이 될 수 없어 0건'] },
      c: { title: 'NOT EXISTS', items: ['행이 있는지만 본다', 'NULL 이 있어도 영향이 없다. 총무가 나온다'] } },
    { t: 'trap', title: 'NOT IN 과 NOT EXISTS 는 같은 결과가 아닐 수 있어요', x: '"두 SQL 의 결과가 같다"는 보기는 서브쿼리 쪽 컬럼에 NULL 이 있는지부터 보세요. NULL 이 있으면 NOT IN 은 0건, NOT EXISTS 는 정상 결과예요. NOT IN 으로 같은 결과를 얻으려면 서브쿼리에 `WHERE DEPTNO IS NOT NULL` 을 넣어 NULL 을 빼야 해요.' },
    { t: 'p', x: '이번에는 NULL 이 메인쿼리 쪽에 있는 경우예요. "DEPT 에 없는 부서 번호를 가진 사원"을 두 가지로 찾아 볼게요. 서브쿼리 결과 10, 20, 30, 40 에는 NULL 이 없어요.' },
    { t: 'sql', code: `-- (가) NOT IN
SELECT ENAME
  FROM EMP
 WHERE DEPTNO NOT IN (SELECT DEPTNO FROM DEPT);

-- (나) NOT EXISTS
SELECT E.ENAME
  FROM EMP E
 WHERE NOT EXISTS (SELECT 1 FROM DEPT D
                    WHERE D.DEPTNO = E.DEPTNO);`, note: '(가)는 0건, (나)는 HAN 한 건이에요.' },
    { t: 'p', x: 'HAN 의 DEPTNO 는 NULL 이라 (가)에서는 `NULL <> 10` 부터 전부 UNKNOWN 이 돼 통과하지 못해요. (나)에서는 `D.DEPTNO = NULL` 을 만족하는 행이 없어 서브쿼리가 0건이고, NOT EXISTS 가 참이 돼 ==메인쿼리 쪽 값이 NULL 인 행이 출력==돼요.' },
    { t: 'table', caption: '차집합을 구하는 세 가지 방법. NULL 이 없으면 같은 값을 찾아요', head: ['방법', '서브쿼리 쪽에 NULL', '메인쿼리 쪽에 NULL', '중복'], rows: [
      ['`NOT IN`', '전체가 0건', '그 행은 안 나온다', '그대로 둔다'],
      ['`NOT EXISTS`', '영향 없다', '그 행이 나온다', '그대로 둔다'],
      ['`MINUS`', '영향 없다. NULL 은 NULL 끼리만 뺀다', '아래쪽에 NULL 이 없으면 그 행이 나온다', '제거한다']
    ] },
    { t: 'p', x: '`SELECT DEPTNO FROM DEPT MINUS SELECT DEPTNO FROM EMP` 는 `NOT IN` 이나 `NOT EXISTS` 로 바꿔 쓸 수 있어요. 시험은 이 셋을 나란히 놓고 결과가 다른 하나를 고르게 하는데, 대부분 NULL 이 섞인 NOT IN 이 답이에요.' },

    { t: 'h', x: '스칼라 서브쿼리는 한 행 한 컬럼' },
    { t: 'p', x: 'SELECT 절에 쓰는 서브쿼리는 컬럼 하나 자리에 들어가니까, 메인쿼리의 행마다 ==값 하나(한 행, 한 컬럼)==만 돌려줘야 해요. 조인 대신 쓰는 경우가 많아요.' },
    { t: 'sql', code: `SELECT E.ENAME,
       (SELECT D.DNAME
          FROM DEPT D
         WHERE D.DEPTNO = E.DEPTNO) AS DNAME
  FROM EMP E;`, result: { head: ['ENAME', 'DNAME'], rows: [['KIM', '영업'], ['LEE', '영업'], ['PARK', '개발'], ['CHOI', '개발'], ['JUNG', '인사'], ['HAN', null]] },
      note: 'HAN 은 맞는 부서가 없지만 행이 빠지지 않고 DNAME 이 NULL 로 나와요.' },
    { t: 'table', head: ['스칼라 서브쿼리 결과', '어떻게 되나'], rows: [
      ['한 행 한 컬럼', '그 값이 나온다'],
      ['0건', '오류가 아니다. 그 자리에 NULL 이 나오고 메인쿼리의 행은 그대로 남는다'],
      ['두 행 이상', '오류'],
      ['두 컬럼 이상', '오류']
    ] },
    { t: 'trap', title: '스칼라 서브쿼리는 행을 줄이지 않아요', x: 'EMP 와 DEPT 를 내부 조인하면 HAN 이 빠져서 5행이지만, 스칼라 서브쿼리로 쓰면 6행이 그대로 나와요. 맞는 값이 없는 행을 NULL 로 채워 남기니 아우터 조인과 같은 결과예요. 결과 행 수를 묻는 문제에서 "값이 없는 행은 빠진다"고 읽게 만들어요.' },
    { t: 'trap', title: 'NVL 은 서브쿼리 바깥에 씌워요', x: 'HAN 의 부서 이름을 \'없음\' 으로 보이게 하려고 `(SELECT NVL(D.DNAME, \'없음\') FROM DEPT D WHERE D.DEPTNO = E.DEPTNO)` 라고 써도 여전히 NULL 이 나와요. 서브쿼리가 0건이라 NVL 이 계산할 행이 아예 없기 때문이에요. `NVL((SELECT D.DNAME FROM DEPT D WHERE D.DEPTNO = E.DEPTNO), \'없음\')` 처럼 서브쿼리 전체를 감싸야 바뀌어요.' },

    { t: 'h', x: '서브쿼리 안의 ORDER BY' },
    { t: 'p', x: '정렬은 최종 결과를 내보낼 때 한 번 하는 일이에요. 그래서 ==서브쿼리 안에는 ORDER BY 를 쓰지 못하고== 메인쿼리의 맨 끝에 써요. 예외는 인라인 뷰예요. 정렬해 놓고 위에서 몇 건만 자르는 Top N 쿼리에서는 인라인 뷰 안에 ORDER BY 를 써요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM (SELECT ENAME, SAL
          FROM EMP
         ORDER BY SAL DESC)
 WHERE ROWNUM <= 2;`, result: { head: ['ENAME', 'SAL'], rows: [['JUNG', 600], ['KIM', 500]] },
      note: '인라인 뷰에서 급여순으로 정렬한 뒤 위에서 두 건만 잘라요. Top N 쿼리 장에서 다시 다뤄요.' },

    { t: 'h', x: '뷰 맛보기' },
    { t: 'p', x: '자주 쓰는 SELECT 문에 이름을 붙여 저장해 둔 것이 뷰예요. `CREATE VIEW 이름 AS SELECT …` 로 만들고, 테이블처럼 `FROM` 절에 써요. 뷰는 ==데이터를 따로 저장하지 않고 SELECT 문만 저장==해요. 조회할 때마다 그 SELECT 문이 실행돼요.' },
    { t: 'table', head: ['뷰의 장점', '뜻'], rows: [
      ['독립성', '테이블 구조가 바뀌어도 뷰를 쓰는 응용 프로그램은 고치지 않아도 된다'],
      ['편리성', '복잡한 쿼리를 뷰로 만들어 두면 간단한 쿼리로 쓸 수 있다'],
      ['보안성', '급여처럼 숨기고 싶은 컬럼을 빼고 뷰를 만들어 보여 줄 수 있다']
    ] },
    { t: 'p', x: '이름을 붙여 저장해 두는 뷰를 정적 뷰, 쿼리 안에서 한 번 쓰고 사라지는 인라인 뷰를 동적 뷰라고도 불러요.' },
    { t: 'check', q: '사원이 없는 부서를 찾으려고 NOT IN 을 썼는데 0건이 나왔어요. 무엇부터 의심해야 할까요?', a: '서브쿼리가 돌려주는 컬럼에 NULL 이 있는지요. NULL 이 하나라도 있으면 NOT IN 은 참이 될 수 없어서 0건이에요. 서브쿼리에 `IS NOT NULL` 조건을 넣거나 NOT EXISTS 로 바꿔요.' }
  ],
  keys: [
    '서브쿼리는 SELECT, FROM, WHERE, HAVING, ORDER BY, INSERT 의 VALUES, UPDATE 의 SET 에 쓸 수 있다. GROUP BY 절만 안 된다',
    'SELECT 절은 스칼라 서브쿼리, FROM 절은 인라인 뷰, WHERE 와 HAVING 절은 중첩 서브쿼리',
    '단일행 연산자(=, >, < …)에 여러 행이 오면 오류. 여러 행은 IN, ANY(SOME), ALL, EXISTS 로 받는다',
    '> ANY 는 최솟값보다 큼, > ALL 은 최댓값보다 큼. < ANY 는 최댓값보다 작음, < ALL 은 최솟값보다 작음',
    '연관 서브쿼리는 메인쿼리 컬럼을 참조하고, 메인쿼리 행마다 서브쿼리가 다시 실행된다',
    'EXISTS 는 한 건이라도 있으면 참. 값은 보지 않는다',
    '서브쿼리 결과에 NULL 이 있으면 NOT IN 은 0건. NOT EXISTS 는 영향이 없고, 메인쿼리 쪽 값이 NULL 인 행도 내보낸다',
    '스칼라 서브쿼리는 한 행 한 컬럼. 0건이면 NULL(행은 남는다), 두 행 이상이면 오류. NVL 은 서브쿼리 바깥에 씌운다'
  ],
  cards: [
    { q: '서브쿼리를 쓸 수 없는 절은?', a: 'GROUP BY 절. 나머지 SELECT, FROM, WHERE, HAVING, ORDER BY 에는 쓸 수 있어요.' },
    { q: 'FROM 절에 쓴 서브쿼리의 이름은?', a: '인라인 뷰. SELECT 절은 스칼라 서브쿼리, WHERE 절과 HAVING 절은 중첩 서브쿼리.' },
    { q: '`SAL > ANY (100, 300)` 을 바꿔 읽으면?', a: '`SAL > 100`. 하나만 이기면 되니 최솟값보다 크면 돼요.' },
    { q: '`SAL > ALL (100, 300)` 을 바꿔 읽으면?', a: '`SAL > 300`. 전부 이겨야 하니 최댓값보다 커야 해요.' },
    { q: '`= ANY` 와 `<> ALL` 은 각각 무엇과 같나요?', a: '`= ANY` 는 IN, `<> ALL` 은 NOT IN.' },
    { q: 'NOT IN 의 서브쿼리 결과에 NULL 이 있으면?', a: '결과가 0건. `<> NULL` 이 UNKNOWN 이라 AND 전체가 참이 될 수 없어요.' },
    { q: '스칼라 서브쿼리 결과가 0건이면? 2건이면?', a: '0건이면 NULL 이 나오고 행은 남아요. 2건이면 오류.' },
    { q: '연관 서브쿼리와 비연관 서브쿼리의 차이는?', a: '서브쿼리 안에 메인쿼리 컬럼이 있으면 연관. 연관은 메인쿼리 행마다 다시 실행되고, 비연관은 한 번 실행해 값을 넘겨요.' }
  ],
  quiz: [
    { id: 'q9-01', level: 1, tag: '서브쿼리 위치',
      q: 'SELECT 문에서 서브쿼리를 사용할 수 없는 절은?',
      choices: ['SELECT 절', 'FROM 절', 'GROUP BY 절', 'HAVING 절'],
      answer: 3,
      why: '서브쿼리는 SELECT, FROM, WHERE, HAVING, ORDER BY 절과 INSERT 의 VALUES 절, UPDATE 의 SET 절에 쓸 수 있어요. GROUP BY 절에는 쓸 수 없어요. HAVING 절은 집계 결과와 비교할 값을 서브쿼리로 넘길 수 있어요.' },
    { id: 'q9-02', level: 1, tag: '서브쿼리 종류',
      q: '서브쿼리에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'FROM 절에 쓴 서브쿼리를 스칼라 서브쿼리라고 한다.',
        '서브쿼리 안에서 메인쿼리의 컬럼을 참조하면 연관 서브쿼리이다.',
        '서브쿼리는 괄호로 감싸서 쓴다.',
        '서브쿼리가 여러 행을 돌려줄 때는 IN, ANY, ALL 같은 다중행 연산자를 쓴다.'
      ],
      answer: 1,
      why: 'FROM 절에 쓴 서브쿼리는 인라인 뷰예요. 스칼라 서브쿼리는 SELECT 절에 써서 한 행 한 컬럼을 돌려주는 서브쿼리예요. 나머지 셋은 모두 맞는 설명이에요.' },
    { id: 'q9-03', level: 2, tag: 'ANY 와 ALL',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 10, 300], ['B', 10, 500], ['C', 20, 200], ['D', 20, 400], ['E', 30, 450]] }],
      code: `SELECT COUNT(*)
  FROM EMP
 WHERE SAL > ANY (SELECT SAL FROM EMP WHERE DEPTNO = 20);`,
      choices: ['2', '4', '3', '5'],
      answer: 2,
      why: '서브쿼리 결과는 200, 400 이에요. `> ANY` 는 하나만 이기면 되니 최솟값 200 보다 크면 통과해요. A(300), B(500), D(400), E(450) 네 명이에요. C 는 200 이라 200 보다 크지 않아요. 2 는 `> ALL` 로 읽어 400 보다 큰 B, E 만 셌을 때 나오는 값이에요.' },
    { id: 'q9-04', level: 2, tag: 'ANY 와 ALL',
      q: '아래 SQL 과 항상 같은 결과를 내는 WHERE 조건은? (20번 부서에 사원이 있고 SAL 에는 NULL 이 없다)',
      code: `SELECT ENAME
  FROM EMP
 WHERE SAL < ANY (SELECT SAL FROM EMP WHERE DEPTNO = 20);`,
      choices: [
        { code: `WHERE SAL < (SELECT MIN(SAL) FROM EMP WHERE DEPTNO = 20)` },
        { code: `WHERE SAL > (SELECT MIN(SAL) FROM EMP WHERE DEPTNO = 20)` },
        { code: `WHERE SAL IN (SELECT SAL FROM EMP WHERE DEPTNO = 20)` },
        { code: `WHERE SAL < (SELECT MAX(SAL) FROM EMP WHERE DEPTNO = 20)` }
      ],
      answer: 4,
      why: '`< ANY` 는 서브쿼리 값 가운데 하나보다만 작으면 되니, 가장 큰 값보다 작으면 통과해요. 그래서 `< (SELECT MAX …)` 와 같아요. `< (SELECT MIN …)` 은 전부보다 작아야 하는 `< ALL` 이고, IN 은 `= ANY` 와 같아요.' },
    { id: 'q9-05', level: 3, tag: 'EXISTS',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'DEPT', head: ['DEPTNO', 'DNAME'], rows: [[10, '영업'], [20, '개발'], [30, '인사'], [40, '총무']] },
        { name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 10, 300], ['B', 10, 500], ['C', 20, 200]] }
      ],
      code: `SELECT COUNT(*)
  FROM DEPT D
 WHERE EXISTS (SELECT 1
                 FROM EMP E
                WHERE E.SAL >= 500);`,
      choices: ['1', '4', '0', '2'],
      answer: 2,
      why: '서브쿼리 안에 `D` 의 컬럼이 없어요. 메인쿼리와 연결되지 않은 서브쿼리라 DEPT 의 어느 행에서 봐도 결과가 같고, B(500) 한 건이 있으니 EXISTS 는 언제나 참이에요. DEPT 네 행이 전부 통과해서 4 예요. 1 은 `E.DEPTNO = D.DEPTNO` 조건이 있다고 착각해 10번 부서만 셌을 때 나오는 값이에요.' },
    { id: 'q9-06', level: 2, tag: '연관 서브쿼리',
      q: '아래 테이블에서 SQL 을 실행했을 때 출력되는 ENAME 을 모두 고른 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 10, 300], ['B', 10, 500], ['C', 20, 200], ['D', 20, 400], ['E', 30, 450]] }],
      code: `SELECT E.ENAME
  FROM EMP E
 WHERE E.SAL > (SELECT AVG(S.SAL)
                  FROM EMP S
                 WHERE S.DEPTNO = E.DEPTNO);`,
      choices: ['B, D, E', 'B', 'A, C', 'B, D'],
      answer: 4,
      why: '서브쿼리는 메인쿼리 행의 부서 평균을 구해요. 10번 평균은 400, 20번은 300, 30번은 450 이에요. B(500 > 400)와 D(400 > 300)가 통과하고, E 는 혼자라 450 > 450 이 거짓이에요. "B, D, E"는 전체 평균 370 과 비교했을 때 나오는 답이에요.' },
    { id: 'q9-07', level: 2, tag: '스칼라 서브쿼리',
      q: '스칼라 서브쿼리에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        '스칼라 서브쿼리의 결과가 0건이면 메인쿼리의 그 행은 결과에서 빠진다.',
        '메인쿼리의 한 행마다 한 행 한 컬럼만 돌려줘야 한다.',
        '결과가 두 행 이상이면 오류가 난다.',
        '메인쿼리의 컬럼을 참조하는 연관 서브쿼리로 쓸 수 있다.'
      ],
      answer: 1,
      why: '스칼라 서브쿼리의 결과가 0건이면 그 자리에 NULL 이 나올 뿐이고 메인쿼리의 행은 그대로 남아요. 아우터 조인과 같은 결과예요. 한 행 한 컬럼만 돌려줘야 하고, 두 행 이상이면 오류가 난다는 설명은 맞아요.' },
    { id: 'q9-08', level: 3, tag: 'NOT IN 과 NULL',
      q: '아래 테이블에서 결과 건수가 나머지 셋과 다른 SQL 은?',
      tables: [
        { name: 'DEPT', head: ['DEPTNO'], rows: [[10], [20], [30]] },
        { name: 'EMP', head: ['ENAME', 'DEPTNO'], rows: [['A', 10], ['B', null], ['C', 10]] }
      ],
      choices: [
        { code: `SELECT D.DEPTNO
  FROM DEPT D
 WHERE NOT EXISTS (SELECT 1 FROM EMP E
                    WHERE E.DEPTNO = D.DEPTNO);` },
        { code: `SELECT DEPTNO
  FROM DEPT
 WHERE DEPTNO NOT IN (SELECT DEPTNO FROM EMP
                       WHERE DEPTNO IS NOT NULL);` },
        { code: `SELECT DEPTNO
  FROM DEPT
 WHERE DEPTNO NOT IN (SELECT DEPTNO FROM EMP);` },
        { code: `SELECT D.DEPTNO
  FROM DEPT D LEFT OUTER JOIN EMP E
    ON D.DEPTNO = E.DEPTNO
 WHERE E.ENAME IS NULL;` }
      ],
      answer: 3,
      why: '3번의 서브쿼리 결과는 10, NULL, 10 이에요. NULL 이 섞인 NOT IN 은 `<> NULL` 때문에 참이 될 수 없어 0건이에요. 1번은 사원이 없는 20, 30 두 건이고, 2번은 NULL 을 뺀 뒤 비교하니 20, 30 두 건이에요. 4번은 아우터 조인에서 짝이 없는 부서만 남기니 역시 20, 30 두 건이에요.' },
    { id: 'q9-09', level: 2, tag: '다중컬럼 서브쿼리',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 10, 500], ['B', 10, 400], ['C', 20, 400], ['D', 20, 300], ['E', 30, 300]] }],
      code: `SELECT COUNT(*)
  FROM EMP
 WHERE SAL IN (SELECT MAX(SAL)
                 FROM EMP
                GROUP BY DEPTNO);`,
      choices: ['3', '4', '1', '5'],
      answer: 4,
      why: '서브쿼리는 부서별 최고 급여 500, 400, 300 을 돌려줘요. 메인쿼리는 부서를 따지지 않고 급여만 비교하니, B(400)는 20번의 최고 급여와, D(300)는 30번의 최고 급여와 같아서 통과해요. 다섯 명 전부예요. 3 은 `(DEPTNO, SAL) IN (SELECT DEPTNO, MAX(SAL) …)` 처럼 부서까지 짝으로 비교했을 때의 답이에요.' },
    { id: 'q9-10', level: 2, tag: '컬럼 참조 규칙',
      q: '다음 중 실행하면 오류가 나는 SQL 은? (EMP 에는 ENAME, DEPTNO, SAL 이, DEPT 에는 DEPTNO, DNAME 이 있다)',
      choices: [
        { code: `SELECT E.ENAME, D.DNAME
  FROM EMP E
 WHERE E.DEPTNO IN (SELECT D.DEPTNO FROM DEPT D);` },
        { code: `SELECT E.ENAME, V.AVG_SAL
  FROM EMP E,
       (SELECT DEPTNO, AVG(SAL) AS AVG_SAL
          FROM EMP
         GROUP BY DEPTNO) V
 WHERE E.DEPTNO = V.DEPTNO;` },
        { code: `SELECT E.ENAME,
       (SELECT D.DNAME FROM DEPT D
         WHERE D.DEPTNO = E.DEPTNO) AS DNAME
  FROM EMP E;` },
        { code: `SELECT DEPTNO, AVG(SAL)
  FROM EMP
 GROUP BY DEPTNO
HAVING AVG(SAL) > (SELECT AVG(SAL) FROM EMP);` }
      ],
      answer: 1,
      why: '1번은 WHERE 절 서브쿼리 안에만 있는 DEPT 의 컬럼 `D.DNAME` 을 메인쿼리 SELECT 절에서 쓰고 있어요. 메인쿼리는 서브쿼리의 컬럼을 볼 수 없어서 오류예요. 2번은 인라인 뷰가 내놓은 컬럼이라 쓸 수 있고, 3번은 서브쿼리가 메인쿼리 컬럼을 참조하는 정상적인 스칼라 서브쿼리, 4번은 HAVING 절 서브쿼리예요.' },
    { id: 'q9-11', level: 2, tag: '스칼라 서브쿼리',
      q: '아래 테이블에서 SQL 을 실행했을 때, 결과 행 수와 그중 DNAME 이 NULL 인 행 수로 알맞은 것은?',
      tables: [
        { name: 'DEPT', head: ['DEPTNO', 'DNAME'], rows: [[10, '영업'], [20, '개발']] },
        { name: 'EMP', head: ['ENAME', 'DEPTNO'], rows: [['A', 10], ['B', 20], ['C', 30], ['D', null]] }
      ],
      code: `SELECT E.ENAME,
       (SELECT D.DNAME
          FROM DEPT D
         WHERE D.DEPTNO = E.DEPTNO) AS DNAME
  FROM EMP E;`,
      choices: ['2행, 0행', '4행, 2행', '4행, 1행', '3행, 1행'],
      answer: 2,
      why: '스칼라 서브쿼리는 메인쿼리의 행을 줄이지 않아요. EMP 네 행이 모두 나와요. C 는 30번 부서가 DEPT 에 없어서, D 는 DEPTNO 가 NULL 이라 `=` 비교가 참이 될 수 없어서 서브쿼리가 0건이고 DNAME 이 NULL 이에요. "2행, 0행"은 내부 조인처럼 읽었을 때의 답이에요.' },
    { id: 'q9-12', level: 3, tag: '단일행, 다중행 연산자',
      q: '아래 테이블에서 실행하면 오류가 나는 SQL 은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['A', 10, 300], ['B', 10, 500], ['C', 20, 200], ['D', 30, 400]] }],
      choices: [
        { code: `SELECT ENAME FROM EMP
 WHERE SAL = (SELECT MAX(SAL) FROM EMP);` },
        { code: `SELECT ENAME FROM EMP
 WHERE SAL > (SELECT AVG(SAL) FROM EMP
               WHERE DEPTNO = 99);` },
        { code: `SELECT ENAME FROM EMP
 WHERE SAL = (SELECT MIN(SAL) FROM EMP
               GROUP BY DEPTNO);` },
        { code: `SELECT ENAME FROM EMP
 WHERE SAL IN (SELECT MIN(SAL) FROM EMP
                GROUP BY DEPTNO);` }
      ],
      answer: 3,
      why: '3번은 부서가 셋이라 서브쿼리가 3행(300, 200, 400)을 돌려주는데 단일행 연산자 `=` 로 받아서 오류가 나요. 4번처럼 IN 으로 받으면 돼요. 2번은 99번 부서가 없어도 GROUP BY 없는 집계라 NULL 한 행이 나오고, `SAL > NULL` 은 참이 아니어서 오류 없이 0건이에요.' }
  ]
});
