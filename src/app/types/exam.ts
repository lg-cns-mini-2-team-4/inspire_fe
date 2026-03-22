// export interface Exam {
//   id: string;
//   name: string;
//   category: ExamCategory;
//   testDate: string;
//   applicationStartDate: string;
//   applicationEndDate: string;
//   resultDate?: string;
//   description?: string;
//   organizationName: string;
//   website?: string;
//   eligibility?: string;
//   subjects?: string[];
//   location?: string;
//   status: ExamStatus;
// }

// export type ExamCategory =
//   | '공무원'
//   | '교육'
//   | '의료'
//   | '기술/기능'
//   | '금융'
//   | '법률'
//   | '기타';

// export type ExamStatus = '접수예정' | '접수중' | '접수마감' | '시험완료';

export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;      // 대직무분야
  mediumCategory: string;      // 중직무분야
  
  // 날짜 데이터 (10종)
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  writtenPassDate: string;     // 추가
  practicalRegStart: string;
  practicalRegEnd: string;
  practicalExamStart: string;
  practicalExamEnd: string;
  practicalPassDate: string;   // 추가

  status: ExamStatus;
  description?: string;

}

export type ExamCategory =
  | '공무원'
  | '교육'
  | '의료'
  | '기술/기능'
  | '금융'
  | '법률'
  | '정보통신' // 스크린샷의 'IT' 대응을 위해 추가 권장
  | '기타';

export type ExamStatus = '접수예정' | '접수중' | '접수마감' | '시험완료';