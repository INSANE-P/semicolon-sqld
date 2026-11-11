// 장 순서와 시험 정보. 다른 내용 파일보다 먼저 읽힌다.
window.SQLD = window.SQLD || {
  chapters: {},
  add: function (c) { this.chapters[c.id] = c; }
};

SQLD.meta = {
  examDate: '2026-11-14',
  subjects: [
    {
      id: 's1', name: '1과목', title: '데이터 모델링의 이해', count: 10,
      parts: [
        { title: '데이터 모델링', ids: ['m1', 'm2', 'm3', 'm4', 'm5'] },
        { title: '데이터 모델과 SQL', ids: ['m6', 'm7', 'm8', 'm9', 'm10'] }
      ]
    },
    {
      id: 's2', name: '2과목', title: 'SQL 기본 및 활용', count: 40,
      parts: [
        { title: 'SQL 기본', ids: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] },
        { title: 'SQL 활용', ids: ['q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16'] },
        { title: '관리 구문', ids: ['q17', 'q18', 'q19', 'q20'] }
      ]
    }
  ],
  // 장 제목. 내용 파일이 아직 없어도 목차는 보이게 한다.
  titles: {
    m1: '데이터 모델의 이해', m2: '엔터티', m3: '속성', m4: '관계', m5: '식별자',
    m6: '정규화', m7: '관계와 조인의 이해', m8: '모델이 표현하는 트랜잭션의 이해', m9: 'NULL 속성의 이해', m10: '본질식별자와 인조식별자',
    q1: '관계형 데이터베이스 개요', q2: 'SELECT 문', q3: '함수', q4: 'WHERE 절', q5: 'GROUP BY 와 HAVING', q6: 'ORDER BY 절',
    q7: '조인', q8: '표준 조인', q9: '서브쿼리', q10: '집합 연산자', q11: '그룹 함수', q12: '윈도우 함수',
    q13: 'Top N 쿼리', q14: '계층형 질의', q15: 'PIVOT 과 UNPIVOT', q16: '정규 표현식',
    q17: 'DML', q18: 'TCL', q19: 'DDL', q20: 'DCL'
  }
};
