// import { useState, useMemo } from 'react';
// import { Link } from 'react-router';
// import { mockExams } from '../data/mockExams';
// import { ExamCard } from '../components/ExamCard';
// import {
//   Calendar,
//   TrendingUp,
//   Clock,
//   CheckCircle,
//   ArrowRight,
// } from 'lucide-react';
// import { format, isAfter, isBefore } from 'date-fns';
// import { ko } from 'date-fns/locale';

// export default function Home() {
//   const [currentDate] = useState(new Date('2026-03-13')); // 하드코딩

//   const stats = useMemo(() => { // mockExams에 하드코딩된 데이터 기반
//     const total = mockExams.length;
//     const upcoming = mockExams.filter((exam) =>
//       isAfter(new Date(exam.testDate), currentDate)
//     ).length;
//     const inProgress = mockExams.filter(
//       (exam) => exam.status === '접수중'
//     ).length;
//     const completed = mockExams.filter(
//       (exam) => exam.status === '시험완료'
//     ).length;

//     return { total, upcoming, inProgress, completed };
//   }, [currentDate]);

//   const upcomingExams = useMemo(() => { // mockExams에 하드코딩된 데이터 기반 - 다가오는 시험 3개
//     return mockExams
//       .filter((exam) => isAfter(new Date(exam.testDate), currentDate))
//       .sort(
//         (a, b) =>
//           new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
//       )
//       .slice(0, 3);
//   }, [currentDate]);

//   const activeApplications = useMemo(() => { // mockExams에 하드코딩된 데이터 기반 - 접수중인 시험
//     return mockExams.filter((exam) => exam.status === '접수중');
//   }, []);

//   return (
//     <div className="space-y-8">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
//         <h1 className="text-3xl font-bold mb-2">국가시험 일정 관리 시스템</h1>
//         <p className="text-blue-100 mb-6">
//           모든 국가시험 정보를 한 곳에서 관리하세요
//         </p>
//         <div className="text-sm text-blue-100">
//           오늘 날짜: {format(currentDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">전체 시험</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <Calendar className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">예정된 시험</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.upcoming}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">접수중</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.inProgress}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//               <Clock className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">완료된 시험</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.completed}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <CheckCircle className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Active Applications */}
//       {activeApplications.length > 0 && (
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               현재 접수중인 시험
//             </h2>
//             <Link
//               to="/exams?status=접수중"
//               className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
//             >
//               전체보기 <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {activeApplications.map((exam) => (
//               <ExamCard key={exam.id} exam={exam} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Upcoming Exams */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-gray-900">다가오는 시험</h2>
//           <Link
//             to="/exams"
//             className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
//           >
//             전체보기 <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {upcomingExams.map((exam) => (
//             <ExamCard key={exam.id} exam={exam} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { mockExams } from '../data/mockExams';
import { ExamCard } from '../components/ExamCard';
import { Exam, ExamCategory } from '../types/exam';
import { ExamStatus} from '../types/exam';
import {
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 1. 백엔드 DTO 규격 정의
interface ScheduleResponseDTO {
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  description: string;      // 추가
  officeName: string;
  examLocation: string;
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  practicalRegStart: string; // 추가
  practicalRegEnd: string;   // 추가
  practicalExamStart: string;// 추가
  practicalExamEnd: string;  // 추가
}

// 상단 통계 DTO 규격
interface StatsResponseDTO {
  totalCount: number;
  upcomingCount: number;
  activeCount: number;
  completedCount: number;
}

export default function Home() {
  // 기준 날짜
  const [currentDate] = useState(new Date('2026-03-13'));
  
  // 상태 관리
  const [activeApplications, setActiveApplications] = useState<Exam[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<StatsResponseDTO>({
    totalCount: 0,
    upcomingCount: 0,
    activeCount: 0,
    completedCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 매핑 함수 (타입 단언 as ExamCategory 추가)
  const mapDtoToExam = (dto: ScheduleResponseDTO, status: string): Exam => ({
    id: dto.itemCode,
    name: dto.itemName,
    category: dto.largeFieldName as ExamCategory,
    status: status as ExamStatus,
    // 신규 날짜 필드 전수 매핑
    writtenRegStart: dto.writtenRegStart,
    writtenRegEnd: dto.writtenRegEnd,
    writtenExamStart: dto.writtenExamStart,
    writtenExamEnd: dto.writtenExamEnd,
    practicalRegStart: dto.practicalRegStart,
    practicalRegEnd: dto.practicalRegEnd,
    practicalExamStart: dto.practicalExamStart,
    practicalExamEnd: dto.practicalExamEnd,
    // 하위 호환성을 위한 기존 필드 매핑
    testDate: dto.writtenExamStart,
    applicationStartDate: dto.writtenRegStart,
    applicationEndDate: dto.writtenRegEnd,
    organizationName: dto.officeName,
    location: dto.examLocation,
    description: dto.description,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // 세 가지 API를 병렬로 호출 (통계 API 주소는 관례에 따라 /status-counts로 가정합니다)
        const [activeRes, upcomingRes, statsRes] = await Promise.all([
          fetch('http://localhost:8080/api/schedules/active'),
          fetch('http://localhost:8080/api/schedules/upcoming'),
          fetch('http://localhost:8080/api/schedules/status-counts') 
        ]);

        if (!activeRes.ok || !upcomingRes.ok || !statsRes.ok) {
          throw new Error('데이터 로딩 실패');
        }

        const activeData: ScheduleResponseDTO[] = await activeRes.json();
        const upcomingData: ScheduleResponseDTO[] = await upcomingRes.json();
        const statsData: StatsResponseDTO = await statsRes.json();

        setActiveApplications(activeData.map(dto => mapDtoToExam(dto, '접수중')));
        setUpcomingExams(upcomingData.map(dto => mapDtoToExam(dto, '접수예정')));
        setStats(statsData);
      } catch (error) {
        console.error('API 호출 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">국가시험 일정 관리 시스템</h1>
        <p className="text-blue-100 mb-6">모든 국가시험 정보를 한 곳에서 관리하세요</p>
        <div className="text-sm text-blue-100">
          오늘 날짜: {format(currentDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
        </div>
      </div>

      {/* Stats Section - 백엔드 JSON 데이터 반영 및 명칭 변경 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 전체 시험 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">전체 시험</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 접수 예정 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">접수 예정</p>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 접수 중 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">접수 중</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* 접수 종료 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">접수 종료</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 표시 */}
      {isLoading && (
        <div className="py-10 text-center text-gray-500 font-medium">데이터를 불러오는 중...</div>
      )}

      {/* 1. 현재 접수 중인 시험 */}
      {!isLoading && activeApplications.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">현재 접수 중인 시험</h2>
            <Link to="/exams?status=접수중" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeApplications.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      )}

      {/* 2. 다가오는 시험 */}
      {!isLoading && upcomingExams.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">다가오는 시험</h2>
            <Link to="/exams" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}