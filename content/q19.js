SQLD.add({
  id: 'q19',
  title: 'DDL',
  minutes: 24,
  weight: 3,
  lead: '테이블을 만들고 고치고 지우는 명령어예요. 범위가 넓지만 묻는 곳은 정해져 있어요. 제약조건 다섯 가지, ALTER 로 되는 것과 안 되는 것, DELETE·TRUNCATE·DROP 비교에서 매회 두세 문제가 나옵니다.',
  goals: [
    'CHAR 와 VARCHAR2, NUMBER(p,s) 에 값이 어떻게 저장되는지 말할 수 있다',
    '제약조건 다섯 가지와 FK 옵션을 구분하고, INSERT 가 성공하는지 판단한다',
    'ALTER TABLE 로 컬럼을 추가·변경·삭제할 때의 조건을 안다',
    'DELETE, TRUNCATE, DROP 의 차이를 표로 떠올린다'
  ],
  blocks: [
    { t: 'h', x: 'DDL 은 구조를 다루는 명령어예요' },
    { t: 'p', x: 'DML 이 테이블 안의 데이터를 넣고 고치는 명령어라면, DDL(Data Definition Language)은 테이블 같은 객체 자체를 만들고 바꾸고 없애는 명령어예요. `CREATE`(생성), `ALTER`(변경), `DROP`(삭제), `RENAME`(이름 변경), `TRUNCATE`(데이터 전체 삭제)가 여기에 들어갑니다.' },
    { t: 'p', x: 'Oracle 에서 DDL 은 실행하는 순간 ==자동으로 COMMIT== 돼요. ROLLBACK 으로 되돌릴 수 없고, 그 앞에 하던 DML 까지 같이 확정됩니다.' },
    { t: 'trap', title: 'TRUNCATE 는 DDL', x: '데이터를 지우는 명령어라서 DML 로 분류한 보기가 나와요. TRUNCATE 는 DDL 이에요. DML 은 SELECT, INSERT, UPDATE, DELETE, MERGE 이고, COMMIT 과 ROLLBACK 은 TCL, GRANT 와 REVOKE 는 DCL 입니다.' },

    { t: 'h', x: 'CREATE TABLE' },
    { t: 'sql', code: `CREATE TABLE MEMBER (
  ID     NUMBER        PRIMARY KEY,
  NAME   VARCHAR2(20)  NOT NULL,
  GRADE  CHAR(1)       DEFAULT 'B',
  JOINED DATE
);` },
    { t: 'p', x: '컬럼마다 이름과 데이터 타입은 꼭 적어야 하고, DEFAULT 와 제약조건은 생략할 수 있어요. 이름을 지을 때 지켜야 하는 규칙이 보기로 나옵니다.' },
    { t: 'ul', items: [
      '테이블 이름과 컬럼 이름은 ==문자로 시작==해야 한다. 숫자로 시작할 수 없다',
      '쓸 수 있는 글자는 영문자, 숫자, `_`, `$`, `#` 이다',
      '같은 사용자 안에서 테이블 이름이 겹칠 수 없고, 한 테이블 안에서 컬럼 이름이 겹칠 수 없다',
      '`SELECT`, `TABLE` 같은 예약어는 이름으로 쓸 수 없다',
      '컬럼 정의는 콤마로 구분하고, 컬럼 이름 뒤에 데이터 타입을 반드시 적는다'
    ] },

    { t: 'h', x: '데이터 타입' },
    { t: 'table', head: ['타입', '성격', '기억할 것'], rows: [
      ['`CHAR(n)`', '고정 길이 문자', '값이 n 보다 짧으면 남는 자리를 공백으로 채운다. 크기를 생략하면 1'],
      ['`VARCHAR2(n)`', '가변 길이 문자', '넣은 만큼만 저장한다. 크기를 반드시 적는다. SQL Server 는 `VARCHAR`'],
      ['`NUMBER(p, s)`', '숫자', 'p 는 전체 자릿수, s 는 소수점 아래 자릿수. 크기를 생략할 수 있다. SQL Server 는 `NUMERIC`'],
      ['`DATE`', '날짜와 시각', '크기를 적지 않는다']
    ] },
    { t: 'fig', caption: '같은 AB 를 넣어도 CHAR(5) 는 다섯 칸을 다 쓰고 VARCHAR2(5) 는 두 칸만 써요.', svg: `<svg viewBox="0 0 640 130" xmlns="http://www.w3.org/2000/svg">
  <text x="160" y="24" class="tx-b" text-anchor="middle">CHAR(5)</text>
  <rect x="50" y="40" width="44" height="40" class="bx-a"/><text x="72" y="65" class="tx-m" text-anchor="middle">A</text>
  <rect x="94" y="40" width="44" height="40" class="bx-a"/><text x="116" y="65" class="tx-m" text-anchor="middle">B</text>
  <rect x="138" y="40" width="44" height="40" class="bx-y"/><text x="160" y="65" class="tx-s" text-anchor="middle">공백</text>
  <rect x="182" y="40" width="44" height="40" class="bx-y"/><text x="204" y="65" class="tx-s" text-anchor="middle">공백</text>
  <rect x="226" y="40" width="44" height="40" class="bx-y"/><text x="248" y="65" class="tx-s" text-anchor="middle">공백</text>
  <text x="160" y="108" class="tx" text-anchor="middle">길이 5</text>
  <line x1="320" y1="10" x2="320" y2="120" class="ln-d"/>
  <text x="480" y="24" class="tx-b" text-anchor="middle">VARCHAR2(5)</text>
  <rect x="436" y="40" width="44" height="40" class="bx-a"/><text x="458" y="65" class="tx-m" text-anchor="middle">A</text>
  <rect x="480" y="40" width="44" height="40" class="bx-a"/><text x="502" y="65" class="tx-m" text-anchor="middle">B</text>
  <text x="480" y="108" class="tx" text-anchor="middle">길이 2</text>
</svg>` },
    { t: 'vs',
      a: { title: 'CHAR', items: ['고정 길이. 남는 자리는 공백', 'CHAR 끼리 비교할 때는 짧은 쪽에 공백을 채워서 비교', '`\'AB\'` 와 `\'AB \'` 를 같다고 본다'] },
      b: { title: 'VARCHAR2', items: ['가변 길이. 넣은 만큼만 저장', '공백도 한 글자로 보고 비교', '`\'AB\'` 와 `\'AB \'` 를 다르다고 본다'] } },
    { t: 'p', x: '`NUMBER(5, 2)` 는 전체 5자리 중 소수점 아래가 2자리라는 뜻이에요. 정수 부분에 쓸 수 있는 자리는 5 - 2 = 3자리입니다.' },
    { t: 'table', caption: 'NUMBER(5, 2) 컬럼에 넣어 보면', head: ['넣는 값', '결과', '이유'], rows: [
      ['`123.45`', '123.45 저장', '정수 3자리, 소수 2자리'],
      ['`123.456`', '123.46 저장', '소수점 아래가 넘치면 반올림'],
      ['`1234.5`', '오류', '정수 부분이 4자리라 3자리를 넘음']
    ] },

    { t: 'h', x: '제약조건 다섯 가지' },
    { t: 'p', x: '회원 번호가 겹치거나, 없는 부서 번호를 가진 사원이 들어오면 데이터를 믿을 수 없게 돼요. 이런 값을 DBMS 가 막아 주도록 컬럼에 거는 규칙이 제약조건이에요.' },
    { t: 'table', head: ['제약조건', '막는 것', '기억할 것'], rows: [
      ['`PRIMARY KEY`', '중복과 NULL', 'UNIQUE + NOT NULL. ==테이블당 1개==. 여러 컬럼을 묶어 하나의 PK 로 만들 수는 있다. 유니크 인덱스가 자동 생성'],
      ['`UNIQUE`', '중복', '==NULL 은 허용==. 한 테이블에 여러 개 가능. 유니크 인덱스가 자동 생성'],
      ['`NOT NULL`', 'NULL', '이미 있는 컬럼에 걸 때는 `MODIFY` 로 건다'],
      ['`CHECK`', '조건에 안 맞는 값', '예: `CHECK (AGE >= 19)`. NULL 은 조건을 어긴 것으로 보지 않아 들어간다'],
      ['`FOREIGN KEY`', '부모 테이블에 없는 값', '부모의 PK 나 UNIQUE 컬럼을 참조. NULL 은 허용. 한 테이블에 여러 개 가능']
    ] },
    { t: 'sql', code: `-- 컬럼 옆에 적기
CREATE TABLE EMP (
  ENO  NUMBER       PRIMARY KEY,
  MAIL VARCHAR2(30) UNIQUE,
  SAL  NUMBER       CHECK (SAL >= 0),
  DNO  NUMBER       REFERENCES DEPT (DNO)
);

-- 아래쪽에 이름을 붙여 적기
CREATE TABLE EMP (
  ENO  NUMBER,
  DNO  NUMBER,
  CONSTRAINT EMP_PK PRIMARY KEY (ENO),
  CONSTRAINT EMP_FK FOREIGN KEY (DNO) REFERENCES DEPT (DNO)
);`, note: '제약조건 이름은 생략할 수 있고, 생략하면 DBMS 가 알아서 붙여요.' },
    { t: 'trap', title: 'UNIQUE 와 NULL, PK 의 개수', x: '"UNIQUE 는 NULL 을 허용하지 않는다"와 "한 테이블에 PRIMARY KEY 를 여러 개 만들 수 있다"는 둘 다 틀린 보기로 단골이에요. UNIQUE 는 NULL 이 들어가고, PK 는 테이블당 하나입니다. 컬럼 두 개를 묶은 복합 PK 도 PK 는 한 개예요.' },
    { t: 'trap', title: 'CHECK 는 NULL 을 통과시켜요', x: '`CHECK (AGE >= 19)` 가 걸린 컬럼에 18 은 못 넣지만 NULL 은 들어가요. NULL 과의 비교는 참도 거짓도 아닌 UNKNOWN 이고, CHECK 는 거짓일 때만 막습니다. INSERT 몇 건이 성공하는지 세는 문제에서 이 한 건을 놓치기 쉬워요.' },

    { t: 'h', x: 'FOREIGN KEY 와 참조 동작' },
    { t: 'p', x: 'FK 가 걸리면 자식 테이블(참조하는 쪽)과 부모 테이블(참조되는 쪽) 사이에 규칙이 생겨요. 기본 상태에서는 아래 두 가지가 막힙니다.' },
    { t: 'ul', items: [
      '자식에 넣거나 고치려는 FK 값이 부모에 없으면 오류',
      '자식이 참조하고 있는 부모 행을 삭제하거나 그 키 값을 바꾸려 하면 오류'
    ] },
    { t: 'p', x: '부모 행을 지울 때 자식을 어떻게 할지는 FK 를 만들 때 옵션으로 정할 수 있어요.' },
    { t: 'fig', caption: '부모 행을 지울 때 자식 행이 어떻게 되는지는 FK 옵션이 정해요.', svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="60" y="14" width="170" height="56" class="bx"/>
  <text x="145" y="37" class="tx-b" text-anchor="middle">DEPT (부모)</text>
  <text x="145" y="59" class="tx-m" text-anchor="middle">PK DNO = 10</text>
  <rect x="410" y="14" width="170" height="56" class="bx"/>
  <text x="495" y="37" class="tx-b" text-anchor="middle">EMP (자식)</text>
  <text x="495" y="59" class="tx-m" text-anchor="middle">FK DNO = 10</text>
  <line x1="408" y1="42" x2="238" y2="42" class="ln" marker-end="url(#arr)"/>
  <text x="320" y="34" class="tx-s" text-anchor="middle">참조</text>
  <text x="320" y="100" class="tx-b" text-anchor="middle">DEPT 의 10번 행을 DELETE 하면</text>
  <rect x="15" y="114" width="190" height="70" class="bx-r"/>
  <text x="110" y="142" class="tx-b" text-anchor="middle">CASCADE</text>
  <text x="110" y="166" class="tx-s" text-anchor="middle">자식 행도 같이 삭제</text>
  <rect x="225" y="114" width="190" height="70" class="bx-y"/>
  <text x="320" y="142" class="tx-b" text-anchor="middle">SET NULL</text>
  <text x="320" y="166" class="tx-s" text-anchor="middle">자식의 DNO 를 NULL 로</text>
  <rect x="435" y="114" width="190" height="70" class="bx-a"/>
  <text x="530" y="142" class="tx-b" text-anchor="middle">RESTRICT</text>
  <text x="530" y="166" class="tx-s" text-anchor="middle">삭제를 막음(오류)</text>
</svg>` },
    { t: 'table', caption: '부모를 삭제(DELETE)하거나 수정(MODIFY)할 때', head: ['옵션', '동작'], rows: [
      ['CASCADE', '부모를 삭제하면 그 부모를 참조하는 자식 행도 함께 삭제'],
      ['SET NULL', '부모를 삭제하면 자식의 FK 값을 NULL 로 바꿈'],
      ['SET DEFAULT', '부모를 삭제하면 자식의 FK 값을 DEFAULT 값으로 바꿈'],
      ['RESTRICT', '자식이 참조하고 있지 않을 때만 부모 삭제를 허용'],
      ['NO ACTION', '참조무결성을 어기는 삭제나 수정은 하지 않음']
    ] },
    { t: 'table', caption: '자식에 입력(INSERT)할 때', head: ['옵션', '동작'], rows: [
      ['AUTOMATIC', '부모에 그 키가 없으면 부모에 먼저 만들고 자식에 입력'],
      ['SET NULL', '부모에 그 키가 없으면 자식의 FK 를 NULL 로 입력'],
      ['SET DEFAULT', '부모에 그 키가 없으면 자식의 FK 를 DEFAULT 값으로 입력'],
      ['DEPENDENT', '부모에 그 키가 ==있을 때만== 자식 입력을 허용'],
      ['NO ACTION', '참조무결성을 어기는 입력은 하지 않음']
    ] },
    { t: 'sql', code: `ALTER TABLE EMP ADD CONSTRAINT EMP_FK
  FOREIGN KEY (DNO) REFERENCES DEPT (DNO) ON DELETE CASCADE;`, note: 'Oracle 에서 쓰는 형태는 ON DELETE CASCADE 와 ON DELETE SET NULL 이에요. 옵션을 안 적으면 자식이 있는 부모는 삭제되지 않습니다. 옵션은 FK 를 만들 때 정하고, 바꾸려면 FK 를 지우고 다시 만들어요.' },
    { t: 'trap', title: 'CASCADE 와 SET NULL 뒤바꾸기', x: '"ON DELETE CASCADE 로 만들면 부모만 삭제되고 자식은 남는다"처럼 설명을 바꿔 놓아요. CASCADE 는 자식 행까지 삭제, SET NULL 은 자식 행은 남기고 FK 값만 NULL 이에요. 결과를 묻는 문제라면 자식 테이블의 행 수가 줄어드는지로 갈립니다.' },

    { t: 'h', x: 'DEFAULT 와 NULL' },
    { t: 'p', x: 'DEFAULT 는 INSERT 할 때 그 컬럼을 ==아예 언급하지 않았을 때== 들어가는 값이에요. NULL 이라고 직접 적어 넣으면 DEFAULT 가 아니라 NULL 이 들어갑니다.' },
    { t: 'sql', code: `CREATE TABLE ORD (
  ONO NUMBER,
  ST  VARCHAR2(10) DEFAULT 'WAIT'
);
INSERT INTO ORD (ONO) VALUES (1);
INSERT INTO ORD (ONO, ST) VALUES (2, NULL);

SELECT * FROM ORD;`, result: { head: ['ONO', 'ST'], rows: [[1, 'WAIT'], [2, null]] },
      note: '1번은 ST 를 언급하지 않아 DEFAULT, 2번은 NULL 을 직접 넣어 NULL 이에요.' },

    { t: 'h', x: 'CTAS 로 테이블 복사하기' },
    { t: 'p', x: '`CREATE TABLE … AS SELECT …` 를 줄여서 CTAS 라고 불러요. SELECT 결과의 컬럼 이름, 데이터 타입, 데이터를 그대로 가진 새 테이블이 만들어집니다. SELECT 에 별칭을 주면 별칭이 컬럼 이름이 되고, `CREATE TABLE B (X, Y) AS SELECT …` 처럼 테이블 이름 뒤에 새 컬럼 이름을 적어 줄 수도 있어요.' },
    { t: 'sql', code: `CREATE TABLE EMP_BAK AS
SELECT * FROM EMP;

-- 구조만 복사(데이터 없이)
CREATE TABLE EMP_EMPTY AS
SELECT * FROM EMP WHERE 1 = 2;`, note: 'WHERE 에 항상 거짓인 조건을 주면 행은 0건이고 컬럼 구조만 따라와요.' },
    { t: 'trap', title: 'CTAS 는 NOT NULL 만 따라와요', x: '원본의 PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK, 인덱스는 복사되지 않아요. ==NOT NULL 만== 복사됩니다. PK 컬럼에 자동으로 붙어 있던 "NULL 불가" 성질도 PK 와 함께 빠져서, 복사본에는 PK 였던 컬럼에 NULL 과 중복 값이 들어가요. SQL Server 에서는 같은 일을 `SELECT … INTO 새테이블 FROM …` 으로 합니다.' },

    { t: 'h', x: 'ALTER TABLE' },
    { t: 'p', x: '이미 만든 테이블의 컬럼과 제약조건을 바꾸는 명령어예요. 컬럼의 순서를 바꾸는 기능은 없습니다.' },
    { t: 'table', head: ['하려는 일', 'Oracle 문법', '조건'], rows: [
      ['컬럼 추가', '`ALTER TABLE T ADD (C1 NUMBER, C2 DATE);`', '새 컬럼은 항상 ==맨 뒤==에 붙는다. 여러 개면 괄호로 묶는다'],
      ['컬럼 변경', '`ALTER TABLE T MODIFY (C1 VARCHAR2(20) DEFAULT \'X\' NOT NULL);`', '타입, 크기, DEFAULT, NOT NULL 을 바꾼다. 아래 표의 조건을 따른다'],
      ['컬럼 삭제', '`ALTER TABLE T DROP COLUMN C1;`', '데이터가 있어도 삭제된다. 되돌릴 수 없다'],
      ['컬럼 이름 변경', '`ALTER TABLE T RENAME COLUMN C1 TO C9;`', '한 번에 한 컬럼'],
      ['제약조건 추가', '`ALTER TABLE T ADD CONSTRAINT T_PK PRIMARY KEY (C1);`', '이미 든 데이터가 그 제약을 어기고 있으면 오류'],
      ['제약조건 삭제', '`ALTER TABLE T DROP CONSTRAINT T_PK;`', '']
    ] },
    { t: 'table', caption: '데이터가 들어 있는 테이블에서 ADD, MODIFY 가 되는 조건', head: ['바꾸려는 것', '되는 경우'], rows: [
      ['컬럼 추가', '기존 행의 새 컬럼 값은 NULL. DEFAULT 를 주면서 추가하면 기존 행에도 DEFAULT 값이 들어간다'],
      ['NOT NULL 컬럼 추가', '기존 행이 NULL 이 되므로 그냥은 오류. `DEFAULT 값 NOT NULL` 을 같이 주면 가능'],
      ['크기 늘리기', '항상 가능'],
      ['크기 줄이기', '행이 없거나 값이 전부 NULL 이면 가능. 문자 컬럼은 들어 있는 값 중 가장 긴 것의 길이까지 줄일 수 있다'],
      ['데이터 타입 바꾸기', '행이 없거나 그 컬럼 값이 전부 NULL 일 때. CHAR 와 VARCHAR2 사이는 데이터가 있어도 가능'],
      ['DEFAULT 바꾸기', '언제나 가능. 단 ==바꾼 뒤에 입력되는 행부터== 적용되고 기존 행은 그대로. DEFAULT 를 없애려면 `DEFAULT NULL` 로 바꾼다'],
      ['NOT NULL 걸기', '그 컬럼에 NULL 이 하나도 없을 때만']
    ] },
    { t: 'trap', title: 'DEFAULT 와 NOT NULL 의 순서', x: '`ADD C NUMBER DEFAULT 0 NOT NULL` 은 되지만 `ADD C NUMBER NOT NULL DEFAULT 0` 은 오류예요. DEFAULT 를 먼저, NOT NULL 을 뒤에 적습니다. 문법이 틀린 문장을 고르라는 문제에 그대로 나와요.' },
    { t: 'trap', title: 'DEFAULT 를 바꿔도 기존 행은 그대로', x: '`MODIFY (ST DEFAULT \'DONE\')` 을 해도 이미 들어 있는 행의 ST 는 바뀌지 않아요. 그 뒤에 ST 를 언급하지 않고 INSERT 한 행부터 새 DEFAULT 가 들어갑니다. ALTER 와 INSERT 를 섞어 놓고 최종 데이터를 묻는 문제의 재료예요.' },
    { t: 'table', caption: 'Oracle 과 SQL Server', head: ['하려는 일', 'Oracle', 'SQL Server'], rows: [
      ['컬럼 추가', '`ADD (C1 NUMBER, C2 DATE)` 괄호 사용', '`ADD C1 INT, C2 DATE` 괄호 없이'],
      ['컬럼 변경', '`MODIFY (C1 VARCHAR2(20))` 여러 컬럼 동시 가능', '`ALTER COLUMN C1 VARCHAR(20)` 한 번에 한 컬럼'],
      ['컬럼 이름 변경', '`RENAME COLUMN A TO B`', '`sp_rename` 프로시저'],
      ['테이블 이름 변경', '`RENAME A TO B`', '`sp_rename` 프로시저'],
      ['테이블 복사', '`CREATE TABLE B AS SELECT …`', '`SELECT … INTO B FROM …`']
    ] },
    { t: 'check', q: 'VARCHAR2(10) 컬럼에 \'SEOUL\' 과 \'BUSAN\' 이 들어 있어요. 이 컬럼을 VARCHAR2(5) 로 줄일 수 있을까요? VARCHAR2(4) 는요?', a: 'VARCHAR2(5) 는 돼요. 들어 있는 값이 모두 5글자라 줄인 크기에 맞습니다. VARCHAR2(4) 는 값이 잘리게 되므로 오류가 나요.' },

    { t: 'h', x: 'RENAME, DROP TABLE, TRUNCATE' },
    { t: 'sql', code: `RENAME EMP_BAK TO EMP_OLD;                 -- 테이블 이름 변경
DROP TABLE EMP_OLD;                         -- 테이블 삭제
DROP TABLE DEPT CASCADE CONSTRAINT;         -- 이 테이블을 참조하던 FK 제약조건까지 삭제
DROP TABLE EMP_OLD PURGE;                   -- 휴지통을 거치지 않고 완전히 삭제
TRUNCATE TABLE EMP_OLD;                     -- 구조는 두고 모든 행 삭제` },
    { t: 'p', x: '다른 테이블이 FK 로 참조하고 있는 부모 테이블은 그냥 DROP 하면 오류가 나요. `CASCADE CONSTRAINT` 를 붙이면 그 FK 제약조건을 같이 없애고 테이블을 지웁니다. 이때 없어지는 것은 제약조건이고, 자식 테이블의 데이터는 그대로 남아요.' },
    { t: 'p', x: 'Oracle 에서 DROP 한 테이블은 휴지통(RECYCLEBIN)에 들어가요. `PURGE` 를 붙이면 휴지통에 남기지 않습니다.' },
    { t: 'table', caption: '데이터를 지우는 세 가지', head: ['', 'DELETE', 'TRUNCATE', 'DROP'], rows: [
      ['분류', 'DML', 'DDL', 'DDL'],
      ['지우는 범위', 'WHERE 로 일부 또는 전체', '전체만(WHERE 불가)', '데이터와 테이블 구조 전부'],
      ['커밋', '직접 COMMIT', '자동 커밋', '자동 커밋'],
      ['ROLLBACK', 'COMMIT 전이면 가능', '불가', '불가'],
      ['테이블 구조', '남음', '남음', '없어짐'],
      ['저장공간', '반납되지 않음', '처음 만들었을 때 상태로 반납', '전부 반납'],
      ['로그', '행마다 남김(느림)', '행 단위 로그를 남기지 않음(빠름)', '남기지 않음']
    ] },
    { t: 'trap', title: 'DELETE 로 다 지워도 공간은 그대로', x: '`DELETE FROM T;` 로 모든 행을 지운 결과와 `TRUNCATE TABLE T;` 의 결과는 눈에는 똑같이 0건이에요. 차이는 DELETE 는 저장공간을 반납하지 않고 ROLLBACK 할 수 있다는 것, TRUNCATE 는 공간을 반납하고 ROLLBACK 할 수 없다는 것입니다. 둘 다 테이블 구조는 남아요. 구조까지 없어지는 건 DROP 뿐이에요.' },

    { t: 'h', x: '그 밖의 객체' },
    { t: 'p', x: '뷰(VIEW)는 SELECT 문에 이름을 붙여 저장해 둔 가상 테이블이에요. ==실제 데이터를 갖지 않고== 정의(SELECT 문)만 저장되며, 조회할 때마다 원본 테이블에서 데이터를 가져옵니다.' },
    { t: 'sql', code: `CREATE OR REPLACE VIEW V_EMP10 AS
SELECT ENO, ENAME FROM EMP WHERE DNO = 10;

SELECT * FROM V_EMP10;
DROP VIEW V_EMP10;` },
    { t: 'table', caption: '뷰의 장점', head: ['장점', '뜻'], rows: [
      ['독립성', '테이블 구조가 바뀌어도 뷰를 쓰는 응용 프로그램은 고치지 않아도 된다'],
      ['편리성', '복잡한 질의를 뷰로 만들어 두면 단순한 질의로 쓸 수 있다'],
      ['보안성', '급여처럼 숨기고 싶은 컬럼을 빼고 뷰를 만들어 보여 줄 수 있다']
    ] },
    { t: 'ul', items: [
      '뷰를 바탕으로 또 다른 뷰를 만들 수 있다',
      '테이블 하나로 만든 뷰를 단순 뷰, 둘 이상을 조인해 만든 뷰를 복합 뷰라고 한다. 조인이나 집계가 들어간 복잡한 SELECT 문으로도 뷰를 만들 수 있다',
      '뷰의 정의는 ALTER 로 고치지 않고 다시 만든다(`CREATE OR REPLACE VIEW`)',
      '뷰에는 인덱스를 직접 만들 수 없고, 뷰를 통한 INSERT, UPDATE, DELETE 에는 제한이 있다'
    ] },
    { t: 'table', head: ['객체', '하는 일', '예'], rows: [
      ['시퀀스(SEQUENCE)', '1, 2, 3 처럼 이어지는 번호를 자동으로 만들어 준다', '`CREATE SEQUENCE SEQ_ORD START WITH 1 INCREMENT BY 1;` 뒤에 `SEQ_ORD.NEXTVAL`'],
      ['시노님(SYNONYM)', '객체에 붙이는 별칭. 다른 사용자의 `SCOTT.EMP` 를 `EMP` 로 부를 수 있게 한다', '`CREATE SYNONYM EMP FOR SCOTT.EMP;` `PUBLIC` 을 붙이면 모든 사용자가 쓴다'],
      ['인덱스(INDEX)', '원하는 행을 빨리 찾게 해 주는 색인. 테이블과 따로 저장된다', '`CREATE INDEX IDX_EMP_DNO ON EMP (DNO);`']
    ] },
    { t: 'check', q: 'EMP 를 CTAS 로 복사한 EMP2 에 EMP 의 PK 값과 같은 사번으로 INSERT 하면 어떻게 될까요?', a: '들어가요. CTAS 는 NOT NULL 만 복사하고 PRIMARY KEY 는 복사하지 않아서, EMP2 에는 중복을 막는 장치가 없습니다.' }
  ],
  keys: [
    'DDL 은 CREATE, ALTER, DROP, RENAME, TRUNCATE. Oracle 에서는 실행하면 자동 커밋',
    'CHAR 는 고정 길이(공백 채움), VARCHAR2 는 가변 길이. NUMBER(5,2) 의 정수 부분은 3자리',
    'PRIMARY KEY = UNIQUE + NOT NULL, 테이블당 1개. UNIQUE 는 NULL 허용. CHECK 도 NULL 은 통과',
    'FK: CASCADE 는 자식도 삭제, SET NULL 은 자식 FK 를 NULL 로. INSERT 쪽 DEPENDENT 는 부모에 키가 있을 때만 입력',
    'DEFAULT 는 컬럼을 언급하지 않았을 때만. NULL 을 직접 넣으면 NULL',
    'CTAS 는 NOT NULL 만 복사. PK, UNIQUE, FK, CHECK, 인덱스는 빠진다',
    'ADD 컬럼은 맨 뒤, 크기 줄이기는 데이터가 맞을 때만, DEFAULT 변경은 이후 입력분부터, DEFAULT 는 NOT NULL 앞에 적는다',
    'DELETE 는 DML·롤백 가능·공간 유지, TRUNCATE 는 DDL·롤백 불가·구조 유지, DROP 은 구조까지 삭제'
  ],
  cards: [
    { q: 'CHAR(5) 컬럼에 `\'AB\'` 를 넣으면 길이는?', a: '5. 남는 세 자리를 공백으로 채워요. VARCHAR2(5) 였다면 2.' },
    { q: 'PRIMARY KEY 와 UNIQUE 의 차이는?', a: 'PK 는 NULL 불가이고 테이블당 1개. UNIQUE 는 NULL 을 허용하고 여러 개 만들 수 있어요.' },
    { q: 'DEFAULT 가 있는 컬럼에 NULL 을 직접 INSERT 하면?', a: 'NULL 이 들어가요. DEFAULT 는 그 컬럼을 언급하지 않았을 때만 적용됩니다.' },
    { q: 'CTAS 로 복사할 때 따라오는 제약조건은?', a: 'NOT NULL 뿐이에요.' },
    { q: 'ON DELETE CASCADE 와 ON DELETE SET NULL 의 차이는?', a: 'CASCADE 는 부모를 지우면 자식 행도 삭제, SET NULL 은 자식 행은 두고 FK 값만 NULL 로 바꿔요.' },
    { q: 'DELETE, TRUNCATE, DROP 중 ROLLBACK 이 되는 것은?', a: 'DELETE 만. COMMIT 하기 전이라면 되돌릴 수 있어요.' },
    { q: '컬럼의 DEFAULT 값을 바꾸면 기존 행은?', a: '그대로예요. 바꾼 뒤에 입력되는 행부터 적용됩니다.' },
    { q: '뷰의 장점 세 가지는?', a: '독립성, 편리성, 보안성. 뷰는 실제 데이터를 갖지 않아요.' }
  ],
  quiz: [
    { id: 'q19-01', level: 1, tag: '데이터 타입',
      q: 'Oracle 의 데이터 타입에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'CHAR 는 고정 길이 문자 타입이라 값이 정의한 길이보다 짧으면 남는 자리를 공백으로 채운다.',
        'VARCHAR2(10) 컬럼에 \'AB\' 를 넣으면 뒤에 공백 8개가 채워져 길이 10 으로 저장된다.',
        'NUMBER(7, 2) 는 전체 7자리 중 소수점 아래 2자리를 뜻한다.',
        'DATE 타입은 컬럼을 정의할 때 크기를 지정하지 않는다.'
      ],
      answer: 2,
      why: 'VARCHAR2 는 가변 길이라서 넣은 만큼만 저장해요. \'AB\' 는 길이 2 로 들어갑니다. 공백을 채우는 것은 고정 길이인 CHAR 예요. 나머지 세 보기는 맞는 설명입니다.' },
    { id: 'q19-02', level: 2, tag: '데이터 타입',
      q: 'Oracle 에서 아래 SQL 을 차례로 실행했을 때 SELECT 의 결과로 알맞은 것은?',
      code: `CREATE TABLE T (
  C1 CHAR(5),
  C2 VARCHAR2(5)
);
INSERT INTO T VALUES ('AB', 'AB');

SELECT LENGTH(C1), LENGTH(C2) FROM T;`,
      choices: ['2, 2', '5, 5', '5, 2', '2, 5'],
      answer: 3,
      why: 'CHAR(5) 는 고정 길이라 \'AB\' 뒤에 공백 3개를 채워 길이가 5 가 돼요. VARCHAR2(5) 는 넣은 만큼만 저장해서 길이가 2 입니다. 두 타입을 반대로 기억하면 2, 5 를 고르게 돼요.' },
    { id: 'q19-03', level: 2, tag: '데이터 타입',
      q: 'Oracle 에서 `CREATE TABLE T (N NUMBER(5, 2));` 로 테이블을 만들었다. 다음 중 오류가 나는 INSERT 문은?',
      choices: [
        { code: `INSERT INTO T VALUES (123.456);` },
        { code: `INSERT INTO T VALUES (0.5);` },
        { code: `INSERT INTO T VALUES (-999.99);` },
        { code: `INSERT INTO T VALUES (1234.5);` }
      ],
      answer: 4,
      why: 'NUMBER(5, 2) 는 전체 5자리, 소수점 아래 2자리라서 정수 부분은 3자리까지예요. 1234.5 는 정수 부분이 4자리라 오류가 납니다. 123.456 은 소수점 아래가 넘치지만 반올림되어 123.46 으로 저장돼요. 자릿수가 넘쳐서 오류가 나는 쪽은 정수 부분입니다.' },
    { id: 'q19-04', level: 1, tag: 'CREATE TABLE',
      q: '테이블 생성에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        '테이블 이름과 컬럼 이름은 숫자로 시작할 수 있다.',
        '한 테이블 안에서 컬럼 이름은 중복될 수 없다.',
        '컬럼을 정의할 때 데이터 타입은 반드시 지정해야 한다.',
        '컬럼의 DEFAULT 값과 제약조건은 생략할 수 있다.'
      ],
      answer: 1,
      why: '테이블 이름과 컬럼 이름은 문자로 시작해야 해요. 숫자는 이름 중간이나 끝에만 쓸 수 있습니다. 컬럼 이름 중복 불가, 데이터 타입 필수, DEFAULT 와 제약조건 생략 가능은 모두 맞는 설명이에요.' },
    { id: 'q19-05', level: 3, tag: '제약조건',
      q: 'Oracle 에서 아래 SQL 을 차례로 실행했다. 오류가 나는 문장은 그 문장만 실행되지 않는다고 할 때, 마지막 SELECT 의 결과는?',
      code: `CREATE TABLE M (
  ID    NUMBER       PRIMARY KEY,
  EMAIL VARCHAR2(20) UNIQUE,
  AGE   NUMBER       CHECK (AGE >= 19)
);
INSERT INTO M VALUES (1, 'a@x.com', 20);
INSERT INTO M VALUES (2, NULL, 30);
INSERT INTO M VALUES (3, NULL, NULL);
INSERT INTO M VALUES (NULL, 'b@x.com', 25);
INSERT INTO M VALUES (4, 'a@x.com', 40);
INSERT INTO M VALUES (5, 'c@x.com', 18);

SELECT COUNT(*) FROM M;`,
      choices: ['1', '2', '3', '4'],
      answer: 3,
      why: '1번, 2번, 3번 INSERT 가 성공해서 3건이에요. UNIQUE 는 NULL 을 허용하므로 EMAIL 이 NULL 인 행이 두 건 들어가고, CHECK 는 NULL 을 조건 위반으로 보지 않아 AGE 가 NULL 인 행도 들어갑니다. 4번째는 PK 에 NULL 을 넣어서, 5번째는 EMAIL 이 중복이라서, 6번째는 AGE 가 19 보다 작아서 실패해요. 3번째 INSERT 를 실패로 보면 2 를 고르게 됩니다.' },
    { id: 'q19-06', level: 2, tag: 'DEFAULT',
      q: 'Oracle 에서 아래 SQL 을 차례로 실행했을 때 마지막 SELECT 의 결과로 알맞은 것은?',
      code: `CREATE TABLE P (
  ID NUMBER,
  ST VARCHAR2(5) DEFAULT 'NEW'
);
INSERT INTO P (ID) VALUES (1);
INSERT INTO P (ID, ST) VALUES (2, NULL);
ALTER TABLE P MODIFY (ST DEFAULT 'OLD');
INSERT INTO P (ID) VALUES (3);

SELECT ID, ST FROM P ORDER BY ID;`,
      choices: [
        { head: ['ID', 'ST'], rows: [[1, 'NEW'], [2, null], [3, 'OLD']] },
        { head: ['ID', 'ST'], rows: [[1, 'OLD'], [2, 'OLD'], [3, 'OLD']] },
        { head: ['ID', 'ST'], rows: [[1, 'NEW'], [2, 'NEW'], [3, 'OLD']] },
        { head: ['ID', 'ST'], rows: [[1, 'OLD'], [2, null], [3, 'OLD']] }
      ],
      answer: 1,
      why: '1번 행은 ST 를 언급하지 않아 당시 DEFAULT 인 NEW 가 들어가요. 2번 행은 NULL 을 직접 넣었으니 DEFAULT 가 아니라 NULL 입니다. DEFAULT 를 OLD 로 바꿔도 기존 행은 바뀌지 않고, 그 뒤에 입력한 3번 행만 OLD 가 돼요.' },
    { id: 'q19-07', level: 2, tag: 'DELETE·TRUNCATE·DROP',
      q: 'DELETE, TRUNCATE, DROP 에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'DELETE 는 DML 이라 COMMIT 하기 전이면 ROLLBACK 으로 되돌릴 수 있다.',
        'TRUNCATE 는 DDL 이며 WHERE 절로 일부 행만 지울 수 없다.',
        'DROP 은 데이터뿐 아니라 테이블 구조까지 삭제한다.',
        'DELETE 로 모든 행을 지우면 TRUNCATE 와 마찬가지로 테이블이 쓰던 저장공간이 반납된다.'
      ],
      answer: 4,
      why: 'DELETE 는 모든 행을 지워도 테이블이 쓰던 저장공간을 반납하지 않아요. 공간을 반납하는 쪽은 TRUNCATE 와 DROP 입니다. 나머지 세 보기는 맞는 설명이에요.' },
    { id: 'q19-08', level: 3, tag: 'CTAS',
      q: 'Oracle 에서 아래와 같이 테이블 A 를 만들고 한 행을 넣은 뒤 테이블 B 를 만들었다. 다음 중 오류가 나는 INSERT 문은? (보기는 서로 영향을 주지 않는다고 본다)',
      code: `CREATE TABLE A (
  ID  NUMBER       PRIMARY KEY,
  NM  VARCHAR2(10) NOT NULL,
  CD  VARCHAR2(5)  UNIQUE,
  QTY NUMBER       CHECK (QTY > 0)
);
INSERT INTO A VALUES (1, 'KIM', 'C1', 5);

CREATE TABLE B AS SELECT * FROM A;`,
      choices: [
        { code: `INSERT INTO B VALUES (NULL, 'LEE', 'C2', 3);` },
        { code: `INSERT INTO B VALUES (2, NULL, 'C2', 3);` },
        { code: `INSERT INTO B VALUES (2, 'LEE', 'C2', -5);` },
        { code: `INSERT INTO B VALUES (1, 'LEE', 'C1', 3);` }
      ],
      answer: 2,
      why: 'CTAS 로 만든 테이블에는 NOT NULL 만 복사돼요. B 에서 살아 있는 제약은 NM 의 NOT NULL 하나라서 NM 에 NULL 을 넣는 두 번째 보기만 오류가 납니다. PRIMARY KEY 가 빠졌으니 ID 에 NULL 이나 중복 값 1 이 들어가고, UNIQUE 가 빠져 CD 에 C1 이 또 들어가고, CHECK 가 빠져 -5 도 들어가요.' },
    { id: 'q19-09', level: 2, tag: 'ALTER TABLE',
      q: 'Oracle 에서 테이블 T(C1 NUMBER, C2 VARCHAR2(10)) 에 데이터가 들어 있다. 다음 중 오류가 나는 문장은? (보기는 서로 영향을 주지 않는다고 본다)',
      choices: [
        { code: `ALTER TABLE T ADD (C3 NUMBER, C4 DATE);` },
        { code: `ALTER TABLE T ADD C5 NUMBER DEFAULT 0 NOT NULL;` },
        { code: `ALTER TABLE T ADD C6 NUMBER NOT NULL DEFAULT 0;` },
        { code: `ALTER TABLE T MODIFY (C2 VARCHAR2(30));` }
      ],
      answer: 3,
      why: 'DEFAULT 는 NOT NULL 보다 앞에 적어야 해요. `NOT NULL DEFAULT 0` 순서는 문법 오류입니다. 여러 컬럼을 괄호로 묶어 추가하는 것, DEFAULT 를 주면서 NOT NULL 컬럼을 추가하는 것, 컬럼 크기를 늘리는 것은 모두 정상이에요.' },
    { id: 'q19-10', level: 3, tag: 'ALTER TABLE',
      q: 'Oracle 에서 테이블 T 의 컬럼 C 는 VARCHAR2(10) 이고 아래 데이터가 들어 있다. 다음 중 정상적으로 실행되는 문장은? (보기는 서로 영향을 주지 않는다고 본다)',
      tables: [{ name: 'T', head: ['ID', 'C'], rows: [[1, 'APPLE'], [2, 'KIWI'], [3, null]] }],
      choices: [
        { code: `ALTER TABLE T MODIFY (C VARCHAR2(5));` },
        { code: `ALTER TABLE T MODIFY (C VARCHAR2(4));` },
        { code: `ALTER TABLE T MODIFY (C NOT NULL);` },
        { code: `ALTER TABLE T MODIFY (C NUMBER);` }
      ],
      answer: 1,
      why: '크기를 줄이는 것은 들어 있는 값이 줄인 크기에 다 맞을 때만 돼요. 가장 긴 값 APPLE 이 5글자라 VARCHAR2(5) 는 되고 VARCHAR2(4) 는 안 됩니다. NOT NULL 은 NULL 이 하나도 없을 때만 걸 수 있는데 3번 행이 NULL 이에요. 문자를 숫자로 바꾸는 타입 변경은 컬럼에 데이터가 없을 때만 됩니다.' },
    { id: 'q19-11', level: 2, tag: 'FOREIGN KEY',
      q: 'EMP.DNO 가 DEPT.DNO 를 참조하는 FK 가 `ON DELETE SET NULL` 옵션으로 만들어져 있다. Oracle 에서 아래 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'DEPT', head: ['DNO'], rows: [[10], [20], [30]] },
        { name: 'EMP', head: ['ENO', 'DNO'], rows: [[1, 10], [2, 10], [3, 20], [4, null]] }
      ],
      code: `DELETE FROM DEPT WHERE DNO = 10;

SELECT COUNT(*), COUNT(DNO) FROM EMP;`,
      choices: ['2, 1', '4, 1', '4, 3', '2, 2'],
      answer: 2,
      why: 'SET NULL 은 자식 행을 지우지 않고 FK 값만 NULL 로 바꿔요. EMP 는 4건 그대로이고 DNO 는 NULL, NULL, 20, NULL 이 되어 COUNT(DNO) 는 1 입니다. 2, 1 은 ON DELETE CASCADE 였을 때의 결과이고, 4, 3 은 EMP 에 아무 변화가 없다고 본 값이에요.' },
    { id: 'q19-12', level: 1, tag: '뷰',
      q: '뷰(VIEW)에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        '뷰는 SELECT 문의 정의만 저장하고 실제 데이터는 갖지 않는다.',
        '필요한 컬럼만 골라 뷰로 만들어 보여 주면 보안에 도움이 된다.',
        '이미 만든 뷰를 바탕으로 또 다른 뷰를 만들 수 있다.',
        '뷰를 만들면 조회 결과가 별도 저장공간에 복사되므로, 원본 테이블이 바뀌어도 뷰의 조회 결과는 달라지지 않는다.'
      ],
      answer: 4,
      why: '뷰는 데이터를 복사해 두지 않아요. 정의만 저장하고 조회할 때마다 원본 테이블에서 가져오므로, 원본이 바뀌면 뷰의 결과도 바뀝니다. 나머지는 뷰의 특징과 장점(보안성)을 맞게 설명했어요.' },
    { id: 'q19-13', level: 2, tag: 'FOREIGN KEY',
      q: '참조무결성 규칙 중 자식 테이블에 행을 입력할 때의 동작에 대한 설명이다. 빈칸에 들어갈 것은?\n\n"(      ) : 부모 테이블에 해당 PK 값이 존재할 때만 자식 테이블의 입력을 허용한다."',
      choices: ['AUTOMATIC', 'CASCADE', 'DEPENDENT', 'SET DEFAULT'],
      answer: 3,
      why: '부모에 키가 있을 때만 자식 입력을 허용하는 것은 DEPENDENT 예요. AUTOMATIC 은 부모에 키가 없으면 부모에 먼저 만든 뒤 자식에 입력하고, SET DEFAULT 는 부모에 키가 없으면 자식의 FK 를 DEFAULT 값으로 넣습니다. CASCADE 는 부모를 삭제하거나 수정할 때의 동작이에요.' }
  ]
});
