SQLD.add({
  id: 'q3',
  title: '함수',
  minutes: 26,
  weight: 3,
  lead: '함수는 외울 것이 많아 보이지만 시험은 "이 식의 결과는?"을 물어요. 인자 순서와 음수가 들어갔을 때의 동작만 정확히 알면 계산 문제가 그대로 점수가 돼요.',
  goals: [
    '단일행 함수와 다중행 함수를 구분한다',
    'SUBSTR, INSTR, LTRIM, LPAD 같은 문자 함수의 결과를 손으로 계산한다',
    'ROUND, TRUNC, CEIL, FLOOR, MOD 에 음수가 들어간 결과를 계산한다',
    'DECODE 와 CASE 를 읽고, 조건에 안 걸린 행이 무엇이 되는지 말한다'
  ],
  blocks: [
    { t: 'h', x: '단일행 함수와 다중행 함수' },
    { t: 'p', x: '함수는 값을 넣으면 정해진 규칙대로 결과를 돌려주는 도구예요. 넣는 행 수에 따라 둘로 나눠요. 한 행을 넣으면 한 행이 나오는 것이 단일행 함수, 여러 행을 넣어 값 하나로 줄이는 것이 다중행 함수예요.' },
    { t: 'vs',
      a: { title: '단일행 함수', items: ['행마다 한 번씩 계산해 행 수가 그대로다', '문자, 숫자, 날짜, 변환, 일반(NULL 관련) 함수', '`SUBSTR`, `ROUND`, `TO_CHAR`, `NVL`, `DECODE`', 'SELECT, WHERE, ORDER BY 등에서 쓴다', '함수 안에 함수를 넣을 수 있고 안쪽부터 계산한다'] },
      b: { title: '다중행 함수', items: ['여러 행을 받아 값 하나를 돌려준다', '집계 함수, 그룹 함수, 윈도우 함수', '`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`', '주로 GROUP BY 와 함께 쓴다'] } },

    { t: 'h', x: '문자 함수' },
    { t: 'table', head: ['함수', '하는 일', '예', '결과'], rows: [
      ['`LOWER(s)`', '소문자로', "`LOWER('SQL Dev')`", 'sql dev'],
      ['`UPPER(s)`', '대문자로', "`UPPER('SQL Dev')`", 'SQL DEV'],
      ['`INITCAP(s)`', '낱말의 첫 글자만 대문자로', "`INITCAP('sql dev')`", 'Sql Dev'],
      ['`SUBSTR(s, 시작, 길이)`', '시작 위치부터 길이만큼 자른다', "`SUBSTR('ABCDEFG', 3, 2)`", 'CD'],
      ['`INSTR(s, 찾을글자, 시작, 몇번째)`', '찾을 글자의 위치(숫자)', "`INSTR('A-B-C', '-')`", '2'],
      ['`LTRIM(s, 글자들)`', '왼쪽에서 지정한 글자를 지운다', "`LTRIM('XXSQL', 'X')`", 'SQL'],
      ['`RTRIM(s, 글자들)`', '오른쪽에서 지정한 글자를 지운다', "`RTRIM('SQLXX', 'X')`", 'SQL'],
      ['`TRIM(s)`', '양쪽 공백을 지운다', "`TRIM('  SQL  ')`", 'SQL'],
      ['`LPAD(s, 전체길이, 채울글자)`', '왼쪽을 채워 전체 길이를 맞춘다', "`LPAD('7', 3, '0')`", '007'],
      ['`RPAD(s, 전체길이, 채울글자)`', '오른쪽을 채워 전체 길이를 맞춘다', "`RPAD('7', 3, '0')`", '700'],
      ['`CONCAT(a, b)`', '두 문자열을 잇는다', "`CONCAT('SQL', 'D')`", 'SQLD'],
      ['`LENGTH(s)`', '글자 수(숫자)', "`LENGTH('SQLD')`", '4'],
      ['`REPLACE(s, 찾을말, 바꿀말)`', '낱말 단위로 바꾼다', "`REPLACE('2026-11-14', '-', '/')`", '2026/11/14'],
      ['`TRANSLATE(s, 찾을글자들, 바꿀글자들)`', '글자를 1:1 로 바꾼다', "`TRANSLATE('ABCA', 'AB', 'xy')`", 'xyCx']
    ] },
    { t: 'p', x: '문자 함수는 대부분 문자를 돌려주지만 `LENGTH` 와 `INSTR` 은 숫자를 돌려줘요. 아래부터는 계산 문제에 나오는 함수를 하나씩 봐요.' },

    { t: 'h', x: 'SUBSTR: 위치는 1부터, 음수는 뒤에서부터' },
    { t: 'fig', caption: '시작 위치가 음수면 뒤에서부터 세어 자리를 잡고, 자르는 방향은 언제나 오른쪽이에요.', svg: `<svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg">
  <text x="290" y="24" class="tx-m" text-anchor="middle">SUBSTR(s, 3, 2) = CD</text>
  <text x="62" y="52" class="tx-s" text-anchor="middle">앞에서</text>
  <text x="140" y="52" class="tx-s" text-anchor="middle">1</text>
  <text x="200" y="52" class="tx-s" text-anchor="middle">2</text>
  <text x="260" y="52" class="tx-a" text-anchor="middle">3</text>
  <text x="320" y="52" class="tx-s" text-anchor="middle">4</text>
  <text x="380" y="52" class="tx-s" text-anchor="middle">5</text>
  <text x="440" y="52" class="tx-s" text-anchor="middle">6</text>
  <text x="500" y="52" class="tx-s" text-anchor="middle">7</text>
  <rect x="110" y="62" width="60" height="44" class="bx"/><text x="140" y="90" class="tx-m" text-anchor="middle">A</text>
  <rect x="170" y="62" width="60" height="44" class="bx"/><text x="200" y="90" class="tx-m" text-anchor="middle">B</text>
  <rect x="230" y="62" width="60" height="44" class="bx-a"/><text x="260" y="90" class="tx-m" text-anchor="middle">C</text>
  <rect x="290" y="62" width="60" height="44" class="bx-a"/><text x="320" y="90" class="tx-m" text-anchor="middle">D</text>
  <rect x="350" y="62" width="60" height="44" class="bx-y"/><text x="380" y="90" class="tx-m" text-anchor="middle">E</text>
  <rect x="410" y="62" width="60" height="44" class="bx-y"/><text x="440" y="90" class="tx-m" text-anchor="middle">F</text>
  <rect x="470" y="62" width="60" height="44" class="bx"/><text x="500" y="90" class="tx-m" text-anchor="middle">G</text>
  <text x="62" y="128" class="tx-s" text-anchor="middle">뒤에서</text>
  <text x="140" y="128" class="tx-s" text-anchor="middle">-7</text>
  <text x="200" y="128" class="tx-s" text-anchor="middle">-6</text>
  <text x="260" y="128" class="tx-s" text-anchor="middle">-5</text>
  <text x="320" y="128" class="tx-s" text-anchor="middle">-4</text>
  <text x="380" y="128" class="tx-r" text-anchor="middle">-3</text>
  <text x="440" y="128" class="tx-s" text-anchor="middle">-2</text>
  <text x="500" y="128" class="tx-s" text-anchor="middle">-1</text>
  <text x="410" y="160" class="tx-m" text-anchor="middle">SUBSTR(s, -3, 2) = EF</text>
</svg>` },
    { t: 'table', head: ['식', '결과', '읽는 법'], rows: [
      ["`SUBSTR('ABCDEFG', 3, 2)`", 'CD', '3번째 글자부터 2글자'],
      ["`SUBSTR('ABCDEFG', 3)`", 'CDEFG', '길이를 생략하면 끝까지'],
      ["`SUBSTR('ABCDEFG', -3, 2)`", 'EF', '뒤에서 3번째(E)부터 오른쪽으로 2글자'],
      ["`SUBSTR('ABCDEFG', -3)`", 'EFG', '뒤에서 3번째부터 끝까지']
    ] },
    { t: 'trap', title: '음수 위치에서 왼쪽으로 자르지 않아요', x: '`SUBSTR(\'ABCDEFG\', -3, 2)` 를 "뒤에서 3번째부터 왼쪽으로 2글자"로 읽으면 DE 라고 답하게 돼요. 음수는 ==시작 자리를 잡을 때만== 쓰이고, 자르는 방향은 항상 오른쪽이라 EF 예요. 또 위치는 0 이 아니라 1 부터 세어요.' },

    { t: 'h', x: 'INSTR: 셋째 인자는 찾기 시작할 자리, 넷째는 몇 번째' },
    { t: 'p', x: '`INSTR` 은 찾는 글자가 문자열의 몇 번째 자리에 있는지 알려 줘요. 셋째 인자(어디서부터 찾을지)와 넷째 인자(몇 번째로 나온 것을 찾을지)는 생략하면 둘 다 1 이에요. 못 찾으면 0 을 돌려줘요.' },
    { t: 'table', head: ['식', '결과', '읽는 법'], rows: [
      ["`INSTR('A-B-C', '-')`", '2', '처음부터 찾아 첫 번째 `-` 의 위치'],
      ["`INSTR('A-B-C', '-', 3)`", '4', '3번째 자리부터 찾아 첫 번째 `-`'],
      ["`INSTR('A-B-C', '-', 1, 2)`", '4', '처음부터 찾아 두 번째 `-`'],
      ["`INSTR('A-B-C', '-', -1)`", '4', '끝에서부터 거꾸로 찾아 첫 번째 `-`'],
      ["`INSTR('A-B-C', 'X')`", '0', '없으면 0']
    ] },
    { t: 'trap', title: '결과는 항상 문자열 맨 앞에서 센 위치예요', x: '`INSTR(\'A-B-C\', \'-\', 3)` 은 3번째 자리부터 찾지만, 답은 찾기 시작한 곳에서 센 2 가 아니라 ==전체 문자열 기준 위치== 4 예요. 셋째와 넷째 인자를 바꿔 읽는 것도 조심해요. `INSTR(s, \'-\', 1, 2)` 는 "1번째 자리부터 찾아 2번째로 나온 것"이에요. 못 찾았을 때는 NULL 이나 -1 이 아니라 0 이에요.' },

    { t: 'h', x: 'LTRIM, RTRIM, TRIM: 낱말이 아니라 글자 집합을 지워요' },
    { t: 'p', x: '`LTRIM(s, \'XY\')` 는 왼쪽에서 "XY 라는 낱말"을 지우는 게 아니에요. 왼쪽 끝부터 한 글자씩 보면서 ==X 이거나 Y 인 글자를 계속 지우다가, 다른 글자를 만나면 멈춰요.== 둘째 인자를 생략하면 공백을 지워요.' },
    { t: 'table', head: ['식', '결과', '읽는 법'], rows: [
      ["`LTRIM('  SQL')`", 'SQL', '왼쪽 공백 제거'],
      ["`LTRIM('XXYSQLX', 'XY')`", 'SQLX', 'X, X, Y 를 지우고 S 에서 멈춤. 뒤의 X 는 그대로'],
      ["`RTRIM('SQLXYX', 'XY')`", 'SQL', '오른쪽에서 X, Y, X 를 지우고 L 에서 멈춤'],
      ["`LTRIM('AABAC', 'A')`", 'BAC', 'B 에서 멈췄으니 뒤의 A 는 남는다'],
      ["`TRIM('X' FROM 'XXSQLXX')`", 'SQL', '양쪽에서 X 를 지운다']
    ] },
    { t: 'p', x: '`TRIM` 은 `TRIM(LEADING \'X\' FROM s)`, `TRIM(TRAILING \'X\' FROM s)`, `TRIM(BOTH \'X\' FROM s)` 로 왼쪽, 오른쪽, 양쪽을 고를 수 있어요. 생략하면 양쪽(BOTH)이고, 지울 글자는 한 글자만 지정할 수 있어요.' },
    { t: 'trap', title: '가운데 글자는 건드리지 않아요', x: '`LTRIM`, `RTRIM`, `TRIM` 은 끝에서부터 지우다가 다른 글자를 만나면 멈춰요. 문자열 가운데에 있는 같은 글자는 남아요. 모든 자리의 글자를 없애려면 `REPLACE(s, \'X\')` 처럼 바꿀 말을 생략한 `REPLACE` 를 써요.' },

    { t: 'h', x: 'LPAD, RPAD, REPLACE, TRANSLATE' },
    { t: 'table', head: ['식', '결과', '읽는 법'], rows: [
      ["`LPAD('42', 5, '0')`", '00042', '전체 5글자가 되도록 왼쪽을 0 으로 채움'],
      ["`RPAD('AB', 5, 'xy')`", 'ABxyx', '채울 글자를 반복하다 5글자에서 끊음'],
      ["`LPAD('ABCDE', 3, '*')`", 'ABC', '원래 글자가 더 길면 왼쪽부터 3글자만 남김'],
      ["`REPLACE('AABBCC', 'B', 'x')`", 'AAxxCC', 'B 를 x 로'],
      ["`REPLACE('AABBCC', 'B')`", 'AACC', '바꿀 말을 생략하면 지운다'],
      ["`TRANSLATE('AABBCC', 'AB', 'xy')`", 'xxyyCC', 'A 는 x 로, B 는 y 로 글자마다 1:1']
    ] },
    { t: 'trap', title: 'LPAD 의 둘째 인자는 "채울 개수"가 아니에요', x: '`LPAD(\'42\', 5, \'0\')` 은 0 을 5개 붙이는 게 아니라 ==결과의 전체 길이==를 5 로 맞춰요. 그래서 0000042 가 아니라 00042 예요. 전체 길이가 원래 글자보다 짧으면 채우지 않고 잘라요. `LPAD` 든 `RPAD` 든 자를 때는 왼쪽부터 남겨요.' },
    { t: 'check', q: "LENGTH(REPLACE('010-1234-5678', '-')) 의 결과는?", a: '11 이에요. 안쪽 `REPLACE` 가 `-` 두 개를 지워 `01012345678` 을 만들고, 바깥 `LENGTH` 가 그 글자 수를 세어요. 함수가 겹쳐 있으면 안쪽부터 계산해요.' },

    { t: 'h', x: '숫자 함수' },
    { t: 'table', head: ['함수', '하는 일', '예', '결과'], rows: [
      ['`ABS(n)`', '절댓값', '`ABS(-5)`', '5'],
      ['`SIGN(n)`', '부호. 양수 1, 0 은 0, 음수 -1', '`SIGN(-5)`', '-1'],
      ['`ROUND(n, k)`', '반올림', '`ROUND(1265.384, 1)`', '1265.4'],
      ['`TRUNC(n, k)`', '버림', '`TRUNC(1265.384, 1)`', '1265.3'],
      ['`CEIL(n)`', 'n 보다 크거나 같은 가장 작은 정수(올림)', '`CEIL(3.2)`', '4'],
      ['`FLOOR(n)`', 'n 보다 작거나 같은 가장 큰 정수(내림)', '`FLOOR(3.7)`', '3'],
      ['`MOD(a, b)`', 'a 를 b 로 나눈 나머지', '`MOD(7, 3)`', '1'],
      ['`POWER(a, b)`', 'a 의 b 제곱', '`POWER(2, 3)`', '8'],
      ['`SQRT(n)`', '제곱근', '`SQRT(16)`', '4']
    ] },
    { t: 'p', x: '`ROUND` 와 `TRUNC` 의 둘째 인자 k 는 ==어느 자리까지 남길지==예요. 생략하면 0 이고 정수가 돼요. 양수면 소수점 아래 k 번째 자리까지, 음수면 소수점 왼쪽으로 넘어가요.' },
    { t: 'fig', caption: 'k 가 가리키는 자리까지 남기고, ROUND 는 그 바로 오른쪽 자리에서 반올림, TRUNC 는 버려요.', svg: `<svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="24" class="tx" text-anchor="middle">1265.384 에서 k 가 가리키는 자리</text>
  <rect x="96" y="40" width="56" height="44" class="bx"/><text x="124" y="68" class="tx-m" text-anchor="middle">1</text>
  <rect x="152" y="40" width="56" height="44" class="bx-a"/><text x="180" y="68" class="tx-m" text-anchor="middle">2</text>
  <rect x="208" y="40" width="56" height="44" class="bx"/><text x="236" y="68" class="tx-m" text-anchor="middle">6</text>
  <rect x="264" y="40" width="56" height="44" class="bx"/><text x="292" y="68" class="tx-m" text-anchor="middle">5</text>
  <rect x="320" y="40" width="56" height="44" class="bx"/><text x="348" y="68" class="tx-b" text-anchor="middle">.</text>
  <rect x="376" y="40" width="56" height="44" class="bx-y"/><text x="404" y="68" class="tx-m" text-anchor="middle">3</text>
  <rect x="432" y="40" width="56" height="44" class="bx"/><text x="460" y="68" class="tx-m" text-anchor="middle">8</text>
  <rect x="488" y="40" width="56" height="44" class="bx"/><text x="516" y="68" class="tx-m" text-anchor="middle">4</text>
  <text x="56" y="106" class="tx-s" text-anchor="middle">k</text>
  <text x="124" y="106" class="tx-s" text-anchor="middle">-3</text>
  <text x="180" y="106" class="tx-a" text-anchor="middle">-2</text>
  <text x="236" y="106" class="tx-s" text-anchor="middle">-1</text>
  <text x="292" y="106" class="tx-s" text-anchor="middle">0</text>
  <text x="404" y="106" class="tx-a" text-anchor="middle">1</text>
  <text x="460" y="106" class="tx-s" text-anchor="middle">2</text>
  <text x="516" y="106" class="tx-s" text-anchor="middle">3</text>
  <text x="180" y="146" class="tx-m" text-anchor="middle">ROUND(n, -2) = 1300</text>
  <text x="460" y="146" class="tx-m" text-anchor="middle">TRUNC(n, 1) = 1265.3</text>
  <text x="180" y="166" class="tx-s" text-anchor="middle">백의 자리까지 남김</text>
  <text x="460" y="166" class="tx-s" text-anchor="middle">소수 첫째 자리까지 남김</text>
</svg>` },
    { t: 'table', head: ['k', '`ROUND(1265.384, k)`', '`TRUNC(1265.384, k)`'], rows: [
      ['2', '1265.38', '1265.38'],
      ['1', '1265.4', '1265.3'],
      ['0 또는 생략', '1265', '1265'],
      ['-1', '1270', '1260'],
      ['-2', '1300', '1200'],
      ['-3', '1000', '1000']
    ] },
    { t: 'trap', title: '음수 자리는 소수점 왼쪽이에요', x: '`ROUND(1265.384, -2)` 의 -2 를 "소수 둘째 자리"로 읽으면 1265.38 이라고 답하게 돼요. 음수는 소수점 왼쪽으로 가서 -1 은 십의 자리, -2 는 백의 자리까지 남겨요. 십의 자리 6 에서 반올림해 1300 이에요. `TRUNC` 는 같은 자리에서 그냥 버려 1200 이에요.' },
    { t: 'p', x: '음수가 들어가면 `CEIL`, `FLOOR`, `TRUNC` 의 결과가 서로 갈려요. 수직선에서 `CEIL` 은 오른쪽(큰 쪽) 정수, `FLOOR` 는 왼쪽(작은 쪽) 정수, `TRUNC` 는 소수 부분을 떼어 낸 수예요.' },
    { t: 'table', head: ['n', '`CEIL(n)`', '`FLOOR(n)`', '`TRUNC(n)`', '`ROUND(n)`'], rows: [
      ['3.7', '4', '3', '3', '4'],
      ['3.2', '4', '3', '3', '3'],
      ['-3.2', '-3', '-4', '-3', '-3'],
      ['-3.7', '-3', '-4', '-3', '-4']
    ] },
    { t: 'table', caption: 'MOD 의 결과 부호는 나누어지는 수(첫째 인자)를 따라가요.', head: ['식', '결과'], rows: [
      ['`MOD(7, 3)`', '1'],
      ['`MOD(-7, 3)`', '-1'],
      ['`MOD(7, -3)`', '1'],
      ['`MOD(7, 0)`', '7 (0 으로 나누면 첫째 인자를 그대로 돌려준다)']
    ] },
    { t: 'trap', title: 'MOD(-7, 3) 은 2 가 아니에요', x: '수학 시간에 배운 나머지로 계산하면 2 가 나오지만, Oracle 의 `MOD(-7, 3)` 은 ==-1== 이에요. 부호를 떼고 7 을 3 으로 나눈 나머지 1 을 구한 다음, 첫째 인자의 부호를 붙이면 돼요. `FLOOR(-3.2)` 를 -3 으로 답하는 것도 같은 종류의 실수예요. -3.2 보다 작은 정수는 -4 예요.' },
    { t: 'check', q: 'TRUNC(-3.7) 과 FLOOR(-3.7) 의 결과는 같을까요?', a: '달라요. `TRUNC(-3.7)` 은 소수 부분을 떼어 -3, `FLOOR(-3.7)` 은 -3.7 보다 작거나 같은 가장 큰 정수라서 -4 예요. 양수에서는 둘이 같고 음수에서만 갈려요.' },

    { t: 'h', x: '날짜 함수' },
    { t: 'p', x: 'Oracle 의 날짜는 숫자처럼 더하고 뺄 수 있어요. 단위는 ==하루==예요. 아래 표에서 d 는 2026년 11월 11일(수요일)이라고 할게요.' },
    { t: 'table', head: ['식', '결과', '읽는 법'], rows: [
      ['`SYSDATE`', '지금 날짜와 시각', '괄호 없이 쓴다'],
      ['`d + 3`', '2026-11-14', '날짜 + 숫자 = 날짜(3일 뒤)'],
      ['`d - 10`', '2026-11-01', '날짜 - 숫자 = 날짜(10일 전)'],
      ["`TO_DATE('2026-11-14', 'YYYY-MM-DD') - d`", '3', '날짜 - 날짜 = 숫자(일수)'],
      ['`d + 1/24`', '2026-11-11 의 1시간 뒤', '1 이 하루니까 1/24 는 한 시간'],
      ['`d + 30/24/60`', '2026-11-11 의 30분 뒤', '1/24/60 이 1분이니까 n/24/60 은 n 분'],
      ['`ADD_MONTHS(d, 3)`', '2027-02-11', '3개월 뒤. 음수면 이전'],
      ["`MONTHS_BETWEEN(d, TO_DATE('2026-08-11', 'YYYY-MM-DD'))`", '3', '앞 날짜 - 뒤 날짜를 개월 수로'],
      ['`LAST_DAY(d)`', '2026-11-30', '그 달의 마지막 날'],
      ["`NEXT_DAY(d, '토요일')`", '2026-11-14', 'd 다음에 처음 오는 토요일'],
      ['`EXTRACT(YEAR FROM d)`', '2026', '연, 월, 일을 숫자로 뽑는다']
    ] },
    { t: 'trap', title: '날짜끼리는 뺄 수만 있어요', x: '날짜 - 날짜는 일수(숫자)가 나오지만 ==날짜 + 날짜는 오류==예요. 그리고 `MONTHS_BETWEEN(a, b)` 는 a - b 라서 앞 인자가 더 이른 날짜면 음수가 나와요. `MONTHS_BETWEEN` 만 숫자를 돌려주고 `ADD_MONTHS`, `LAST_DAY`, `NEXT_DAY` 는 날짜를 돌려줘요.' },
    { t: 'p', x: '`ADD_MONTHS` 는 결과 달에 그 날짜가 없으면 말일로 맞춰요. 1월 31일에 한 달을 더하면 2월 31일이 없으니 2월 말일이 돼요. `NEXT_DAY` 는 기준 날짜 당일은 빼고 그다음부터 찾아요. d 가 토요일이면 일주일 뒤 토요일이 나와요. `MONTHS_BETWEEN` 은 두 날짜의 일이 같거나 둘 다 말일이면 정수가 나오고, 아니면 소수가 붙어요.' },
    { t: 'p', x: '날짜에도 `ROUND` 와 `TRUNC` 를 쓸 수 있어요. 둘째 인자로 어느 단위까지 남길지 정해요.' },
    { t: 'table', head: ['식', '결과', '읽는 법'], rows: [
      ['`TRUNC(d)`', '2026-11-11 00:00:00', '둘째 인자가 없으면 일 단위. 시, 분, 초를 버린다'],
      ['`ROUND(d)`', '정오 전이면 2026-11-11, 정오부터는 2026-11-12', '둘째 인자가 없으면 일 단위. 낮 12시부터는 다음 날로 올라간다'],
      ["`TRUNC(d, 'MM')`", '2026-11-01', '그 달의 1일'],
      ["`TRUNC(d, 'YYYY')`", '2026-01-01', '그 해의 1월 1일'],
      ["`ROUND(d, 'MM')`", '2026-11-01', '16일부터는 다음 달 1일로 올라간다'],
      ["`ROUND(d, 'YYYY')`", '2027-01-01', '7월 1일부터는 다음 해 1월 1일로 올라간다']
    ] },

    { t: 'trap', title: '날짜 ROUND 가 올라가는 기준', x: '날짜의 `ROUND` 는 단위마다 올라가는 기준이 정해져 있어요. 일 단위는 ==정오(12시)==, 월 단위(`MM`, `MONTH`)는 ==16일==, 연 단위(`YYYY`)는 ==7월 1일==부터 올라가요. 11월 15일을 월 단위로 반올림하면 11월 1일, 11월 16일이면 12월 1일이에요. `TRUNC` 는 기준과 상관없이 언제나 버려요.' },

    { t: 'h', x: '변환 함수와 형변환' },
    { t: 'p', x: '문자 `\'100\'` 과 숫자 100 은 다른 타입이에요. 타입을 바꾸는 방법은 둘이에요. 함수를 써서 직접 바꾸면 ==명시적 형변환==, DBMS 가 알아서 바꿔 주면 ==암시적(묵시적) 형변환==이에요.' },
    { t: 'table', head: ['함수', '바꾸는 방향', '예', '결과'], rows: [
      ['`TO_CHAR(날짜, 포맷)`', '날짜 → 문자', "`TO_CHAR(d, 'YYYY/MM/DD')`", '2026/11/11'],
      ['`TO_CHAR(숫자, 포맷)`', '숫자 → 문자', "`TO_CHAR(1234567, '9,999,999')`", '1,234,567'],
      ['`TO_NUMBER(문자)`', '문자 → 숫자', "`TO_NUMBER('100') + 1`", '101'],
      ['`TO_DATE(문자, 포맷)`', '문자 → 날짜', "`TO_DATE('20261114', 'YYYYMMDD')`", '2026년 11월 14일(날짜 타입)']
    ] },
    { t: 'table', caption: '날짜 포맷', head: ['포맷', '뜻', '포맷', '뜻'], rows: [
      ['`YYYY`', '연도 4자리', '`HH24`', '시(0~23)'],
      ['`MM`', '월(01~12)', '`HH`', '시(1~12)'],
      ['`DD`', '일(01~31)', '`MI`', '분'],
      ['`DAY`', '요일(수요일)', '`SS`', '초'],
      ['`DY`', '요일 줄임(수)', '`D`', '요일 번호(일요일이 1)']
    ] },
    { t: 'trap', title: '분은 MI, 월은 MM', x: '시각을 뽑을 때 `HH24:MM:SS` 라고 쓰면 오류 없이 실행되는데, 가운데에 분이 아니라 ==월==이 찍혀요. 분은 `MI` 예요. 11월 14일 09시 05분을 `TO_CHAR(d, \'HH24:MM\')` 으로 뽑으면 09:05 가 아니라 09:11 이 나와요.' },
    { t: 'p', x: '시는 `HH24` 가 0~23, `HH` 는 1~12 예요. 오후 3시를 `HH24` 로 뽑으면 15, `HH` 로 뽑으면 03 이에요. 연도를 두 자리로 받을 때는 `YY` 와 `RR` 이 갈려요. `YY` 는 언제나 지금 세기(20)를 붙이고, `RR` 은 ==50~99 면 1900년대, 00~49 면 2000년대==로 읽어요. 지금이 2026년일 때 `TO_DATE(\'95-01-01\', \'RR-MM-DD\')` 는 1995년, `TO_DATE(\'95-01-01\', \'YY-MM-DD\')` 는 2095년이에요.' },
    { t: 'p', x: '숫자 포맷에서 `9` 는 그 자리에 숫자가 없으면 비워 두고, `0` 은 0 으로 채워요. `TO_CHAR(42, \'0999\')` 는 0042 예요. `,` 는 천 단위 구분, `.` 은 소수점이에요.' },
    { t: 'table', caption: '암시적 형변환이 일어나는 예', head: ['식', '결과', '일어난 일'], rows: [
      ["`'100' + 1`", '101', '문자가 숫자로 바뀌어 더해진다'],
      ["`100 || '원'`", '100원', '숫자가 문자로 바뀌어 이어진다'],
      ["`WHERE SAL = '300'` (SAL 은 숫자)", 'SAL 이 300 인 행', '문자 상수가 숫자로 바뀐다'],
      ["`'A' + 1`", '오류', '숫자로 바꿀 수 없는 문자']
    ] },
    { t: 'p', x: '암시적 형변환은 편하지만 성능이 떨어지거나 오류가 날 수 있어서, 시험은 "명시적으로 바꿔 주는 것이 좋다"를 옳은 설명으로 봐요. SQL Server 에서는 `TO_CHAR`, `TO_NUMBER`, `TO_DATE` 대신 `CAST(값 AS 타입)` 과 `CONVERT(타입, 값, 스타일)` 을 써요.' },

    { t: 'h', x: 'DECODE: 인자를 둘씩 짝지어 읽어요' },
    { t: 'p', x: '부서 번호가 10 이면 인사, 20 이면 재무라고 보여 주고 싶을 때 쓰는 Oracle 전용 함수예요. `DECODE(대상, 값1, 결과1, 값2, 결과2, …, 기본값)` 모양이고, 대상 뒤의 인자를 ==(값, 결과) 둘씩 짝지어== 읽어요. 짝이 안 맞고 하나 남으면 그게 기본값이에요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPTNO', 'SAL'], rows: [['KIM', 10, 500], ['LEE', 20, 300], ['PARK', 30, 250]] },
    { t: 'sql', code: `SELECT ENAME,
       DECODE(DEPTNO, 10, '인사', 20, '재무')          AS D1,
       DECODE(DEPTNO, 10, '인사', 20, '재무', '기타')  AS D2
  FROM EMP;`, result: { head: ['ENAME', 'D1', 'D2'], rows: [['KIM', '인사', '인사'], ['LEE', '재무', '재무'], ['PARK', null, '기타']] },
      note: 'D1 은 기본값이 없어서 30번인 PARK 이 NULL 이에요. D2 는 마지막에 혼자 남은 인자가 기본값이에요.' },
    { t: 'trap', title: '기본값이 없으면 NULL', x: '`DECODE` 에서 어느 값과도 안 맞고 기본값도 없으면 결과는 ==NULL== 이에요. 0 이나 빈칸, 원래 값이 아니에요. 인자 개수를 세어 보세요. 대상을 빼고 남은 인자가 짝수 개면 기본값이 없는 것이고, 홀수 개면 마지막이 기본값이에요.' },
    { t: 'p', x: '`DECODE` 는 같은지만 비교할 수 있어요. 크다, 작다 같은 조건은 `CASE` 로 써야 해요. 그리고 `DECODE` 는 특이하게 NULL 끼리를 같다고 봐서 `DECODE(COMM, NULL, \'없음\', \'있음\')` 은 COMM 이 NULL 인 행에서 없음을 돌려줘요.' },

    { t: 'h', x: 'CASE: 두 가지 모양' },
    { t: 'vs',
      a: { title: '단순형 (Simple CASE)', items: ['`CASE 대상 WHEN 값 THEN 결과 … END`', '대상을 한 번만 쓰고 같은지만 비교한다', 'DECODE 와 같은 일을 한다'] },
      b: { title: '검색형 (Searched CASE)', items: ['`CASE WHEN 조건 THEN 결과 … END`', 'WHEN 마다 조건을 통째로 쓴다', '크다, 작다, AND, OR, IS NULL 을 쓸 수 있다'] } },
    { t: 'sql', code: `SELECT ENAME,
       CASE DEPTNO WHEN 10 THEN '인사'
                   WHEN 20 THEN '재무'
       END AS C1,
       CASE WHEN SAL >= 400 THEN '상'
            WHEN SAL >= 300 THEN '중'
            ELSE '하'
       END AS C2
  FROM EMP;`, result: { head: ['ENAME', 'C1', 'C2'], rows: [['KIM', '인사', '상'], ['LEE', '재무', '중'], ['PARK', null, '하']] },
      note: 'C1 은 ELSE 가 없어서 PARK 이 NULL 이에요. C2 에서 KIM 은 첫 조건에 걸려 거기서 끝나요.' },
    { t: 'trap', title: 'ELSE 가 없으면 NULL, 먼저 걸린 WHEN 에서 끝', x: '`CASE` 는 두 가지를 물어요. 첫째, 어느 WHEN 에도 안 걸리고 ELSE 도 없으면 ==NULL== 이에요. 행이 사라지지 않고 그 칸만 NULL 이 돼요. 둘째, 위에서부터 보다가 ==처음 참이 된 WHEN 에서 끝나요.== `WHEN SAL >= 300` 을 `WHEN SAL >= 400` 보다 위에 쓰면 500 인 사람도 첫 줄에 걸려 버려요. `END` 를 빼먹으면 오류예요.' },
    { t: 'p', x: '단순형에서 `CASE COMM WHEN NULL THEN …` 은 절대 걸리지 않아요. 안에서 `COMM = NULL` 로 비교하기 때문이에요. NULL 을 가르려면 검색형으로 `CASE WHEN COMM IS NULL THEN …` 이라고 써요.' },

    { t: 'h', x: 'NULL 을 다루는 함수' },
    { t: 'table', head: ['함수', '하는 일', '예', '결과'], rows: [
      ['`NVL(a, b)`', 'a 가 NULL 이면 b, 아니면 a', '`NVL(NULL, 0)`', '0'],
      ['`NVL2(a, b, c)`', 'a 가 NULL 이 아니면 b, NULL 이면 c', "`NVL2(100, 'Y', 'N')`", 'Y'],
      ['`NULLIF(a, b)`', 'a 와 b 가 같으면 NULL, 다르면 a', '`NULLIF(10, 20)`', '10'],
      ['`COALESCE(a, b, c, …)`', '왼쪽부터 처음 만나는 NULL 아닌 값', '`COALESCE(NULL, NULL, 3, 4)`', '3'],
      ['`ISNULL(a, b)`', 'SQL Server 의 NVL', '`ISNULL(NULL, 0)`', '0']
    ] },
    { t: 'p', x: '`NVL(a, b)` 의 두 인자는 타입이 맞아야 해요. COMM 이 숫자 컬럼일 때 `NVL(COMM, \'없음\')` 은 오류예요. 문자로 보여 주고 싶으면 `NVL(TO_CHAR(COMM), \'없음\')` 처럼 먼저 타입을 맞춰요. `COALESCE` 는 인자가 전부 NULL 이면 NULL 을 돌려줘요.' },
    { t: 'p', x: '타입이 달라도 문자가 숫자로 바뀔 수 있으면 실행돼요. COMM 이 숫자 컬럼일 때 `NVL(COMM, \'0\')` 은 `\'0\'` 이 숫자 0 으로 바뀌어 실행되고, `NVL(COMM, \'없음\')` 은 숫자로 바꿀 수 없어 오류예요. 단순형 `CASE` 도 마찬가지로 CASE 뒤의 비교 대상과 WHEN 뒤 값의 타입이 같아야 해요. DEPTNO 가 숫자인데 `CASE DEPTNO WHEN \'10\' THEN …` 이라고 쓰면 오류예요.' },
    { t: 'p', x: '시험은 식 네 개를 주고 "결과가 다른 하나"를 고르게 해요. 아래 다섯은 모두 "COMM 이 NULL 이면 100, 아니면 COMM" 이라는 같은 결과를 내요.' },
    { t: 'table', head: ['식', '읽는 법'], rows: [
      ['`NVL(COMM, 100)`', 'COMM 이 NULL 이면 100'],
      ['`NVL2(COMM, COMM, 100)`', 'COMM 이 NULL 이 아니면 COMM, NULL 이면 100'],
      ['`COALESCE(COMM, 100)`', 'COMM, 100 순서로 처음 만나는 NULL 아닌 값'],
      ['`CASE WHEN COMM IS NULL THEN 100 ELSE COMM END`', '검색형 CASE 로 풀어 쓴 모양'],
      ['`DECODE(COMM, NULL, 100, COMM)`', 'DECODE 는 NULL 끼리를 같다고 본다']
    ] },
    { t: 'trap', title: '다른 하나는 대개 NULLIF 예요', x: '`NULLIF(COMM, 100)` 은 위 식들과 방향이 반대예요. ==NULL 을 값으로 바꾸는 게 아니라, 값이 100 이면 NULL 로 바꿔요.== COMM 이 NULL 이면 그대로 NULL 이에요. `NULLIF(a, b)` 는 `CASE WHEN a = b THEN NULL ELSE a END` 와 같아요. 그리고 `NVL2(COMM, 100, COMM)` 처럼 둘째와 셋째 인자를 바꿔 놓은 보기도 결과가 달라요. COMM 이 있으면 100, 없으면 NULL 이 돼요.' },
    { t: 'p', x: '`DECODE` 안에 `DECODE` 를 넣으면 조건 두 개를 차례로 따질 수 있어요. `DECODE(DEPTNO, 10, DECODE(JOB, \'CLERK\', \'A\', \'B\'), \'C\')` 는 "10번이면서 CLERK 이면 A, 10번인데 CLERK 이 아니면 B, 10번이 아니면 C" 예요. `CASE WHEN DEPTNO = 10 AND JOB = \'CLERK\' THEN \'A\' WHEN DEPTNO = 10 THEN \'B\' ELSE \'C\' END` 와 같은 결과를 내요. 안쪽 `DECODE` 는 바깥 조건이 맞은 행에서만 계산돼요.' },
    { t: 'check', q: 'COMM 이 NULL 인 행에서 NVL2(COMM, COMM + 100, 0) 과 NVL(COMM + 100, 0) 의 결과는 같을까요?', a: '같아요. 둘 다 0 이에요. `NVL2` 는 COMM 이 NULL 이라 셋째 인자 0 을 돌려주고, `NVL` 은 NULL + 100 이 NULL 이라 0 으로 바꿔요. COMM 이 300 이면 둘 다 400 이에요.' },

    { t: 'h', x: 'Oracle 과 SQL Server 함수 이름' },
    { t: 'p', x: '숫자 함수는 두 DBMS 가 거의 같고, 문자 함수 몇 개와 날짜, 변환 함수의 이름이 달라요. 짝이 맞는지 묻는 문제로 나와요.' },
    { t: 'table', head: ['하는 일', 'Oracle', 'SQL Server'], rows: [
      ['문자열 자르기', '`SUBSTR`', '`SUBSTRING`'],
      ['글자 수', '`LENGTH`', '`LEN`'],
      ['글자 위치 찾기', '`INSTR`', '`CHARINDEX`'],
      ['문자열 잇기', '`||`, `CONCAT`', '`+`, `CONCAT`'],
      ['나머지', '`MOD(a, b)`', '`a % b`'],
      ['올림', '`CEIL`', '`CEILING`'],
      ['현재 날짜와 시각', '`SYSDATE`', '`GETDATE()`'],
      ['개월 더하기', '`ADD_MONTHS`', '`DATEADD`'],
      ['두 날짜의 차이', '`MONTHS_BETWEEN`', '`DATEDIFF`'],
      ['형변환', '`TO_CHAR`, `TO_NUMBER`, `TO_DATE`', '`CAST`, `CONVERT`'],
      ['NULL 바꾸기', '`NVL`', '`ISNULL`'],
      ['분산, 표준편차', '`VARIANCE`, `STDDEV`', '`VAR`, `STDEV`']
    ] },
    { t: 'p', x: '`UPPER`, `LOWER`, `LTRIM`, `RTRIM`, `REPLACE`, `ABS`, `ROUND`, `FLOOR`, `POWER`, `SQRT`, `SIGN`, `COALESCE`, `NULLIF`, `CASE` 는 두 DBMS 에서 이름이 같아요. `DECODE`, `NVL`, `NVL2` 는 Oracle 에만 있어요.' }
  ],
  keys: [
    'SUBSTR(s, 시작, 길이): 위치는 1부터, 시작이 음수면 뒤에서 세고 자르는 방향은 오른쪽',
    'INSTR(s, 찾을글자, 시작위치, 몇번째): 결과는 문자열 맨 앞 기준 위치, 없으면 0',
    'LTRIM, RTRIM 의 둘째 인자는 글자 집합. 끝에서부터 지우다 다른 글자를 만나면 멈춘다',
    'LPAD(s, n, c) 의 n 은 결과 전체 길이. 원래 글자가 더 길면 왼쪽부터 n 글자만 남긴다',
    'ROUND, TRUNC 의 음수 자리는 소수점 왼쪽. -1 은 십의 자리, -2 는 백의 자리까지 남긴다',
    'CEIL(-3.2) = -3, FLOOR(-3.2) = -4, TRUNC(-3.7) = -3, MOD(-7, 3) = -1',
    '날짜 ± 숫자 = 날짜(일 단위, n/24/60 은 n 분), 날짜 - 날짜 = 일수, 날짜 + 날짜는 오류. 분 포맷은 MI, RR 의 50~99 는 1900년대',
    'DECODE 기본값 없음, CASE ELSE 없음이면 NULL. CASE 는 처음 참인 WHEN 에서 끝난다'
  ],
  cards: [
    { q: "`SUBSTR('ABCDEFG', -3, 2)` 의 결과는?", a: 'EF. 뒤에서 3번째인 E 에서 시작해 오른쪽으로 2글자.' },
    { q: "`INSTR('A-B-C', '-', 1, 2)` 의 결과는?", a: '4. 1번째 자리부터 찾아 2번째로 나오는 `-` 의 위치.' },
    { q: "`LTRIM('XXYSQLX', 'XY')` 의 결과는?", a: 'SQLX. 왼쪽에서 X 또는 Y 를 지우다가 S 에서 멈춰요. 뒤의 X 는 남아요.' },
    { q: '`ROUND(1265.384, -2)` 와 `TRUNC(1265.384, -2)` 의 결과는?', a: '1300 과 1200. -2 는 백의 자리까지 남긴다는 뜻이에요.' },
    { q: '`MOD(-7, 3)` 의 결과는?', a: '-1. 결과의 부호는 첫째 인자를 따라가요.' },
    { q: '`CEIL(-3.2)` 와 `FLOOR(-3.2)` 의 결과는?', a: '-3 과 -4. CEIL 은 큰 쪽 정수, FLOOR 는 작은 쪽 정수.' },
    { q: 'CASE 문에 ELSE 가 없고 어느 WHEN 에도 안 걸리면?', a: 'NULL. 행이 빠지는 게 아니라 그 칸이 NULL 이 돼요.' },
    { q: 'Oracle 의 SUBSTR, LENGTH, NVL, SYSDATE 는 SQL Server 에서 무엇인가요?', a: '`SUBSTRING`, `LEN`, `ISNULL`, `GETDATE()`.' }
  ],
  quiz: [
    { id: 'q3-01', level: 1, tag: '함수 분류',
      q: '다음 중 단일행 함수가 아닌 것은?',
      choices: ['`ROUND`', '`SUBSTR`', '`MAX`', '`NVL`'],
      answer: 3,
      why: '`MAX` 는 여러 행을 받아 값 하나를 돌려주는 다중행 함수(집계 함수)예요. `ROUND`, `SUBSTR`, `NVL` 은 행마다 한 번씩 계산해서 행 수가 그대로인 단일행 함수예요.' },
    { id: 'q3-02', level: 1, tag: 'DBMS 차이',
      q: '같은 일을 하는 Oracle 함수와 SQL Server 함수를 짝지은 것으로 적절하지 않은 것은?',
      choices: [
        '`SUBSTR` - `SUBSTRING`',
        '`LENGTH` - `LEN`',
        '`NVL` - `ISNULL`',
        '`MOD` - `CEILING`'
      ],
      answer: 4,
      why: '`CEILING` 은 Oracle `CEIL`(올림)의 짝이에요. Oracle 의 `MOD(a, b)` 는 SQL Server 에서 `a % b` 연산자로 써요. 나머지 셋은 맞는 짝이에요.' },
    { id: 'q3-03', level: 2, tag: '문자 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT SUBSTR('SQLDEVELOPER', -5, 3)
  FROM DUAL;`,
      choices: ['EVE', 'LOP', 'OPE', 'LOPER'],
      answer: 2,
      why: 'SQLDEVELOPER 는 12글자예요. 뒤에서 5번째는 8번째 글자 L 이고, 거기서 오른쪽으로 3글자를 자르면 LOP 예요. EVE 는 -5 를 앞에서 5번째로 읽었을 때, LOPER 는 길이 3 을 무시했을 때 나오는 값이에요.' },
    { id: 'q3-04', level: 2, tag: '문자 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT INSTR('2026-11-14', '-')       AS A,
       INSTR('2026-11-14', '-', 6)    AS B,
       INSTR('2026-11-14', '-', 1, 3) AS C
  FROM DUAL;`,
      choices: ['5, 8, 0', '5, 3, 0', '5, 8, NULL', '5, 8, -1'],
      answer: 1,
      why: '첫 번째 `-` 는 5번째 자리예요. B 는 6번째 자리부터 찾으니 다음 `-` 인 8번째 자리가 나오는데, 찾기 시작한 곳에서 센 3 이 아니라 문자열 맨 앞에서 센 8 이에요. C 는 세 번째 `-` 를 찾는데 `-` 가 두 개뿐이라 0 이에요. 못 찾으면 NULL 이나 -1 이 아니라 0 을 돌려줘요.' },
    { id: 'q3-05', level: 2, tag: '문자 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT LTRIM('XXYXZYX', 'XY') AS A,
       RTRIM('XXYXZYX', 'XY') AS B
  FROM DUAL;`,
      choices: [
        'XXYXZYX, XXYXZYX',
        'Z, Z',
        'ZYX, XXYXZ',
        'ZYX, XXYXZYX'
      ],
      answer: 3,
      why: '둘째 인자는 낱말이 아니라 글자 집합이에요. LTRIM 은 왼쪽에서 X, X, Y, X 를 지우고 Z 에서 멈춰 ZYX 가 남아요. RTRIM 은 오른쪽에서 X, Y 를 지우고 Z 에서 멈춰 XXYXZ 가 남아요. 1번은 XY 를 한 덩어리 낱말로 봤을 때, 2번은 가운데 글자까지 전부 지운다고 봤을 때의 답이에요.' },
    { id: 'q3-06', level: 2, tag: '숫자 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT ROUND(3847.265, -2) AS A,
       TRUNC(3847.265, 2)  AS B
  FROM DUAL;`,
      choices: [
        '3800, 3847.26',
        '3847.27, 3847.26',
        '3900, 3847.26',
        '3800, 3847.27'
      ],
      answer: 1,
      why: 'ROUND 의 -2 는 백의 자리까지 남긴다는 뜻이에요. 십의 자리가 4 라서 올리지 않고 3800 이에요. TRUNC 의 2 는 소수 둘째 자리까지 남기고 버리니 3847.26 이에요. 3847.27 은 -2 를 소수 둘째 자리로 읽었거나 TRUNC 를 반올림으로 착각했을 때 나오는 값이에요.' },
    { id: 'q3-07', level: 2, tag: '숫자 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT CEIL(-4.3)  AS A,
       FLOOR(-4.3) AS B,
       MOD(-7, 3)  AS C
  FROM DUAL;`,
      choices: ['-5, -4, -1', '-4, -5, 2', '-4, -4, -1', '-4, -5, -1'],
      answer: 4,
      why: 'CEIL 은 -4.3 보다 크거나 같은 가장 작은 정수라서 -4, FLOOR 는 -4.3 보다 작거나 같은 가장 큰 정수라서 -5 예요. MOD 의 결과는 첫째 인자의 부호를 따라가서 -1 이에요. 2 는 수학식 나머지로 계산했을 때 나오는 값이에요.' },
    { id: 'q3-08', level: 2, tag: '문자 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT LPAD('42', 5, '0')     AS A,
       LPAD('123456', 4, '0') AS B
  FROM DUAL;`,
      choices: ['00042, 123456', '00042, 1234', '00042, 3456', '42000, 1234'],
      answer: 2,
      why: 'LPAD 의 둘째 인자는 결과의 전체 길이예요. 42 는 왼쪽에 0 을 세 개 채워 00042 가 돼요. 123456 은 이미 4글자보다 길어서 채우지 않고 왼쪽부터 4글자만 남겨 1234 예요. 오른쪽 4글자(3456)를 남기는 게 아니에요.' },
    { id: 'q3-09', level: 3, tag: 'CASE',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은?',
      tables: [{ name: 'SCORE', head: ['ID', 'PT'], rows: [[1, 95], [2, 82], [3, 70], [4, 55]] }],
      code: `SELECT ID,
       CASE WHEN PT >= 70 THEN 'C'
            WHEN PT >= 80 THEN 'B'
            WHEN PT >= 90 THEN 'A'
       END AS G
  FROM SCORE
 ORDER BY ID;`,
      choices: [
        { head: ['ID', 'G'], rows: [[1, 'C'], [2, 'C'], [3, 'C'], [4, null]] },
        { head: ['ID', 'G'], rows: [[1, 'A'], [2, 'B'], [3, 'C'], [4, null]] },
        { head: ['ID', 'G'], rows: [[1, 'A'], [2, 'B'], [3, 'C'], [4, 'C']] },
        { head: ['ID', 'G'], rows: [[1, 'C'], [2, 'C'], [3, 'C']] }
      ],
      answer: 1,
      why: 'CASE 는 위에서부터 보다가 처음 참이 된 WHEN 에서 끝나요. 95, 82, 70 은 모두 첫 줄 PT >= 70 에 걸려 C 가 돼요. 55 는 어느 WHEN 에도 안 걸리고 ELSE 가 없으니 NULL 이에요. CASE 는 값을 만드는 식이라 행을 없애지 않아서 4번처럼 3행이 되지는 않아요.' },
    { id: 'q3-10', level: 3, tag: 'DECODE',
      q: '아래 테이블에서 SQL 을 실행한 결과로 알맞은 것은? (Oracle)',
      tables: [{ name: 'T', head: ['C1'], rows: [['A'], ['B'], ['C'], [null]] }],
      code: `SELECT SUM(DECODE(C1, 'A', 10, 'B', 20))     AS S1,
       SUM(DECODE(C1, 'A', 10, 'B', 20, 30)) AS S2
  FROM T;`,
      choices: ['30, 60', 'NULL, 90', 'NULL, 60', '30, 90'],
      answer: 4,
      why: 'S1 의 DECODE 는 기본값이 없어서 행마다 10, 20, NULL, NULL 이에요. SUM 은 NULL 을 건너뛰어 30 이에요. S2 는 마지막 30 이 기본값이라 10, 20, 30, 30 이 되고 합은 90 이에요. C1 이 NULL 인 행도 A 나 B 와 같지 않으니 기본값 30 을 받아요.' },
    { id: 'q3-11', level: 2, tag: '날짜 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle, 결과는 YYYY-MM-DD 형식으로 본다)',
      code: `SELECT LAST_DAY(ADD_MONTHS(TO_DATE('2025-12-15', 'YYYY-MM-DD'), 2))
  FROM DUAL;`,
      choices: ['2026-02-15', '2026-02-28', '2026-02-29', '2026-01-31'],
      answer: 2,
      why: '안쪽부터 계산해요. 2025년 12월 15일에 2개월을 더하면 2026년 2월 15일이고, LAST_DAY 는 그 달의 마지막 날을 돌려주니 2026년 2월 28일이에요. 2026년은 윤년이 아니라 29일이 없어요. 2026-02-15 는 LAST_DAY 를 빠뜨렸을 때의 값이에요.' },
    { id: 'q3-12', level: 3, tag: '변환 함수',
      q: '아래 SQL 의 실행 결과로 알맞은 것은? (Oracle)',
      code: `SELECT TO_CHAR(TO_DATE('2026-11-14 09:05', 'YYYY-MM-DD HH24:MI'),
               'YYYY/MM/DD HH24:MM')
  FROM DUAL;`,
      choices: [
        '2026/11/14 09:05',
        '2026/11/14 21:05',
        '2026/11/14 09:11',
        '오류가 발생한다.'
      ],
      answer: 3,
      why: 'TO_CHAR 의 포맷 끝에 분을 뜻하는 MI 가 아니라 월을 뜻하는 MM 이 쓰였어요. 오류 없이 실행되고 그 자리에 월 11 이 찍혀 09:11 이 돼요. 09:05 가 나오려면 포맷이 HH24:MI 여야 해요.' }
  ]
});
