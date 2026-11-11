SQLD.add({
  id: 'q20',
  title: 'DCL',
  minutes: 10,
  weight: 2,
  lead: '권한을 주고 뺏는 명령어 두 개가 전부예요. 문법의 ON, TO, FROM 자리와, WITH GRANT OPTION 과 WITH ADMIN OPTION 의 회수 차이에서 한 문제가 나옵니다.',
  goals: [
    '시스템 권한과 오브젝트 권한을 구분한다',
    'GRANT 와 REVOKE 문장을 틀리지 않게 쓴다',
    'WITH GRANT OPTION 과 WITH ADMIN OPTION 에서 권한을 회수했을 때 누구에게 권한이 남는지 말할 수 있다',
    'ROLE 이 무엇이고 왜 쓰는지 설명한다'
  ],
  blocks: [
    { t: 'h', x: '남의 테이블은 기본적으로 못 봐요' },
    { t: 'p', x: 'SCOTT 이 만든 EMP 테이블을 HR 계정으로 조회하면 오류가 나요. 테이블은 만든 사용자(소유자)의 것이고, 다른 사용자는 권한을 받아야 쓸 수 있습니다. 이 권한을 주고(`GRANT`) 회수하는(`REVOKE`) 명령어가 DCL(Data Control Language)이에요.' },
    { t: 'vs',
      a: { title: '시스템 권한', items: ['데이터베이스에서 어떤 작업을 할 수 있는 권한', '`CREATE SESSION`(접속), `CREATE TABLE`, `CREATE VIEW`, `CREATE USER`', '관리자(SYS, SYSTEM)가 준다', '문장에 ON 이 없다'] },
      b: { title: '오브젝트 권한', items: ['특정 객체(테이블, 뷰 등)를 다룰 수 있는 권한', '`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `INDEX`, `REFERENCES`, `EXECUTE`', '그 객체의 소유자가 준다', '문장에 ON 객체 가 있다'] } },

    { t: 'h', x: 'GRANT 와 REVOKE' },
    { t: 'sql', code: `-- 오브젝트 권한: GRANT 권한 ON 객체 TO 사용자
GRANT SELECT, UPDATE ON EMP TO HR;
REVOKE UPDATE ON EMP FROM HR;

-- 시스템 권한: ON 이 없다
GRANT CREATE TABLE TO HR;
REVOKE CREATE TABLE FROM HR;

-- 모든 사용자에게
GRANT SELECT ON EMP TO PUBLIC;`, note: '권한 여러 개, 사용자 여러 명은 콤마로 이어 한 문장에 쓸 수 있어요. ON 뒤의 객체는 한 문장에 하나만 적습니다. 이미 회수한 권한을 다시 회수하면 오류가 나요.' },
    { t: 'table', head: ['', 'GRANT', 'REVOKE'], rows: [
      ['하는 일', '권한 부여', '권한 회수'],
      ['오브젝트 권한', '`GRANT 권한 ON 객체 TO 사용자`', '`REVOKE 권한 ON 객체 FROM 사용자`'],
      ['시스템 권한', '`GRANT 권한 TO 사용자`', '`REVOKE 권한 FROM 사용자`']
    ] },
    { t: 'trap', title: 'TO 와 FROM', x: '줄 때는 `TO`, 뺏을 때는 `FROM` 이에요. `REVOKE SELECT ON EMP TO HR` 처럼 REVOKE 에 TO 를 붙이거나, `GRANT SELECT TO HR ON EMP` 처럼 ON 과 TO 의 순서를 바꾼 문장이 틀린 보기로 나옵니다. 순서는 항상 권한, ON 객체, TO(FROM) 사용자예요.' },
    { t: 'p', x: '`PUBLIC` 은 특정 사용자가 아니라 ==모든 사용자==를 가리켜요. `TO PUBLIC` 으로 주면 데이터베이스의 모든 사용자가 그 권한을 갖습니다.' },

    { t: 'h', x: '유저를 만들고 접속하기까지' },
    { t: 'p', x: '유저를 만들었다고 바로 쓸 수 있는 게 아니에요. 단계마다 필요한 권한이 따로 있고, 시험은 어느 단계에서 어떤 권한이 없어 막히는지를 물어요.' },
    { t: 'sql', code: `CREATE USER KIM IDENTIFIED BY pw1234;   -- CREATE USER 권한이 있는 계정으로 실행
GRANT CREATE SESSION TO KIM;             -- 이제 접속 가능
GRANT CREATE TABLE TO KIM;               -- 이제 테이블 생성 가능` },
    { t: 'table', head: ['하려는 일', '필요한 권한', '없으면'], rows: [
      ['유저 만들기', '`CREATE USER`', '일반 유저는 다른 유저를 만들 수 없다'],
      ['접속(로그인)', '`CREATE SESSION`', '유저가 있어도 접속이 거부된다'],
      ['테이블 만들기', '`CREATE TABLE`', '접속은 되지만 CREATE TABLE 이 거부된다'],
      ['남의 테이블 조회', '그 테이블의 `SELECT` 오브젝트 권한', '테이블이 없다는 오류가 난다']
    ] },
    { t: 'trap', title: 'CREATE USER 만으로는 접속이 안 돼요', x: '방금 만든 유저로 접속을 시도하면 실패해요. 접속에 필요한 권한은 `CREATE SESSION` 이고, 이름이 비슷한 `CREATE USER` 나 `CREATE TABLE` 로는 접속할 수 없습니다. 빈칸에 들어갈 권한을 고르는 문제로 나와요.' },

    { t: 'h', x: 'ROLE 은 권한 묶음이에요' },
    { t: 'p', x: '신입 개발자가 올 때마다 접속 권한, 테이블 생성 권한, 뷰 생성 권한을 하나씩 주는 건 번거로워요. 권한 여러 개를 묶어 이름을 붙여 두고 그 이름을 통째로 주는 것이 ROLE(롤)이에요. ROLE 에는 시스템 권한과 오브젝트 권한을 함께 담을 수 있습니다.' },
    { t: 'sql', code: `CREATE ROLE DEV_ROLE;                           -- 롤 만들기
GRANT CREATE SESSION, CREATE TABLE TO DEV_ROLE; -- 롤에 권한 담기
GRANT SELECT ON EMP TO DEV_ROLE;
GRANT DEV_ROLE TO KIM, LEE;                     -- 롤을 사용자에게 주기` },
    { t: 'ul', items: [
      'ROLE 에서 권한을 빼면 그 ROLE 을 받은 모든 사용자에게 ==바로 반영==된다. ROLE 을 다시 줄 필요가 없다',
      'ROLE 을 통해 받은 권한은 사용자에게서 직접 회수할 수 없다. ROLE 에서 빼거나 ROLE 자체를 회수한다',
      '한 사용자가 여러 ROLE 을 받을 수 있다',
      'Oracle 이 미리 만들어 둔 ROLE: `CONNECT`(접속에 필요한 권한 묶음), `RESOURCE`(테이블 같은 객체를 만드는 권한 묶음)'
    ] },

    { t: 'h', x: 'WITH GRANT OPTION 과 WITH ADMIN OPTION' },
    { t: 'p', x: '권한을 받은 사람이 그 권한을 다른 사람에게 또 줄 수 있게 하려면 옵션을 붙여서 줘요. 권한의 종류에 따라 옵션 이름이 다르고, ==회수할 때의 동작이 다릅니다==.' },
    { t: 'table', head: ['', 'WITH GRANT OPTION', 'WITH ADMIN OPTION'], rows: [
      ['대상', '오브젝트 권한', '시스템 권한, ROLE'],
      ['예', '`GRANT SELECT ON EMP TO U1 WITH GRANT OPTION;`', '`GRANT CREATE TABLE TO U1 WITH ADMIN OPTION;`'],
      ['받은 사람(U1)', 'U2 에게 같은 권한을 줄 수 있다', 'U2 에게 같은 권한을 줄 수 있다'],
      ['U1 에게서 회수하면', 'U1 이 U2 에게 준 권한도 ==함께 회수==', 'U2 의 권한은 ==그대로 남음=='],
      ['U2 의 권한을 처음 준 사람이 직접 회수', '불가. U1 이 회수하거나 U1 의 권한을 회수', '가능']
    ] },
    { t: 'fig', caption: 'U1 의 권한을 회수했을 때 U2 가 어떻게 되는지가 두 옵션의 차이예요.', svg: `<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="20" class="tx-b" text-anchor="middle">WITH GRANT OPTION (오브젝트 권한)</text>
  <rect x="40" y="34" width="120" height="40" class="bx"/><text x="100" y="59" class="tx-m" text-anchor="middle">SCOTT</text>
  <rect x="260" y="34" width="120" height="40" class="bx-r"/><text x="320" y="59" class="tx-r" text-anchor="middle">U1</text>
  <rect x="480" y="34" width="120" height="40" class="bx-r"/><text x="540" y="59" class="tx-r" text-anchor="middle">U2</text>
  <line x1="164" y1="54" x2="252" y2="54" class="ln" marker-end="url(#arr)"/>
  <line x1="384" y1="54" x2="472" y2="54" class="ln" marker-end="url(#arr)"/>
  <text x="320" y="98" class="tx-r" text-anchor="middle">U1 에게서 회수하면 U2 의 권한도 함께 사라짐</text>
  <line x1="20" y1="120" x2="620" y2="120" class="ln-d"/>
  <text x="320" y="148" class="tx-b" text-anchor="middle">WITH ADMIN OPTION (시스템 권한)</text>
  <rect x="40" y="162" width="120" height="40" class="bx"/><text x="100" y="187" class="tx-m" text-anchor="middle">SYSTEM</text>
  <rect x="260" y="162" width="120" height="40" class="bx-r"/><text x="320" y="187" class="tx-r" text-anchor="middle">U1</text>
  <rect x="480" y="162" width="120" height="40" class="bx-a"/><text x="540" y="187" class="tx-a" text-anchor="middle">U2</text>
  <line x1="164" y1="182" x2="252" y2="182" class="ln" marker-end="url(#arr)"/>
  <line x1="384" y1="182" x2="472" y2="182" class="ln" marker-end="url(#arr)"/>
  <text x="320" y="228" class="tx-a" text-anchor="middle">U1 에게서 회수해도 U2 의 권한은 남음</text>
</svg>` },
    { t: 'trap', title: '옵션과 권한 종류 짝 바꾸기', x: '"WITH ADMIN OPTION 으로 받은 테이블 조회 권한을 다른 유저에게 줄 수 있다"는 틀린 문장이에요. 테이블 조회는 오브젝트 권한이라 WITH GRANT OPTION 을 씁니다. 연쇄 회수도 반대로 적어 놓아요. 함께 회수되는 쪽은 GRANT OPTION(오브젝트 권한)이고, ADMIN OPTION(시스템 권한)은 남습니다.' },
    { t: 'tip', title: '이렇게 외워요', x: '오브젝트 권한은 객체 주인에게서 흘러나온 것이라 중간이 끊기면 뒤도 같이 끊겨요. 시스템 권한은 한번 받으면 각자의 것이 되어 중간 사람과 상관없이 남습니다.' },
    { t: 'check', q: 'SCOTT 이 U1 에게 EMP 의 SELECT 권한을 WITH GRANT OPTION 으로 주고, U1 이 U2 에게 같은 권한을 줬어요. SCOTT 이 U1 의 권한을 회수하면 U2 는 EMP 를 조회할 수 있을까요?', a: '없어요. WITH GRANT OPTION 으로 준 오브젝트 권한은 중간 사람에게서 회수하면 그 사람이 나눠 준 권한까지 함께 회수됩니다.' },
    { t: 'check', q: 'DEV_ROLE 을 받은 KIM 이 있어요. 관리자가 DEV_ROLE 에서 CREATE TABLE 권한을 뺐습니다. KIM 에게 반영되려면 ROLE 을 다시 줘야 할까요?', a: '아니요. ROLE 에서 권한을 빼면 그 ROLE 을 가진 사용자에게 바로 반영돼요.' }
  ],
  keys: [
    '시스템 권한은 작업 권한(CREATE SESSION, CREATE TABLE), 오브젝트 권한은 특정 객체 권한(SELECT, INSERT, UPDATE, DELETE, REFERENCES)',
    'GRANT 권한 ON 객체 TO 사용자, REVOKE 권한 ON 객체 FROM 사용자. 시스템 권한은 ON 이 없다',
    '유저를 만든 뒤 접속하려면 CREATE SESSION 권한이 필요하다',
    'ROLE 은 권한 묶음. ROLE 에서 권한을 빼면 받은 사용자에게 바로 반영',
    'WITH GRANT OPTION 은 오브젝트 권한, 회수하면 연쇄 회수',
    'WITH ADMIN OPTION 은 시스템 권한과 ROLE, 회수해도 연쇄 회수되지 않는다',
    'PUBLIC 은 모든 사용자'
  ],
  cards: [
    { q: 'HR 에게서 EMP 의 SELECT 권한을 회수하는 문장은?', a: '`REVOKE SELECT ON EMP FROM HR;` 회수는 FROM 이에요.' },
    { q: '새로 만든 유저가 접속하려면 필요한 시스템 권한은?', a: '`CREATE SESSION`.' },
    { q: 'WITH GRANT OPTION 과 WITH ADMIN OPTION 은 각각 어떤 권한에 쓰나요?', a: 'GRANT OPTION 은 오브젝트 권한, ADMIN OPTION 은 시스템 권한과 ROLE.' },
    { q: '중간 사람의 권한을 회수했을 때 제3자의 권한까지 함께 회수되는 옵션은?', a: 'WITH GRANT OPTION. WITH ADMIN OPTION 은 제3자의 권한이 남아요.' },
    { q: 'ROLE 이란?', a: '여러 권한을 묶어 이름을 붙인 것. 사용자에게 ROLE 을 주면 묶인 권한을 한꺼번에 받아요.' },
    { q: '`GRANT SELECT ON EMP TO PUBLIC;` 의 뜻은?', a: '모든 사용자에게 EMP 조회 권한을 준다.' }
  ],
  quiz: [
    { id: 'q20-01', level: 1, tag: 'GRANT 문법',
      q: 'HR 사용자에게 EMP 테이블의 조회 권한을 주는 문장으로 알맞은 것은?',
      choices: [
        { code: `GRANT SELECT TO HR ON EMP;` },
        { code: `GRANT SELECT ON EMP TO HR;` },
        { code: `GRANT SELECT ON EMP FROM HR;` },
        { code: `GRANT ON EMP SELECT TO HR;` }
      ],
      answer: 2,
      why: '오브젝트 권한은 `GRANT 권한 ON 객체 TO 사용자` 순서로 써요. ON 과 TO 의 순서를 바꾸면 안 되고, FROM 은 권한을 회수하는 REVOKE 에서 씁니다.' },
    { id: 'q20-02', level: 2, tag: '권한 종류',
      q: '다음 중 오브젝트 권한에 해당하는 것은?',
      choices: ['`CREATE SESSION`', '`CREATE TABLE`', '`CREATE USER`', '`REFERENCES`'],
      answer: 4,
      why: 'REFERENCES 는 특정 테이블을 FK 로 참조할 수 있는 권한이라 오브젝트 권한이에요. `GRANT REFERENCES ON 테이블 TO 사용자` 처럼 대상 객체를 적습니다. CREATE SESSION, CREATE TABLE, CREATE USER 는 어떤 작업을 할 수 있는지를 정하는 시스템 권한이에요.' },
    { id: 'q20-03', level: 3, tag: '권한 옵션',
      q: 'Oracle 에서 아래 문장을 차례로 실행했다(괄호 앞은 실행한 계정). 실행이 끝난 뒤 U2 가 할 수 있는 일로 알맞은 것은?',
      code: `SCOTT)  GRANT SELECT ON EMP TO U1 WITH GRANT OPTION;
SYSTEM) GRANT CREATE TABLE TO U1 WITH ADMIN OPTION;
U1)     GRANT SELECT ON SCOTT.EMP TO U2;
U1)     GRANT CREATE TABLE TO U2;
SCOTT)  REVOKE SELECT ON EMP FROM U1;
SYSTEM) REVOKE CREATE TABLE FROM U1;`,
      choices: [
        'SCOTT.EMP 조회와 테이블 생성을 모두 할 수 있다.',
        'SCOTT.EMP 조회만 할 수 있다.',
        '테이블 생성만 할 수 있다.',
        '둘 다 할 수 없다.'
      ],
      answer: 3,
      why: 'SELECT 는 오브젝트 권한이고 WITH GRANT OPTION 으로 전달됐어요. U1 에게서 회수하면 U1 이 U2 에게 준 SELECT 권한도 함께 회수됩니다. CREATE TABLE 은 시스템 권한이고 WITH ADMIN OPTION 으로 전달됐기 때문에 U1 에게서 회수해도 U2 의 권한은 남아요. 그래서 U2 는 테이블 생성만 할 수 있습니다.' },
    { id: 'q20-04', level: 2, tag: '유저와 권한',
      q: '관리자 계정에서 아래 문장으로 유저를 만들었다. KIM 으로 접속을 시도했더니 권한이 없어 실패했다. KIM 이 접속할 수 있도록 빈칸에 들어갈 권한은?',
      code: `CREATE USER KIM IDENTIFIED BY pw1234;

GRANT (      ) TO KIM;`,
      choices: ['`CREATE SESSION`', '`CREATE USER`', '`CREATE TABLE`', '`SELECT ANY TABLE`'],
      answer: 1,
      why: '데이터베이스에 접속하려면 CREATE SESSION 시스템 권한이 필요해요. CREATE USER 는 다른 유저를 만드는 권한, CREATE TABLE 은 테이블을 만드는 권한, SELECT ANY TABLE 은 모든 테이블을 조회하는 권한이라 접속과는 관계가 없습니다.' },
    { id: 'q20-05', level: 2, tag: 'ROLE',
      q: 'ROLE 에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'ROLE 은 여러 권한을 묶어 이름을 붙인 것으로, 권한 부여와 회수를 편하게 해 준다.',
        'ROLE 에는 시스템 권한과 오브젝트 권한을 함께 담을 수 있다.',
        'ROLE 에서 권한을 빼면, 이미 그 ROLE 을 받은 사용자에게는 ROLE 을 다시 부여해야 반영된다.',
        '한 사용자가 여러 ROLE 을 받을 수 있다.'
      ],
      answer: 3,
      why: 'ROLE 에서 권한을 빼면 그 ROLE 을 가진 사용자에게 바로 반영돼요. ROLE 을 다시 줄 필요가 없습니다. 나머지는 ROLE 의 뜻과 특징을 맞게 설명했어요.' },
    { id: 'q20-06', level: 1, tag: 'PUBLIC',
      q: '데이터베이스의 모든 사용자에게 EMP 테이블의 조회 권한을 주는 문장으로 알맞은 것은?',
      choices: [
        { code: `GRANT SELECT ON EMP TO PUBLIC;` },
        { code: `GRANT SELECT ON EMP TO ALL;` },
        { code: `GRANT SELECT ON EMP WITH ADMIN OPTION;` },
        { code: `GRANT PUBLIC SELECT ON EMP;` }
      ],
      answer: 1,
      why: '모든 사용자를 가리키는 낱말은 PUBLIC 이고, 사용자 이름 자리인 TO 뒤에 적어요. ALL 은 사용자를 가리키는 낱말이 아니고, WITH ADMIN OPTION 은 받은 시스템 권한을 다시 나눠 줄 수 있게 하는 옵션입니다.' },
    { id: 'q20-07', level: 3, tag: '권한 옵션',
      q: '권한 부여와 회수에 대한 설명으로 가장 적절한 것은?',
      choices: [
        'WITH ADMIN OPTION 으로 받은 테이블 조회 권한은 다른 사용자에게 다시 줄 수 있다.',
        'WITH GRANT OPTION 으로 받은 오브젝트 권한을 회수당하면, 그 사용자가 다른 사용자에게 나눠 준 같은 권한도 함께 회수된다.',
        'WITH ADMIN OPTION 으로 받은 시스템 권한을 회수당하면, 그 사용자가 다른 사용자에게 나눠 준 같은 권한도 함께 회수된다.',
        '권한을 회수할 때는 `REVOKE 권한 ON 객체 TO 사용자` 형식으로 쓴다.'
      ],
      answer: 2,
      why: 'WITH GRANT OPTION 은 오브젝트 권한에 쓰는 옵션이고, 중간 사용자에게서 회수하면 그 사용자가 나눠 준 권한까지 연쇄로 회수돼요. 테이블 조회는 오브젝트 권한이라 WITH ADMIN OPTION 이 아니라 WITH GRANT OPTION 으로 전달합니다. WITH ADMIN OPTION 으로 전달된 시스템 권한은 중간 사용자에게서 회수해도 남아요. REVOKE 는 TO 가 아니라 FROM 을 씁니다.' }
  ]
});
