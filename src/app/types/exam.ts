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
  itemCode: string;
  itemName: string;
  category: ExamCategory;
  type: 'WR' | 'WE' | 'PR' | 'PE' | 'PD'; // 필기접수, 필기시험 등
  startDate: string;
  endDate: string;
  description?: string;
  status: ExamStatus | string;

}

export type ExamCategory =
  | '재료' | '기계' | '화학' | '전기.전자' | '건설' | '섬유.의복' | '광업자원'
  | '정보통신' | '농림어업' | '안전관리' | '경영.회계.사무' | '식품.가공'
  | '환경.에너지' | '문화.예술.디자인.방송' | '인쇄.목재.가구.공예' | '운전.운송'
  | '음식서비스' | '이용.숙박.여행.오락.스포츠' | '보건.의료' | '사회복지.종교'
  | '영업.판매' | '교육.자연.과학.사회과학' | '사업관리' | '기타';

export type ExamStatus = '접수예정' | '접수중';