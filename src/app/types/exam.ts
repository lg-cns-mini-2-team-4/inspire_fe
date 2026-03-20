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
  category: ExamCategory;
  
  // 1. 필기 일정 (백엔드 written... 대응)
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  
  // 2. 실기 일정 (백엔드 practical... 대응)
  practicalRegStart: string;
  practicalRegEnd: string;
  practicalExamStart: string;
  practicalExamEnd: string;

  // 3. 기존 필드 및 공통 정보
  testDate: string;             // UI 호환성을 위해 writtenExamStart를 주로 할당
  applicationStartDate: string; // writtenRegStart 할당
  applicationEndDate: string;   // writtenRegEnd 할당
  
  description?: string;
  organizationName: string;     // 백엔드의 officeName 대응
  location?: string;            // 백엔드의 examLocation 대응
  status: ExamStatus;
  
  // 선택적 상세 정보
  resultDate?: string;
  website?: string;
  eligibility?: string;
  subjects?: string[];
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