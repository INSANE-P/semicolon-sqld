SQLD.add({
  id: 'q14',
  title: '계층형 질의',
  minutes: 18,
  weight: 3,
  lead: '사원과 관리자처럼 한 테이블 안에서 위아래로 이어지는 데이터를 펼치는 문법이에요. 거의 매회 나오고, PRIOR 가 어느 쪽에 붙었는지와 조건을 WHERE 에 썼는지 CONNECT BY 에 썼는지를 보고 결과를 맞히게 해요.',
  goals: [
    'CONNECT BY 에서 PRIOR 의 위치를 보고 위에서 아래로 가는지, 아래에서 위로 가는지 가른다',
    '작은 EMPNO/MGR 표를 보고 전개 순서와 LEVEL 을 손으로 적는다',
    '같은 조건을 WHERE 에 쓸 때와 CONNECT BY 에 쓸 때 결과가 어떻게 다른지 계산한다',
    'LEVEL, CONNECT_BY_ISLEAF, CONNECT_BY_ROOT, SYS_CONNECT_BY_PATH, ORDER SIBLINGS BY, NOCYCLE 의 쓰임을 구분한다'
  ],
  blocks: [
    { t: 'h', x: '한 테이블 안의 위아래 관계' },
    { t: 'p', x: '사원 테이블에 "내 관리자의 사번"을 적는 MGR 컬럼이 있다고 해 볼게요. KIM 밑에 LEE 와 PARK 가 있고, LEE 밑에 CHOI 와 JUNG 이 있는 식으로 한 테이블 안에서 나무 모양이 만들어져요. 이걸 사장부터 말단까지, 또는 말단에서 사장까지 따라가며 펼치는 것이 계층형 질의예요.' },
    { t: 'data', name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[1, 'KIM', null], [2, 'LEE', 1], [3, 'PARK', 1], [4, 'CHOI', 2], [5, 'JUNG', 2], [6, 'HAN', 3]] },
    { t: 'p', x: '용어 세 개만 먼저 볼게요. 맨 위 행을 루트 노드, 밑에 아무도 없는 맨 끝 행을 리프 노드, 같은 부모를 둔 행들을 형제 노드라고 해요. 위 표에서 KIM 이 루트, CHOI 와 JUNG 과 HAN 이 리프, LEE 와 PARK 가 형제예요.' },
    { t: 'sql', code: `SELECT 컬럼
  FROM 테이블
 WHERE 조건
 START WITH 시작 조건
 CONNECT BY [NOCYCLE] PRIOR 컬럼 = 컬럼 [AND 조건]
 ORDER SIBLINGS BY 컬럼;` },
    { t: 'table', head: ['절', '하는 일'], rows: [
      ['`START WITH`', '어느 행에서 출발할지. 여기서 뽑힌 행이 LEVEL 1 이 된다'],
      ['`CONNECT BY`', '지금 행에서 다음 행으로 어떻게 이어 갈지'],
      ['`PRIOR`', '"방금 읽은 행"의 컬럼이라는 표시. CONNECT BY 안에 쓴다'],
      ['`ORDER SIBLINGS BY`', '계층은 그대로 두고 형제끼리만 정렬'],
      ['`WHERE`', '전개가 다 끝난 결과에서 행을 걸러 낸다']
    ] },

    { t: 'h', x: 'PRIOR 가 방향을 정해요' },
    { t: 'p', x: '`CONNECT BY PRIOR EMPNO = MGR` 을 말로 풀면 "==방금 읽은 행의 EMPNO== 를 MGR 로 갖는 행을 다음에 읽어라"예요. 방금 읽은 사람이 관리자인 행, 그러니까 부하를 찾아 내려가요. 이쪽이 순방향 전개(부모 → 자식)예요.' },
    { t: 'p', x: 'PRIOR 를 반대쪽에 붙인 `CONNECT BY PRIOR MGR = EMPNO` 는 "방금 읽은 행의 MGR 을 EMPNO 로 갖는 행을 읽어라"예요. 방금 읽은 사람의 관리자를 찾아 올라가요. 이쪽이 역방향 전개(자식 → 부모)예요.' },
    { t: 'fig', caption: 'PRIOR 가 붙은 컬럼이 "방금 읽은 행" 쪽이에요. 사번(EMPNO)에 붙으면 아래로, 관리자(MGR)에 붙으면 위로 가요. LEVEL 은 출발한 행이 1 이에요.', svg: `<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
  <text x="76" y="24" class="tx-a" text-anchor="middle">순방향 전개</text>
  <text x="76" y="42" class="tx-s" text-anchor="middle">부모 → 자식</text>
  <line x1="76" y1="56" x2="76" y2="196" class="ln-a" marker-end="url(#arr-a)"/>
  <text x="76" y="226" class="tx-m" text-anchor="middle">PRIOR EMPNO = MGR</text>
  <rect x="282" y="20" width="96" height="42" class="bx-a"/>
  <text x="330" y="38" class="tx-b" text-anchor="middle">KIM</text>
  <text x="330" y="54" class="tx-s" text-anchor="middle">EMPNO 1</text>
  <rect x="202" y="100" width="96" height="42" class="bx"/>
  <text x="250" y="118" class="tx-b" text-anchor="middle">LEE</text>
  <text x="250" y="134" class="tx-s" text-anchor="middle">EMPNO 2</text>
  <rect x="372" y="100" width="96" height="42" class="bx"/>
  <text x="420" y="118" class="tx-b" text-anchor="middle">PARK</text>
  <text x="420" y="134" class="tx-s" text-anchor="middle">EMPNO 3</text>
  <rect x="148" y="180" width="96" height="42" class="bx"/>
  <text x="196" y="198" class="tx-b" text-anchor="middle">CHOI</text>
  <text x="196" y="214" class="tx-s" text-anchor="middle">EMPNO 4</text>
  <rect x="256" y="180" width="96" height="42" class="bx"/>
  <text x="304" y="198" class="tx-b" text-anchor="middle">JUNG</text>
  <text x="304" y="214" class="tx-s" text-anchor="middle">EMPNO 5</text>
  <rect x="372" y="180" width="96" height="42" class="bx"/>
  <text x="420" y="198" class="tx-b" text-anchor="middle">HAN</text>
  <text x="420" y="214" class="tx-s" text-anchor="middle">EMPNO 6</text>
  <line x1="330" y1="62" x2="250" y2="100" class="ln"/>
  <line x1="330" y1="62" x2="420" y2="100" class="ln"/>
  <line x1="250" y1="142" x2="196" y2="180" class="ln"/>
  <line x1="250" y1="142" x2="304" y2="180" class="ln"/>
  <line x1="420" y1="142" x2="420" y2="180" class="ln"/>
  <text x="560" y="24" class="tx-r" text-anchor="middle">역방향 전개</text>
  <text x="560" y="42" class="tx-s" text-anchor="middle">자식 → 부모</text>
  <line x1="560" y1="200" x2="560" y2="60" class="ln-r" marker-end="url(#arr-r)"/>
  <text x="560" y="226" class="tx-m" text-anchor="middle">PRIOR MGR = EMPNO</text>
</svg>` },
    { t: 'sql', code: `SELECT EMPNO, ENAME, MGR, LEVEL
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
 ORDER SIBLINGS BY EMPNO;`, result: { head: ['EMPNO', 'ENAME', 'MGR', 'LEVEL'], rows: [
      [1, 'KIM', null, 1],
      [2, 'LEE', 1, 2],
      [4, 'CHOI', 2, 3],
      [5, 'JUNG', 2, 3],
      [3, 'PARK', 1, 2],
      [6, 'HAN', 3, 3]
    ] }, note: 'KIM → LEE → LEE 의 부하를 끝까지 → 그다음 PARK. 한 가지를 끝까지 내려간 뒤 옆 가지로 넘어가요.' },
    { t: 'sql', code: `SELECT EMPNO, ENAME, MGR, LEVEL
  FROM EMP
 START WITH EMPNO = 4
 CONNECT BY PRIOR MGR = EMPNO;`, result: { head: ['EMPNO', 'ENAME', 'MGR', 'LEVEL'], rows: [
      [4, 'CHOI', 2, 1],
      [2, 'LEE', 1, 2],
      [1, 'KIM', null, 3]
    ] }, note: 'CHOI 에서 출발해 관리자를 따라 올라가요. 출발한 CHOI 가 LEVEL 1 이고 KIM 이 LEVEL 3 이에요.' },
    { t: 'trap', title: 'PRIOR 가 오른쪽에 있는 보기', x: '`CONNECT BY MGR = PRIOR EMPNO` 는 `CONNECT BY PRIOR EMPNO = MGR` 과 같은 뜻이에요. 등호의 왼쪽이냐 오른쪽이냐가 아니라 ==PRIOR 가 어느 컬럼 앞에 붙었는지==만 봐요. PRIOR 가 자식 쪽 컬럼(EMPNO, 사번)에 붙으면 순방향, 부모 쪽 컬럼(MGR, 상위 코드)에 붙으면 역방향이에요.' },
    { t: 'tip', title: '방향은 이렇게 읽어요', x: 'PRIOR 가 붙은 컬럼의 값을 손가락으로 짚고, 반대쪽 컬럼에서 같은 값을 가진 행을 찾으면 그게 다음 행이에요. KIM 의 EMPNO 1 을 짚고 MGR 이 1 인 행을 찾으면 LEE 와 PARK 가 나오니 아래로 가는 거예요.' },
    { t: 'p', x: 'START WITH 조건에 여러 행이 걸리면 그 행들이 각각 루트가 돼 따로 전개돼요. `START WITH EMPNO IN (1, 2)` 로 순방향 전개를 하면 KIM 에서 내려간 6건과 LEE 에서 내려간 3건이 모두 나와서 9건이고, LEE 와 CHOI 와 JUNG 은 두 번씩 나와요. 계층형 질의는 이렇게 같은 행이 중복 출력될 수 있어요.' },
    { t: 'p', x: 'START WITH 를 생략하면 모든 행이 각각 출발점이 돼요. LEVEL 은 실제 조직의 높이가 아니라 ==출발한 행부터 센 깊이==라는 점도 같이 기억해 두세요. `START WITH EMPNO = 2` 로 순방향 전개를 하면 LEE 가 LEVEL 1, CHOI 와 JUNG 이 LEVEL 2 예요.' },

    { t: 'h', x: '같이 쓰는 가상 컬럼과 함수' },
    { t: 'table', head: ['이름', '돌려주는 값'], rows: [
      ['`LEVEL`', '출발 행이 1, 한 단계 이어질 때마다 1 씩 커지는 깊이'],
      ['`CONNECT_BY_ISLEAF`', '더 이어질 행이 없는 마지막 행이면 1, 아니면 0'],
      ['`CONNECT_BY_ROOT 컬럼`', '그 행이 속한 가지의 출발 행(LEVEL 1)의 컬럼 값'],
      ['`SYS_CONNECT_BY_PATH(컬럼, 구분자)`', '출발 행부터 현재 행까지의 경로. 구분자가 맨 앞에도 붙는다'],
      ['`CONNECT_BY_ISCYCLE`', '순환을 만드는 행이면 1, 아니면 0. NOCYCLE 을 썼을 때만 쓸 수 있다']
    ] },
    { t: 'sql', code: `SELECT LPAD('-', 2 * (LEVEL - 1), '-') || ENAME AS NAME,
       LEVEL                              AS LV,
       CONNECT_BY_ISLEAF                  AS LEAF,
       CONNECT_BY_ROOT ENAME              AS ROOT,
       SYS_CONNECT_BY_PATH(ENAME, '/')    AS PATH
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
 ORDER SIBLINGS BY EMPNO;`, result: { head: ['NAME', 'LV', 'LEAF', 'ROOT', 'PATH'], rows: [
      ['KIM', 1, 0, 'KIM', '/KIM'],
      ['--LEE', 2, 0, 'KIM', '/KIM/LEE'],
      ['----CHOI', 3, 1, 'KIM', '/KIM/LEE/CHOI'],
      ['----JUNG', 3, 1, 'KIM', '/KIM/LEE/JUNG'],
      ['--PARK', 2, 0, 'KIM', '/KIM/PARK'],
      ['----HAN', 3, 1, 'KIM', '/KIM/PARK/HAN']
    ] }, note: 'LPAD 는 LEVEL 에 맞춰 왼쪽을 채워 들여쓰기를 만들어요. 보통은 공백으로 채우는데 여기서는 보이게 - 를 썼어요.' },
    { t: 'trap', title: '역방향에서는 리프와 루트가 뒤집혀요', x: 'CONNECT_BY_ISLEAF 와 CONNECT_BY_ROOT 는 조직도의 위아래가 아니라 ==전개한 방향== 기준이에요. CHOI 에서 출발해 위로 올라가는 역방향 전개에서는 출발한 CHOI 가 루트(CONNECT_BY_ROOT 값)이고, 마지막에 닿는 KIM 이 CONNECT_BY_ISLEAF = 1 이에요.' },

    { t: 'h', x: '형제끼리 정렬: ORDER SIBLINGS BY' },
    { t: 'p', x: '계층형 질의에 그냥 `ORDER BY ENAME` 을 쓰면 전체를 이름순으로 다시 세워서 계층 모양이 깨져요. `ORDER SIBLINGS BY` 는 부모 밑에 자식이 붙어 있는 모양은 그대로 두고, 같은 부모를 둔 형제끼리만 순서를 정해요.' },
    { t: 'vs',
      a: { title: 'ORDER SIBLINGS BY ENAME DESC', items: ['KIM', 'PARK → HAN', 'LEE → JUNG → CHOI', '형제끼리만(LEE 와 PARK, CHOI 와 JUNG) 내림차순'] },
      b: { title: 'ORDER BY ENAME DESC', items: ['PARK, LEE, KIM, JUNG, HAN, CHOI', '계층과 상관없이 전체를 내림차순'] } },
    { t: 'p', x: '왼쪽의 출력 순서는 KIM, PARK, HAN, LEE, JUNG, CHOI 예요. LEE 와 PARK 중 PARK 가 먼저 오고, PARK 의 부하인 HAN 이 바로 뒤따라 나온 다음에 LEE 로 넘어가요.' },

    { t: 'h', x: '조건을 어디에 쓰느냐: WHERE 와 CONNECT BY' },
    { t: 'p', x: '계층형 질의는 ==START WITH → CONNECT BY → WHERE== 순서로 실행돼요. WHERE 는 전개가 다 끝난 뒤에 행을 하나씩 걸러 낼 뿐이라, 부모가 걸러져도 자식은 남아요. CONNECT BY 에 `AND` 로 붙인 조건은 이어 가는 도중에 검사해서, 조건에 걸린 행에서 가지가 끊기고 그 아래도 나오지 않아요.' },
    { t: 'sql', code: `SELECT ENAME, LEVEL
  FROM EMP
 WHERE ENAME <> 'LEE'
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
 ORDER SIBLINGS BY EMPNO;`, result: { head: ['ENAME', 'LEVEL'], rows: [['KIM', 1], ['CHOI', 3], ['JUNG', 3], ['PARK', 2], ['HAN', 3]] },
      note: 'LEE 한 줄만 빠졌어요. LEE 의 부하 CHOI, JUNG 은 LEVEL 3 그대로 남아요.' },
    { t: 'sql', code: `SELECT ENAME, LEVEL
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
        AND ENAME <> 'LEE'
 ORDER SIBLINGS BY EMPNO;`, result: { head: ['ENAME', 'LEVEL'], rows: [['KIM', 1], ['PARK', 2], ['HAN', 3]] },
      note: 'LEE 로 이어지지 못해서 그 아래 CHOI, JUNG 까지 안 나와요.' },
    { t: 'fig', caption: '빨간 상자가 결과에서 빠지는 행이에요. WHERE 는 한 줄만, CONNECT BY 의 조건은 그 아래 가지 전체를 빼요.', svg: `<svg viewBox="0 0 640 224" xmlns="http://www.w3.org/2000/svg">
  <text x="150" y="20" class="tx-b" text-anchor="middle">WHERE 에 조건</text>
  <text x="150" y="38" class="tx-s" text-anchor="middle">전개가 끝난 뒤 LEE 한 줄만 뺌</text>
  <rect x="118" y="50" width="64" height="28" class="bx"/><text x="150" y="69" class="tx" text-anchor="middle">KIM</text>
  <rect x="58" y="104" width="64" height="28" class="bx-r"/><text x="90" y="123" class="tx-r" text-anchor="middle">LEE</text>
  <rect x="188" y="104" width="64" height="28" class="bx"/><text x="220" y="123" class="tx" text-anchor="middle">PARK</text>
  <rect x="18" y="158" width="64" height="28" class="bx"/><text x="50" y="177" class="tx" text-anchor="middle">CHOI</text>
  <rect x="98" y="158" width="64" height="28" class="bx"/><text x="130" y="177" class="tx" text-anchor="middle">JUNG</text>
  <rect x="188" y="158" width="64" height="28" class="bx"/><text x="220" y="177" class="tx" text-anchor="middle">HAN</text>
  <line x1="150" y1="78" x2="90" y2="104" class="ln"/>
  <line x1="150" y1="78" x2="220" y2="104" class="ln"/>
  <line x1="90" y1="132" x2="50" y2="158" class="ln"/>
  <line x1="90" y1="132" x2="130" y2="158" class="ln"/>
  <line x1="220" y1="132" x2="220" y2="158" class="ln"/>
  <text x="150" y="212" class="tx-a" text-anchor="middle">결과 5건</text>
  <line x1="320" y1="10" x2="320" y2="216" class="ln-d"/>
  <text x="470" y="20" class="tx-b" text-anchor="middle">CONNECT BY 에 조건</text>
  <text x="470" y="38" class="tx-s" text-anchor="middle">LEE 에서 가지가 끊겨 아래도 안 나옴</text>
  <rect x="438" y="50" width="64" height="28" class="bx"/><text x="470" y="69" class="tx" text-anchor="middle">KIM</text>
  <rect x="378" y="104" width="64" height="28" class="bx-r"/><text x="410" y="123" class="tx-r" text-anchor="middle">LEE</text>
  <rect x="508" y="104" width="64" height="28" class="bx"/><text x="540" y="123" class="tx" text-anchor="middle">PARK</text>
  <rect x="338" y="158" width="64" height="28" class="bx-r"/><text x="370" y="177" class="tx-r" text-anchor="middle">CHOI</text>
  <rect x="418" y="158" width="64" height="28" class="bx-r"/><text x="450" y="177" class="tx-r" text-anchor="middle">JUNG</text>
  <rect x="508" y="158" width="64" height="28" class="bx"/><text x="540" y="177" class="tx" text-anchor="middle">HAN</text>
  <line x1="470" y1="78" x2="410" y2="104" class="ln-d"/>
  <line x1="470" y1="78" x2="540" y2="104" class="ln"/>
  <line x1="410" y1="132" x2="370" y2="158" class="ln-d"/>
  <line x1="410" y1="132" x2="450" y2="158" class="ln-d"/>
  <line x1="540" y1="132" x2="540" y2="158" class="ln"/>
  <text x="470" y="212" class="tx-a" text-anchor="middle">결과 3건</text>
</svg>` },
    { t: 'trap', title: 'CONNECT BY 의 조건은 출발 행을 거르지 못해요', x: 'CONNECT BY 의 조건은 "다음 행으로 이어 갈 때" 검사해요. START WITH 로 뽑힌 출발 행은 이어져서 온 행이 아니라서 이 조건과 상관없이 나와요. `START WITH MGR IS NULL CONNECT BY PRIOR EMPNO = MGR AND ENAME <> \'KIM\'` 을 실행해도 KIM 은 그대로 나와요. 출발 행까지 빼려면 WHERE 에 써야 해요.' },
    { t: 'check', q: 'WHERE LEVEL = 3 을 붙이면 CHOI, JUNG, HAN 만 나올까요, 아니면 아무것도 안 나올까요?', a: '세 명이 나와요. WHERE 는 전개가 끝난 뒤에 실행되니, LEVEL 1 과 2 를 거쳐 LEVEL 3 까지 다 펼쳐진 다음에 LEVEL 이 3 인 행만 남겨요.' },

    { t: 'h', x: '돌고 도는 데이터: NOCYCLE' },
    { t: 'p', x: 'A 의 관리자가 B 인데 B 의 관리자가 다시 A 로 적혀 있으면, 따라가다 제자리로 돌아와서 끝이 나지 않아요. 이런 데이터에 계층형 질의를 실행하면 Oracle 은 오류를 내요.' },
    { t: 'p', x: '`CONNECT BY NOCYCLE PRIOR EMPNO = MGR` 처럼 ==CONNECT BY 바로 뒤에 NOCYCLE== 을 쓰면, 이미 지나온 행으로 다시 이어지는 지점에서 전개를 멈추고 오류 없이 결과를 줘요. 이때 어느 행에서 순환이 생겼는지는 `CONNECT_BY_ISCYCLE` 이 1 인 행으로 알 수 있어요.' },

    { t: 'h', x: 'SQL Server 는 재귀 CTE 로 써요' },
    { t: 'p', x: 'CONNECT BY 는 Oracle 문법이에요. SQL Server 는 WITH 절 안에서 자기 자신을 다시 부르는 재귀 CTE 로 같은 일을 해요. 출발 행을 뽑는 쿼리와, 앞 단계 결과에 조인해서 다음 단계를 뽑는 쿼리를 `UNION ALL` 로 이어요.' },
    { t: 'sql', code: `WITH ORG AS (
  SELECT EMPNO, ENAME, MGR, 1 AS LV
    FROM EMP
   WHERE MGR IS NULL
  UNION ALL
  SELECT E.EMPNO, E.ENAME, E.MGR, O.LV + 1
    FROM EMP E
    JOIN ORG O
      ON E.MGR = O.EMPNO
)
SELECT EMPNO, ENAME, MGR, LV
  FROM ORG;`, note: '위쪽 SELECT 가 START WITH, 아래쪽 SELECT 의 조인 조건이 CONNECT BY 에 해당해요. E.MGR = O.EMPNO 는 "앞 단계 행의 사번을 관리자로 갖는 행"이라 순방향이에요.' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['문법', '`START WITH … CONNECT BY PRIOR …`', '`WITH 이름 AS (출발 쿼리 UNION ALL 재귀 쿼리)`'],
      ['출발 행', '`START WITH` 조건', 'UNION ALL 위쪽 쿼리의 WHERE'],
      ['이어 가는 조건', '`CONNECT BY` 와 `PRIOR`', 'UNION ALL 아래쪽 쿼리에서 CTE 자신과 조인'],
      ['깊이', '`LEVEL` 가상 컬럼', '직접 만든 컬럼에 1 씩 더한다']
    ] },
    { t: 'check', q: 'CONNECT BY PRIOR 상위부서코드 = 부서코드 는 순방향일까요, 역방향일까요?', a: '역방향이에요. PRIOR 가 부모 쪽 컬럼(상위부서코드)에 붙었으니 "방금 읽은 행의 상위 부서"를 찾아 위로 올라가요.' }
  ],
  keys: [
    'PRIOR 는 "방금 읽은 행". PRIOR 자식 = 부모(PRIOR EMPNO = MGR)는 순방향, PRIOR 부모 = 자식(PRIOR MGR = EMPNO)은 역방향',
    '등호 좌우는 상관없다. MGR = PRIOR EMPNO 도 순방향',
    'LEVEL 은 START WITH 로 출발한 행이 1. 출발 행이 여럿이면 각각 루트가 돼 같은 행이 여러 번 나올 수 있다',
    '실행 순서는 START WITH → CONNECT BY → WHERE',
    'WHERE 조건은 그 행만 빠지고 자식은 남는다. CONNECT BY 의 AND 조건은 그 행 아래 가지까지 빠진다(출발 행은 못 거른다)',
    'ORDER SIBLINGS BY 는 계층을 유지한 채 형제끼리만 정렬. ORDER BY 는 계층이 깨진다',
    '순환 데이터는 오류. CONNECT BY NOCYCLE 로 막고 CONNECT_BY_ISCYCLE 로 확인',
    'SQL Server 는 재귀 CTE: WITH … 출발 쿼리 UNION ALL 자기 자신과 조인하는 쿼리'
  ],
  cards: [
    { q: '`CONNECT BY PRIOR EMPNO = MGR` 은 어느 방향인가요?', a: '순방향(부모 → 자식). 방금 읽은 행의 EMPNO 를 MGR 로 가진 행, 곧 부하를 찾아 내려가요.' },
    { q: '`CONNECT BY EMPNO = PRIOR MGR` 은 어느 방향인가요?', a: '역방향(자식 → 부모). PRIOR 가 MGR 에 붙었으니 방금 읽은 행의 관리자를 찾아 올라가요.' },
    { q: '계층형 질의의 실행 순서는?', a: 'START WITH → CONNECT BY → WHERE. WHERE 는 전개가 끝난 뒤 걸러요.' },
    { q: 'WHERE 조건과 CONNECT BY 의 AND 조건은 결과가 어떻게 다른가요?', a: 'WHERE 는 걸린 행 한 줄만 빠지고 자식은 남아요. CONNECT BY 조건은 걸린 행에서 가지가 끊겨 자식까지 안 나와요.' },
    { q: '`SYS_CONNECT_BY_PATH(ENAME, \'/\')` 는 무엇을 돌려주나요?', a: '출발 행부터 현재 행까지의 경로. `/KIM/LEE/CHOI` 처럼 구분자가 맨 앞에도 붙어요.' },
    { q: 'CONNECT_BY_ISLEAF 가 1 인 행은?', a: '전개 방향으로 더 이어질 행이 없는 마지막 행. 역방향이면 조직도 맨 위 행이 1 이에요.' },
    { q: 'ORDER SIBLINGS BY 와 ORDER BY 의 차이는?', a: 'ORDER SIBLINGS BY 는 같은 부모의 형제끼리만 정렬해 계층이 유지돼요. ORDER BY 는 전체를 정렬해 계층이 깨져요.' },
    { q: 'NOCYCLE 은 어디에 쓰고 무슨 일을 하나요?', a: 'CONNECT BY 바로 뒤. 순환이 생기는 지점에서 전개를 멈춰 오류 없이 결과를 내요.' }
  ],
  quiz: [
    { id: 'q14-01', level: 1, tag: '계층형 질의 개요',
      q: 'Oracle 계층형 질의에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'START WITH 절은 전개를 시작할 행을 정하는 조건이다.',
        'LEVEL 은 START WITH 로 뽑힌 출발 행이 1 이다.',
        'ORDER SIBLINGS BY 는 전체 결과를 지정한 컬럼으로 다시 정렬하므로 계층 구조가 유지되지 않는다.',
        'CONNECT_BY_ISLEAF 는 더 이어질 행이 없는 행이면 1 을 돌려준다.'
      ],
      answer: 3,
      why: 'ORDER SIBLINGS BY 는 계층 구조를 유지한 채 같은 부모를 둔 형제끼리만 정렬해요. 전체를 다시 정렬해 계층이 깨지는 쪽은 일반 ORDER BY 예요.' },
    { id: 'q14-02', level: 2, tag: '순방향 전개와 LEVEL',
      q: '아래 SQL 의 결과 건수와, 결과에서 GAON 의 LEVEL 로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `SELECT ENAME, LEVEL
  FROM EMP
 START WITH EMPNO = 110
 CONNECT BY MGR = PRIOR EMPNO;`,
      choices: ['4건, LEVEL 3', '4건, LEVEL 4', '7건, LEVEL 4', '2건, 결과에 GAON 이 없다'],
      answer: 1,
      why: 'PRIOR 가 EMPNO 에 붙었으니 방금 읽은 행의 사번을 MGR 로 가진 행, 곧 부하를 찾아 내려가는 순방향이에요. BORA(1) → DANA(2) → GAON(3), 그리고 EUNI(2) 로 4건이에요. LEVEL 은 출발 행 BORA 가 1 이라서 GAON 은 3 이에요. 4 는 ALEX 부터 셌을 때의 값이고, 2건은 역방향으로 읽었을 때(BORA, ALEX)의 결과예요.' },
    { id: 'q14-03', level: 2, tag: '역방향 전개',
      q: '아래 SQL 의 결과를 출력 순서대로 적은 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `SELECT ENAME
  FROM EMP
 START WITH EMPNO = 160
 CONNECT BY PRIOR MGR = EMPNO;`,
      choices: [
        'ALEX, BORA, DANA, GAON',
        'GAON, DANA, BORA, ALEX',
        'GAON',
        'GAON, DANA'
      ],
      answer: 2,
      why: 'PRIOR 가 MGR 에 붙었으니 방금 읽은 행의 관리자를 찾아 올라가는 역방향이에요. GAON(MGR 130) → DANA(MGR 110) → BORA(MGR 100) → ALEX 순서로 나오고, ALEX 의 MGR 이 NULL 이라 거기서 끝나요. 순방향으로 읽으면 GAON 밑에 아무도 없어서 GAON 한 건만 나온다고 착각하게 돼요.' },
    { id: 'q14-04', level: 2, tag: 'PRIOR 방향',
      q: 'EMP(EMPNO, ENAME, MGR) 테이블에서 최상위 관리자부터 부하 방향으로 모든 사원을 전개하려고 한다. 빈칸에 들어갈 것으로 알맞은 것은?',
      code: `SELECT ENAME, LEVEL
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY (        );`,
      choices: [
        '`PRIOR MGR = EMPNO`',
        '`EMPNO = PRIOR MGR`',
        '`PRIOR MGR = MGR`',
        '`PRIOR EMPNO = MGR`'
      ],
      answer: 4,
      why: '위에서 아래로 가려면 "방금 읽은 행의 EMPNO 를 MGR 로 가진 행"을 찾아야 하니 PRIOR 가 EMPNO 에 붙어야 해요. 1번과 2번은 둘 다 PRIOR 가 MGR 에 붙은 역방향이라, 최상위 행에서 출발하면 더 올라갈 곳이 없어 한 건만 나와요. 3번은 "방금 읽은 행의 MGR 과 MGR 이 같은 행"을 찾는 조건인데, 출발 행의 MGR 이 NULL 이에요. NULL 은 = 로 비교하면 어떤 행과도 같다고 나오지 않아서 이어지는 행이 없고, 이 보기도 출발 행 한 건만 나와요.' },
    { id: 'q14-05', level: 3, tag: 'WHERE 와 CONNECT BY 조건',
      q: '아래 EMP 테이블에 대해 (가), (나) 를 각각 실행했을 때 결과 건수로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `-- (가)
SELECT ENAME
  FROM EMP
 WHERE ENAME <> 'BORA'
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR;

-- (나)
SELECT ENAME
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
        AND ENAME <> 'BORA';`,
      choices: ['(가) 6건, (나) 6건', '(가) 3건, (나) 3건', '(가) 6건, (나) 3건', '(가) 3건, (나) 6건'],
      answer: 3,
      why: '(가) 의 WHERE 는 일곱 건을 다 전개한 뒤 BORA 한 줄만 빼서 6건이에요. BORA 의 부하 DANA, EUNI, GAON 은 남아요. (나) 는 전개 도중 BORA 로 이어지지 못하니 BORA 와 그 아래 DANA, EUNI, GAON 이 모두 빠져서 ALEX, CHAN, FINN 3건이에요.' },
    { id: 'q14-06', level: 2, tag: 'ORDER SIBLINGS BY',
      q: '아래 SQL 의 결과를 출력 순서대로 적은 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `SELECT ENAME
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
 ORDER SIBLINGS BY ENAME DESC;`,
      choices: [
        'ALEX, BORA, DANA, GAON, EUNI, CHAN, FINN',
        'ALEX, CHAN, FINN, BORA, EUNI, DANA, GAON',
        'GAON, FINN, EUNI, DANA, CHAN, BORA, ALEX',
        'ALEX, CHAN, BORA, FINN, EUNI, DANA, GAON'
      ],
      answer: 2,
      why: '형제끼리만 이름 내림차순으로 세워요. ALEX 의 자식 BORA, CHAN 중 CHAN 이 먼저 오고 CHAN 의 부하 FINN 이 바로 따라 나와요. 그다음 BORA 로 가서 자식 DANA, EUNI 중 EUNI 가 먼저, 이어서 DANA 와 그 부하 GAON 이에요. 1번은 오름차순, 3번은 일반 ORDER BY, 4번은 같은 LEVEL 끼리 모아 버린 순서예요.' },
    { id: 'q14-07', level: 2, tag: '가상 컬럼과 함수',
      q: '아래 SQL 의 결과에서 ENAME 이 FINN 인 행의 P, LF 값으로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `SELECT ENAME,
       SYS_CONNECT_BY_PATH(ENAME, '/') AS P,
       CONNECT_BY_ISLEAF               AS LF
  FROM EMP
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR;`,
      choices: [
        '/ALEX/CHAN/FINN, 1',
        'ALEX/CHAN/FINN, 1',
        '/FINN/CHAN/ALEX, 1',
        '/ALEX/CHAN/FINN, 0'
      ],
      answer: 1,
      why: 'SYS_CONNECT_BY_PATH 는 출발 행부터 현재 행까지를 구분자로 이어 주고, 구분자는 맨 앞에도 붙어요. ALEX → CHAN → FINN 이라 /ALEX/CHAN/FINN 이에요. FINN 밑에는 아무도 없으니 CONNECT_BY_ISLEAF 는 1 이에요.' },
    { id: 'q14-08', level: 3, tag: '역방향의 루트와 리프',
      q: '아래 SQL 의 결과에서 ENAME 이 ALEX 인 행의 LV, LF, RT 값으로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `SELECT ENAME,
       LEVEL                 AS LV,
       CONNECT_BY_ISLEAF     AS LF,
       CONNECT_BY_ROOT ENAME AS RT
  FROM EMP
 START WITH EMPNO = 140
 CONNECT BY PRIOR MGR = EMPNO;`,
      choices: ['1, 0, ALEX', '3, 0, EUNI', '3, 1, ALEX', '3, 1, EUNI'],
      answer: 4,
      why: 'EUNI 에서 출발해 관리자를 따라 올라가는 역방향이에요. EUNI(1) → BORA(2) → ALEX(3) 이라 ALEX 의 LEVEL 은 3 이에요. ALEX 에서 더 이어질 행이 없으니 CONNECT_BY_ISLEAF 는 1 이고, CONNECT_BY_ROOT 는 출발 행의 값이라 EUNI 예요. 조직도에서 맨 위라는 이유로 ALEX 를 루트로 보면 틀려요.' },
    { id: 'q14-09', level: 1, tag: 'NOCYCLE',
      q: '순환 관계가 있는 데이터에 대한 Oracle 계층형 질의의 설명으로 적절한 것은?',
      choices: [
        'NOCYCLE 을 쓰지 않아도 순환이 생긴 지점에서 자동으로 전개를 멈추고 정상 결과를 낸다.',
        'NOCYCLE 은 START WITH 절 안에 쓴다.',
        'CONNECT_BY_ISCYCLE 은 NOCYCLE 없이도 쓸 수 있다.',
        'CONNECT BY NOCYCLE 을 쓰면 순환이 생기는 지점에서 전개를 멈추고 오류 없이 결과를 낸다.'
      ],
      answer: 4,
      why: '순환 데이터를 NOCYCLE 없이 전개하면 오류가 나요. NOCYCLE 은 CONNECT BY 바로 뒤에 쓰고, 이미 지나온 행으로 다시 이어지는 지점에서 전개를 멈춰요. CONNECT_BY_ISCYCLE 은 NOCYCLE 을 썼을 때만 쓸 수 있어요.' },
    { id: 'q14-10', level: 3, tag: 'WHERE 와 CONNECT BY 조건',
      q: '아래 SQL 의 결과 건수는?',
      tables: [{ name: 'EMP', head: ['EMPNO', 'ENAME', 'MGR'], rows: [[100, 'ALEX', null], [110, 'BORA', 100], [120, 'CHAN', 100], [130, 'DANA', 110], [140, 'EUNI', 110], [150, 'FINN', 120], [160, 'GAON', 130]] }],
      code: `SELECT ENAME
  FROM EMP
 WHERE LEVEL <> 2
 START WITH MGR IS NULL
 CONNECT BY PRIOR EMPNO = MGR
        AND EMPNO <> 130;`,
      choices: ['2건', '3건', '4건', '5건'],
      answer: 2,
      why: '먼저 CONNECT BY 로 전개해요. DANA(130) 로는 이어지지 못하니 DANA 와 그 부하 GAON 이 빠지고 ALEX(1), BORA(2), EUNI(3), CHAN(2), FINN(3) 다섯 건이 펼쳐져요. 그다음 WHERE 가 LEVEL 2 인 BORA, CHAN 을 빼서 ALEX, EUNI, FINN 3건이에요. 5건은 WHERE 를 빠뜨린 값, 4건은 DANA 만 빼고 GAON 을 남긴 값이에요.' },
    { id: 'q14-11', level: 2, tag: 'SQL Server 재귀 CTE',
      q: 'SQL Server 에서 EMP(EMPNO, ENAME, MGR) 테이블을 최상위 관리자부터 부하 방향으로 전개하려고 한다. 빈칸에 들어갈 조인 조건으로 알맞은 것은?',
      code: `WITH ORG AS (
  SELECT EMPNO, ENAME, MGR, 1 AS LV
    FROM EMP
   WHERE MGR IS NULL
  UNION ALL
  SELECT E.EMPNO, E.ENAME, E.MGR, O.LV + 1
    FROM EMP E
    JOIN ORG O
      ON (        )
)
SELECT * FROM ORG;`,
      choices: [
        '`E.MGR = O.EMPNO`',
        '`E.EMPNO = O.MGR`',
        '`E.EMPNO = O.EMPNO`',
        '`E.MGR = O.MGR`'
      ],
      answer: 1,
      why: 'ORG 에는 앞 단계에서 뽑힌 행이 들어 있어요. 그 행의 사번(O.EMPNO)을 관리자로 가진 사원(E.MGR)을 붙여야 부하 방향으로 내려가요. Oracle 의 `CONNECT BY PRIOR EMPNO = MGR` 과 같은 뜻이에요. 2번은 관리자를 찾아 올라가는 역방향 조건이에요.' }
  ]
});
