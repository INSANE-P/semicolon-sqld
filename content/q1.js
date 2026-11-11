SQLD.add({
  id: 'q1',
  title: '관계형 데이터베이스 개요',
  minutes: 10,
  weight: 3,
  lead: '2과목 첫 문제로 자주 나오는 장이에요. 계산할 것은 없고, 명령어가 DML, DDL, DCL, TCL 중 어디에 속하는지와 무결성 이름을 정확히 가르면 점수가 됩니다.',
  goals: [
    '행, 열, 튜플, 속성, 도메인, 릴레이션이 각각 무엇을 가리키는지 말할 수 있다',
    '무결성 종류를 상황에 맞춰 고른다',
    'SQL 명령어를 DML, DDL, DCL, TCL 로 틀리지 않고 나눈다',
    '테이블과 관계형 데이터베이스의 특징을 맞고 틀림으로 가른다'
  ],
  blocks: [
    { t: 'h', x: '데이터베이스와 DBMS' },
    { t: 'p', x: '수강 신청 내역을 엑셀 파일 여러 개에 나눠 적어 뒀다고 해 볼게요. 이렇게 모아 둔 데이터 덩어리가 데이터베이스예요. 그런데 여러 사람이 동시에 고치거나, 원하는 줄만 빨리 찾으려면 파일만으로는 힘들어요.' },
    { t: 'p', x: '그래서 데이터를 대신 관리해 주는 프로그램을 쓰는데, 이걸 ==DBMS(Database Management System)== 라고 해요. Oracle, SQL Server, MySQL 이 DBMS 예요. 그중 데이터를 표(테이블) 모양으로 저장하고 표끼리 관계를 맺는 방식을 관계형 데이터베이스(RDB)라고 부릅니다.' },
    { t: 'table', head: ['낱말', '뜻'], rows: [
      ['데이터베이스(DB)', '데이터를 모아 둔 것'],
      ['DBMS', '데이터베이스를 관리하는 시스템(소프트웨어)'],
      ['계정(유저)', '데이터 접근을 나누는 단위. 테이블은 어느 한 계정이 소유한다'],
      ['테이블', '행과 열로 된 2차원 구조. 데이터가 저장되는 기본 단위'],
      ['스키마', '테이블이 어떤 컬럼과 구조로 이루어졌는지 정의한 것']
    ] },

    { t: 'h', x: '테이블을 부르는 여러 이름' },
    { t: 'p', x: '같은 것을 이론에서는 다른 이름으로 불러요. 시험은 이 이름들을 섞어 놓고 맞는 짝을 고르게 합니다.' },
    { t: 'fig', caption: '가로 한 줄이 행(튜플), 세로 한 줄이 열(속성)이에요. 도메인은 한 열에 들어갈 수 있는 값의 범위입니다.', svg: `<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
  <text x="330" y="24" class="tx-b" text-anchor="middle">EMP 테이블(릴레이션)</text>
  <rect x="150" y="40" width="120" height="34" class="bx"/><text x="210" y="62" class="tx-b" text-anchor="middle">EMPNO</text>
  <rect x="270" y="40" width="120" height="34" class="bx"/><text x="330" y="62" class="tx-b" text-anchor="middle">ENAME</text>
  <rect x="390" y="40" width="120" height="34" class="bx"/><text x="450" y="62" class="tx-b" text-anchor="middle">DEPTNO</text>
  <rect x="150" y="74" width="120" height="34" class="bx"/><text x="210" y="96" class="tx-m" text-anchor="middle">101</text>
  <rect x="270" y="74" width="120" height="34" class="bx"/><text x="330" y="96" class="tx-m" text-anchor="middle">KIM</text>
  <rect x="390" y="74" width="120" height="34" class="bx-y"/><text x="450" y="96" class="tx-m" text-anchor="middle">10</text>
  <rect x="150" y="108" width="120" height="34" class="bx-a"/><text x="210" y="130" class="tx-m" text-anchor="middle">102</text>
  <rect x="270" y="108" width="120" height="34" class="bx-a"/><text x="330" y="130" class="tx-m" text-anchor="middle">LEE</text>
  <rect x="390" y="108" width="120" height="34" class="bx-a"/><text x="450" y="130" class="tx-m" text-anchor="middle">20</text>
  <rect x="150" y="142" width="120" height="34" class="bx"/><text x="210" y="164" class="tx-m" text-anchor="middle">103</text>
  <rect x="270" y="142" width="120" height="34" class="bx"/><text x="330" y="164" class="tx-m" text-anchor="middle">PARK</text>
  <rect x="390" y="142" width="120" height="34" class="bx-y"/><text x="450" y="164" class="tx-m" text-anchor="middle">10</text>
  <text x="66" y="122" class="tx-a" text-anchor="middle">행(튜플)</text>
  <text x="66" y="142" class="tx-s" text-anchor="middle">사원 한 명</text>
  <line x1="108" y1="125" x2="144" y2="125" class="ln-a" marker-end="url(#arr-a)"/>
  <line x1="450" y1="208" x2="450" y2="182" class="ln" marker-end="url(#arr)"/>
  <text x="450" y="224" class="tx" text-anchor="middle">열(속성, 컬럼)</text>
  <text x="450" y="242" class="tx-s" text-anchor="middle">도메인: 부서 번호로 쓸 수 있는 값의 범위</text>
</svg>` },
    { t: 'table', head: ['쓰는 말', '이론에서 부르는 말', '뜻'], rows: [
      ['테이블', '릴레이션(Relation)', '행과 열로 이루어진 표 하나'],
      ['행(Row), 레코드', '튜플(Tuple)', '가로 한 줄. 대상 하나의 정보'],
      ['열(Column), 컬럼', '속성(Attribute)', '세로 한 줄. 같은 종류의 값'],
      ['값의 범위', '도메인(Domain)', '한 속성이 가질 수 있는 값의 범위'],
      ['식별자', '키(Key)', '행 하나를 가려내는 속성']
    ] },
    { t: 'trap', title: '튜플과 속성을 바꿔 놓아요', x: '"튜플은 테이블의 열을 뜻한다", "속성은 한 행의 데이터다"처럼 가로와 세로를 뒤집은 보기가 나와요. 튜플은 행, 속성은 열이에요. 도메인은 테이블이 아니라 ==속성 하나가 가질 수 있는 값의 범위==입니다. 릴레이션은 교재에 따라 테이블 사이의 관계라는 뜻으로 적기도 해서, 시험은 이 낱말보다 튜플, 속성, 도메인의 짝을 묻는 편이에요.' },

    { t: 'h', x: '테이블의 성질' },
    { t: 'ul', items: [
      '테이블은 반드시 한 계정(유저)의 소유예요.',
      '한 계정 안에서는 같은 이름의 테이블을 두 개 만들 수 없어요. 소유자가 다르면 같은 이름으로 만들 수 있습니다. 예: `SCOTT.EMP` 와 `HR.EMP`.',
      '입력(INSERT)과 삭제(DELETE)는 ==행 단위==로 일어나요. 사원 한 명을 넣으면 그 사원의 모든 컬럼 값이 한 줄로 들어가고, 지우면 한 줄이 통째로 사라집니다.',
      '수정(UPDATE)은 값 단위로 할 수 있어요. 특정 사원의 급여 칸만 바꿀 수 있습니다.',
      '테이블끼리는 1:1, 1:N, N:M 관계를 가질 수 있어요.'
    ] },
    { t: 'p', x: '테이블 사이의 관계를 그림으로 그린 것이 ERD 예요. 엔터티(Entity), 관계(Relationship), 속성(Attribute) 세 가지로 이루어집니다. 자세한 내용은 1과목에서 다뤄요.' },

    { t: 'h', x: '관계 연산: 테이블에서 테이블을 만드는 여덟 가지' },
    { t: 'p', x: '관계형 데이터베이스는 테이블에 연산을 해서 새 테이블을 얻어요. 이 연산을 두 묶음으로 나눕니다. 수학의 집합에서 가져온 ==일반 집합 연산자== 넷과, 관계형 데이터베이스를 위해 따로 만든 ==순수 관계 연산자== 넷이에요. 어느 묶음에 속하는지 고르는 문제로 나와요.' },
    { t: 'vs',
      a: { title: '일반 집합 연산자', items: ['UNION(합집합): SQL 의 `UNION`', 'INTERSECTION(교집합): SQL 의 `INTERSECT`', 'DIFFERENCE(차집합): SQL 의 `MINUS`(Oracle), `EXCEPT`(SQL Server)', 'PRODUCT(곱집합): SQL 의 `CROSS JOIN`'] },
      b: { title: '순수 관계 연산자', items: ['SELECT: 조건에 맞는 행을 고른다. SQL 의 WHERE 절', 'PROJECT: 필요한 열만 고른다. SQL 의 SELECT 절', 'JOIN: 두 테이블을 이어 붙인다. SQL 의 여러 조인', 'DIVIDE: 상대 테이블의 값을 모두 가진 행을 찾는다. 바로 대응하는 SQL 문법은 없다'] } },
    { t: 'trap', title: '관계 연산의 SELECT 는 SQL 의 WHERE 예요', x: '이름이 같아서 헷갈리지만 관계 연산의 SELECT 는 ==행을 고르는 연산==이라 SQL 에서는 WHERE 절이 그 일을 해요. SQL 의 SELECT 절처럼 열을 고르는 연산은 PROJECT 입니다. 또 PRODUCT 는 이름이 낯설어 순수 관계 연산자 쪽에 넣은 보기가 나오는데, 곱집합이라서 일반 집합 연산자예요.' },

    { t: 'h', x: '관계형 데이터베이스의 특징' },
    { t: 'table', head: ['좋은 점', '아쉬운 점'], rows: [
      ['데이터의 분류, 정렬, 탐색이 빠르다', '이미 만든 스키마를 고치기 어렵다'],
      ['신뢰성이 높고 데이터 무결성을 보장한다', '데이터베이스의 부하를 분석하기 어렵다']
    ] },
    { t: 'p', x: '옳은 것을 고르는 문제에서 "스키마 수정이 쉽다"처럼 아쉬운 점을 뒤집어 놓은 보기가 오답으로 나와요.' },

    { t: 'h', x: '데이터 무결성' },
    { t: 'p', x: '사원 테이블에 사번이 같은 사람이 둘 있거나, 없는 부서 번호가 적혀 있으면 그 데이터는 믿을 수 없어요. 이런 일이 없도록 ==데이터의 정확성과 일관성을 지키는 성질==을 무결성(Integrity)이라고 해요. DBMS 는 제약조건으로 이걸 지켜 줍니다.' },
    { t: 'table', head: ['무결성', '지키는 것', '거는 제약조건'], rows: [
      ['개체 무결성', '기본키 컬럼은 NULL 도 안 되고 중복도 안 된다', 'PRIMARY KEY'],
      ['참조 무결성', '외래키 값은 NULL 이거나, 참조하는 테이블의 기본키에 있는 값이어야 한다', 'FOREIGN KEY'],
      ['도메인 무결성', '속성 값은 정해진 도메인(타입, 길이, 허용 범위) 안의 값이어야 한다', '데이터 타입, CHECK, DEFAULT'],
      ['고유 무결성', '특정 속성의 값이 서로 중복되지 않는다', 'UNIQUE'],
      ['NULL 무결성', '특정 속성에 NULL 을 허용하지 않는다', 'NOT NULL'],
      ['키 무결성', '한 릴레이션에는 키가 적어도 하나 있어야 한다', '']
    ] },
    { t: 'fig', caption: '참조 무결성. 자식의 외래키에는 부모에 있는 값이나 NULL 만 들어갈 수 있어요.', svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
  <text x="110" y="24" class="tx-b" text-anchor="middle">DEPT (부모)</text>
  <rect x="60" y="40" width="100" height="32" class="bx"/><text x="110" y="61" class="tx-b" text-anchor="middle">DEPTNO</text>
  <rect x="60" y="72" width="100" height="32" class="bx"/><text x="110" y="93" class="tx-m" text-anchor="middle">10</text>
  <rect x="60" y="104" width="100" height="32" class="bx"/><text x="110" y="125" class="tx-m" text-anchor="middle">20</text>
  <rect x="60" y="136" width="100" height="32" class="bx"/><text x="110" y="157" class="tx-m" text-anchor="middle">30</text>
  <text x="430" y="24" class="tx-b" text-anchor="middle">EMP (자식)</text>
  <rect x="340" y="40" width="90" height="32" class="bx"/><text x="385" y="61" class="tx-b" text-anchor="middle">ENAME</text>
  <rect x="430" y="40" width="90" height="32" class="bx"/><text x="475" y="61" class="tx-b" text-anchor="middle">DEPTNO</text>
  <rect x="340" y="72" width="90" height="32" class="bx"/><text x="385" y="93" class="tx-m" text-anchor="middle">KIM</text>
  <rect x="430" y="72" width="90" height="32" class="bx-a"/><text x="475" y="93" class="tx-m" text-anchor="middle">10</text>
  <rect x="340" y="104" width="90" height="32" class="bx"/><text x="385" y="125" class="tx-m" text-anchor="middle">LEE</text>
  <rect x="430" y="104" width="90" height="32" class="bx"/><text x="475" y="125" class="tx-m" text-anchor="middle">NULL</text>
  <rect x="340" y="136" width="90" height="32" class="bx-r"/><text x="385" y="157" class="tx-r" text-anchor="middle">PARK</text>
  <rect x="430" y="136" width="90" height="32" class="bx-r"/><text x="475" y="157" class="tx-r" text-anchor="middle">40</text>
  <line x1="334" y1="88" x2="168" y2="88" class="ln-a" marker-end="url(#arr-a)"/>
  <text x="250" y="80" class="tx-s" text-anchor="middle">부모에 있는 값</text>
  <line x1="334" y1="152" x2="240" y2="152" class="ln-r" marker-end="url(#arr-r)"/>
  <text x="250" y="184" class="tx-r" text-anchor="middle">40 은 부모에 없음</text>
  <text x="580" y="93" class="tx-s" text-anchor="middle">입력 가능</text>
  <text x="580" y="125" class="tx-s" text-anchor="middle">입력 가능</text>
  <text x="580" y="157" class="tx-r" text-anchor="middle">입력 거부</text>
</svg>` },
    { t: 'trap', title: '기본키와 외래키의 NULL', x: '기본키는 NULL 이 안 돼요(개체 무결성). 외래키는 NULL 이 ==될 수 있어요==(참조 무결성). "외래키는 NULL 을 가질 수 없다"는 틀린 보기로 자주 나옵니다. 아직 부서가 정해지지 않은 사원처럼, 가리키는 대상이 없으면 NULL 로 둘 수 있어요.' },
    { t: 'trap', title: '개체 무결성과 고유 무결성', x: '둘 다 중복을 막지만 다른 이름이에요. 기본키에 대한 "NULL 불가 + 중복 불가"는 개체 무결성, 기본키가 아닌 특정 속성의 "중복 불가"는 고유 무결성이에요. "주민번호 컬럼에 같은 값이 두 번 들어가지 않게 한다"는 고유 무결성입니다.' },
    { t: 'check', q: '주문 테이블의 수량 컬럼에 숫자 대신 글자 "많이"를 넣으려다 실패했어요. 어떤 무결성이 막은 걸까요?', a: '도메인 무결성이에요. 수량 속성이 가질 수 있는 값의 범위(숫자)를 벗어난 값이라서 거부됩니다.' },

    { t: 'h', x: 'SQL 의 종류' },
    { t: 'p', x: 'SQL(Structured Query Language)은 관계형 데이터베이스에 일을 시키는 언어예요. 무엇을 건드리느냐에 따라 네 묶음으로 나눠요. ==데이터를 다루면 DML, 구조를 다루면 DDL, 권한을 다루면 DCL, 트랜잭션을 다루면 TCL== 입니다.' },
    { t: 'table', head: ['종류', '하는 일', '명령어'], rows: [
      ['DML (Data Manipulation Language)\n데이터 조작어', '테이블 안의 데이터를 조회하고 바꾼다', '`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`'],
      ['DDL (Data Definition Language)\n데이터 정의어', '테이블 같은 객체의 구조를 만들고 바꾸고 없앤다', '`CREATE`, `ALTER`, `DROP`, `RENAME`, `TRUNCATE`'],
      ['DCL (Data Control Language)\n데이터 제어어', '권한을 주고 거둔다', '`GRANT`, `REVOKE`'],
      ['TCL (Transaction Control Language)\n트랜잭션 제어어', 'DML 로 바꾼 내용을 확정하거나 되돌린다', '`COMMIT`, `ROLLBACK`, `SAVEPOINT`']
    ] },
    { t: 'trap', title: 'TRUNCATE 는 DDL 이에요', x: '`TRUNCATE` 는 테이블의 데이터를 전부 지우니까 `DELETE` 와 같은 DML 처럼 보여요. 하지만 분류는 ==DDL== 입니다. 구조는 남기고 저장 공간을 비우는 명령이라 실행하면 바로 확정되고 `ROLLBACK` 으로 되돌릴 수 없어요. 분류 문제에서 가장 자주 틀리는 자리예요.' },
    { t: 'trap', title: 'DCL 과 TCL 을 섞어 놓아요', x: '`COMMIT`, `ROLLBACK` 을 DCL 칸에, `GRANT`, `REVOKE` 를 TCL 칸에 넣은 보기가 나와요. 권한(GRANT, REVOKE)은 DCL, 트랜잭션(COMMIT, ROLLBACK, SAVEPOINT)은 TCL 이에요. `RENAME` 은 객체 이름을 바꾸니 DDL, `MERGE` 는 데이터를 넣거나 고치니 DML 입니다.' },
    { t: 'tip', title: '이렇게 외워요', x: 'DDL 다섯 개를 먼저 외워요. `CREATE`, `ALTER`, `DROP`, `RENAME`, `TRUNCATE`. DCL 은 `GRANT`, `REVOKE` 둘, TCL 은 `COMMIT`, `ROLLBACK`, `SAVEPOINT` 셋. 남는 `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE` 가 DML 이에요.' },
    { t: 'p', x: '`SELECT` 는 시험에서 DML 로 분류해요. 조회만 하는 `SELECT` 를 따로 떼어 DQL(Data Query Language)이라고 부르는 분류도 있다는 정도만 알아 두면 됩니다.' },
    { t: 'p', x: 'SQL 의 예약어, 테이블 이름, 컬럼 이름은 ==대소문자를 구분하지 않아요.== `select * from emp` 와 `SELECT * FROM EMP` 는 같은 문장이에요. 다만 테이블에 저장된 데이터 값은 구분합니다. Oracle 에서 `\'SMITH\'` 와 `\'smith\'` 는 다른 값이에요.' },
    { t: 'check', q: 'DELETE, TRUNCATE, DROP 은 각각 어떤 종류의 SQL 일까요?', a: '`DELETE` 는 DML, `TRUNCATE` 와 `DROP` 은 DDL 이에요. 셋 다 무언가를 지우지만 `DELETE` 만 데이터 조작이고, 나머지 둘은 구조를 다루는 명령으로 분류합니다.' }
  ],
  keys: [
    '테이블=릴레이션, 행=튜플, 열=속성, 도메인=속성이 가질 수 있는 값의 범위',
    '입력과 삭제는 행 단위, 수정은 값 단위. 테이블 이름은 소유자가 다르면 같아도 된다',
    '개체 무결성: 기본키는 NULL 불가, 중복 불가. 참조 무결성: 외래키는 NULL 이거나 부모 기본키에 있는 값',
    '순수 관계 연산자: SELECT, PROJECT, JOIN, DIVIDE. 일반 집합 연산자: UNION, INTERSECTION, DIFFERENCE, PRODUCT',
    '도메인 무결성은 값의 범위, 고유 무결성은 중복 불가, NULL 무결성은 NULL 불가',
    'DML: SELECT, INSERT, UPDATE, DELETE, MERGE',
    'DDL: CREATE, ALTER, DROP, RENAME, TRUNCATE (TRUNCATE 는 DML 이 아니다)',
    'DCL: GRANT, REVOKE / TCL: COMMIT, ROLLBACK, SAVEPOINT'
  ],
  cards: [
    { q: '튜플, 속성, 도메인은 각각 무엇인가요?', a: '튜플은 행, 속성은 열, 도메인은 한 속성이 가질 수 있는 값의 범위예요.' },
    { q: '`TRUNCATE` 는 DML 인가요 DDL 인가요?', a: 'DDL 이에요. 데이터를 지우지만 분류는 구조를 다루는 쪽이고, 되돌릴 수 없어요.' },
    { q: 'DCL 명령어 두 개와 TCL 명령어 세 개는?', a: 'DCL 은 `GRANT`(권한 주기), `REVOKE`(권한 거두기). TCL 은 `COMMIT`, `ROLLBACK`, `SAVEPOINT`.' },
    { q: '순수 관계 연산자 네 가지는?', a: 'SELECT, PROJECT, JOIN, DIVIDE. 관계 연산의 SELECT 는 행을 고르는 연산이라 SQL 의 WHERE 절에 해당해요. UNION, INTERSECTION, DIFFERENCE, PRODUCT 는 일반 집합 연산자입니다.' },
    { q: '`MERGE` 와 `RENAME` 은 각각 어디에 속하나요?', a: '`MERGE` 는 DML, `RENAME` 은 DDL 이에요.' },
    { q: '외래키 컬럼에 NULL 을 넣을 수 있나요?', a: '넣을 수 있어요. 참조 무결성은 "NULL 이거나 부모의 기본키에 있는 값"을 요구합니다.' },
    { q: '개체 무결성이 요구하는 두 가지는?', a: '기본키 컬럼은 NULL 이 아니어야 하고, 중복되지 않아야 해요.' },
    { q: 'SCOTT 계정과 HR 계정에 둘 다 EMP 테이블을 만들 수 있나요?', a: '만들 수 있어요. 같은 계정 안에서만 이름이 겹치면 안 됩니다.' }
  ],
  quiz: [
    { id: 'q1-01', level: 1, tag: 'SQL 종류',
      q: 'SQL 종류와 명령어를 짝지은 것으로 적절하지 않은 것은?',
      choices: [
        'DCL - `ROLLBACK`',
        'DML - `MERGE`',
        'DDL - `TRUNCATE`',
        'TCL - `SAVEPOINT`'
      ],
      answer: 1,
      why: '`ROLLBACK` 은 트랜잭션을 되돌리는 TCL 이에요. DCL 은 권한을 다루는 `GRANT`, `REVOKE` 둘뿐입니다. `MERGE` 는 데이터를 넣거나 고치니 DML, `TRUNCATE` 는 데이터를 지우지만 DDL, `SAVEPOINT` 는 TCL 이 맞아요.' },
    { id: 'q1-02', level: 2, tag: '테이블 용어',
      q: '관계형 데이터베이스의 용어에 대한 설명으로 적절하지 않은 것은?',
      choices: [
        '키는 행 하나를 가려내는 식별자 역할을 한다.',
        '속성은 테이블의 열(컬럼)에 해당한다.',
        '튜플은 테이블의 열 하나에 들어 있는 값 전체를 가리킨다.',
        '도메인은 하나의 속성이 가질 수 있는 값의 범위이다.'
      ],
      answer: 3,
      why: '튜플은 열이 아니라 행 하나예요. 사원 한 명의 정보처럼 가로 한 줄을 가리킵니다. 세로 한 줄은 속성(컬럼)이고, 그 속성에 들어갈 수 있는 값의 범위가 도메인이에요. 키는 행을 가려내는 식별자가 맞습니다.' },
    { id: 'q1-03', level: 2, tag: '무결성',
      q: '데이터 무결성에 대한 설명으로 적절하지 않은 것은?',
      choices: [
        '개체 무결성: 기본키를 구성하는 컬럼은 NULL 이나 중복 값을 가질 수 없다.',
        '도메인 무결성: 속성 값은 그 속성에 정의된 도메인에 속해야 한다.',
        '고유 무결성: 특정 속성의 값은 서로 중복되지 않아야 한다.',
        '참조 무결성: 외래키 값은 NULL 을 가질 수 없고, 참조하는 테이블의 기본키 값과 같아야 한다.'
      ],
      answer: 4,
      why: '참조 무결성은 외래키 값이 "NULL 이거나" 참조하는 테이블의 기본키 값과 같아야 한다는 규칙이에요. 외래키에는 NULL 이 들어갈 수 있습니다. NULL 을 못 갖는 쪽은 기본키(개체 무결성)예요.' },
    { id: 'q1-04', level: 2, tag: '무결성',
      q: 'DEPT 테이블의 기본키 DEPTNO 에는 10, 20, 30 이 있다. EMP 테이블의 DEPTNO 는 DEPT 의 DEPTNO 를 참조하는 외래키이다. EMP 에 DEPTNO 가 40 인 사원을 입력하려다 실패했다면, 이 입력을 막은 것은?',
      choices: [
        '개체 무결성',
        '참조 무결성',
        '도메인 무결성',
        '고유 무결성'
      ],
      answer: 2,
      why: '외래키에 부모 테이블의 기본키에 없는 값(40)을 넣으려 해서 막힌 것이니 참조 무결성이에요. 개체 무결성은 EMP 자신의 기본키가 NULL 이거나 중복일 때, 고유 무결성은 UNIQUE 로 지정한 컬럼 값이 겹칠 때 걸립니다. 40 은 숫자라서 타입이나 범위를 따지는 도메인 무결성과는 상관없어요.' },
    { id: 'q1-05', level: 3, tag: 'SQL 종류',
      q: '아래 명령어 중 DDL 에 속하는 것은 모두 몇 개인가?',
      code: `CREATE, DELETE, TRUNCATE, RENAME,
GRANT, MERGE, ALTER, COMMIT`,
      choices: ['2개', '3개', '4개', '5개'],
      answer: 3,
      why: 'DDL 은 `CREATE`, `TRUNCATE`, `RENAME`, `ALTER` 네 개예요. `DELETE` 와 `MERGE` 는 DML, `GRANT` 는 DCL, `COMMIT` 은 TCL 입니다. `TRUNCATE` 를 DML 로 세면 3개, `DELETE` 까지 DDL 로 세면 5개가 나오는데 둘 다 틀린 계산이에요.' },
    { id: 'q1-06', level: 3, tag: '테이블 특징',
      q: '테이블과 SQL 에 대한 설명으로 가장 적절한 것은?',
      choices: [
        '소유자(계정)가 다르더라도 이름이 같은 테이블은 만들 수 없다.',
        '데이터의 입력과 삭제는 행 단위로 이루어지고, 수정은 특정 컬럼 값만 골라서 할 수 있다.',
        '`SELECT` 와 `select` 는 서로 다른 명령으로 처리된다.',
        '기본키 컬럼에는 중복 값을 넣을 수 없지만 NULL 은 넣을 수 있다.'
      ],
      answer: 2,
      why: '입력과 삭제는 한 행이 통째로 들어가고 빠지며, 수정은 원하는 값만 바꿀 수 있어요. 테이블 이름은 같은 계정 안에서만 겹치면 안 되고 소유자가 다르면 같은 이름으로 만들 수 있습니다. SQL 예약어는 대소문자를 구분하지 않아요. 기본키는 개체 무결성에 따라 NULL 도 중복도 안 됩니다.' },
    { id: 'q1-07', level: 2, tag: '관계 연산',
      q: '다음 중 순수 관계 연산자에 속하지 않는 것은?',
      choices: ['SELECT', 'PROJECT', 'DIVIDE', 'PRODUCT'],
      answer: 4,
      why: '순수 관계 연산자는 SELECT, PROJECT, JOIN, DIVIDE 넷이에요. PRODUCT(곱집합)는 UNION, INTERSECTION, DIFFERENCE 와 함께 일반 집합 연산자에 속합니다. SQL 에서는 `CROSS JOIN` 이 PRODUCT 에 해당해요.' }
  ]
});
