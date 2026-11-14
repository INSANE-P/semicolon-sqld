SQLD.add({
  id: 'q10',
  title: '집합 연산자',
  minutes: 10,
  weight: 2,
  lead: '연산자는 네 개뿐인데, 중복을 지우는지와 어느 순서로 계산하는지를 섞어서 결과 행 수를 세게 해요. 규칙만 알면 손으로 따라가서 맞힐 수 있어요.',
  goals: [
    'UNION, UNION ALL, INTERSECT, MINUS 의 결과를 손으로 계산한다',
    '중복을 지우는 연산자와 남기는 연산자를 구분한다',
    '집합 연산자를 쓸 때 지켜야 하는 규칙(컬럼 수, 타입, ORDER BY 위치)을 안다',
    '연산자를 여러 개 이어 썼을 때 위에서부터 차례로 계산한다'
  ],
  blocks: [
    { t: 'h', x: '조인은 옆으로, 집합 연산은 아래로' },
    { t: 'p', x: '올해 주문 테이블과 작년 주문 테이블이 따로 있는데 한 목록으로 보고 싶다고 해 볼게요. 조인은 컬럼을 옆으로 붙이는 일이라 맞지 않아요. 두 SELECT 결과를 ==위아래로 이어 붙이거나 겹치는 행을 골라내는 것==이 집합 연산자예요. SELECT 문과 SELECT 문 사이에 적어요.' },
    { t: 'table', head: ['연산자', '하는 일', '중복 행'], rows: [
      ['`UNION`', '합집합', '지운다'],
      ['`UNION ALL`', '합집합. 그냥 이어 붙인다', '==남긴다=='],
      ['`INTERSECT`', '교집합. 양쪽에 다 있는 행', '지운다'],
      ['`MINUS`', '차집합. 위쪽에만 있는 행', '지운다']
    ] },
    { t: 'p', x: '두 테이블로 네 연산자를 전부 돌려 볼게요. T1 에는 1 이 두 번, T2 에는 3 이 두 번 들어 있어요.' },
    { t: 'data', name: 'T1', head: ['C'], rows: [[1], [1], [2], [3]] },
    { t: 'data', name: 'T2', head: ['C'], rows: [[2], [3], [3], [4]] },
    { t: 'sql', code: `SELECT C FROM T1
UNION
SELECT C FROM T2;`, result: { head: ['C'], rows: [[1], [2], [3], [4]] },
      note: '양쪽을 합친 뒤 같은 값은 한 번만 남겨요. T1 안에서 겹친 1 도 하나가 돼요.' },
    { t: 'sql', code: `SELECT C FROM T1
UNION ALL
SELECT C FROM T2;`, result: { head: ['C'], rows: [[1], [1], [2], [3], [2], [3], [3], [4]] },
      note: '4행 + 4행 = 8행. 아무것도 지우지 않고 그대로 이어 붙여요.' },
    { t: 'sql', code: `SELECT C FROM T1
INTERSECT
SELECT C FROM T2;`, result: { head: ['C'], rows: [[2], [3]] },
      note: '양쪽에 다 있는 값. 3 이 T2 에 두 번 있어도 결과에는 한 번이에요.' },
    { t: 'sql', code: `SELECT C FROM T1
MINUS
SELECT C FROM T2;`, result: { head: ['C'], rows: [[1]] },
      note: 'T1 에만 있는 값. 1 이 두 번 있었지만 한 번만 나와요. 순서를 바꿔 T2 MINUS T1 이면 4 가 나와요.' },
    { t: 'fig', caption: '색칠한 곳이 결과예요. UNION ALL 만 겹치는 부분을 두 번 내보내요.', svg: `<svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg">
  <circle cx="58" cy="70" r="40" class="bx-a"/>
  <circle cx="102" cy="70" r="40" class="bx-a"/>
  <path d="M80,36.6 A40,40 0 0,1 80,103.4 A40,40 0 0,1 80,36.6 Z" class="bx-a"/>
  <text x="42" y="75" class="tx" text-anchor="middle">A</text>
  <text x="118" y="75" class="tx" text-anchor="middle">B</text>
  <text x="80" y="136" class="tx-b" text-anchor="middle">UNION</text>
  <text x="80" y="156" class="tx-s" text-anchor="middle">겹친 곳은 한 번</text>

  <circle cx="218" cy="70" r="40" class="bx-a"/>
  <circle cx="262" cy="70" r="40" class="bx-a"/>
  <path d="M240,36.6 A40,40 0 0,1 240,103.4 A40,40 0 0,1 240,36.6 Z" class="bx-y"/>
  <text x="202" y="75" class="tx" text-anchor="middle">A</text>
  <text x="278" y="75" class="tx" text-anchor="middle">B</text>
  <text x="240" y="75" class="tx-s" text-anchor="middle">x2</text>
  <text x="240" y="136" class="tx-b" text-anchor="middle">UNION ALL</text>
  <text x="240" y="156" class="tx-s" text-anchor="middle">겹친 곳도 그대로 두 번</text>

  <circle cx="378" cy="70" r="40" class="bx"/>
  <circle cx="422" cy="70" r="40" class="bx"/>
  <path d="M400,36.6 A40,40 0 0,1 400,103.4 A40,40 0 0,1 400,36.6 Z" class="bx-a"/>
  <text x="362" y="75" class="tx" text-anchor="middle">A</text>
  <text x="438" y="75" class="tx" text-anchor="middle">B</text>
  <text x="400" y="136" class="tx-b" text-anchor="middle">INTERSECT</text>
  <text x="400" y="156" class="tx-s" text-anchor="middle">양쪽에 다 있는 행</text>

  <circle cx="538" cy="70" r="40" class="bx-a"/>
  <circle cx="582" cy="70" r="40" class="bx"/>
  <path d="M560,36.6 A40,40 0 0,1 560,103.4 A40,40 0 0,1 560,36.6 Z" class="bx"/>
  <text x="522" y="75" class="tx" text-anchor="middle">A</text>
  <text x="598" y="75" class="tx" text-anchor="middle">B</text>
  <text x="560" y="136" class="tx-b" text-anchor="middle">A MINUS B</text>
  <text x="560" y="156" class="tx-s" text-anchor="middle">A 에만 있는 행</text>
</svg>` },
    { t: 'trap', title: '중복을 남기는 건 UNION ALL 하나', x: 'MINUS 와 INTERSECT 도 결과에서 중복을 지워요. T1 에 1 이 두 번 있어도 `T1 MINUS T2` 결과는 1 한 행이에요. 결과 행 수 문제는 "MINUS 는 빼기만 하니 1 이 두 번 남는다"고 세게 만들어요. 네 연산자 가운데 중복을 남기는 것은 UNION ALL 뿐이에요.' },

    { t: 'h', x: 'UNION 과 UNION ALL 의 차이' },
    { t: 'vs',
      a: { title: 'UNION', items: ['중복 행을 지운다', '중복을 찾느라 정렬이 일어날 수 있다', '그만큼 느리다'] },
      b: { title: 'UNION ALL', items: ['중복 행을 남긴다', '정렬 없이 이어 붙이기만 한다', '빠르다'] } },
    { t: 'p', x: '두 결과에 겹치는 행이 없다는 걸 알고 있으면 UNION ALL 을 쓰는 편이 좋아요. 쓸데없는 중복 검사를 하지 않으니까요. 그리고 UNION 이 내부에서 정렬을 하더라도 결과가 정렬돼 나온다는 보장은 없어요. 순서가 필요하면 ORDER BY 를 써요.' },

    { t: 'h', x: 'NULL 은 같은 값으로 봐요' },
    { t: 'p', x: 'WHERE 절이나 조인에서는 `NULL = NULL` 이 참이 아니었죠. 집합 연산자는 다르게 다뤄요. 중복인지 볼 때 ==NULL 끼리는 같은 값==으로 쳐요. 여러 컬럼이면 모든 컬럼 값이 같아야(NULL 은 NULL 끼리) 같은 행이에요.' },
    { t: 'data', name: 'X', head: ['C'], rows: [[1], [null], [null]] },
    { t: 'data', name: 'Y', head: ['C'], rows: [[null], [2]] },
    { t: 'table', head: ['SQL', '결과', '행 수'], rows: [
      ['X `UNION` Y', '1, 2, NULL', '3'],
      ['X `UNION ALL` Y', '1, NULL, NULL, NULL, 2', '5'],
      ['X `INTERSECT` Y', 'NULL', '1'],
      ['X `MINUS` Y', '1', '1']
    ] },
    { t: 'trap', title: '조인의 NULL 과 헷갈리게 하기', x: '`X INTERSECT Y` 는 NULL 한 행이 나오지만, `X JOIN Y ON X.C = Y.C` 는 한 행도 안 나와요. 조인의 `=` 는 NULL 을 서로 다르다고 보고, 집합 연산자는 같다고 봐요. "NULL 은 비교할 수 없으니 INTERSECT 결과가 0건"이라는 보기는 틀린 설명이에요.' },

    { t: 'h', x: '지켜야 하는 규칙' },
    { t: 'ul', items: [
      '위아래 SELECT 문의 **컬럼 수**가 같아야 한다',
      '같은 자리의 컬럼끼리 **데이터 타입**이 맞아야 한다(숫자 자리에 문자가 오면 오류). 길이는 달라도 된다',
      '컬럼 이름은 달라도 된다. 결과의 **컬럼 이름은 첫 번째 SELECT 문**의 것을 따른다',
      '`ORDER BY` 는 **맨 끝에 한 번만** 쓴다. 전체 결과를 정렬한다',
      '개별 SELECT 문에는 ORDER BY 를 쓸 수 없다. WHERE, GROUP BY, HAVING 은 쓸 수 있다'
    ] },
    { t: 'p', x: '아래 두 테이블로 규칙을 확인해 볼게요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'SAL'], rows: [['KIM', 500], ['LEE', 300]] },
    { t: 'data', name: 'DEPT', head: ['DNAME', 'LOC'], rows: [['SALES', 'SEOUL'], ['DEV', 'BUSAN']] },
    { t: 'sql', code: `SELECT ENAME AS NM FROM EMP
UNION ALL
SELECT DNAME FROM DEPT
 ORDER BY NM;`, result: { head: ['NM'], rows: [['DEV'], ['KIM'], ['LEE'], ['SALES']] },
      note: '결과 컬럼 이름은 첫 번째 SELECT 문의 별칭 NM. ORDER BY 는 맨 끝에서 전체를 정렬해요. ORDER BY 1 처럼 위치 번호로 써도 돼요.' },
    { t: 'table', caption: '오류가 나는 경우', head: ['SQL', '이유'], rows: [
      ['`SELECT ENAME, SAL FROM EMP UNION SELECT DNAME FROM DEPT`', '컬럼 수가 다르다(2개와 1개)'],
      ['`SELECT SAL FROM EMP UNION SELECT DNAME FROM DEPT`', '타입이 다르다(숫자와 문자)'],
      ['`SELECT ENAME FROM EMP ORDER BY ENAME UNION SELECT DNAME FROM DEPT`', '개별 SELECT 문에 ORDER BY 를 썼다'],
      ['`SELECT ENAME FROM EMP UNION SELECT DNAME FROM DEPT ORDER BY DNAME`', '결과 컬럼 이름은 ENAME 이라 DNAME 을 모른다']
    ] },
    { t: 'trap', title: 'ORDER BY 에 두 번째 쿼리의 컬럼 이름 쓰기', x: '맨 끝의 ORDER BY 는 합쳐진 결과를 정렬하니, 쓸 수 있는 이름은 첫 번째 SELECT 문의 컬럼 이름이나 별칭, 또는 위치 번호예요. 두 번째 SELECT 문의 컬럼 이름으로 정렬하면 오류가 나요. "결과 컬럼 이름은 마지막 쿼리를 따른다"는 보기도 같은 함정이에요.' },

    { t: 'h', x: '여러 개를 이어 쓰면 위에서 아래로' },
    { t: 'p', x: '집합 연산자가 둘 이상이면 ==위에 적힌 것부터 차례로== 계산해요. 앞의 두 SELECT 문을 먼저 계산하고, 그 결과와 다음 SELECT 문을 계산해요. 순서를 바꾸고 싶으면 괄호로 묶어요. T3 에 3 한 행만 있다고 하고 따라가 볼게요.' },
    { t: 'data', name: 'T3', head: ['C'], rows: [[3]] },
    { t: 'sql', code: `SELECT C FROM T1
UNION ALL
SELECT C FROM T2
MINUS
SELECT C FROM T3;`, result: { head: ['C'], rows: [[1], [2], [4]] },
      note: '먼저 T1 UNION ALL T2 로 8행(1, 1, 2, 3, 2, 3, 3, 4). 거기서 3 을 빼고 중복을 지우니 1, 2, 4.' },
    { t: 'sql', code: `SELECT C FROM T1
UNION ALL
(SELECT C FROM T2
 MINUS
 SELECT C FROM T3);`, result: { head: ['C'], rows: [[1], [1], [2], [3], [2], [4]] },
      note: '괄호 안을 먼저. T2 MINUS T3 은 2, 4. 그 앞에 T1 네 행을 그대로 붙여 6행.' },
    { t: 'tip', title: '마지막 연산자가 중복을 정해요', x: '차례로 계산하니, 맨 마지막 연산자가 UNION ALL 이 아니면 최종 결과에는 중복이 없어요. 반대로 앞에서 UNION 으로 중복을 지웠어도 마지막이 UNION ALL 이면 뒤에 붙는 행 때문에 중복이 다시 생길 수 있어요.' },

    { t: 'h', x: 'Oracle 과 SQL Server' },
    { t: 'table', head: ['', 'Oracle', 'SQL Server'], rows: [
      ['차집합', '`MINUS`', '`EXCEPT`'],
      ['합집합, 교집합', '`UNION`, `UNION ALL`, `INTERSECT`', '같다'],
      ['여러 개를 이어 쓸 때', '위에서 아래로 차례로 계산한다', '`INTERSECT` 를 먼저 계산한다']
    ] },
    { t: 'check', q: 'T1 MINUS T2 와 T2 MINUS T1 은 같은 결과일까요?', a: '아니에요. 차집합은 순서가 중요해요. 위 예에서 T1 MINUS T2 는 1, T2 MINUS T1 은 4 예요. UNION 과 INTERSECT 는 순서를 바꿔도 행이 같아요.' },
    { t: 'check', q: '5행짜리 결과와 3행짜리 결과를 UNION ALL 하면 몇 행일까요? UNION 이면요?', a: 'UNION ALL 은 내용과 상관없이 5 + 3 = 8행이에요. UNION 은 겹치는 행과 각 결과 안의 중복까지 지우니 내용을 봐야 알 수 있고, 8행 이하가 돼요.' }
  ],
  keys: [
    'UNION 은 중복 제거, UNION ALL 은 중복 유지. UNION ALL 이 정렬과 중복 검사가 없어 빠르다',
    'INTERSECT 와 MINUS 도 결과에서 중복을 지운다. 중복을 남기는 건 UNION ALL 뿐',
    'MINUS 는 위쪽에만 있는 행. 순서를 바꾸면 결과가 달라진다. SQL Server 는 EXCEPT',
    '컬럼 수와 같은 자리의 데이터 타입이 맞아야 한다. 컬럼 이름은 달라도 된다',
    '결과 컬럼 이름은 첫 번째 SELECT 문 기준',
    'ORDER BY 는 맨 끝에 한 번만. 개별 SELECT 문에는 쓸 수 없다',
    '여러 개를 이어 쓰면 위에서 아래로 차례로 계산한다. 괄호가 있으면 괄호 먼저',
    '집합 연산자는 NULL 끼리 같은 값으로 보고 중복을 지운다'
  ],
  cards: [
    { q: 'UNION 과 UNION ALL 의 차이는?', a: 'UNION 은 중복을 지우고(정렬이 일어날 수 있음), UNION ALL 은 그대로 이어 붙여요. UNION ALL 이 빨라요.' },
    { q: '(1, 1, 2) MINUS (2) 의 결과는?', a: '1 한 행. MINUS 도 중복을 지워요.' },
    { q: '집합 연산 결과의 컬럼 이름은 어느 쪽을 따르나요?', a: '첫 번째 SELECT 문.' },
    { q: '집합 연산자에서 ORDER BY 는 어디에 쓰나요?', a: '맨 끝에 한 번만. 첫 번째 SELECT 문의 컬럼 이름이나 별칭, 위치 번호로 써요.' },
    { q: 'Oracle 의 MINUS 는 SQL Server 에서?', a: 'EXCEPT.' },
    { q: '(NULL, NULL) UNION (NULL) 의 결과 행 수는?', a: '1행. 집합 연산자는 NULL 끼리 같은 값으로 봐요.' },
    { q: 'A UNION ALL B MINUS C 는 어떤 순서로 계산하나요?', a: '위에서 아래로. (A UNION ALL B) 를 먼저 하고 거기서 C 를 빼요.' }
  ],
  quiz: [
    { id: 'q10-01', level: 1, tag: '연산자 뜻',
      q: '집합 연산자에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'UNION 은 두 결과를 합친 뒤 중복된 행을 한 번만 남긴다.',
        'INTERSECT 는 두 결과에 모두 있는 행을 돌려준다.',
        'SQL Server 에서는 MINUS 대신 EXCEPT 를 쓴다.',
        'UNION ALL 은 중복을 제거하므로 UNION 보다 느리다.'
      ],
      answer: 4,
      why: '중복을 제거하는 쪽은 UNION 이에요. UNION ALL 은 중복 검사 없이 그대로 이어 붙이기 때문에 UNION 보다 빨라요. 나머지 셋은 맞는 설명이에요.' },
    { id: 'q10-02', level: 1, tag: 'UNION 과 UNION ALL',
      q: '아래 테이블에서 (가)와 (나)의 결과 행 수를 순서대로 적은 것은?',
      tables: [
        { name: 'T1', head: ['C'], rows: [[1], [2], [2], [3]] },
        { name: 'T2', head: ['C'], rows: [[2], [3], [4], [4]] }
      ],
      code: `-- (가)
SELECT C FROM T1 UNION SELECT C FROM T2;

-- (나)
SELECT C FROM T1 UNION ALL SELECT C FROM T2;`,
      choices: ['6, 8', '4, 8', '4, 6', '5, 8'],
      answer: 2,
      why: 'UNION 은 합친 결과에서 중복을 전부 지워요. 두 테이블 사이에 겹치는 2, 3 뿐 아니라 T1 안의 2, T2 안의 4 중복도 지워져서 1, 2, 3, 4 네 행이에요. UNION ALL 은 4 + 4 = 8행이에요. 6 은 테이블끼리 겹치는 것만 지웠을 때 나오는 값이에요.' },
    { id: 'q10-03', level: 2, tag: 'MINUS',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [
        { name: 'T1', head: ['C'], rows: [[1], [1], [2], [3], [3]] },
        { name: 'T2', head: ['C'], rows: [[3], [4]] }
      ],
      code: `SELECT C FROM T1
MINUS
SELECT C FROM T2
 ORDER BY C;`,
      choices: ['1, 2', '1, 1, 2', '1, 1, 2, 3', '1, 2, 4'],
      answer: 1,
      why: 'T1 에서 T2 에 있는 3 을 빼면 1, 1, 2 가 남는데, MINUS 는 결과의 중복도 지워서 1, 2 예요. T1 의 3 은 두 행 모두 빠져요. 4 는 T2 에만 있는 값이라 T1 MINUS T2 에는 나올 수 없어요.' },
    { id: 'q10-04', level: 3, tag: '연산 순서',
      q: '아래 테이블에서 SQL 을 실행한 결과 행 수는?',
      tables: [
        { name: 'T1', head: ['C'], rows: [[1], [2], [2], [3]] },
        { name: 'T2', head: ['C'], rows: [[2], [3], [4]] },
        { name: 'T3', head: ['C'], rows: [[2], [5]] }
      ],
      code: `SELECT C FROM T1
UNION ALL
SELECT C FROM T2
MINUS
SELECT C FROM T3;`,
      choices: ['6', '4', '5', '3'],
      answer: 4,
      why: '위에서부터 계산해요. T1 UNION ALL T2 는 1, 2, 2, 3, 2, 3, 4 일곱 행이에요. 여기서 T3 에 있는 2 를 빼면 1, 3, 3, 4 가 남고, MINUS 가 중복을 지워 1, 3, 4 세 행이에요. 4 는 중복을 지우지 않았을 때, 6 은 T2 MINUS T3 을 먼저 계산했을 때 나오는 값이에요.' },
    { id: 'q10-05', level: 3, tag: '연산 순서',
      q: '아래 테이블에서 (가)와 (나)의 결과 행 수를 순서대로 적은 것은?',
      tables: [
        { name: 'T1', head: ['C'], rows: [[1], [1], [2]] },
        { name: 'T2', head: ['C'], rows: [[2], [3]] },
        { name: 'T3', head: ['C'], rows: [[1], [3]] }
      ],
      code: `-- (가)
SELECT C FROM T1
UNION
SELECT C FROM T2
UNION ALL
SELECT C FROM T3;

-- (나)
SELECT C FROM T1
UNION ALL
SELECT C FROM T2
UNION
SELECT C FROM T3;`,
      choices: ['5, 3', '3, 3', '5, 5', '3, 5'],
      answer: 1,
      why: '(가)는 T1 UNION T2 로 1, 2, 3 을 만든 뒤 T3 의 1, 3 을 그대로 붙여서 5행이에요. (나)는 T1 UNION ALL T2 로 1, 1, 2, 2, 3 을 만든 뒤 T3 과 UNION 하면서 중복을 전부 지워 1, 2, 3 세 행이에요. 마지막 연산자가 UNION ALL 이냐 UNION 이냐에 따라 갈려요.' },
    { id: 'q10-06', level: 2, tag: '사용 규칙',
      q: '다음 중 오류 없이 실행되는 SQL 은? (EMP 의 ENAME 과 DEPT 의 DNAME, LOC 는 문자 타입, EMP 의 SAL 은 숫자 타입이다)',
      choices: [
        { code: `SELECT ENAME, SAL FROM EMP
UNION
SELECT DNAME FROM DEPT;` },
        { code: `SELECT ENAME FROM EMP
 ORDER BY ENAME
UNION ALL
SELECT DNAME FROM DEPT;` },
        { code: `SELECT ENAME AS NM FROM EMP
UNION ALL
SELECT DNAME FROM DEPT
 ORDER BY NM;` },
        { code: `SELECT ENAME AS NM FROM EMP
UNION ALL
SELECT DNAME AS DN FROM DEPT
 ORDER BY DN;` }
      ],
      answer: 3,
      why: '3번은 컬럼 수와 타입이 맞고, ORDER BY 를 맨 끝에 첫 번째 SELECT 문의 별칭으로 썼어요. 1번은 컬럼 수가 다르고, 2번은 개별 SELECT 문에 ORDER BY 를 썼어요. 4번은 결과 컬럼 이름이 첫 번째 SELECT 문의 NM 이라 DN 으로는 정렬할 수 없어요.' },
    { id: 'q10-07', level: 2, tag: '집합 연산과 NULL',
      q: '아래 테이블에서 (가)와 (나)의 결과 행 수를 순서대로 적은 것은?',
      tables: [
        { name: 'T1', head: ['C'], rows: [[1], [null], [null]] },
        { name: 'T2', head: ['C'], rows: [[null], [2]] }
      ],
      code: `-- (가)
SELECT C FROM T1 UNION SELECT C FROM T2;

-- (나)
SELECT C FROM T1 INTERSECT SELECT C FROM T2;`,
      choices: ['3, 0', '3, 1', '5, 0', '4, 1'],
      answer: 2,
      why: '집합 연산자는 NULL 끼리 같은 값으로 봐요. (가)는 NULL 세 개가 하나로 합쳐져 1, 2, NULL 세 행이에요. (나)는 양쪽에 다 있는 NULL 한 행이 나와요. 0 은 조인의 `=` 처럼 NULL 끼리 다르다고 봤을 때 나오는 값이에요.' }
  ]
});
