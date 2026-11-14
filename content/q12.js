SQLD.add({
  id: 'q12',
  title: '윈도우 함수',
  minutes: 25,
  weight: 3,
  lead: '윈도우 함수는 거의 매회 두세 문제가 나오고, 대부분 작은 표를 주고 결과를 계산시켜요. 동점이 있을 때 순위와 누적합이 어떻게 달라지는지만 손에 익히면 점수가 돼요.',
  goals: [
    'OVER 안의 PARTITION BY, ORDER BY, ROWS|RANGE 가 각각 무엇을 정하는지 말할 수 있다',
    '동점이 있는 표에서 RANK, DENSE_RANK, ROW_NUMBER 와 누적합(ROWS, RANGE)을 손으로 계산한다',
    'LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTILE 의 결과를 예측한다',
    'PERCENT_RANK, CUME_DIST, RATIO_TO_REPORT 를 식으로 구분한다'
  ],
  blocks: [
    { t: 'h', x: '행을 줄이지 않고 그룹 계산을 하고 싶을 때' },
    { t: 'p', x: '사원 이름 옆에 "전체 급여 합"을 같이 보여 주고 싶다고 해 볼게요. `SELECT ENAME, SAL, SUM(SAL) FROM EMP` 라고 쓰면 오류가 나요. ENAME 은 다섯 줄인데 SUM(SAL) 은 한 줄이라서 한 표에 같이 놓을 수 없어요.' },
    { t: 'p', x: 'GROUP BY 를 쓰면 그룹마다 한 줄로 줄어들어서 사원 이름이 사라져요. ==행 수는 그대로 두고 각 행 옆에 그룹 계산 결과를 붙여 주는 것==이 윈도우 함수예요. 함수 뒤에 `OVER` 를 붙이면 윈도우 함수가 돼요.' },
    { t: 'data', name: 'EMP', head: ['ENAME', 'DEPT', 'SAL'], rows: [['KIM', 10, 300], ['LEE', 10, 200], ['PARK', 10, 200], ['CHOI', 20, 400], ['JUNG', 20, 100]] },
    { t: 'sql', code: `SELECT ENAME, DEPT, SAL,
       SUM(SAL)  OVER ()                  AS TOT,
       SUM(SAL)  OVER (PARTITION BY DEPT) AS D_SUM,
       COUNT(*)  OVER (PARTITION BY DEPT) AS D_CNT,
       MAX(SAL)  OVER (PARTITION BY DEPT) AS D_MAX
  FROM EMP;`, result: { head: ['ENAME', 'DEPT', 'SAL', 'TOT', 'D_SUM', 'D_CNT', 'D_MAX'], rows: [
      ['KIM', 10, 300, 1200, 700, 3, 300],
      ['LEE', 10, 200, 1200, 700, 3, 300],
      ['PARK', 10, 200, 1200, 700, 3, 300],
      ['CHOI', 20, 400, 1200, 500, 2, 400],
      ['JUNG', 20, 100, 1200, 500, 2, 400]
    ] }, note: 'OVER () 처럼 괄호를 비우면 전체가 한 그룹이에요. 다섯 줄이 그대로 나오고 옆에 계산 결과만 붙었어요.' },
    { t: 'p', x: '한 SELECT 안에 OVER 를 여러 개 써도 서로 영향을 주지 않아요. 위에서 TOT 은 PARTITION BY 가 없어서 전체 다섯 행을, D_SUM 은 PARTITION BY DEPT 가 있어서 자기 부서 행만 보고 계산했어요. 시험은 이렇게 PARTITION BY 가 있는 것과 없는 것을 한 문장에 섞어 놓고 컬럼마다 값을 따로 계산하게 해요.' },
    { t: 'p', x: 'SUM, AVG, MIN, MAX, COUNT 는 전부 같은 방식으로 OVER 를 붙여 쓸 수 있어요. 스칼라 서브쿼리로도 같은 결과를 만들 수 있지만, 시험은 윈도우 함수 쪽 문법을 물어요.' },

    { t: 'h', x: 'OVER 안에 들어가는 세 가지' },
    { t: 'sql', code: `함수(인자) OVER (
  PARTITION BY 그룹 컬럼
  ORDER BY     정렬 컬럼
  ROWS | RANGE BETWEEN 시작점 AND 끝점
)` },
    { t: 'table', head: ['절', '하는 일', '규칙'], rows: [
      ['`PARTITION BY`', '어떤 단위로 묶어서 계산할지. GROUP BY 와 달리 행 수가 줄지 않는다', '생략하면 전체가 한 그룹'],
      ['`ORDER BY`', '그룹 안에서 행을 세우는 순서', '순위 함수, LAG, LEAD, NTILE 에는 반드시 있어야 한다. 집계 함수에 붙이면 누적 계산이 된다'],
      ['`ROWS | RANGE BETWEEN …`', '현재 행 기준으로 어디부터 어디까지 계산할지(프레임)', 'ORDER BY 가 있어야 쓸 수 있다']
    ] },
    { t: 'trap', title: '절 순서를 바꾼 보기', x: '세 절은 ==PARTITION BY → ORDER BY → ROWS|RANGE== 순서로만 쓸 수 있어요. `OVER (ORDER BY SAL PARTITION BY DEPT)` 는 문법 오류예요. ORDER BY 없이 `ROWS BETWEEN …` 만 쓴 것도, ORDER BY 없이 `RANK() OVER (PARTITION BY DEPT)` 라고 쓴 것도 오류예요.' },

    { t: 'h', x: 'ORDER BY 를 넣으면 누적이 돼요' },
    { t: 'p', x: '`SUM(SAL) OVER (ORDER BY SAL)` 처럼 집계 함수에 ORDER BY 만 넣으면 전체 합이 아니라 "처음부터 지금 행까지"의 합이 나와요. 프레임을 안 적으면 ==`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`== 가 기본으로 들어가기 때문이에요. ORDER BY 도 없으면 프레임은 그룹 전체예요.' },
    { t: 'p', x: '여기서 RANGE 와 ROWS 가 갈려요. ROWS 는 행을 한 줄씩 세고, RANGE 는 정렬 값이 같은 행들을 한 묶음으로 봐요. 그래서 동점이 있으면 RANGE 는 동점 행을 한꺼번에 더해요.' },
    { t: 'sql', code: `SELECT ENAME, SAL,
       SUM(SAL) OVER (ORDER BY SAL) AS S_RANGE,
       SUM(SAL) OVER (ORDER BY SAL
                      ROWS BETWEEN UNBOUNDED PRECEDING
                               AND CURRENT ROW) AS S_ROWS
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'S_RANGE', 'S_ROWS'], rows: [
      ['JUNG', 100, 100, 100],
      ['LEE', 200, 500, 300],
      ['PARK', 200, 500, 500],
      ['KIM', 300, 800, 800],
      ['CHOI', 400, 1200, 1200]
    ] }, note: 'SAL 이 200 으로 같은 LEE 와 PARK 를 보세요. RANGE 는 둘 다 100+200+200 = 500, ROWS 는 300 다음 500 이에요.' },
    { t: 'trap', title: '동점인데 누적합을 한 줄씩 더한 보기', x: '`SUM(…) OVER (ORDER BY 컬럼)` 만 있고 프레임이 안 적혀 있으면 RANGE 예요. 정렬 컬럼 값이 같은 행은 누적합도 같은 값이 나와요. 한 줄씩 늘어나는 값은 `ROWS` 를 직접 적었을 때만 나와요. 결과 계산 문제에서 오답 보기로 가장 자주 쓰여요.' },

    { t: 'tip', title: '결과표를 주고 RANGE 인지 ROWS 인지 고르게 할 때', x: '결과표에서 정렬 값이 같은 행들의 누적값을 보세요. 동점 행의 값이 서로 같으면(500, 500) RANGE 이거나 프레임을 생략한 것이고, 서로 다르면(300, 500) ROWS 예요. 동점이 하나도 없는 표라면 둘의 결과는 같아요.' },
    { t: 'p', x: 'RANGE 가 한 묶음으로 보는 기준은 ORDER BY 에 쓴 컬럼 전부예요. `SUM(SAL) OVER (ORDER BY SAL, ENAME)` 처럼 정렬 컬럼을 더 주면 SAL 과 ENAME 이 모두 같은 행만 동점이라서, LEE 와 PARK 는 프레임을 생략해도 300, 500 으로 따로 계산돼요.' },

    { t: 'h', x: '프레임: 어디부터 어디까지' },
    { t: 'table', head: ['경계', '뜻'], rows: [
      ['`UNBOUNDED PRECEDING`', '그룹의 맨 첫 행부터'],
      ['`n PRECEDING`', '현재 행에서 n 행 앞부터(또는 앞까지)'],
      ['`CURRENT ROW`', '현재 행'],
      ['`n FOLLOWING`', '현재 행에서 n 행 뒤까지(또는 뒤부터)'],
      ['`UNBOUNDED FOLLOWING`', '그룹의 맨 끝 행까지']
    ], caption: '시작점은 끝점보다 앞이어야 해요. BETWEEN 없이 `ROWS UNBOUNDED PRECEDING` 처럼 시작점만 쓰면 끝점은 CURRENT ROW 예요.' },
    { t: 'fig', caption: 'SAL 순으로 세운 다섯 행에서 현재 행이 둘째(200)일 때 프레임. 파란 테두리 안이 계산에 들어가요. RANGE 는 같은 값 200 을 한 묶음으로 봐서 셋째 행까지 들어가요.', svg: `<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">
  <text x="140" y="18" class="tx-b" text-anchor="middle">ROWS</text>
  <text x="140" y="36" class="tx-s" text-anchor="middle">처음 ~ 현재 행</text>
  <text x="280" y="18" class="tx-b" text-anchor="middle">RANGE</text>
  <text x="280" y="36" class="tx-s" text-anchor="middle">처음 ~ 현재 행</text>
  <text x="420" y="18" class="tx-b" text-anchor="middle">ROWS</text>
  <text x="420" y="36" class="tx-s" text-anchor="middle">1 앞 ~ 1 뒤</text>
  <text x="560" y="18" class="tx-b" text-anchor="middle">ROWS</text>
  <text x="560" y="36" class="tx-s" text-anchor="middle">현재 행 ~ 끝</text>
  <text x="44" y="100" class="tx-a" text-anchor="middle">현재 행</text>
  <rect x="90" y="50" width="100" height="30" class="bx"/><text x="140" y="70" class="tx-m" text-anchor="middle">100</text>
  <rect x="90" y="80" width="100" height="30" class="bx-y"/><text x="140" y="100" class="tx-m" text-anchor="middle">200</text>
  <rect x="90" y="110" width="100" height="30" class="bx"/><text x="140" y="130" class="tx-m" text-anchor="middle">200</text>
  <rect x="90" y="140" width="100" height="30" class="bx"/><text x="140" y="160" class="tx-m" text-anchor="middle">300</text>
  <rect x="90" y="170" width="100" height="30" class="bx"/><text x="140" y="190" class="tx-m" text-anchor="middle">400</text>
  <rect x="86" y="47" width="108" height="66" class="ln-a"/>
  <text x="140" y="226" class="tx-a" text-anchor="middle">합 300</text>
  <rect x="230" y="50" width="100" height="30" class="bx"/><text x="280" y="70" class="tx-m" text-anchor="middle">100</text>
  <rect x="230" y="80" width="100" height="30" class="bx-y"/><text x="280" y="100" class="tx-m" text-anchor="middle">200</text>
  <rect x="230" y="110" width="100" height="30" class="bx"/><text x="280" y="130" class="tx-m" text-anchor="middle">200</text>
  <rect x="230" y="140" width="100" height="30" class="bx"/><text x="280" y="160" class="tx-m" text-anchor="middle">300</text>
  <rect x="230" y="170" width="100" height="30" class="bx"/><text x="280" y="190" class="tx-m" text-anchor="middle">400</text>
  <rect x="226" y="47" width="108" height="96" class="ln-a"/>
  <text x="280" y="226" class="tx-a" text-anchor="middle">합 500</text>
  <rect x="370" y="50" width="100" height="30" class="bx"/><text x="420" y="70" class="tx-m" text-anchor="middle">100</text>
  <rect x="370" y="80" width="100" height="30" class="bx-y"/><text x="420" y="100" class="tx-m" text-anchor="middle">200</text>
  <rect x="370" y="110" width="100" height="30" class="bx"/><text x="420" y="130" class="tx-m" text-anchor="middle">200</text>
  <rect x="370" y="140" width="100" height="30" class="bx"/><text x="420" y="160" class="tx-m" text-anchor="middle">300</text>
  <rect x="370" y="170" width="100" height="30" class="bx"/><text x="420" y="190" class="tx-m" text-anchor="middle">400</text>
  <rect x="366" y="47" width="108" height="96" class="ln-a"/>
  <text x="420" y="226" class="tx-a" text-anchor="middle">합 500</text>
  <rect x="510" y="50" width="100" height="30" class="bx"/><text x="560" y="70" class="tx-m" text-anchor="middle">100</text>
  <rect x="510" y="80" width="100" height="30" class="bx-y"/><text x="560" y="100" class="tx-m" text-anchor="middle">200</text>
  <rect x="510" y="110" width="100" height="30" class="bx"/><text x="560" y="130" class="tx-m" text-anchor="middle">200</text>
  <rect x="510" y="140" width="100" height="30" class="bx"/><text x="560" y="160" class="tx-m" text-anchor="middle">300</text>
  <rect x="510" y="170" width="100" height="30" class="bx"/><text x="560" y="190" class="tx-m" text-anchor="middle">400</text>
  <rect x="506" y="77" width="108" height="126" class="ln-a"/>
  <text x="560" y="226" class="tx-a" text-anchor="middle">합 1100</text>
</svg>` },
    { t: 'p', x: '앞뒤 한 행씩을 묶는 `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` 은 이동 합계나 이동 평균을 낼 때 써요. 첫 행은 앞 행이 없고 마지막 행은 뒤 행이 없어서, 있는 행만 가지고 계산해요.' },
    { t: 'sql', code: `SELECT ENAME, SAL,
       SUM(SAL) OVER (ORDER BY SAL, ENAME
                      ROWS BETWEEN 1 PRECEDING
                               AND 1 FOLLOWING) AS MV_SUM
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'MV_SUM'], rows: [
      ['JUNG', 100, 300],
      ['LEE', 200, 500],
      ['PARK', 200, 700],
      ['KIM', 300, 900],
      ['CHOI', 400, 700]
    ] }, note: 'JUNG 은 100+200, CHOI 는 300+400 처럼 두 행만 더해요. AVG 로 바꾸면 JUNG 은 300 ÷ 2 = 150 이에요. 3 으로 나누지 않아요.' },
    { t: 'p', x: 'RANGE 에 숫자를 쓰면 행 개수가 아니라 ==값의 범위==가 돼요. `RANGE BETWEEN 100 PRECEDING AND 100 FOLLOWING` 은 "정렬 값이 현재 값 - 100 이상, 현재 값 + 100 이하인 행"이에요.' },
    { t: 'sql', code: `SELECT ENAME, SAL,
       COUNT(*) OVER (ORDER BY SAL
                      RANGE BETWEEN 100 PRECEDING
                                AND 100 FOLLOWING) AS CNT
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'CNT'], rows: [
      ['JUNG', 100, 3],
      ['LEE', 200, 4],
      ['PARK', 200, 4],
      ['KIM', 300, 4],
      ['CHOI', 400, 2]
    ] }, note: 'JUNG 은 0 ~ 200 사이인 100, 200, 200 세 건. CHOI 는 300 ~ 500 사이인 300, 400 두 건.' },
    { t: 'check', q: 'SAL 이 100, 200, 200, 300 인 네 행에 SUM(SAL) OVER (ORDER BY SAL DESC) 를 하면 SAL 이 200 인 두 행의 값은?', a: '둘 다 700 이에요. 내림차순이라 300 이 먼저 오고, 프레임을 안 적었으니 RANGE 라서 200 두 행이 한 묶음으로 300+200+200 이 돼요.' },

    { t: 'h', x: '순위 함수 세 가지' },
    { t: 'p', x: '순위를 매길 때 동점을 어떻게 처리하느냐에 따라 함수가 셋으로 나뉘어요. 셋 다 ORDER BY 가 반드시 있어야 하고, 괄호 안에 인자는 없어요.' },
    { t: 'vs',
      a: { title: 'RANK', items: ['동점은 같은 순위', '다음 순위는 동점 수만큼 건너뜀', '1, 2, 2, 4'] },
      b: { title: 'DENSE_RANK', items: ['동점은 같은 순위', '다음 순위를 건너뛰지 않음', '1, 2, 2, 3'] },
      c: { title: 'ROW_NUMBER', items: ['동점이어도 다른 번호', '겹치는 번호가 없음', '1, 2, 3, 4'] } },
    { t: 'sql', code: `SELECT ENAME, SAL,
       RANK()       OVER (ORDER BY SAL DESC) AS RK,
       DENSE_RANK() OVER (ORDER BY SAL DESC) AS DRK,
       ROW_NUMBER() OVER (ORDER BY SAL DESC) AS RN
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'RK', 'DRK', 'RN'], rows: [
      ['CHOI', 400, 1, 1, 1],
      ['KIM', 300, 2, 2, 2],
      ['LEE', 200, 3, 3, 3],
      ['PARK', 200, 3, 3, 4],
      ['JUNG', 100, 5, 4, 5]
    ] }, note: 'LEE 와 PARK 중 누가 RN 3 을 받을지는 정해져 있지 않아요. 정하고 싶으면 ORDER BY SAL DESC, ENAME 처럼 기준을 더 줘요.' },
    { t: 'p', x: '부서 안에서 순위를 매기려면 `RANK() OVER (PARTITION BY DEPT ORDER BY SAL DESC)` 처럼 PARTITION BY 를 넣어요. 부서가 바뀌면 순위가 1 부터 다시 시작해요.' },
    { t: 'trap', title: 'RANK 로 "2등"만 뽑으면 0건일 수 있어요', x: '점수가 90, 90, 80 이면 RANK 는 1, 1, 3 이에요. 2 라는 번호가 아예 없어서 인라인 뷰 바깥에서 `WHERE RK = 2` 로 거르면 한 건도 나오지 않아요. 같은 표에서 DENSE_RANK 는 1, 1, 2 라서 80 점이 나오고, ROW_NUMBER 는 1, 2, 3 이라 90 점 둘 중 하나가 나와요. "두 번째로 높은 값"을 찾는 문제에서 RANK 를 쓴 보기가 오답으로 나와요.' },
    { t: 'tip', title: 'RANK WITHIN GROUP 은 다른 함수예요', x: '`RANK(250) WITHIN GROUP (ORDER BY SAL DESC)` 는 "250 이라는 값이 이 표에 들어온다면 몇 등인가"를 한 줄로 돌려주는 일반 집계 함수예요. OVER 가 없으니 윈도우 함수가 아니에요. 위 표에서는 400, 300 다음이라 3 이 나와요.' },

    { t: 'h', x: 'LAG 와 LEAD: 앞 행, 뒤 행의 값 가져오기' },
    { t: 'p', x: '전월 대비 증감처럼 바로 앞 행이나 뒤 행의 값을 옆에 놓고 싶을 때 써요. `LAG(컬럼, n, 기본값)` 은 정렬 순서에서 n 행 **앞**의 값, `LEAD(컬럼, n, 기본값)` 은 n 행 **뒤**의 값이에요. n 을 안 쓰면 1 이고, 가져올 행이 없을 때 기본값을 안 줬으면 NULL 이 나와요.' },
    { t: 'sql', code: `SELECT ENAME, SAL,
       LAG(SAL)        OVER (ORDER BY SAL DESC, ENAME) AS PREV,
       LEAD(SAL, 2, 0) OVER (ORDER BY SAL DESC, ENAME) AS NEXT2
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'PREV', 'NEXT2'], rows: [
      ['CHOI', 400, null, 200],
      ['KIM', 300, 400, 200],
      ['LEE', 200, 300, 100],
      ['PARK', 200, 200, 0],
      ['JUNG', 100, 200, 0]
    ] }, note: '첫 행은 앞 행이 없어서 PREV 가 NULL. 뒤에서 두 행은 두 칸 뒤가 없어서 기본값 0.' },
    { t: 'trap', title: 'LAG 와 LEAD 방향', x: 'LAG 는 뒤처진다는 뜻이라 "이전 행", LEAD 는 앞서간다는 뜻이라 "다음 행"이에요. 여기서 이전과 다음은 테이블에 저장된 순서가 아니라 OVER 안의 ORDER BY 순서예요. 내림차순으로 세웠으면 LAG 는 더 큰 값을 가져와요. 동점이어도 한 묶음으로 보지 않고 한 행씩 따져요.' },

    { t: 'h', x: 'FIRST_VALUE 와 LAST_VALUE' },
    { t: 'p', x: '프레임 안에서 맨 처음 값과 맨 마지막 값을 가져와요. FIRST_VALUE 는 생각한 대로 나오는데, LAST_VALUE 는 기본 프레임 때문에 엉뚱한 값이 나와요.' },
    { t: 'sql', code: `SELECT ENAME, DEPT, SAL,
       FIRST_VALUE(SAL) OVER (PARTITION BY DEPT ORDER BY SAL) AS FV,
       LAST_VALUE(SAL)  OVER (PARTITION BY DEPT ORDER BY SAL) AS LV,
       LAST_VALUE(SAL)  OVER (PARTITION BY DEPT ORDER BY SAL
                              ROWS BETWEEN UNBOUNDED PRECEDING
                                       AND UNBOUNDED FOLLOWING) AS LV_ALL
  FROM EMP;`, result: { head: ['ENAME', 'DEPT', 'SAL', 'FV', 'LV', 'LV_ALL'], rows: [
      ['LEE', 10, 200, 200, 200, 300],
      ['PARK', 10, 200, 200, 200, 300],
      ['KIM', 10, 300, 200, 300, 300],
      ['JUNG', 20, 100, 100, 100, 400],
      ['CHOI', 20, 400, 100, 400, 400]
    ] }, note: 'LV 는 부서 최댓값이 아니라 자기 SAL 과 같은 값이 나왔어요.' },
    { t: 'p', x: 'FIRST_VALUE 는 정렬 기준으로 첫 행의 값이에요. 그래서 `FIRST_VALUE(SAL) OVER (PARTITION BY DEPT ORDER BY SAL)` 은 `MIN(SAL) OVER (PARTITION BY DEPT)` 와 같은 값이 나와요. ORDER BY SAL DESC 로 세우면 부서 최댓값을 얻을 수 있어서, "MAX 를 쓰지 않고 같은 결과를 내는 것"을 고르는 문제에 쓰여요.' },
    { t: 'trap', title: 'LAST_VALUE 가 그룹의 마지막 값을 안 줘요', x: 'ORDER BY 만 쓰면 프레임이 "처음부터 현재 행까지"라서, 그 안의 마지막 값은 현재 행(동점이 있으면 동점 묶음의 마지막 행)이에요. 그룹 전체의 마지막 값을 원하면 `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` 을 적어야 해요. FIRST_VALUE 는 프레임이 항상 첫 행에서 시작하니 이 문제가 없어요.' },

    { t: 'h', x: 'NTILE: 순서대로 n 등분' },
    { t: 'p', x: '`NTILE(n)` 은 행을 정렬 순서대로 n 개 묶음으로 나누고 묶음 번호(1 ~ n)를 돌려줘요. 딱 나눠떨어지지 않으면 ==남는 행을 앞 묶음부터 하나씩== 더 넣어요. 다섯 행을 NTILE(2) 로 나누면 3, 2 이고 NTILE(3) 으로 나누면 2, 2, 1 이에요.' },
    { t: 'sql', code: `SELECT ENAME, SAL,
       NTILE(2) OVER (ORDER BY SAL DESC, ENAME) AS G2,
       NTILE(3) OVER (ORDER BY SAL DESC, ENAME) AS G3
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'G2', 'G3'], rows: [
      ['CHOI', 400, 1, 1],
      ['KIM', 300, 1, 1],
      ['LEE', 200, 1, 2],
      ['PARK', 200, 2, 2],
      ['JUNG', 100, 2, 3]
    ] }, note: 'NTILE 은 값이 같아도 신경 쓰지 않고 행 수로만 잘라요. LEE 와 PARK 는 동점인데 G2 가 달라요.' },

    { t: 'h', x: '비율 함수 세 가지' },
    { t: 'table', head: ['함수', '계산식', 'ORDER BY'], rows: [
      ['`RATIO_TO_REPORT(컬럼)`', '내 값 ÷ 그룹 합계', '쓸 수 없다'],
      ['`PERCENT_RANK()`', '(RANK - 1) ÷ (그룹 행 수 - 1)', '필수'],
      ['`CUME_DIST()`', '나와 같거나 앞선 행 수 ÷ 그룹 행 수', '필수']
    ] },
    { t: 'sql', code: `SELECT ENAME, SAL,
       ROUND(RATIO_TO_REPORT(SAL) OVER (), 2) AS RTR,
       PERCENT_RANK() OVER (ORDER BY SAL)     AS PR,
       CUME_DIST()    OVER (ORDER BY SAL)     AS CD
  FROM EMP;`, result: { head: ['ENAME', 'SAL', 'RTR', 'PR', 'CD'], rows: [
      ['JUNG', 100, 0.08, 0, 0.2],
      ['LEE', 200, 0.17, 0.25, 0.6],
      ['PARK', 200, 0.17, 0.25, 0.6],
      ['KIM', 300, 0.25, 0.75, 0.8],
      ['CHOI', 400, 0.33, 1, 1]
    ] }, note: 'LEE: RANK 는 2 라서 PR 은 (2-1) ÷ (5-1) = 0.25. 200 이하인 행이 세 건이라 CD 는 3 ÷ 5 = 0.6.' },
    { t: 'tip', title: '시작 값으로 구분해요', x: 'PERCENT_RANK 는 첫 행이 항상 0 이고 마지막이 1 이에요. CUME_DIST 는 0 이 나올 수 없고(다섯 행이면 0.2 부터) 마지막이 1 이에요. 동점은 둘 다 같은 값을 받는데, CUME_DIST 는 동점 묶음의 끝까지 센 값을 받아요.' },

    { t: 'h', x: '윈도우 함수를 쓸 수 있는 자리' },
    { t: 'p', x: '윈도우 함수는 FROM, WHERE, GROUP BY, HAVING 이 다 끝난 결과를 놓고 계산해요. 그래서 SELECT 절과 ORDER BY 절에만 쓸 수 있고, ==WHERE 절에는 쓸 수 없어요.== 순위로 걸러 내려면 인라인 뷰로 한 번 감싸야 해요.' },
    { t: 'sql', code: `SELECT ENAME, DEPT, SAL
  FROM (SELECT ENAME, DEPT, SAL,
               RANK() OVER (PARTITION BY DEPT ORDER BY SAL DESC) AS RK
          FROM EMP)
 WHERE RK = 1;`, result: { head: ['ENAME', 'DEPT', 'SAL'], rows: [['KIM', 10, 300], ['CHOI', 20, 400]] } },
    { t: 'trap', title: 'WHERE 가 먼저, 윈도우 함수가 나중', x: '같은 SELECT 문에 WHERE 가 있으면 WHERE 로 걸러진 행만 가지고 윈도우 함수를 계산해요. `WHERE SAL >= 200` 이 있으면 `COUNT(*) OVER ()` 는 5 가 아니라 4 예요. 반대로 `WHERE RANK() OVER (…) = 1` 이나 SELECT 절에서 붙인 별칭을 같은 문장의 WHERE 에서 쓰는 것은 오류예요.' },
    { t: 'check', q: 'RANK() OVER (ORDER BY SAL DESC) 로 3등까지 뽑았더니 4건이 나왔어요. 어떤 경우일까요?', a: '3등이 두 명인 경우예요(1, 2, 3, 3). 2등이 두 명이면 1, 2, 2, 4 라서 3건이 나와요. RANK 는 동점 다음 순위를 건너뛰기 때문이에요.' }
  ],
  keys: [
    'OVER 안의 순서는 PARTITION BY → ORDER BY → ROWS|RANGE. 행 수는 줄지 않는다',
    '집계 함수에 ORDER BY 만 쓰면 누적. 기본 프레임은 RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
    'RANGE 는 정렬 값이 같은 행을 한 묶음으로 계산, ROWS 는 한 행씩 계산',
    'RANK 1,2,2,4 / DENSE_RANK 1,2,2,3 / ROW_NUMBER 1,2,3,4. 1등이 둘이면 RANK = 2 는 0건',
    'LAG 는 앞 행, LEAD 는 뒤 행. (컬럼, 몇 행, 없을 때 기본값) 이고 기본은 1 행, NULL',
    'LAST_VALUE 는 기본 프레임이면 현재 행 값. 그룹 끝 값은 UNBOUNDED FOLLOWING 까지 적어야 한다',
    'NTILE(n) 은 남는 행을 앞 묶음부터 하나씩. 7행을 3등분하면 3, 2, 2',
    'PERCENT_RANK = (순위-1)/(행수-1), CUME_DIST = 누적 행 수/행수, RATIO_TO_REPORT = 값/합계(ORDER BY 불가)'
  ],
  cards: [
    { q: 'OVER (ORDER BY SAL) 만 쓰고 프레임을 생략하면 기본 프레임은?', a: '`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. 동점 행은 같은 누적값을 받아요.' },
    { q: '점수가 90, 80, 80, 70 일 때 70 의 RANK, DENSE_RANK, ROW_NUMBER 는?', a: '4, 3, 4.' },
    { q: '`LAG(SAL, 2, 0)` 의 세 인자는 각각 무엇인가요?', a: '가져올 컬럼, 몇 행 앞인지, 그 행이 없을 때 대신 줄 값. 생략하면 1 행 앞, NULL.' },
    { q: 'LAST_VALUE 로 그룹의 마지막 값을 얻으려면?', a: '프레임을 `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` 으로 적어요. 안 적으면 현재 행 값이 나와요.' },
    { q: '10 행을 NTILE(4) 로 나누면 묶음별 행 수는?', a: '3, 3, 2, 2. 남는 두 행을 앞 묶음부터 하나씩 줘요.' },
    { q: '다섯 행 중 RANK 가 2 인 행의 PERCENT_RANK 는?', a: '(2-1) ÷ (5-1) = 0.25.' },
    { q: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING 에서 첫 행은 몇 행을 계산하나요?', a: '두 행(자기와 다음 행). 앞 행이 없으니 있는 행만 계산해요.' },
    { q: '윈도우 함수를 WHERE 절에 쓸 수 있나요?', a: '없어요. SELECT 와 ORDER BY 절에만 쓰고, 걸러 내려면 인라인 뷰로 감싼 뒤 바깥 WHERE 에서 별칭으로 걸러요.' }
  ],
  quiz: [
    { id: 'q12-01', level: 1, tag: '윈도우 함수 개요',
      q: '윈도우 함수에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        '행 수를 줄이지 않고 각 행 옆에 그룹 단위 계산 결과를 붙일 수 있다.',
        'PARTITION BY 를 쓰면 GROUP BY 처럼 결과가 그룹당 한 행으로 줄어든다.',
        'RANK, DENSE_RANK, ROW_NUMBER 는 OVER 안에 ORDER BY 가 반드시 있어야 한다.',
        '윈도우 함수는 WHERE 절에 직접 쓸 수 없다.'
      ],
      answer: 2,
      why: 'PARTITION BY 는 계산 단위만 나눌 뿐 행 수를 줄이지 않아요. 그룹당 한 행으로 줄이는 것은 GROUP BY 예요. 순위 함수는 순서가 있어야 순위를 매기니 ORDER BY 가 필수이고, 윈도우 함수는 SELECT 와 ORDER BY 절에서만 쓸 수 있어요.' },
    { id: 'q12-02', level: 1, tag: '문법과 절 순서',
      q: '다음 중 오류 없이 실행되는 윈도우 함수 표현은?',
      choices: [
        { code: `SUM(SAL) OVER (ORDER BY SAL PARTITION BY DEPT)` },
        { code: `SUM(SAL) OVER (PARTITION BY DEPT
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` },
        { code: `SUM(SAL) OVER (PARTITION BY DEPT ORDER BY SAL
               ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)` },
        { code: `RANK() OVER (PARTITION BY DEPT)` }
      ],
      answer: 3,
      why: 'OVER 안은 PARTITION BY, ORDER BY, ROWS|RANGE 순서로 써요. 1번은 ORDER BY 가 PARTITION BY 앞에 와서 오류, 2번은 ORDER BY 없이 프레임을 써서 오류, 4번은 순위 함수에 ORDER BY 가 없어서 오류예요.' },
    { id: 'q12-03', level: 2, tag: '순위 함수',
      q: '아래 SQL 의 결과에서 NAME 이 E 인 행의 R1, R2, R3 값으로 알맞은 것은?',
      tables: [{ name: 'SCORE', head: ['NAME', 'PT'], rows: [['A', 90], ['B', 80], ['C', 80], ['D', 80], ['E', 70]] }],
      code: `SELECT NAME,
       RANK()       OVER (ORDER BY PT DESC) AS R1,
       DENSE_RANK() OVER (ORDER BY PT DESC) AS R2,
       ROW_NUMBER() OVER (ORDER BY PT DESC) AS R3
  FROM SCORE;`,
      choices: ['5, 3, 5', '3, 3, 5', '5, 5, 5', '3, 5, 5'],
      answer: 1,
      why: 'A 가 1등이고 B, C, D 가 동점 2등이에요. RANK 는 동점 세 명만큼 건너뛰어 E 가 5, DENSE_RANK 는 건너뛰지 않아 3, ROW_NUMBER 는 행마다 다른 번호라 마지막 행인 E 가 5 예요.' },
    { id: 'q12-04', level: 2, tag: '누적합과 RANGE',
      q: '아래 SQL 의 결과로 알맞은 것은? (행 순서는 AMT 오름차순으로 적었다)',
      tables: [{ name: 'SALE', head: ['ID', 'AMT'], rows: [[1, 20], [2, 10], [3, 30], [4, 20]] }],
      code: `SELECT AMT, SUM(AMT) OVER (ORDER BY AMT) AS S
  FROM SALE;`,
      choices: [
        { head: ['AMT', 'S'], rows: [[10, 10], [20, 30], [20, 50], [30, 80]] },
        { head: ['AMT', 'S'], rows: [[10, 80], [20, 80], [20, 80], [30, 80]] },
        { head: ['AMT', 'S'], rows: [[10, 10], [20, 40], [20, 40], [30, 30]] },
        { head: ['AMT', 'S'], rows: [[10, 10], [20, 50], [20, 50], [30, 80]] }
      ],
      answer: 4,
      why: '프레임을 안 적었으니 RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW 예요. AMT 가 20 인 두 행은 한 묶음이라 둘 다 10+20+20 = 50 을 받아요. 1번은 ROWS 로 한 행씩 더했을 때, 2번은 ORDER BY 가 없을 때, 3번은 PARTITION BY AMT 였을 때의 결과예요.' },
    { id: 'q12-05', level: 3, tag: 'ROWS 와 RANGE',
      q: 'T 테이블의 ID 는 중복이 없는 기본키이다. 다음 중 나머지 셋과 결과가 다른 것은?',
      choices: [
        { code: `SUM(AMT) OVER (ORDER BY ID)` },
        { code: `SUM(AMT) OVER (ORDER BY ID
               RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` },
        { code: `SUM(AMT) OVER (ORDER BY ID
               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)` },
        { code: `SUM(AMT) OVER (ORDER BY ID
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` }
      ],
      answer: 3,
      why: '1번은 프레임을 생략해서 2번과 완전히 같은 뜻이에요. ROWS 와 RANGE 는 정렬 값에 동점이 있을 때만 달라지는데 ID 는 중복이 없으니 4번도 같은 누적합이 나와요. 3번은 끝점이 UNBOUNDED FOLLOWING 이라 모든 행에 전체 합이 나와요.' },
    { id: 'q12-06', level: 2, tag: '프레임과 이동 평균',
      q: '아래 SQL 의 결과에서 MV 값을 DAY 1, 2, 3, 4 순서로 적은 것은?',
      tables: [{ name: 'DAILY', head: ['DAY', 'QTY'], rows: [[1, 30], [2, 60], [3, 90], [4, 60]] }],
      code: `SELECT DAY,
       AVG(QTY) OVER (ORDER BY DAY
                      ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS MV
  FROM DAILY;`,
      choices: ['45, 60, 70, 75', '30, 60, 70, 50', '30, 45, 60, 60', '30, 45, 75, 75'],
      answer: 1,
      why: 'DAY 1 은 앞 행이 없어 (30+60) ÷ 2 = 45, DAY 2 는 (30+60+90) ÷ 3 = 60, DAY 3 은 (60+90+60) ÷ 3 = 70, DAY 4 는 뒤 행이 없어 (90+60) ÷ 2 = 75 예요. 2번은 양 끝도 3 으로 나눈 값, 3번은 처음부터 누적 평균, 4번은 앞 행과 현재 행만 본 값이에요.' },
    { id: 'q12-07', level: 2, tag: 'LAG 와 LEAD',
      q: '아래 SQL 의 결과에서 M = 1 인 행의 DIFF 와 M = 3 인 행의 NX 로 알맞은 것은?',
      tables: [{ name: 'MON', head: ['M', 'AMT'], rows: [[1, 100], [2, 150], [3, 120], [4, 200]] }],
      code: `SELECT M,
       AMT - LAG(AMT) OVER (ORDER BY M) AS DIFF,
       LEAD(AMT, 2, 0) OVER (ORDER BY M) AS NX
  FROM MON;`,
      choices: ['100, 0', 'NULL, 0', 'NULL, NULL', '0, 200'],
      answer: 2,
      why: 'M = 1 은 앞 행이 없고 기본값도 안 줬으니 LAG 가 NULL 이에요. 100 - NULL 은 NULL 이에요. M = 3 에서 두 행 뒤는 M = 5 인데 없으니 셋째 인자로 준 기본값 0 이 나와요. 200 은 한 행 뒤의 값이에요.' },
    { id: 'q12-08', level: 3, tag: 'FIRST_VALUE 와 LAST_VALUE',
      q: '아래 SQL 의 결과로 알맞은 것은? (행 순서는 무시한다)',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPT', 'SAL'], rows: [['P', 'A', 100], ['Q', 'A', 200], ['R', 'A', 300], ['S', 'B', 500], ['T', 'B', 400]] }],
      code: `SELECT ENAME,
       FIRST_VALUE(SAL) OVER (PARTITION BY DEPT ORDER BY SAL) AS F,
       LAST_VALUE(SAL)  OVER (PARTITION BY DEPT ORDER BY SAL) AS L
  FROM EMP;`,
      choices: [
        { head: ['ENAME', 'F', 'L'], rows: [['P', 100, 300], ['Q', 100, 300], ['R', 100, 300], ['T', 400, 500], ['S', 400, 500]] },
        { head: ['ENAME', 'F', 'L'], rows: [['P', 100, 300], ['Q', 200, 300], ['R', 300, 300], ['T', 400, 500], ['S', 500, 500]] },
        { head: ['ENAME', 'F', 'L'], rows: [['P', 100, 100], ['Q', 100, 200], ['R', 100, 300], ['T', 100, 400], ['S', 100, 500]] },
        { head: ['ENAME', 'F', 'L'], rows: [['P', 100, 100], ['Q', 100, 200], ['R', 100, 300], ['T', 400, 400], ['S', 400, 500]] }
      ],
      answer: 4,
      why: 'ORDER BY 만 있으니 프레임은 부서의 첫 행부터 현재 행까지예요. FIRST_VALUE 는 부서 최솟값(A 는 100, B 는 400)이 나오지만, LAST_VALUE 는 프레임의 끝이 현재 행이라 자기 SAL 이 나와요. 1번은 프레임을 UNBOUNDED FOLLOWING 까지 줬을 때의 결과이고, 3번은 PARTITION BY 를 무시한 결과예요.' },
    { id: 'q12-09', level: 1, tag: 'NTILE',
      q: '10 행짜리 테이블에 `NTILE(4) OVER (ORDER BY NO)` 를 적용했다. 묶음 1, 2, 3, 4 에 들어가는 행 수로 알맞은 것은?',
      choices: ['3, 3, 2, 2', '2, 2, 3, 3', '3, 3, 3, 1', '4, 2, 2, 2'],
      answer: 1,
      why: '10 ÷ 4 는 몫 2, 나머지 2 예요. 모든 묶음에 2 행씩 주고 남는 2 행을 앞 묶음부터 하나씩 더 줘서 3, 3, 2, 2 가 돼요. 뒤 묶음이 커지거나 앞 묶음을 가득 채우는 방식이 아니에요.' },
    { id: 'q12-10', level: 3, tag: '비율 함수',
      q: '아래 SQL 의 결과에서 NAME 이 B 인 행의 P, C 값으로 알맞은 것은?',
      tables: [{ name: 'SCORE', head: ['NAME', 'PT'], rows: [['A', 50], ['B', 60], ['C', 60], ['D', 80], ['E', 90]] }],
      code: `SELECT NAME,
       PERCENT_RANK() OVER (ORDER BY PT) AS P,
       CUME_DIST()    OVER (ORDER BY PT) AS C
  FROM SCORE;`,
      choices: ['0.5, 0.6', '0.25, 0.6', '0.25, 0.4', '0.4, 0.6'],
      answer: 2,
      why: 'PT 오름차순에서 B 의 RANK 는 2 예요. PERCENT_RANK 는 (2-1) ÷ (5-1) = 0.25 예요. CUME_DIST 는 PT 가 60 이하인 행이 A, B, C 세 건이라 3 ÷ 5 = 0.6 이에요. 동점인 C 까지 세야 해서 0.4 가 아니고, 순위를 행 수로 그냥 나눈 0.4 도 PERCENT_RANK 가 아니에요.' },
    { id: 'q12-11', level: 2, tag: '윈도우 함수와 WHERE',
      q: '부서(DEPT)별로 급여(SAL)가 가장 높은 사원의 이름을 구하려고 한다. 오류 없이 원하는 결과가 나오는 SQL 은?',
      choices: [
        { code: `SELECT ENAME
  FROM EMP
 WHERE RANK() OVER (PARTITION BY DEPT ORDER BY SAL DESC) = 1;` },
        { code: `SELECT ENAME,
       RANK() OVER (PARTITION BY DEPT ORDER BY SAL DESC) AS RK
  FROM EMP
 WHERE RK = 1;` },
        { code: `SELECT ENAME
  FROM EMP
 GROUP BY DEPT
HAVING RANK() OVER (ORDER BY SAL DESC) = 1;` },
        { code: `SELECT ENAME
  FROM (SELECT ENAME,
               RANK() OVER (PARTITION BY DEPT ORDER BY SAL DESC) AS RK
          FROM EMP)
 WHERE RK = 1;` }
      ],
      answer: 4,
      why: '윈도우 함수는 WHERE 와 HAVING 에 쓸 수 없어서 1번과 3번은 오류예요. 2번은 SELECT 절의 별칭 RK 를 같은 문장의 WHERE 에서 써서 오류예요. WHERE 가 SELECT 보다 먼저 실행되기 때문이에요. 인라인 뷰에서 순위를 붙이고 바깥에서 거르는 4번이 맞아요.' },
    { id: 'q12-12', level: 3, tag: 'RANGE 와 값 범위',
      q: '아래 SQL 의 결과에서 SAL 이 250 인 행의 CNT 값은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'SAL'], rows: [['A', 100], ['B', 200], ['C', 250], ['D', 400], ['E', 500]] }],
      code: `SELECT ENAME, SAL,
       COUNT(*) OVER (ORDER BY SAL
                      RANGE BETWEEN 100 PRECEDING AND 100 FOLLOWING) AS CNT
  FROM EMP;`,
      choices: ['1', '2', '3', '5'],
      answer: 2,
      why: 'RANGE 에 숫자를 쓰면 행 개수가 아니라 값의 범위예요. SAL 이 250 - 100 = 150 이상, 250 + 100 = 350 이하인 행은 200 과 250 두 건이에요. 3 은 앞뒤 한 행씩(200, 250, 400)을 센 값이고, 5 는 ROWS 로 읽어 앞뒤 100 행, 곧 전체를 센 값이에요.' },
    { id: 'q12-13', level: 2, tag: '실행 순서',
      q: '아래 SQL 의 결과에서 ENAME 이 L 인 행의 C, S 값으로 알맞은 것은?',
      tables: [{ name: 'EMP', head: ['ENAME', 'DEPT', 'SAL'], rows: [['K', 'A', 100], ['L', 'A', 200], ['M', 'A', 300], ['N', 'B', 200], ['O', 'B', 100]] }],
      code: `SELECT ENAME,
       COUNT(*) OVER ()                  AS C,
       SUM(SAL) OVER (PARTITION BY DEPT) AS S
  FROM EMP
 WHERE SAL >= 200;`,
      choices: ['5, 600', '2, 500', '3, 500', '3, 600'],
      answer: 3,
      why: 'WHERE 가 먼저 실행돼서 L, M, N 세 행만 남아요. 윈도우 함수는 이 세 행을 가지고 계산하니 COUNT(*) OVER () 는 3 이고, 부서 A 의 합은 200 + 300 = 500 이에요. 600 은 걸러진 K 까지 더한 값이에요.' },
    { id: 'q12-14', level: 2, tag: '윈도우 함수 종합',
      q: '윈도우 함수에 대한 설명으로 가장 적절하지 않은 것은?',
      choices: [
        'OVER 안에 ORDER BY 만 쓰고 프레임을 생략하면 RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW 가 적용된다.',
        'RATIO_TO_REPORT 는 OVER 안에 ORDER BY 를 쓸 수 없다.',
        '`LAG(SAL, 2)` 는 정렬 순서에서 현재 행보다 두 행 뒤에 있는 행의 SAL 을 가져온다.',
        'DENSE_RANK 는 동점이 있어도 다음 순위 번호를 건너뛰지 않는다.'
      ],
      answer: 3,
      why: 'LAG 는 앞 행, LEAD 가 뒤 행이에요. `LAG(SAL, 2)` 는 두 행 앞의 값을 가져와요. RATIO_TO_REPORT 는 그룹 합계에 대한 비율이라 순서가 필요 없고 ORDER BY 를 쓰면 오류예요.' },
    { id: 'q12-15', level: 2, tag: 'ROWS 와 RANGE',
      q: 'T 테이블에서 아래 [결과] 를 얻으려고 한다. 빈칸에 들어갈 것으로 알맞은 것은?',
      tables: [
        { name: 'T', head: ['ID', 'AMT'], rows: [[1, 10], [2, 20], [3, 20], [4, 30]] },
        { name: '결과', head: ['AMT', 'S'], rows: [[10, 10], [20, 30], [20, 50], [30, 80]] }
      ],
      code: `SELECT AMT, (        ) AS S
  FROM T
 ORDER BY AMT, S;`,
      choices: [
        { code: `SUM(AMT) OVER (ORDER BY AMT
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` },
        { code: `SUM(AMT) OVER (ORDER BY AMT)` },
        { code: `SUM(AMT) OVER (ORDER BY AMT
               RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` },
        { code: `SUM(AMT) OVER (PARTITION BY AMT)` }
      ],
      answer: 1,
      why: '결과표에서 AMT 가 20 으로 같은 두 행의 S 가 30, 50 으로 달라요. 동점 행을 한 줄씩 따로 더했다는 뜻이니 ROWS 예요. 2번은 프레임을 생략해서 3번과 같은 RANGE 이고, 둘 다 20 인 두 행이 50, 50 을 받아요. 4번은 AMT 가 같은 행끼리만 더해서 10, 40, 40, 30 이 나와요.' },
    { id: 'q12-16', level: 2, tag: '순위 함수',
      q: '아래 SQL 의 결과로 알맞은 것은?',
      tables: [{ name: 'SCORE', head: ['NAME', 'PT'], rows: [['A', 90], ['B', 90], ['C', 80], ['D', 70]] }],
      code: `SELECT NAME
  FROM (SELECT NAME,
               RANK() OVER (ORDER BY PT DESC) AS RK
          FROM SCORE)
 WHERE RK = 2;`,
      choices: ['C', 'A, B', 'B', '결과가 한 건도 나오지 않는다'],
      answer: 4,
      why: 'A 와 B 가 동점 1등이라 RANK 는 1, 1, 3, 4 예요. 2 라는 번호가 없으니 RK = 2 인 행은 0건이에요. DENSE_RANK 였다면 1, 1, 2, 3 이라 C 가 나오고, ROW_NUMBER 였다면 A 와 B 중 한 명이 2 를 받아요.' }
  ]
});
