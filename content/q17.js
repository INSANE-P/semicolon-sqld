SQLD.add({
  id: 'q17',
  title: 'DML',
  minutes: 15,
  weight: 3,
  lead: 'INSERT, UPDATE, DELETE, MERGE 네 문장이에요. 문장 몇 개를 차례로 실행한 뒤 테이블에 무엇이 남는지, 어느 문장이 제약조건에 걸려 실패하는지를 묻는 문제가 거의 매회 나옵니다.',
  goals: [
    'INSERT 에서 컬럼 목록을 생략하거나 일부만 적었을 때 무슨 일이 생기는지 말할 수 있다',
    'WHERE 가 없는 UPDATE, DELETE 와 서브쿼리 UPDATE 의 결과를 계산한다',
    'MERGE 문의 각 절이 하는 일과 문법 제약을 안다',
    'PK, NOT NULL, FK 제약조건에 걸리는 문장을 골라낸다'
  ],
  blocks: [
    { t: 'h', x: 'DML 은 데이터를 바꾸는 문장' },
    { t: 'p', x: '테이블이라는 그릇은 그대로 두고 그 안의 행을 넣고, 고치고, 지우는 문장을 DML(Data Manipulation Language)이라고 해요. INSERT(삽입), UPDATE(수정), DELETE(삭제), MERGE(병합) 넷이에요.' },
    { t: 'p', x: 'Oracle 에서 DML 은 실행했다고 바로 확정되지 않아요. ==COMMIT 을 해야 저장되고, 그 전에는 ROLLBACK 으로 되돌릴 수 있어요.== 이 점이 테이블 구조를 바꾸는 DDL 과 갈리는 곳입니다. 자세한 것은 다음 장(TCL)에서 다뤄요.' },
    { t: 'p', x: '이 장에서는 아래 테이블로 계속 볼게요. ID 는 기본키, NAME 은 NOT NULL, PRICE 는 기본값이 0 이에요.' },
    { t: 'sql', code: `CREATE TABLE ITEM (
  ID    NUMBER        PRIMARY KEY,
  NAME  VARCHAR2(20)  NOT NULL,
  PRICE NUMBER        DEFAULT 0
);` },

    { t: 'h', x: 'INSERT: 행 넣기' },
    { t: 'sql', code: `INSERT INTO ITEM (ID, NAME, PRICE) VALUES (1, 'PEN', 500);   -- 컬럼 목록을 적는 방법
INSERT INTO ITEM VALUES (2, 'INK', 3000);                     -- 컬럼 목록을 생략하는 방법
INSERT INTO ITEM (ID, NAME) VALUES (3, 'CLIP');               -- 일부 컬럼만 넣는 방법`,
      result: { head: ['ID', 'NAME', 'PRICE'], rows: [[1, 'PEN', 500], [2, 'INK', 3000], [3, 'CLIP', 0]] },
      note: '셋째 문장은 PRICE 를 적지 않았어요. 기본값(DEFAULT)이 있어서 0 이 들어갔습니다.' },
    { t: 'ul', items: [
      '컬럼 목록을 **생략**하면 테이블에 정의된 순서대로 ==모든 컬럼==의 값을 다 줘야 해요. 값의 개수가 모자라거나 남으면 오류입니다.',
      '컬럼 목록을 적으면 그 순서대로 값을 줘요. 테이블에 정의된 순서와 달라도 됩니다. 예: `(NAME, ID) VALUES (\'TAPE\', 4)`',
      '목록에 **안 적은 컬럼**에는 DEFAULT 가 있으면 그 값이, 없으면 NULL 이 들어가요.',
      '문자와 날짜 값은 작은따옴표로 감싸고, 숫자는 그대로 써요.',
      '컬럼의 데이터 타입과 크기에 맞아야 해요. VARCHAR2(20) 컬럼에 21글자를 넣으면 오류입니다.',
      '숫자 컬럼은 넘치는 곳에 따라 달라요. `NUMBER(5,2)` 는 정수부 3자리, 소수부 2자리예요. 123.456 처럼 ==소수부가 넘치면 반올림==해서 123.46 이 들어가고(오류 아님), 1234.5 처럼 ==정수부가 넘치면 오류==입니다.',
      '타입이 달라도 바꿀 수 있는 값이면 자동으로 바뀌어 들어가요. 숫자 컬럼에 `\'001\'` 을 넣으면 1 이, 문자 컬럼에 123 을 넣으면 `\'123\'` 이 들어갑니다. 숫자 컬럼에 `\'ABC\'` 는 바꿀 수 없어 오류예요.'
    ] },
    { t: 'trap', title: '안 적은 컬럼이 NOT NULL 이면 실패', x: '`INSERT INTO ITEM (ID, PRICE) VALUES (5, 100)` 은 NAME 을 안 적었어요. NAME 에는 DEFAULT 가 없으니 NULL 을 넣으려 하고, NOT NULL 제약에 걸려 실패합니다. "일부 컬럼만 넣는 INSERT" 보기가 나오면 빠진 컬럼이 NULL 을 받을 수 있는지부터 확인해요.' },
    { t: 'trap', title: 'NULL 을 직접 적으면 DEFAULT 가 안 들어가요', x: 'DEFAULT 는 그 컬럼을 **아예 안 적었을 때**만 쓰여요. `INSERT INTO ITEM VALUES (6, \'GLUE\', NULL)` 처럼 NULL 을 직접 적으면 PRICE 는 0 이 아니라 NULL 입니다.' },
    { t: 'p', x: 'VALUES 대신 SELECT 를 쓰면 조회한 결과를 한꺼번에 넣을 수 있어요. 이때는 VALUES 를 쓰지 않고, SELECT 의 컬럼 개수와 타입이 넣을 컬럼과 맞아야 해요.' },
    { t: 'sql', code: `INSERT INTO ITEM_BAK (ID, NAME, PRICE)
SELECT ID, NAME, PRICE
  FROM ITEM
 WHERE PRICE >= 500;`, note: 'PEN 과 INK 두 행이 ITEM_BAK 에 들어가요.' },

    { t: 'h', x: 'UPDATE: 값 고치기' },
    { t: 'sql', code: `UPDATE ITEM
   SET PRICE = 600
 WHERE ID = 1;

UPDATE ITEM
   SET NAME = 'GEL', PRICE = PRICE + 500
 WHERE ID = 2;`, result: { head: ['ID', 'NAME', 'PRICE'], rows: [[1, 'PEN', 600], [2, 'GEL', 3500], [3, 'CLIP', 0]] },
      note: '여러 컬럼을 한 번에 고칠 때는 SET 뒤에 쉼표로 이어 써요.' },
    { t: 'trap', title: 'WHERE 가 없으면 전부 바뀌어요', x: '`UPDATE ITEM SET PRICE = 0;` 은 오류가 아니에요. 모든 행의 PRICE 가 0 이 됩니다. `DELETE FROM ITEM;` 도 마찬가지로 모든 행을 지워요. 문장을 차례로 실행하는 문제에서 WHERE 가 빠진 문장이 하나 끼어 있는지 봐요.' },
    { t: 'p', x: 'SET 의 오른쪽에 서브쿼리를 쓸 수도 있어요. 다른 테이블의 값으로 고칠 때 써요. 이때 서브쿼리는 고칠 행 하나마다 ==값 하나(한 행)==만 돌려줘야 합니다. 두 행 이상 나오면 오류예요.' },
    { t: 'data', name: 'NEW_PRICE', head: ['ID', 'PRICE'], rows: [[1, 700], [3, 100]] },
    { t: 'sql', code: `UPDATE ITEM I
   SET PRICE = (SELECT N.PRICE
                  FROM NEW_PRICE N
                 WHERE N.ID = I.ID);`, result: { head: ['ID', 'NAME', 'PRICE'], rows: [[1, 'PEN', 700], [2, 'GEL', null], [3, 'CLIP', 100]] },
      note: 'ID 2 는 NEW_PRICE 에 없어요. 서브쿼리가 아무것도 못 찾아 NULL 을 돌려주고, 그 NULL 로 수정됐습니다.' },
    { t: 'trap', title: '짝이 없는 행은 NULL 로 바뀌어요', x: '위 UPDATE 에는 WHERE 가 없으니 ITEM 의 모든 행이 수정 대상이에요. NEW_PRICE 에 짝이 없는 행은 "그대로 남는다"가 아니라 ==NULL 로 덮어써집니다.== 짝이 있는 행만 고치려면 `WHERE EXISTS (SELECT 1 FROM NEW_PRICE N WHERE N.ID = I.ID)` 나 `WHERE ID IN (SELECT ID FROM NEW_PRICE)` 를 붙여야 해요.' },
    { t: 'p', x: '여러 컬럼을 서브쿼리 하나로 고칠 때는 `SET (NAME, PRICE) = (SELECT … , … FROM …)` 처럼 괄호로 묶어요. 서브쿼리의 컬럼 수가 왼쪽 괄호 안의 컬럼 수와 같아야 합니다.' },

    { t: 'h', x: 'DELETE: 행 지우기' },
    { t: 'sql', code: `DELETE FROM ITEM WHERE ID = 3;   -- ID 가 3 인 행만
DELETE ITEM WHERE ID = 3;        -- FROM 은 생략할 수 있다
DELETE FROM ITEM;                -- WHERE 가 없으면 모든 행` },
    { t: 'ul', items: [
      'DELETE 는 ==행 단위==로 지워요. 특정 컬럼의 값만 비우려면 DELETE 가 아니라 `UPDATE … SET 컬럼 = NULL` 을 써요.',
      'WHERE 조건에 맞는 행이 없으면 0건이 지워질 뿐 오류가 아니에요. UPDATE 도 같아요.',
      '모든 행을 지워도 테이블 자체(구조)는 남아요.'
    ] },
    { t: 'check', q: 'ITEM 에 3행이 있을 때 DELETE FROM ITEM WHERE PRICE > 99999; 를 실행하면 오류일까요?', a: '오류가 아니에요. 조건에 맞는 행이 없어서 0건이 삭제되고 3행이 그대로 남습니다.' },

    { t: 'h', x: 'MERGE: 있으면 고치고 없으면 넣기' },
    { t: 'p', x: '입고 내역을 재고 테이블에 반영한다고 해 볼게요. 이미 있는 품목은 수량을 더하고, 처음 들어온 품목은 새로 넣어야 해요. UPDATE 와 INSERT 를 따로 쓰지 않고 한 문장으로 하는 것이 MERGE 예요.' },
    { t: 'data', name: 'STOCK', head: ['CODE', 'QTY'], rows: [['A', 10], ['B', 20], ['C', 30]] },
    { t: 'data', name: 'INBOUND', head: ['CODE', 'QTY'], rows: [['B', 5], ['D', 7]] },
    { t: 'sql', code: `MERGE INTO STOCK S                 -- 바꿀 테이블
USING INBOUND I                    -- 참조할 테이블(또는 서브쿼리)
   ON (S.CODE = I.CODE)            -- 짝을 찾는 조건. 괄호 필수
 WHEN MATCHED THEN
      UPDATE SET S.QTY = S.QTY + I.QTY
 WHEN NOT MATCHED THEN
      INSERT (CODE, QTY) VALUES (I.CODE, I.QTY);`, result: { head: ['CODE', 'QTY'], rows: [['A', 10], ['B', 25], ['C', 30], ['D', 7]] },
      note: 'B 는 짝이 있어서 20 + 5 로 수정, D 는 짝이 없어서 새로 삽입. A 와 C 는 INBOUND 에 없으니 건드리지 않아요.' },
    { t: 'fig', caption: 'MERGE 는 USING 쪽 행을 하나씩 보면서, 대상 테이블에 짝이 있으면 UPDATE, 없으면 INSERT 해요.', svg: `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="88" width="150" height="44" class="bx"/><text x="95" y="115" class="tx" text-anchor="middle">USING 쪽의 한 행</text>
  <line x1="170" y1="110" x2="214" y2="110" class="ln" marker-end="url(#arr)"/>
  <rect x="220" y="78" width="200" height="64" class="bx-y"/>
  <text x="320" y="104" class="tx" text-anchor="middle">ON 조건이 맞는 행이</text>
  <text x="320" y="126" class="tx" text-anchor="middle">대상 테이블에 있나</text>
  <line x1="420" y1="96" x2="464" y2="64" class="ln-a" marker-end="url(#arr-a)"/>
  <text x="432" y="66" class="tx-a" text-anchor="middle">있다</text>
  <line x1="420" y1="124" x2="464" y2="158" class="ln" marker-end="url(#arr)"/>
  <text x="432" y="168" class="tx" text-anchor="middle">없다</text>
  <rect x="470" y="24" width="150" height="64" class="bx-a"/>
  <text x="545" y="50" class="tx-s" text-anchor="middle">WHEN MATCHED</text>
  <text x="545" y="74" class="tx-a" text-anchor="middle">UPDATE</text>
  <rect x="470" y="136" width="150" height="64" class="bx"/>
  <text x="545" y="162" class="tx-s" text-anchor="middle">WHEN NOT MATCHED</text>
  <text x="545" y="186" class="tx-b" text-anchor="middle">INSERT</text>
</svg>` },
    { t: 'table', caption: 'MERGE 문법에서 묻는 것', head: ['자리', '규칙'], rows: [
      ['`MERGE INTO`', '바뀌는 테이블을 적는다. USING 쪽 테이블은 바뀌지 않는다'],
      ['`USING`', '참조할 테이블, 뷰, 서브쿼리'],
      ['`ON (조건)`', '짝을 찾는 조건. 괄호로 감싼다'],
      ['`WHEN MATCHED THEN UPDATE SET …`', 'UPDATE 뒤에 테이블 이름을 쓰지 않는다'],
      ['`WHEN NOT MATCHED THEN INSERT (…) VALUES (…)`', 'INSERT 뒤에 INTO 와 테이블 이름을 쓰지 않는다'],
      ['두 WHEN 절', '둘 중 하나만 써도 된다'],
      ['`DELETE WHERE 조건`', 'WHEN MATCHED 의 UPDATE 뒤에만 쓴다. 수정된 뒤의 값으로 판정한다']
    ] },
    { t: 'trap', title: 'ON 절에 쓴 컬럼은 UPDATE 할 수 없어요', x: '위 예에서 `UPDATE SET S.CODE = I.CODE` 라고 쓰면 오류예요. 짝을 찾는 기준으로 쓴 컬럼을 같은 문장에서 바꿀 수는 없습니다. MERGE 문법 보기에서 "ON 절의 조건 컬럼도 SET 으로 수정할 수 있다"는 틀린 설명으로 나와요.' },
    { t: 'trap', title: 'USING 에 없는 행은 그대로 남아요', x: 'MERGE 를 "두 테이블을 똑같이 만든다"로 읽으면 A 와 C 가 지워진다고 착각해요. MERGE 는 USING 쪽에 있는 행에 대해서만 일을 합니다. 대상 테이블에만 있는 행은 건드리지 않아요.' },
    { t: 'p', x: 'MERGE 로 행을 지울 수도 있어요. `WHEN MATCHED THEN UPDATE SET …` 바로 뒤에 `DELETE WHERE 조건` 을 붙이면, 이 MERGE 가 방금 수정한 행 가운데 조건에 맞는 행을 지워요. 조건은 ==수정된 뒤의 값==으로 판정합니다. 위의 STOCK(A 10, B 20, C 30)에서 출고 내역 OUTBOUND 가 (B, 20), (C, 10) 이라고 해 볼게요.' },
    { t: 'sql', code: `MERGE INTO STOCK S
USING OUTBOUND O
   ON (S.CODE = O.CODE)
 WHEN MATCHED THEN
      UPDATE SET S.QTY = S.QTY - O.QTY
      DELETE WHERE S.QTY = 0;`, result: { head: ['CODE', 'QTY'], rows: [['A', 10], ['C', 20]] },
      note: 'B 는 20 - 20 = 0 으로 수정된 뒤 조건에 맞아 지워졌어요. 수정 전 값(20)으로 판정했다면 남았을 거예요.' },
    { t: 'trap', title: 'DELETE WHERE 는 수정된 행만, 수정된 값으로', x: 'MERGE 의 DELETE 는 두 가지를 물어요. 첫째, 판정에 쓰는 값은 UPDATE 가 끝난 뒤의 값이에요. 둘째, 지울 수 있는 행은 이 MERGE 에서 짝이 맞아 수정된 행뿐이에요. 대상 테이블에 QTY 가 0 인 행이 원래 있었더라도 USING 쪽에 짝이 없으면 지워지지 않습니다.' },

    { t: 'h', x: '제약조건에 걸리면' },
    { t: 'p', x: 'DML 은 테이블에 걸린 제약조건을 어기면 실패해요. 부서(DEPT)와 사원(EMP)으로 볼게요. EMP.DNO 는 DEPT.DNO 를 참조하는 외래키(FK)이고 NULL 을 허용해요.' },
    { t: 'fig', caption: '자식(EMP)의 FK 값은 부모(DEPT)에 있는 값이거나 NULL 이어야 해요.', svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
  <text x="130" y="26" class="tx-b" text-anchor="middle">DEPT (부모)</text>
  <rect x="40" y="38" width="180" height="110" class="bx"/>
  <text x="130" y="64" class="tx-b" text-anchor="middle">DNO (PK)</text>
  <text x="130" y="94" class="tx-m" text-anchor="middle">10</text>
  <text x="130" y="122" class="tx-m" text-anchor="middle">20</text>
  <text x="500" y="26" class="tx-b" text-anchor="middle">EMP (자식)</text>
  <rect x="400" y="38" width="200" height="110" class="bx"/>
  <text x="450" y="64" class="tx-b" text-anchor="middle">ENO</text>
  <text x="545" y="64" class="tx-b" text-anchor="middle">DNO (FK)</text>
  <text x="450" y="90" class="tx-m" text-anchor="middle">1</text><text x="545" y="90" class="tx-m" text-anchor="middle">10</text>
  <text x="450" y="112" class="tx-m" text-anchor="middle">2</text><text x="545" y="112" class="tx-m" text-anchor="middle">10</text>
  <text x="450" y="134" class="tx-m" text-anchor="middle">3</text><text x="545" y="134" class="tx-m" text-anchor="middle">NULL</text>
  <line x1="398" y1="94" x2="226" y2="94" class="ln-a" marker-end="url(#arr-a)"/>
  <text x="310" y="84" class="tx-s" text-anchor="middle">참조</text>
  <text x="150" y="180" class="tx-r" text-anchor="middle">DNO 10 삭제는 실패(자식이 참조 중)</text>
  <text x="490" y="180" class="tx-r" text-anchor="middle">DNO 30 인 사원 삽입은 실패</text>
</svg>` },
    { t: 'table', head: ['제약조건', '실패하는 경우', '실패하지 않는 경우'], rows: [
      ['PRIMARY KEY', '이미 있는 값을 넣는다. NULL 을 넣는다', ''],
      ['UNIQUE', '이미 있는 값을 넣는다', 'NULL 은 여러 행에 넣을 수 있다'],
      ['NOT NULL', 'NULL 을 넣거나 NULL 로 수정한다', ''],
      ['FOREIGN KEY (자식 쪽)', '부모에 없는 값을 넣거나 그런 값으로 수정한다', 'NULL 은 넣을 수 있다(컬럼이 NULL 을 허용하면)'],
      ['FOREIGN KEY (부모 쪽)', '자식이 참조하는 행을 지우거나 그 키 값을 바꾼다(삭제 옵션이 없는 기본 상태)', '자식이 참조하지 않는 행은 지울 수 있다'],
      ['CHECK', '조건을 어기는 값을 넣는다', '']
    ] },
    { t: 'trap', title: '실패한 문장만 취소돼요', x: '문장 하나가 제약조건에 걸리면 ==그 문장만== 없던 일이 되고, 앞에서 성공한 문장은 그대로 남아요. 트랜잭션 전체가 되돌아가는 것이 아니에요. 그리고 한 문장이 여러 행을 다루다가 한 행에서 걸리면 그 문장이 넣거나 고친 행 전부가 취소됩니다. 문장을 차례로 실행하고 최종 건수를 묻는 문제는 이 규칙으로 풀어요.' },
    { t: 'check', q: 'EMP.DNO 가 NULL 을 허용하는 FK 일 때 INSERT INTO EMP VALUES (4, NULL) 은 성공할까요?', a: '성공해요. FK 는 "값이 있다면 부모에 있어야 한다"는 규칙이라 NULL 은 검사하지 않습니다. 부모에 없는 30 을 넣을 때 실패해요.' },

    { t: 'h', x: 'DELETE, TRUNCATE, DROP 맛보기' },
    { t: 'p', x: '행을 다 지우는 방법이 DELETE 만은 아니에요. 다음 다음 장(DDL)에서 자세히 보지만, DML 문제의 보기에 같이 나오니 큰 차이만 먼저 봐 둘게요.' },
    { t: 'table', head: ['', 'DELETE', 'TRUNCATE', 'DROP'], rows: [
      ['종류', 'DML', 'DDL', 'DDL'],
      ['지우는 것', '행(WHERE 로 일부만 가능)', '모든 행(WHERE 불가)', '테이블 자체(구조까지)'],
      ['ROLLBACK', '가능(COMMIT 전)', '불가(자동 COMMIT)', '불가(자동 COMMIT)'],
      ['테이블 구조', '남는다', '남는다', '사라진다']
    ] },

    { t: 'h', x: 'Oracle 과 SQL Server 가 갈리는 곳' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['DML 뒤 저장', 'COMMIT 을 해야 확정된다', '기본 설정에서는 문장마다 자동 COMMIT'],
      ['VALUES 한 번에 넣는 행', '한 행(SQLD 기준)', '쉼표로 이어 여러 행을 넣을 수 있다']
    ] },
    { t: 'p', x: 'Oracle 도 최신 버전(23c)부터는 VALUES 뒤에 여러 행을 쉼표로 이어 쓸 수 있지만, SQLD 는 그 이전 버전 기준으로 물어요. 시험에서는 "Oracle 의 VALUES 는 한 번에 한 행, 여러 행은 INSERT … SELECT"로 답해요.' }
  ],
  keys: [
    'DML 은 INSERT, UPDATE, DELETE, MERGE. Oracle 에서는 COMMIT 전까지 ROLLBACK 할 수 있다',
    'INSERT 에서 컬럼 목록을 생략하면 모든 컬럼 값을 정의 순서대로 줘야 한다',
    '목록에 안 적은 컬럼은 DEFAULT 가 있으면 그 값, 없으면 NULL. NOT NULL 이면 실패',
    'UPDATE, DELETE 에 WHERE 가 없으면 모든 행이 대상. 오류가 아니다',
    '서브쿼리 UPDATE 에서 짝이 없는 행은 NULL 로 바뀐다',
    'MERGE INTO 대상 USING 참조 ON (조건) WHEN MATCHED THEN UPDATE … WHEN NOT MATCHED THEN INSERT …',
    'MERGE 의 UPDATE 에는 테이블 이름이 없고, INSERT 에는 INTO 가 없고, ON 절 컬럼은 수정 못 한다. DELETE WHERE 는 수정된 뒤의 값으로 판정한다',
    '제약조건에 걸리면 그 문장만 실패하고 앞의 성공한 문장은 남는다'
  ],
  cards: [
    { q: 'INSERT INTO T VALUES (…) 처럼 컬럼 목록을 생략하면?', a: '테이블의 모든 컬럼 값을 정의된 순서대로 다 줘야 해요. 개수가 안 맞으면 오류.' },
    { q: 'INSERT 에서 적지 않은 컬럼에는 무엇이 들어가나요?', a: 'DEFAULT 가 있으면 그 값, 없으면 NULL. 그 컬럼이 NOT NULL 이고 DEFAULT 가 없으면 실패해요.' },
    { q: 'UPDATE T SET A = 0; 의 결과는?', a: '모든 행의 A 가 0 이 돼요. WHERE 가 없으면 전체가 대상이에요.' },
    { q: 'UPDATE T SET A = (SELECT … WHERE S.ID = T.ID); 에서 S 에 짝이 없는 T 의 행은?', a: 'A 가 NULL 로 바뀌어요. 그대로 두려면 WHERE EXISTS 로 대상을 줄여야 해요.' },
    { q: 'MERGE 에서 ON 절은 어떻게 쓰나요?', a: '조건을 괄호로 감싸요. `ON (T.ID = S.ID)`. 그리고 ON 절에 쓴 컬럼은 UPDATE SET 으로 못 바꿔요.' },
    { q: 'MERGE 를 실행하면 USING 쪽에 없는 대상 테이블의 행은?', a: '그대로 남아요. MERGE 는 USING 쪽 행에 대해서만 UPDATE 나 INSERT 를 합니다.' },
    { q: '자식이 참조하고 있는 부모 행을 DELETE 하면? (삭제 옵션 없음)', a: '실패해요. 참조하는 자식 행이 없어야 지울 수 있어요.' },
    { q: 'DELETE 와 TRUNCATE 의 차이 두 가지는?', a: 'DELETE 는 DML 이라 ROLLBACK 이 되고 WHERE 로 일부만 지울 수 있어요. TRUNCATE 는 DDL 이라 자동 COMMIT 되고 전체만 지워요.' }
  ],
  quiz: [
    { id: 'q17-01', level: 1, tag: 'DML 기본',
      q: 'Oracle 의 DML 에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'INSERT 문에서 컬럼 목록을 생략하면 테이블의 모든 컬럼 값을 정의된 순서대로 줘야 한다.',
        'UPDATE 문에서 WHERE 절을 생략하면 테이블의 모든 행이 수정된다.',
        'DELETE 문에서 WHERE 절을 생략하면 오류가 발생한다.',
        'DML 로 바꾼 내용은 COMMIT 하기 전까지 ROLLBACK 으로 되돌릴 수 있다.'
      ],
      answer: 3,
      why: 'WHERE 가 없는 DELETE 는 오류가 아니라 모든 행을 지워요. UPDATE 도 WHERE 가 없으면 모든 행이 대상입니다.' },
    { id: 'q17-02', level: 1, tag: 'DML 종류',
      q: '다음 중 DML 에 해당하지 않는 것은?',
      choices: ['UPDATE', 'MERGE', 'DELETE', 'TRUNCATE'],
      answer: 4,
      why: 'TRUNCATE 는 모든 행을 지우지만 DDL 이에요. 실행하면 자동으로 COMMIT 되어 ROLLBACK 할 수 없습니다. DML 은 INSERT, UPDATE, DELETE, MERGE 예요.' },
    { id: 'q17-03', level: 2, tag: '최종 상태',
      q: '아래 테이블 T 에 SQL 을 차례로 실행했다. 마지막 SELECT 의 결과로 알맞은 것은? (T 의 컬럼에는 DEFAULT 가 없고 QTY 는 NULL 을 허용한다)',
      tables: [{ name: 'T', head: ['ID', 'NAME', 'QTY'], rows: [[1, 'A', 10], [2, 'B', 20], [3, 'C', 30]] }],
      code: `INSERT INTO T VALUES (4, 'D', 40);
UPDATE T SET QTY = QTY + 10 WHERE QTY >= 30;
DELETE FROM T WHERE QTY = 40;
INSERT INTO T (ID, NAME) VALUES (5, 'E');

SELECT COUNT(*), SUM(QTY) FROM T;`,
      choices: ['3, 30', '4, 80', '5, 120', '3, 80'],
      answer: 2,
      why: 'UPDATE 는 QTY 가 30 이상인 C 와 D 를 40 과 50 으로 올려요. 그다음 DELETE 는 QTY 가 40 인 C 만 지웁니다(D 는 이미 50). 마지막 INSERT 는 QTY 를 안 적어 NULL 이 들어가요. 남은 행은 A(10), B(20), D(50), E(NULL) 로 4행이고, SUM 은 NULL 을 건너뛰어 80 이에요. 3, 30 은 D 가 40 인 채로 같이 지워졌다고 봤을 때의 값입니다.' },
    { id: 'q17-04', level: 2, tag: 'INSERT 와 제약조건',
      q: '아래와 같이 만든 빈 테이블 DEPT 에 각 문장을 따로 실행할 때, 실패하는 것은?',
      code: `CREATE TABLE DEPT (
  DNO   NUMBER        PRIMARY KEY,
  DNAME VARCHAR2(10)  NOT NULL,
  LOC   VARCHAR2(10)  DEFAULT 'SEOUL'
);`,
      choices: [
        { code: `INSERT INTO DEPT (DNO, LOC) VALUES (30, 'BUSAN');` },
        { code: `INSERT INTO DEPT (DNO, DNAME) VALUES (20, 'IT');` },
        { code: `INSERT INTO DEPT VALUES (40, 'FIN', NULL);` },
        { code: `INSERT INTO DEPT (DNAME, DNO) VALUES ('PR', 50);` }
      ],
      answer: 1,
      why: '1번은 DNAME 을 적지 않았어요. DNAME 에는 DEFAULT 가 없어 NULL 이 들어가려 하고 NOT NULL 제약에 걸립니다. 2번은 안 적은 LOC 에 기본값 SEOUL 이 들어가요. 3번은 LOC 에 NULL 을 직접 줬는데 LOC 는 NULL 을 허용하니 성공합니다(기본값은 쓰이지 않아요). 4번은 컬럼 목록 순서대로 값을 줬으니 문제없어요.' },
    { id: 'q17-05', level: 3, tag: '서브쿼리 UPDATE',
      q: '아래 두 테이블에서 SQL 을 차례로 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'EMP', head: ['ENO', 'SAL'], rows: [[1, 100], [2, 200], [3, 300]] },
        { name: 'RAISE', head: ['ENO', 'NEW_SAL'], rows: [[1, 150], [3, 350]] }
      ],
      code: `UPDATE EMP E
   SET SAL = (SELECT R.NEW_SAL
                FROM RAISE R
               WHERE R.ENO = E.ENO);

SELECT SUM(SAL), COUNT(SAL) FROM EMP;`,
      choices: ['700, 3', '500, 3', '500, 2', '600, 2'],
      answer: 3,
      why: 'UPDATE 에 WHERE 가 없어서 EMP 의 3행이 모두 수정 대상이에요. ENO 2 는 RAISE 에 짝이 없어 서브쿼리가 NULL 을 돌려주고 SAL 이 NULL 로 바뀝니다. 그래서 SAL 은 150, NULL, 350 이고 합은 500, NULL 을 뺀 건수는 2 예요. 700, 3 은 짝이 없는 행이 200 그대로 남는다고 착각했을 때의 값입니다.' },
    { id: 'q17-06', level: 2, tag: 'MERGE 결과',
      q: '아래 두 테이블에서 SQL 을 차례로 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'TGT', head: ['ID', 'PRICE'], rows: [[1, 1000], [2, 2000], [3, 3000]] },
        { name: 'SRC', head: ['ID', 'PRICE'], rows: [[2, 2500], [4, 4000]] }
      ],
      code: `MERGE INTO TGT T
USING SRC S
   ON (T.ID = S.ID)
 WHEN MATCHED THEN
      UPDATE SET T.PRICE = S.PRICE
 WHEN NOT MATCHED THEN
      INSERT (ID, PRICE) VALUES (S.ID, S.PRICE);

SELECT COUNT(*), SUM(PRICE) FROM TGT;`,
      choices: ['2, 6500', '3, 6500', '5, 12500', '4, 10500'],
      answer: 4,
      why: 'SRC 의 ID 2 는 TGT 에 짝이 있어 PRICE 가 2500 으로 수정되고, ID 4 는 짝이 없어 새로 삽입돼요. SRC 에 없는 ID 1, 3 은 그대로 남습니다. TGT 는 1000, 2500, 3000, 4000 의 4행이고 합은 10500 이에요. 2, 6500 은 SRC 에 없는 행이 지워진다고 봤을 때, 5, 12500 은 수정 없이 두 행이 다 삽입된다고 봤을 때의 값입니다.' },
    { id: 'q17-07', level: 2, tag: 'MERGE 문법',
      q: 'Oracle 의 MERGE 문에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'ON 절의 조건은 괄호로 감싸서 쓴다.',
        'ON 절의 조건에 쓴 대상 테이블 컬럼도 WHEN MATCHED 의 UPDATE SET 에서 수정할 수 있다.',
        'WHEN MATCHED THEN 뒤의 UPDATE 에는 테이블 이름을 쓰지 않는다.',
        'WHEN NOT MATCHED THEN 뒤의 INSERT 에는 INTO 와 테이블 이름을 쓰지 않는다.'
      ],
      answer: 2,
      why: 'ON 절에서 짝을 찾는 기준으로 쓴 컬럼은 같은 MERGE 문의 UPDATE SET 으로 바꿀 수 없어요. 나머지는 MERGE 문법 그대로입니다. 바꿀 테이블은 MERGE INTO 에 이미 적었기 때문에 UPDATE 와 INSERT 뒤에는 테이블 이름이 없어요.' },
    { id: 'q17-08', level: 3, tag: '제약조건과 트랜잭션',
      q: 'ID 가 기본키인 테이블 T 에 아래 SQL 을 차례로 실행했다. 오류가 난 문장이 있으면 그 문장은 건너뛰고 다음 문장을 계속 실행했다고 할 때, 마지막 SELECT 의 결과는? (Oracle)',
      tables: [{ name: 'T', head: ['ID', 'V'], rows: [[1, 'A'], [2, 'B']] }],
      code: `INSERT INTO T VALUES (3, 'C');
INSERT INTO T VALUES (2, 'X');
INSERT INTO T (V) VALUES ('D');
DELETE T WHERE ID = 1;
COMMIT;
INSERT INTO T VALUES (5, 'E');
ROLLBACK;

SELECT COUNT(*) FROM T;`,
      choices: ['2', '3', '1', '0'],
      answer: 1,
      why: '첫 INSERT 는 성공해서 3행이 돼요. 둘째는 ID 2 가 이미 있어 PK 중복으로, 셋째는 ID 에 NULL 이 들어가려 해서 실패합니다. 실패한 문장만 취소되고 앞의 INSERT 는 남아요. DELETE 는 FROM 을 생략한 형태로 ID 1 을 지워 ID 2, 3 의 2행이 되고 COMMIT 으로 확정됩니다. 그 뒤 넣은 ID 5 는 ROLLBACK 으로 취소되지만 COMMIT 된 내용은 되돌아가지 않으니 2 예요. 1 은 오류가 앞의 INSERT 까지 취소한다고 봤을 때, 3 은 ROLLBACK 을 빠뜨렸을 때의 값입니다.' },
    { id: 'q17-09', level: 3, tag: 'FK 제약조건',
      q: 'EMP.DNO 는 DEPT.DNO 를 참조하는 외래키이고 NULL 을 허용하며, 삭제 옵션은 지정하지 않았다. 아래 상태에서 각 문장을 따로 실행할 때 실패하는 것은?',
      tables: [
        { name: 'DEPT', head: ['DNO'], rows: [[10], [20]] },
        { name: 'EMP', head: ['ENO', 'DNO'], rows: [[1, 10], [2, 10], [3, null]] }
      ],
      choices: [
        { code: `INSERT INTO EMP VALUES (4, NULL);` },
        { code: `DELETE FROM DEPT WHERE DNO = 20;` },
        { code: `UPDATE EMP SET DNO = 20 WHERE ENO = 3;` },
        { code: `DELETE FROM DEPT WHERE DNO = 10;` }
      ],
      answer: 4,
      why: 'DNO 10 은 EMP 의 1번, 2번 사원이 참조하고 있어서 지울 수 없어요. 1번은 FK 컬럼에 NULL 을 넣는 것이라 검사 대상이 아니고, 2번은 DNO 20 을 참조하는 사원이 없어서 지워집니다. 3번은 부모에 있는 값 20 으로 바꾸는 것이라 성공해요.' }
  ]
});
