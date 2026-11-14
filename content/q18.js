SQLD.add({
  id: 'q18',
  title: 'TCL',
  minutes: 13,
  weight: 3,
  lead: 'INSERT, SAVEPOINT, ROLLBACK TO, DDL 을 섞어 놓고 마지막에 남는 데이터를 묻는 문제가 거의 매회 나와요. 규칙 네 개만 정확히 알면 한 줄씩 따라가서 맞힐 수 있어요.',
  goals: [
    'ACID 네 가지를 설명 문장만 보고 가려낸다',
    'COMMIT, ROLLBACK, SAVEPOINT, ROLLBACK TO 가 섞인 순서를 따라가 최종 데이터를 구한다',
    'Oracle 에서 DDL 이 끼면 어디까지 커밋되는지 말할 수 있다',
    'Oracle 과 SQL Server 의 커밋 방식 차이를 구분한다'
  ],
  blocks: [
    { t: 'h', x: '트랜잭션은 "같이 성공하거나 같이 취소되는 묶음"이에요' },
    { t: 'p', x: '계좌 이체를 생각해 볼게요. 내 계좌에서 1만 원을 빼는 UPDATE 와 친구 계좌에 1만 원을 더하는 UPDATE, 두 문장이 필요해요. 첫 문장만 실행되고 멈추면 돈이 사라져요. 그래서 둘을 하나로 묶어 ==전부 반영하거나 전부 취소==해야 해요. 이 묶음이 트랜잭션(데이터베이스의 논리적 작업 단위)이에요.' },
    { t: 'p', x: 'TCL(Transaction Control Language)은 이 묶음을 확정하거나 취소하는 명령어예요. `COMMIT`, `ROLLBACK`, `SAVEPOINT` 가 여기에 들어가요. 한 트랜잭션에는 SQL 문장이 하나 이상 들어가고, 묶음의 일부만 COMMIT 하는 것은 안 돼요.' },
    { t: 'table', caption: '트랜잭션의 네 가지 특성(ACID)', head: ['특성', '뜻', '시험 문장에서 찾을 낱말'], rows: [
      ['원자성(Atomicity)', '묶음 안의 연산이 전부 실행되거나 전혀 실행되지 않은 상태여야 한다', '모두 성공하거나 모두 실패, All or Nothing'],
      ['일관성(Consistency)', '실행 전에 데이터베이스 내용이 잘못돼 있지 않았다면 실행 후에도 잘못이 없어야 한다', '실행 전과 후, 잘못이 없어야'],
      ['고립성(Isolation)', '실행 도중에 다른 트랜잭션의 영향을 받아 잘못된 결과가 나오면 안 된다', '다른 트랜잭션의 영향, 실행 도중'],
      ['지속성(Durability)', '성공적으로 끝나면 바뀐 내용이 영구적으로 저장된다', '영구적으로 저장']
    ] },
    { t: 'trap', title: '특성 이름과 설명 바꿔 끼우기', x: '설명 문장은 그대로 두고 이름만 바꿔 놓아요. "실행 전에 잘못이 없으면 실행 후에도 잘못이 없어야 한다"에 원자성을 붙이거나, "영구적으로 저장된다"에 연관성 같은 없는 이름을 붙이는 식이에요. 네 이름은 원자성, 일관성, 고립성, 지속성뿐이에요.' },

    { t: 'h', x: 'COMMIT 과 ROLLBACK' },
    { t: 'p', x: 'Oracle 에서 INSERT, UPDATE, DELETE 를 실행하면 바로 저장되지 않아요. 내 세션(접속)에만 보이는 임시 상태로 있다가, `COMMIT` 을 해야 확정되고 `ROLLBACK` 을 하면 ==마지막 COMMIT 시점==으로 돌아가요.' },
    { t: 'table', head: ['', 'COMMIT 전', 'COMMIT 후'], rows: [
      ['내 세션', 'SELECT 로 바뀐 결과가 보인다', '바뀐 결과가 보인다'],
      ['다른 세션', '바뀌기 전 데이터가 보인다', '바뀐 결과가 보인다'],
      ['바뀐 행의 잠금', '걸려 있다(다른 세션이 그 행을 못 고침)', '풀린다'],
      ['되돌리기', 'ROLLBACK 으로 가능', '불가능']
    ] },
    { t: 'p', x: '잠금(LOCK)은 한 트랜잭션이 고치고 있는 데이터를 다른 트랜잭션이 동시에 건드리지 못하게 막는 장치예요. DML 을 하고 COMMIT 이나 ROLLBACK 을 안 하면 그 행의 잠금이 계속 남아서 다른 세션이 기다리게 돼요. 잠금은 그것을 건 트랜잭션이 끝나야(COMMIT 또는 ROLLBACK) 풀려요.' },

    { t: 'h', x: 'SAVEPOINT 와 ROLLBACK TO' },
    { t: 'p', x: '`ROLLBACK` 은 마지막 COMMIT 뒤에 한 일을 전부 취소해요. 일부만 취소하고 싶으면 중간에 `SAVEPOINT 이름` 으로 표시를 해 두고 `ROLLBACK TO 이름` 으로 그 표시까지만 되돌려요.' },
    { t: 'data', name: 'STOCK (커밋된 상태)', head: ['ID', 'QTY'], rows: [[1, 10], [2, 20]] },
    { t: 'sql', code: `UPDATE STOCK SET QTY = 15 WHERE ID = 1;
SAVEPOINT S1;
INSERT INTO STOCK VALUES (3, 30);
SAVEPOINT S2;
DELETE FROM STOCK WHERE ID = 2;
ROLLBACK TO S1;
COMMIT;

SELECT * FROM STOCK;`, result: { head: ['ID', 'QTY'], rows: [[1, 15], [2, 20]] },
      note: 'S1 뒤에 한 INSERT 와 DELETE 만 취소돼요. S1 앞의 UPDATE 는 남아 있다가 COMMIT 으로 확정돼요.' },
    { t: 'fig', caption: 'ROLLBACK TO S1 은 S1 뒤쪽만 지워요. S1 앞의 UPDATE 는 아직 커밋 전 상태로 남아요.', svg: `<svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg">
  <line x1="8" y1="57" x2="632" y2="57" class="ln-d"/>
  <rect x="8" y="40" width="96" height="34" class="bx"/><text x="56" y="62" class="tx-m" text-anchor="middle">COMMIT</text>
  <rect x="112" y="40" width="96" height="34" class="bx-a"/><text x="160" y="62" class="tx-m" text-anchor="middle">UPDATE</text>
  <rect x="216" y="40" width="96" height="34" class="bx-y"/><text x="264" y="62" class="tx-m" text-anchor="middle">S1</text>
  <rect x="320" y="40" width="96" height="34" class="bx-r"/><text x="368" y="62" class="tx-r" text-anchor="middle">INSERT</text>
  <rect x="424" y="40" width="96" height="34" class="bx-r"/><text x="472" y="62" class="tx-r" text-anchor="middle">S2</text>
  <rect x="528" y="40" width="96" height="34" class="bx-r"/><text x="576" y="62" class="tx-r" text-anchor="middle">DELETE</text>
  <text x="160" y="28" class="tx-a" text-anchor="middle">남음</text>
  <text x="472" y="28" class="tx-r" text-anchor="middle">취소됨 (S2 도 사라짐)</text>
  <path d="M576 78 V112 H264 V84" class="ln-r" fill="none" marker-end="url(#arr-r)"/>
  <text x="420" y="136" class="tx-b" text-anchor="middle">ROLLBACK TO S1</text>
  <text x="420" y="158" class="tx-s" text-anchor="middle">S1 자체는 남아서 다시 ROLLBACK TO S1 가능</text>
</svg>` },
    { t: 'table', caption: '순서 문제를 풀 때 쓰는 규칙', head: ['상황', '결과'], rows: [
      ['`ROLLBACK TO S1`', 'S1 뒤에 한 DML 만 취소. S1 앞의 DML 은 그대로(아직 커밋 전)'],
      ['`ROLLBACK TO S1` 뒤의 S2', 'S1 보다 나중에 만든 SAVEPOINT 는 사라진다. `ROLLBACK TO S2` 는 오류'],
      ['같은 이름으로 SAVEPOINT 를 두 번', '나중에 만든 것만 유효. 앞의 것은 덮어써진다'],
      ['`ROLLBACK` (이름 없이)', '마지막 COMMIT 뒤의 모든 DML 취소. SAVEPOINT 도 전부 사라진다'],
      ['COMMIT 뒤에 `ROLLBACK TO S1`', 'COMMIT 하면 SAVEPOINT 가 전부 사라져서 오류. 데이터는 아무것도 안 바뀐다']
    ] },
    { t: 'trap', title: 'ROLLBACK TO 는 트랜잭션을 끝내지 않아요', x: '`ROLLBACK TO S1` 을 하고 나서도 S1 앞의 변경은 커밋되지 않은 채 남아 있어요. 그 뒤에 `ROLLBACK` 이 한 번 더 나오면 그것까지 전부 취소되고, `COMMIT` 이 나오면 확정돼요. 순서 문제의 마지막 줄이 COMMIT 인지 ROLLBACK 인지 꼭 확인하세요.' },
    { t: 'trap', title: '같은 이름 SAVEPOINT', x: '`SAVEPOINT SP` 가 두 번 나오면 `ROLLBACK TO SP` 는 ==나중에 만든 SP== 로 돌아가요. 처음 SP 로 돌아간다고 보고 계산한 값이 오답 보기로 들어 있어요.' },
    { t: 'check', q: 'INSERT 1건 → SAVEPOINT A → INSERT 1건 → COMMIT → INSERT 1건 → ROLLBACK TO A 를 차례로 실행했어요. 테이블에 몇 건이 보일까요? (처음에는 빈 테이블, 오류가 난 문장만 건너뜀)', a: '3건이에요. COMMIT 에서 앞의 2건이 확정되고 SAVEPOINT A 는 사라져요. 그래서 `ROLLBACK TO A` 는 오류가 나고 아무것도 되돌리지 못해요. 세 번째 INSERT 는 커밋 전 상태로 그대로 보여요.' },

    { t: 'h', x: 'Oracle 에서는 DDL 이 끼면 그 앞까지 커밋돼요' },
    { t: 'p', x: 'Oracle 은 `CREATE`, `ALTER`, `DROP`, `TRUNCATE` 같은 DDL 을 실행하면 ==그 순간 자동으로 COMMIT== 을 해요. DDL 자체만 확정되는 게 아니라, 그 앞에 쌓여 있던 DML 도 같이 확정돼요. 다른 테이블에 대한 DDL 이어도 똑같아요.' },
    { t: 'sql', code: `-- STOCK 에는 (1, 15), (2, 20) 이 커밋되어 있음
INSERT INTO STOCK VALUES (3, 30);
CREATE TABLE TMP (C NUMBER);      -- 위 INSERT 까지 자동 커밋
INSERT INTO STOCK VALUES (4, 40);
ROLLBACK;                         -- (4, 40) 만 취소

SELECT * FROM STOCK;`, result: { head: ['ID', 'QTY'], rows: [[1, 15], [2, 20], [3, 30]] },
      note: 'ROLLBACK 은 마지막 커밋 시점, 곧 CREATE TABLE 직후로 돌아가요. TMP 테이블도 그대로 남아요.' },
    { t: 'trap', title: 'DDL 앞에 만든 SAVEPOINT', x: 'DDL 이 커밋을 일으키니 그 앞에 만든 SAVEPOINT 도 전부 사라져요. DDL 뒤에 `ROLLBACK TO` 로 그 이름을 부르면 오류가 나고 아무것도 되돌려지지 않아요. 순서 문제에서 `TRUNCATE` 나 `ALTER TABLE` 이 보이면 그 줄에 선을 긋고, 선 위쪽은 확정된 것으로 두고 아래쪽만 따져요.' },
    { t: 'table', caption: 'Oracle 에서 트랜잭션이 시작되고 끝나는 때', head: ['구분', '언제'], rows: [
      ['시작', '첫 DML 문장이 실행될 때(따로 시작 명령이 없다)'],
      ['끝(커밋)', '`COMMIT` 실행, DDL 이나 DCL 실행(자동 커밋), 접속을 정상적으로 종료'],
      ['끝(롤백)', '`ROLLBACK` 실행, 장애나 강제 종료로 접속이 비정상적으로 끊김']
    ] },

    { t: 'h', x: 'Oracle 과 SQL Server 의 차이' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['DML 뒤의 커밋', '수동. 직접 `COMMIT` 해야 확정', '기본이 AUTO COMMIT. 문장이 성공하면 바로 확정'],
      ['트랜잭션을 직접 묶으려면', '첫 DML 부터 자동으로 시작', '`BEGIN TRAN` 으로 시작하고 `COMMIT` 또는 `ROLLBACK` 으로 끝'],
      ['DDL', '실행하면 자동 커밋. 롤백 불가', '`BEGIN TRAN` 안에서 실행한 DDL 은 `ROLLBACK` 으로 취소 가능'],
      ['저장점', '`SAVEPOINT S1`', '`SAVE TRAN S1`'],
      ['저장점까지 롤백', '`ROLLBACK TO S1`', '`ROLLBACK TRAN S1`']
    ] },
    { t: 'p', x: 'SQL Server 는 방식이 세 가지예요. 기본인 AUTO COMMIT, `BEGIN TRAN` 으로 직접 묶는 명시적 트랜잭션, 그리고 설정을 켜면 Oracle 처럼 시작은 자동이고 끝은 직접 COMMIT 해야 하는 암시적 트랜잭션이에요.' },
    { t: 'trap', title: 'DBMS 를 먼저 보세요', x: '같은 순서여도 답이 달라요. Oracle 이면 중간의 `CREATE TABLE` 이 앞의 DML 을 커밋시키고, SQL Server 의 `BEGIN TRAN` 안이면 `ROLLBACK` 한 번에 DML 과 `CREATE TABLE` 이 모두 취소돼요. 문제에 DBMS 가 적혀 있으면 그게 단서예요.' },

    { t: 'h', x: '고립성이 깨지면 생기는 일 세 가지' },
    { t: 'p', x: '여러 트랜잭션이 동시에 돌 때 서로 덜 격리돼 있으면 아래 현상이 생겨요. 이름과 설명을 짝짓는 문제로 나와요.' },
    { t: 'table', head: ['현상', '무슨 일이 생기나'], rows: [
      ['Dirty Read', '다른 트랜잭션이 고치고 ==아직 커밋하지 않은== 데이터를 읽는다. 그쪽이 롤백하면 없는 값을 읽은 셈'],
      ['Non-Repeatable Read', '한 트랜잭션 안에서 같은 행을 두 번 읽었는데, 사이에 다른 트랜잭션이 그 행을 수정하거나 삭제하고 커밋해서 ==값이 달라진다=='],
      ['Phantom Read', '같은 조건으로 두 번 조회했는데, 사이에 다른 트랜잭션이 행을 INSERT 하고 커밋해서 ==없던 행이 나타난다==']
    ] },
    { t: 'tip', title: '이렇게 외워요', x: 'Dirty 는 "커밋 안 된 것을 읽음", Non-Repeatable 은 "있던 행의 값이 바뀜", Phantom(유령)은 "없던 행이 생김"이에요.' },
    { t: 'check', q: 'Oracle 에서 UPDATE 를 실행한 뒤 COMMIT 을 하지 않고 TRUNCATE TABLE 다른테이블 을 실행했어요. 그다음 ROLLBACK 하면 UPDATE 가 취소될까요?', a: '취소되지 않아요. TRUNCATE 는 DDL 이라 실행되는 순간 앞의 UPDATE 까지 자동으로 커밋돼요. 대상이 다른 테이블이어도 같아요.' }
  ],
  keys: [
    'ACID: 원자성(전부 아니면 전무), 일관성(실행 전후 잘못 없음), 고립성(다른 트랜잭션의 영향 없음), 지속성(영구 저장)',
    'ROLLBACK 은 마지막 COMMIT 시점까지, ROLLBACK TO S1 은 S1 뒤쪽만 취소',
    'ROLLBACK TO S1 을 하면 S1 뒤에 만든 SAVEPOINT 는 사라진다. S1 은 남는다',
    '같은 이름 SAVEPOINT 는 나중에 만든 것이 유효',
    'COMMIT 하면 SAVEPOINT 가 전부 사라진다. 그 뒤의 ROLLBACK TO 는 오류',
    'Oracle 은 DML 수동 커밋, DDL 을 실행하면 그 앞의 DML 까지 자동 커밋',
    'SQL Server 는 기본 AUTO COMMIT, BEGIN TRAN 안에서는 DDL 도 ROLLBACK 가능',
    'Dirty Read 는 커밋 안 된 값 읽기, Non-Repeatable Read 는 값이 바뀜, Phantom Read 는 없던 행이 생김'
  ],
  cards: [
    { q: '"트랜잭션 실행 도중 다른 트랜잭션의 영향을 받아 잘못된 결과가 나오면 안 된다"는 어떤 특성?', a: '고립성(Isolation).' },
    { q: '`ROLLBACK TO S1` 을 하면 S1 앞에서 한 UPDATE 는?', a: '그대로 남아요. 아직 커밋 전이라 뒤에 COMMIT 이 오면 확정, ROLLBACK 이 오면 취소돼요.' },
    { q: '`SAVEPOINT SP` 를 두 번 만들고 `ROLLBACK TO SP` 하면 어디로 가나요?', a: '나중에 만든 SP 로 가요.' },
    { q: 'Oracle 에서 INSERT 뒤에 `CREATE TABLE` 을 실행하고 `ROLLBACK` 하면 INSERT 는?', a: '남아요. DDL 이 실행될 때 앞의 INSERT 까지 자동 커밋돼요.' },
    { q: 'SQL Server 에서 `BEGIN TRAN` 안의 `CREATE TABLE` 은 `ROLLBACK` 되나요?', a: '돼요. SQL Server 는 트랜잭션 안의 DDL 도 롤백할 수 있어요. Oracle 은 안 돼요.' },
    { q: 'COMMIT 전에 다른 세션은 내가 바꾼 데이터를 볼 수 있나요?', a: '볼 수 없어요. 바뀌기 전 데이터가 보이고, 바뀐 행에는 잠금이 걸려 있어요.' },
    { q: '다른 트랜잭션이 커밋하지 않은 데이터를 읽는 현상은?', a: 'Dirty Read.' }
  ],
  quiz: [
    { id: 'q18-01', level: 1, tag: 'ACID',
      q: '다음 설명에 해당하는 트랜잭션의 특성은?\n\n"트랜잭션이 실행되는 도중에 다른 트랜잭션의 영향을 받아 잘못된 결과를 만들어서는 안 된다."',
      choices: ['원자성(Atomicity)', '일관성(Consistency)', '지속성(Durability)', '고립성(Isolation)'],
      answer: 4,
      why: '실행 도중에 다른 트랜잭션의 영향을 받지 않아야 한다는 것은 고립성이에요. 원자성은 전부 실행되거나 전혀 실행되지 않는 것, 일관성은 실행 전후로 데이터에 잘못이 없는 것, 지속성은 성공한 결과가 영구적으로 저장되는 것이에요.' },
    { id: 'q18-02', level: 2, tag: 'SAVEPOINT',
      q: '아래 테이블은 커밋된 상태이다. Oracle 에서 SQL 을 차례로 실행한 뒤 마지막 SELECT 의 결과로 알맞은 것은?',
      tables: [{ name: 'T', head: ['ID', 'VAL'], rows: [[1, 100], [2, 200]] }],
      code: `UPDATE T SET VAL = 150 WHERE ID = 1;
SAVEPOINT S1;
INSERT INTO T VALUES (3, 300);
SAVEPOINT S2;
DELETE FROM T WHERE ID = 2;
ROLLBACK TO S1;
INSERT INTO T VALUES (4, 400);
COMMIT;

SELECT SUM(VAL) FROM T;`,
      choices: ['750', '700', '1050', '850'],
      answer: 1,
      why: '`ROLLBACK TO S1` 은 S1 뒤의 INSERT(3, 300) 와 DELETE 만 취소해요. S1 앞의 UPDATE 는 남아서 (1, 150), (2, 200) 이 되고, 여기에 (4, 400) 이 더해져 COMMIT 돼요. 150 + 200 + 400 = 750 이에요. 700 은 UPDATE 까지 취소됐다고 본 값, 1050 은 DELETE 만 취소됐다고 본 값, 850 은 아무것도 취소되지 않았다고 본 값이에요.' },
    { id: 'q18-03', level: 2, tag: 'DDL 자동 커밋',
      q: '빈 테이블 T(N NUMBER) 가 있다. Oracle 에서 아래 SQL 을 차례로 실행했을 때 마지막 SELECT 의 결과는?',
      code: `INSERT INTO T VALUES (1);
INSERT INTO T VALUES (2);
CREATE TABLE T2 (C NUMBER);
INSERT INTO T VALUES (3);
ROLLBACK;

SELECT COUNT(*) FROM T;`,
      choices: ['0', '1', '2', '3'],
      answer: 3,
      why: 'Oracle 은 DDL 을 실행하면 그 앞의 DML 까지 자동으로 커밋해요. `CREATE TABLE T2` 가 실행될 때 1 과 2 가 확정되고, 그 뒤의 3 만 ROLLBACK 으로 취소돼 2건이 남아요. T2 가 다른 테이블이라는 점은 상관없어요. 0 은 ROLLBACK 이 전부 취소한다고 본 값이에요.' },
    { id: 'q18-04', level: 3, tag: 'SAVEPOINT',
      q: '빈 테이블 T(N NUMBER) 가 있다. Oracle 에서 아래 SQL 을 차례로 실행했을 때 마지막 SELECT 의 결과는?',
      code: `INSERT INTO T VALUES (10);
SAVEPOINT SP;
INSERT INTO T VALUES (20);
SAVEPOINT SP;
INSERT INTO T VALUES (30);
ROLLBACK TO SP;
INSERT INTO T VALUES (40);
COMMIT;

SELECT SUM(N) FROM T;`,
      choices: ['50', '70', '100', '40'],
      answer: 2,
      why: '같은 이름으로 SAVEPOINT 를 다시 만들면 나중 것이 유효해요. `ROLLBACK TO SP` 는 두 번째 SP(20 을 넣은 뒤)로 돌아가서 30 만 취소돼요. 남는 값은 10, 20, 40 이라 합이 70 이에요. 50 은 첫 번째 SP 로 돌아갔다고 본 값이고, 100 은 아무것도 취소되지 않았다고 본 값이에요.' },
    { id: 'q18-05', level: 3, tag: 'COMMIT 과 SAVEPOINT',
      q: '빈 테이블 T(N NUMBER) 가 있다. Oracle 에서 아래 SQL 을 차례로 실행했다. 오류가 나는 문장이 있으면 그 문장만 실행되지 않고 다음 문장으로 넘어간다고 할 때, 마지막 SELECT 의 결과는?',
      code: `INSERT INTO T VALUES (1);
SAVEPOINT A;
INSERT INTO T VALUES (2);
COMMIT;
INSERT INTO T VALUES (3);
ROLLBACK TO A;
COMMIT;

SELECT COUNT(*) FROM T;`,
      choices: ['1', '3', '2', '0'],
      answer: 2,
      why: 'COMMIT 을 하면 그 트랜잭션에서 만든 SAVEPOINT 가 전부 사라져요. 그래서 `ROLLBACK TO A` 는 오류가 나고 아무것도 되돌리지 못해요. 1 과 2 는 첫 COMMIT 으로, 3 은 마지막 COMMIT 으로 확정돼 3건이에요. 1 은 COMMIT 을 넘어 A 까지 돌아갔다고 본 값, 2 는 COMMIT 시점까지 돌아갔다고 본 값이에요.' },
    { id: 'q18-06', level: 2, tag: 'DBMS 차이',
      q: '빈 테이블 T(N INT) 가 있고 T2 라는 테이블은 없다. SQL Server 에서 아래 SQL 을 차례로 실행한 뒤의 상태로 알맞은 것은?',
      code: `BEGIN TRAN;
INSERT INTO T VALUES (1);
CREATE TABLE T2 (C INT);
ROLLBACK;`,
      choices: [
        'T 에 1건이 있고, T2 테이블이 있다.',
        'T 는 0건이고, T2 테이블이 있다.',
        'T 에 1건이 있고, T2 테이블은 없다.',
        'T 는 0건이고, T2 테이블은 없다.'
      ],
      answer: 4,
      why: 'SQL Server 는 `BEGIN TRAN` 으로 묶은 트랜잭션 안에서 실행한 DDL 도 ROLLBACK 으로 취소할 수 있어요. 그래서 INSERT 와 CREATE TABLE 이 모두 취소돼요. 첫 번째 보기는 Oracle 처럼 DDL 이 앞의 DML 까지 커밋시킨다고 봤을 때의 상태예요.' },
    { id: 'q18-07', level: 1, tag: 'COMMIT 과 ROLLBACK',
      q: 'COMMIT 과 ROLLBACK 에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'Oracle 에서는 INSERT, UPDATE, DELETE 를 실행하면 문장이 끝날 때마다 자동으로 COMMIT 된다.',
        'SQL Server 는 기본 설정에서 DML 문장이 성공하면 자동으로 COMMIT 된다.',
        'COMMIT 하기 전에는 다른 세션에서 변경된 결과를 볼 수 없다.',
        'ROLLBACK 을 실행하면 마지막 COMMIT 이후에 수행한 DML 이 취소된다.'
      ],
      answer: 1,
      why: 'Oracle 의 DML 은 수동 커밋이에요. 직접 COMMIT 하거나 DDL 이 실행돼야 확정돼요. 문장마다 자동으로 커밋되는 쪽은 기본 설정의 SQL Server 예요. 나머지 세 보기는 맞는 설명이에요.' },
    { id: 'q18-08', level: 3, tag: 'DDL 자동 커밋',
      q: '아래 테이블 T 는 커밋된 상태이고, LOG 라는 다른 테이블이 있다. Oracle 에서 SQL 을 차례로 실행했다. 오류가 나는 문장이 있으면 그 문장만 실행되지 않고 다음 문장으로 넘어간다고 할 때, 마지막 SELECT 의 결과는?',
      tables: [{ name: 'T', head: ['ID', 'QTY'], rows: [[1, 10], [2, 20], [3, 30]] }],
      code: `UPDATE T SET QTY = QTY + 5 WHERE ID <= 2;
SAVEPOINT S1;
DELETE FROM T WHERE ID = 3;
TRUNCATE TABLE LOG;
INSERT INTO T VALUES (4, 40);
ROLLBACK TO S1;
ROLLBACK;

SELECT COUNT(*), SUM(QTY) FROM T;`,
      choices: ['3, 60', '3, 70', '2, 40', '3, 80'],
      answer: 3,
      why: '`TRUNCATE` 는 DDL 이라 실행될 때 앞의 UPDATE 와 DELETE 가 자동 커밋돼요. 이 시점에 T 는 (1, 15), (2, 25) 로 확정되고 S1 도 사라져요. `ROLLBACK TO S1` 은 오류가 나고, 마지막 `ROLLBACK` 이 TRUNCATE 뒤의 INSERT(4, 40) 만 취소해요. 그래서 2건, 합 40 이에요. 3, 60 은 전부 취소됐다고 본 값, 3, 70 은 S1 까지 되돌아갔다고 본 값이에요.' },
    { id: 'q18-09', level: 2, tag: '격리성 문제',
      q: '다음 설명에 해당하는 현상은?\n\n"한 트랜잭션 안에서 같은 조건으로 두 번 조회했는데, 그 사이에 다른 트랜잭션이 새 행을 INSERT 하고 커밋해서 첫 조회에는 없던 행이 두 번째 조회에 나타난다."',
      choices: ['Dirty Read', 'Phantom Read', 'Non-Repeatable Read', 'Lock'],
      answer: 2,
      why: '없던 행이 새로 나타나는 것은 Phantom Read 예요. Dirty Read 는 다른 트랜잭션이 커밋하지 않은 데이터를 읽는 것이고, Non-Repeatable Read 는 이미 읽은 행의 값이 다른 트랜잭션의 수정이나 삭제 때문에 달라지는 것이에요. Lock 은 동시에 접근하지 못하게 막는 장치라서 현상 이름이 아니에요.' }
  ]
});
