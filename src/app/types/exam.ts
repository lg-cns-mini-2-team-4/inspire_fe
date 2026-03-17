export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;
  testDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  resultDate?: string;
  description?: string;
  organizationName: string;
  website?: string;
  eligibility?: string;
  subjects?: string[];
  location?: string;
  status: ExamStatus;
}

export type ExamCategory =
  | '공무원'
  | '교육'
  | '의료'
  | '기술/기능'
  | '금융'
  | '법률'
  | '기타';

export type ExamStatus = '접수예정' | '접수중' | '접수마감' | '시험완료';
