SQLD.add({
  id: 'q13',
  title: 'Top N 쿼리',
  minutes: 12,
  weight: 2,
  lead: '"상위 몇 건"을 뽑는 방법은 네 가지이고, 시험은 그중 ROWNUM 이 왜 생각대로 안 되는지와 동점을 몇 건으로 세는지를 물어요. 규칙 두 개만 알면 대부분 풀려요.',
  goals: [
    'ROWNUM 조건 중 결과가 나오는 것과 0건인 것을 가른다',
    '정렬한 뒤 자르려면 왜 인라인 뷰가 필요한지 설명한다',
    'ROW_NUMBER, RANK, DENSE_RANK 로 Top N 을 뽑을 때 동점에 따른 건수를 계산한다',
    'FETCH FIRST, OFFSET, WITH TIES 와 SQL Server 의 TOP 문법을 읽는다'
  ],
  blocks: [
    { t: 'h', x: '상위 N 건을 뽑는 네 가지 방법' },
    { t: 'p', x: '급여가 높은 사원 세 명, 게시판 2쪽에 보여 줄 글 10개처럼 정렬한 결과에서 일부만 잘라 오는 쿼리를 Top N 쿼리라고 해요. 방법은 네 가지예요.' },
    { t: 'table', head: ['방법', 'DBMS', '한 줄 설명'], rows: [
      ['`ROWNUM`', 'Oracle', '결과 행에 붙는 가상 번호로 자른다'],
      ['`ROW_NUMBER`, `RANK` 등', '공통', '윈도우 함수로 순위를 붙이고 바깥에서 거른다'],
      ['`FETCH FIRST N ROWS ONLY`', 'Oracle 12c 이상 (SQL Server 는 OFFSET 과 함께)', 'ORDER BY 뒤에 붙여 자른다'],
      ['`TOP N`', 'SQL Server', 'SELECT 바로 뒤에 붙여 자른다']
    ] },
    { t: 'data', name: 'EMP', head: ['ENAME', 'SAL'], rows: [['KIM', 300], ['LEE', 500], ['PARK', 200], ['CHOI', 400], ['JUNG', 400], ['HAN', 100]] },
    { t: 'p', x: '이 장의 예시는 전부 위 표를 쓰고, 테이블은 적힌 순서대로 읽힌다고 할게요.' },

    { t: 'h', x: 'ROWNUM 은 통과한 행에만 번호가 붙어요' },
    { t: 'p', x: 'ROWNUM 은 테이블에 저장된 값이 아니에요. 행을 하나 읽어서 ==WHERE 조건을 통과할 때마다 1, 2, 3 … 순서로 붙이는 번호==예요. 통과하지 못한 행은 번호를 받지 못하고, 그 번호는 다음 행이 다시 받아요.' },
    { t: 'p', x: '`WHERE ROWNUM = 2` 를 따라가 볼게요. 첫 행이 번호 1 후보가 돼요. 1 은 2 가 아니니 탈락이에요. 다음 행이 다시 번호 1 후보가 되고, 또 탈락해요. 끝까지 가도 번호 2 가 붙는 행이 없어서 결과는 0건이에요. `ROWNUM > 1` 도 같은 이유로 0건이에요.' },
    { t: 'table', head: ['조건', '결과', '이유'], rows: [
      ['`ROWNUM = 1`', '1건', '첫 행이 1 을 받고 통과'],
      ['`ROWNUM <= 3`, `ROWNUM < 4`', '3건', '1, 2, 3 을 차례로 받고 통과'],
      ['`ROWNUM BETWEEN 1 AND 3`', '3건', '1 부터 시작하니 통과'],
      ['`ROWNUM = 2`, `ROWNUM = 3`', '0건', '1 이 통과하지 못해 2 가 생기지 않는다'],
      ['`ROWNUM > 1`, `ROWNUM >= 2`', '0건', '위와 같다'],
      ['`ROWNUM BETWEEN 2 AND 3`', '0건', '위와 같다'],
      ['`ROWNUM >= 1`, `ROWNUM > 0`', '전체', '모든 행이 통과']
    ] },
    { t: 'trap', title: '오류가 아니라 0건', x: '`ROWNUM = 2` 나 `ROWNUM > 1` 은 문법 오류가 아니에요. 실행은 되고 결과가 한 건도 안 나와요. "오류가 발생한다"는 보기와 "0건"이라는 보기가 같이 나오면 0건 쪽이에요. ==1 을 포함하는 조건만 결과가 나온다==고 외우면 돼요.' },

    { t: 'h', x: 'ROWNUM 이 ORDER BY 보다 먼저예요' },
    { t: 'p', x: '급여 상위 세 명을 뽑으려고 이렇게 쓰면 틀려요. WHERE 가 ORDER BY 보다 먼저 실행돼서, 아무 세 행을 먼저 자르고 그 세 행만 정렬하기 때문이에요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 WHERE ROWNUM <= 3
 ORDER BY SAL DESC;`, result: { head: ['ENAME', 'SAL'], rows: [['LEE', 500], ['KIM', 300], ['PARK', 200]] },
      note: '앞의 세 행 KIM, LEE, PARK 를 먼저 자른 다음 정렬했어요. 400 을 받는 CHOI 와 JUNG 이 빠졌어요.' },
    { t: 'p', x: '정렬을 먼저 끝내 놓고 번호를 붙이게 하려면 정렬을 인라인 뷰(FROM 절 안의 서브쿼리) 안으로 넣어요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM (SELECT ENAME, SAL
          FROM EMP
         ORDER BY SAL DESC)
 WHERE ROWNUM <= 3;`, result: { head: ['ENAME', 'SAL'], rows: [['LEE', 500], ['CHOI', 400], ['JUNG', 400]] } },
    { t: 'fig', caption: '왼쪽은 자르고 나서 정렬해서 엉뚱한 세 건, 오른쪽은 인라인 뷰에서 정렬을 끝내고 잘라서 상위 세 건이에요.', svg: `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
  <text x="150" y="20" class="tx-b" text-anchor="middle">자르고 나서 정렬</text>
  <text x="50" y="46" class="tx-s" text-anchor="middle">EMP</text>
  <text x="150" y="46" class="tx-s" text-anchor="middle">ROWNUM &lt;= 3</text>
  <text x="250" y="46" class="tx-s" text-anchor="middle">ORDER BY</text>
  <rect x="20" y="56" width="60" height="24" class="bx"/><text x="50" y="73" class="tx-m" text-anchor="middle">300</text>
  <rect x="20" y="80" width="60" height="24" class="bx"/><text x="50" y="97" class="tx-m" text-anchor="middle">500</text>
  <rect x="20" y="104" width="60" height="24" class="bx"/><text x="50" y="121" class="tx-m" text-anchor="middle">200</text>
  <rect x="20" y="128" width="60" height="24" class="bx"/><text x="50" y="145" class="tx-m" text-anchor="middle">400</text>
  <rect x="20" y="152" width="60" height="24" class="bx"/><text x="50" y="169" class="tx-m" text-anchor="middle">400</text>
  <rect x="20" y="176" width="60" height="24" class="bx"/><text x="50" y="193" class="tx-m" text-anchor="middle">100</text>
  <line x1="86" y1="92" x2="112" y2="92" class="ln" marker-end="url(#arr)"/>
  <rect x="120" y="56" width="60" height="24" class="bx"/><text x="150" y="73" class="tx-m" text-anchor="middle">300</text>
  <rect x="120" y="80" width="60" height="24" class="bx"/><text x="150" y="97" class="tx-m" text-anchor="middle">500</text>
  <rect x="120" y="104" width="60" height="24" class="bx"/><text x="150" y="121" class="tx-m" text-anchor="middle">200</text>
  <line x1="186" y1="92" x2="212" y2="92" class="ln" marker-end="url(#arr)"/>
  <rect x="220" y="56" width="60" height="24" class="bx-r"/><text x="250" y="73" class="tx-r" text-anchor="middle">500</text>
  <rect x="220" y="80" width="60" height="24" class="bx-r"/><text x="250" y="97" class="tx-r" text-anchor="middle">300</text>
  <rect x="220" y="104" width="60" height="24" class="bx-r"/><text x="250" y="121" class="tx-r" text-anchor="middle">200</text>
  <line x1="320" y1="10" x2="320" y2="210" class="ln-d"/>
  <text x="480" y="20" class="tx-b" text-anchor="middle">정렬하고 나서 자르기</text>
  <text x="380" y="46" class="tx-s" text-anchor="middle">EMP</text>
  <text x="480" y="46" class="tx-s" text-anchor="middle">ORDER BY</text>
  <text x="580" y="46" class="tx-s" text-anchor="middle">ROWNUM &lt;= 3</text>
  <rect x="350" y="56" width="60" height="24" class="bx"/><text x="380" y="73" class="tx-m" text-anchor="middle">300</text>
  <rect x="350" y="80" width="60" height="24" class="bx"/><text x="380" y="97" class="tx-m" text-anchor="middle">500</text>
  <rect x="350" y="104" width="60" height="24" class="bx"/><text x="380" y="121" class="tx-m" text-anchor="middle">200</text>
  <rect x="350" y="128" width="60" height="24" class="bx"/><text x="380" y="145" class="tx-m" text-anchor="middle">400</text>
  <rect x="350" y="152" width="60" height="24" class="bx"/><text x="380" y="169" class="tx-m" text-anchor="middle">400</text>
  <rect x="350" y="176" width="60" height="24" class="bx"/><text x="380" y="193" class="tx-m" text-anchor="middle">100</text>
  <line x1="416" y1="92" x2="442" y2="92" class="ln" marker-end="url(#arr)"/>
  <rect x="450" y="56" width="60" height="24" class="bx"/><text x="480" y="73" class="tx-m" text-anchor="middle">500</text>
  <rect x="450" y="80" width="60" height="24" class="bx"/><text x="480" y="97" class="tx-m" text-anchor="middle">400</text>
  <rect x="450" y="104" width="60" height="24" class="bx"/><text x="480" y="121" class="tx-m" text-anchor="middle">400</text>
  <rect x="450" y="128" width="60" height="24" class="bx"/><text x="480" y="145" class="tx-m" text-anchor="middle">300</text>
  <rect x="450" y="152" width="60" height="24" class="bx"/><text x="480" y="169" class="tx-m" text-anchor="middle">200</text>
  <rect x="450" y="176" width="60" height="24" class="bx"/><text x="480" y="193" class="tx-m" text-anchor="middle">100</text>
  <line x1="516" y1="92" x2="542" y2="92" class="ln" marker-end="url(#arr)"/>
  <rect x="550" y="56" width="60" height="24" class="bx-a"/><text x="580" y="73" class="tx-a" text-anchor="middle">500</text>
  <rect x="550" y="80" width="60" height="24" class="bx-a"/><text x="580" y="97" class="tx-a" text-anchor="middle">400</text>
  <rect x="550" y="104" width="60" height="24" class="bx-a"/><text x="580" y="121" class="tx-a" text-anchor="middle">400</text>
</svg>` },
    { t: 'trap', title: '같은 문장의 WHERE ROWNUM 과 ORDER BY', x: '한 SELECT 문 안에 `WHERE ROWNUM <= N` 과 `ORDER BY` 가 같이 있으면 "상위 N 건"이 아니에요. 먼저 N 건을 자르고 그것만 정렬해요. SELECT 절에 `ROWNUM AS RN` 을 쓰고 같은 문장에서 ORDER BY 를 해도 번호는 정렬 전 순서로 붙어요.' },

    { t: 'h', x: '중간 구간(4 ~ 5 번째)을 뽑을 때' },
    { t: 'p', x: '`ROWNUM BETWEEN 4 AND 5` 는 0건이라고 했어요. 중간을 뽑으려면 정렬한 결과에 ROWNUM 을 ==별칭을 붙인 진짜 컬럼==으로 만들어 놓고, 한 번 더 감싸서 그 별칭으로 걸러요. 인라인 뷰가 두 겹이 돼요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM (SELECT ENAME, SAL, ROWNUM AS RN
          FROM (SELECT ENAME, SAL
                  FROM EMP
                 ORDER BY SAL DESC))
 WHERE RN BETWEEN 4 AND 5;`, result: { head: ['ENAME', 'SAL'], rows: [['KIM', 300], ['PARK', 200]] },
      note: '안쪽에서 정렬 → 가운데에서 번호를 컬럼으로 고정 → 바깥에서 RN 으로 거르기.' },

    { t: 'h', x: '윈도우 함수로 뽑기' },
    { t: 'p', x: '윈도우 함수로 순위를 붙이고 바깥에서 거르는 방법이에요. 윈도우 함수는 WHERE 에 쓸 수 없어서 여기서도 인라인 뷰가 필요해요. 동점이 있으면 어떤 함수를 쓰느냐에 따라 건수가 달라져요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM (SELECT ENAME, SAL,
               RANK() OVER (ORDER BY SAL DESC) AS RK
          FROM EMP)
 WHERE RK <= 2;`, result: { head: ['ENAME', 'SAL'], rows: [['LEE', 500], ['CHOI', 400], ['JUNG', 400]] },
      note: 'CHOI 와 JUNG 이 공동 2등이라 3건이에요.' },
    { t: 'table', caption: 'SAL 내림차순 500, 400, 400, 300, 200, 100 에서 "<= N" 으로 걸렀을 때 건수', head: ['함수', '붙는 번호', '<= 2', '<= 3'], rows: [
      ['`ROW_NUMBER`', '1, 2, 3, 4, 5, 6', '2건', '3건'],
      ['`RANK`', '1, 2, 2, 4, 5, 6', '3건', '3건'],
      ['`DENSE_RANK`', '1, 2, 2, 3, 4, 5', '3건', '4건']
    ] },

    { t: 'h', x: 'FETCH 절' },
    { t: 'p', x: 'Oracle 12c 부터는 ORDER BY 뒤에 FETCH 절을 붙여서 인라인 뷰 없이 자를 수 있어요. ORDER BY 가 끝난 뒤에 실행되기 때문에 ROWNUM 같은 문제가 없어요.' },
    { t: 'sql', code: `SELECT 컬럼
  FROM 테이블
 ORDER BY 정렬 컬럼
 OFFSET n ROWS
 FETCH FIRST | NEXT m ROWS ONLY | WITH TIES;` },
    { t: 'table', head: ['구문', '뜻'], rows: [
      ['`OFFSET n ROWS`', '앞의 n 행을 건너뛴다. 생략하면 처음부터'],
      ['`FETCH FIRST m ROWS ONLY`', 'm 행만 가져온다'],
      ['`FETCH FIRST m ROWS WITH TIES`', 'm 행을 가져오고, 마지막 행과 정렬 값이 같은 행이 더 있으면 같이 가져온다'],
      ['`FIRST` 와 `NEXT`, `ROW` 와 `ROWS`', '뜻이 같다. 어느 쪽을 써도 된다']
    ] },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 ORDER BY SAL DESC
 OFFSET 3 ROWS
 FETCH NEXT 2 ROWS ONLY;`, result: { head: ['ENAME', 'SAL'], rows: [['KIM', 300], ['PARK', 200]] },
      note: '세 행(500, 400, 400)을 건너뛰고 그다음 두 행. 위의 두 겹 인라인 뷰와 같은 결과예요.' },
    { t: 'sql', code: `SELECT ENAME, SAL
  FROM EMP
 ORDER BY SAL DESC
 FETCH FIRST 2 ROWS WITH TIES;`, result: { head: ['ENAME', 'SAL'], rows: [['LEE', 500], ['CHOI', 400], ['JUNG', 400]] },
      note: '두 번째 행이 400 인데 400 이 하나 더 있어서 3건. ONLY 였다면 2건이에요.' },

    { t: 'h', x: 'SQL Server 의 TOP' },
    { t: 'p', x: 'SQL Server 는 SELECT 바로 뒤에 `TOP N` 을 써요. ROWNUM 과 달리 ==ORDER BY 로 정렬한 결과에서 위 N 건==을 가져오니 인라인 뷰가 필요 없어요.' },
    { t: 'sql', code: `SELECT TOP 2 WITH TIES ENAME, SAL
  FROM EMP
 ORDER BY SAL DESC;`, result: { head: ['ENAME', 'SAL'], rows: [['LEE', 500], ['CHOI', 400], ['JUNG', 400]] },
      note: 'WITH TIES 를 빼면 LEE 와, 400 인 두 명 중 한 명만 나와서 2건이에요.' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['행 번호로 자르기', '`WHERE ROWNUM <= N` (정렬은 인라인 뷰에서 먼저)', '`SELECT TOP N …` (ORDER BY 결과에서 자름)'],
      ['동점까지 포함', '`FETCH FIRST N ROWS WITH TIES`', '`TOP N WITH TIES` (ORDER BY 가 반드시 있어야 함)'],
      ['건너뛰고 자르기', '`OFFSET n ROWS FETCH NEXT m ROWS ONLY`', '`OFFSET n ROWS FETCH NEXT m ROWS ONLY`'],
      ['순위 함수', '`ROW_NUMBER`, `RANK`, `DENSE_RANK`', '같다']
    ] },
    { t: 'trap', title: 'WITH TIES 는 N 건보다 많이 나올 수 있어요', x: '`TOP 2 WITH TIES` 나 `FETCH FIRST 2 ROWS WITH TIES` 는 "2건"이 아니라 "2건 + 마지막 행과 동점인 행"이에요. 동점 기준은 ORDER BY 에 쓴 컬럼이라서 둘 다 ORDER BY 와 함께 써야 해요. SQL Server 의 `TOP N WITH TIES` 는 ORDER BY 없이 쓰면 오류예요. 결과 건수를 묻는 문제에서는 N 번째 행의 값과 같은 행이 몇 개 더 있는지 세면 돼요.' },
    { t: 'check', q: '점수가 95, 90, 90, 90, 80 인 다섯 행에서 점수 내림차순 TOP 3 WITH TIES 는 몇 건일까요?', a: '4건이에요. 세 번째 행이 90 이고 90 이 하나 더 있어서 같이 나와요. RANK 로 3 이하를 걸러도 1, 2, 2, 2, 5 라서 똑같이 4건이에요.' },
    { t: 'check', q: 'WHERE ROWNUM <= 5 AND ROWNUM > 2 는 3건이 나올까요?', a: '0건이에요. 첫 행이 번호 1 을 받는데 `ROWNUM > 2` 에서 탈락하고, 다음 행도 다시 1 을 받아 탈락해요. 끝까지 통과하는 행이 없어요.' }
  ],
  keys: [
    'ROWNUM 은 WHERE 를 통과한 행에 1 부터 붙는다. = 1, <= N 은 되고 = 2, > 1 은 0건(오류 아님)',
    'ROWNUM 은 ORDER BY 보다 먼저 정해진다. 정렬 후 자르려면 인라인 뷰에서 먼저 정렬',
    '중간 구간은 ROWNUM 에 별칭(RN)을 붙여 한 번 더 감싼 뒤 RN 으로 거른다',
    '500, 400, 400, 300 에서 2등까지: ROW_NUMBER 2건, RANK 3건, DENSE_RANK 3건',
    'FETCH 절은 ORDER BY 뒤. OFFSET n ROWS 로 건너뛰고 FETCH NEXT m ROWS ONLY 로 자른다',
    'WITH TIES 는 마지막 행과 동점인 행까지. SQL Server 의 TOP N WITH TIES 는 ORDER BY 필수'
  ],
  cards: [
    { q: '`WHERE ROWNUM = 2` 의 결과는?', a: '0건. 오류는 아니에요. 번호 1 이 통과하지 못하니 2 가 붙는 행이 없어요.' },
    { q: '`WHERE ROWNUM <= 3 ORDER BY SAL DESC` 가 상위 3건이 아닌 이유는?', a: 'WHERE 가 ORDER BY 보다 먼저라서, 아무 3건을 자른 뒤 그 3건만 정렬해요.' },
    { q: 'ROWNUM 으로 4 ~ 6 번째를 뽑는 방법은?', a: '안쪽에서 정렬, 가운데에서 `ROWNUM AS RN`, 바깥에서 `RN BETWEEN 4 AND 6`. 인라인 뷰 두 겹.' },
    { q: '`OFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY` 는 몇 번째 행을 가져오나요?', a: '3, 4, 5 번째. 앞의 두 행을 건너뛰고 세 행.' },
    { q: '`FETCH FIRST 3 ROWS ONLY` 와 `WITH TIES` 의 차이는?', a: 'ONLY 는 딱 3건. WITH TIES 는 세 번째 행과 정렬 값이 같은 행이 더 있으면 같이 나와요.' },
    { q: 'SQL Server 의 TOP 과 Oracle 의 ROWNUM 은 정렬과의 순서가 어떻게 다른가요?', a: 'TOP 은 ORDER BY 결과에서 위 N 건을 자르고, ROWNUM 은 ORDER BY 전에 번호가 붙어요.' }
  ],
  quiz: [
    { id: 'q13-01', level: 1, tag: 'ROWNUM 조건',
      q: 'EMP 테이블에 10 건이 들어 있다. 다음 중 결과가 한 건도 나오지 않는 것은? (Oracle)',
      choices: [
        { code: `SELECT * FROM EMP WHERE ROWNUM = 1;` },
        { code: `SELECT * FROM EMP WHERE ROWNUM < 3;` },
        { code: `SELECT * FROM EMP WHERE ROWNUM > 1;` },
        { code: `SELECT * FROM EMP WHERE ROWNUM >= 1;` }
      ],
      answer: 3,
      why: 'ROWNUM 은 조건을 통과한 행에 1 부터 붙어요. `ROWNUM > 1` 은 첫 행이 1 을 받고 탈락하고, 다음 행도 다시 1 을 받아 탈락해서 0건이에요. 1번은 1건, 2번은 2건, 4번은 10건이 나와요.' },
    { id: 'q13-02', level: 2, tag: 'ROWNUM 과 ORDER BY',
      q: '아래 SQL 의 결과로 알맞은 것은? (Oracle. 테이블은 적힌 순서대로 읽힌다고 가정하고, 결과는 출력 순서대로 적었다)',
      tables: [{ name: 'PROD', head: ['PNAME', 'PRICE'], rows: [['A', 300], ['B', 900], ['C', 500], ['D', 700], ['E', 100]] }],
      code: `SELECT PNAME
  FROM PROD
 WHERE ROWNUM <= 2
 ORDER BY PRICE DESC;`,
      choices: ['B, A', 'B, D', 'A, B', 'E, A'],
      answer: 1,
      why: 'WHERE 가 ORDER BY 보다 먼저 실행돼요. 앞의 두 행 A(300), B(900) 를 먼저 자르고 그 둘을 가격 내림차순으로 정렬해서 B, A 가 나와요. B, D 는 전체에서 가장 비싼 두 상품인데, 그 결과를 원하면 인라인 뷰에서 먼저 정렬해야 해요.' },
    { id: 'q13-03', level: 2, tag: 'TOP 과 WITH TIES',
      q: '아래 SQL 을 SQL Server 에서 실행했을 때 결과 건수는?',
      tables: [{ name: 'EMP', head: ['ENAME', 'SAL'], rows: [['A', 500], ['B', 400], ['C', 400], ['D', 400], ['E', 200]] }],
      code: `SELECT TOP 2 WITH TIES ENAME, SAL
  FROM EMP
 ORDER BY SAL DESC;`,
      choices: ['2건', '3건', '4건', '5건'],
      answer: 3,
      why: '정렬하면 500, 400, 400, 400, 200 이에요. 위에서 두 번째 행의 SAL 이 400 이고, WITH TIES 는 마지막 행과 같은 값을 가진 행을 전부 같이 가져오니 400 세 명이 다 나와서 4건이에요. WITH TIES 가 없으면 2건이에요.' },
    { id: 'q13-04', level: 3, tag: 'ROWNUM 페이징',
      q: 'PROD 테이블에서 가격(PRICE)이 높은 순서로 2 ~ 3 번째 상품을 구하려고 한다. 원하는 결과가 나오는 SQL 은? (Oracle. PRICE 에 중복은 없다)',
      choices: [
        { code: `SELECT PNAME
  FROM (SELECT PNAME FROM PROD ORDER BY PRICE DESC)
 WHERE ROWNUM BETWEEN 2 AND 3;` },
        { code: `SELECT PNAME
  FROM (SELECT PNAME, ROWNUM AS RN
          FROM (SELECT PNAME FROM PROD ORDER BY PRICE DESC))
 WHERE RN BETWEEN 2 AND 3;` },
        { code: `SELECT PNAME
  FROM (SELECT PNAME, ROWNUM AS RN
          FROM PROD
         ORDER BY PRICE DESC)
 WHERE RN BETWEEN 2 AND 3;` },
        { code: `SELECT PNAME
  FROM PROD
 WHERE ROWNUM >= 2 AND ROWNUM <= 3
 ORDER BY PRICE DESC;` }
      ],
      answer: 2,
      why: '1번과 4번은 ROWNUM 조건이 1 을 포함하지 않아 0건이에요. 3번은 ROWNUM 과 ORDER BY 가 같은 문장에 있어서 RN 이 정렬 전 순서로 붙어요. 2 ~ 3 번째로 읽힌 행이 나올 뿐 가격 순위와 상관없어요. 안쪽에서 정렬하고, 가운데에서 번호를 컬럼으로 만들고, 바깥에서 거르는 2번이 맞아요.' },
    { id: 'q13-05', level: 2, tag: 'FETCH 와 OFFSET',
      q: '아래 SQL 의 결과로 알맞은 것은? (출력 순서대로 적었다)',
      tables: [{ name: 'SCORE', head: ['NAME', 'PT'], rows: [['C', 85], ['A', 95], ['E', 75], ['B', 90], ['D', 80]] }],
      code: `SELECT NAME
  FROM SCORE
 ORDER BY PT DESC
 OFFSET 1 ROWS
 FETCH NEXT 2 ROWS ONLY;`,
      choices: ['A, B', 'C, D', 'B, C, D', 'B, C'],
      answer: 4,
      why: '점수 내림차순은 A(95), B(90), C(85), D(80), E(75) 예요. OFFSET 1 ROWS 로 A 를 건너뛰고 그다음 두 행 B, C 를 가져와요. FETCH 절은 ORDER BY 뒤에 실행돼서 테이블에 적힌 순서와는 상관없어요.' },
    { id: 'q13-06', level: 3, tag: '동점과 건수',
      q: '아래 EMP 테이블에 대해 다음 SQL 을 각각 실행했다. 결과 건수가 나머지 셋과 다른 것은? (Oracle)',
      tables: [{ name: 'EMP', head: ['ENAME', 'SAL'], rows: [['A', 500], ['B', 400], ['C', 400], ['D', 300], ['E', 300], ['F', 100]] }],
      choices: [
        { code: `SELECT ENAME
  FROM EMP
 ORDER BY SAL DESC
 FETCH FIRST 3 ROWS WITH TIES;` },
        { code: `SELECT ENAME
  FROM (SELECT ENAME, RANK() OVER (ORDER BY SAL DESC) AS RK
          FROM EMP)
 WHERE RK <= 3;` },
        { code: `SELECT ENAME
  FROM (SELECT ENAME, ROW_NUMBER() OVER (ORDER BY SAL DESC) AS RN
          FROM EMP)
 WHERE RN <= 3;` },
        { code: `SELECT ENAME
  FROM (SELECT ENAME, DENSE_RANK() OVER (ORDER BY SAL DESC) AS DR
          FROM EMP)
 WHERE DR <= 3;` }
      ],
      answer: 4,
      why: 'SAL 내림차순은 500, 400, 400, 300, 300, 100 이에요. 1번은 세 번째 행이 400 인데 400 은 이미 둘 다 들어 있어 3건, 2번은 RANK 가 1, 2, 2, 4, 4, 6 이라 3건, 3번은 ROW_NUMBER 라 3건이에요. DENSE_RANK 는 1, 2, 2, 3, 3, 4 라서 300 두 명까지 들어와 5건이에요.' },
    { id: 'q13-07', level: 1, tag: 'Top N 종합',
      q: 'Top N 쿼리에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'Oracle 의 ROWNUM 은 ORDER BY 로 정렬이 끝난 결과에 번호를 붙인다.',
        'SQL Server 의 TOP N WITH TIES 는 ORDER BY 절과 함께 써야 한다.',
        'FETCH FIRST N ROWS ONLY 는 ORDER BY 절 뒤에 쓴다.',
        'OFFSET 2 ROWS 는 앞의 두 행을 건너뛰라는 뜻이다.'
      ],
      answer: 1,
      why: 'ROWNUM 은 WHERE 를 통과할 때 붙고, ORDER BY 는 그 뒤에 실행돼요. 그래서 정렬한 순서대로 번호를 붙이려면 인라인 뷰에서 먼저 정렬해야 해요. 나머지 셋은 맞는 설명이에요.' }
  ]
});
