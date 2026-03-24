// import { useState, useEffect } from 'react';
// import { Link } from 'react-router';
// import { ExamCard } from '../components/ExamCard';
// import { Exam, ExamCategory, ExamStatus } from '../types/exam';
// import { Calendar, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
// import { format } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import { certApi } from '../api/certApi';

// // 백엔드 ExamListResponseDTO 규격에 맞춘 인터페이스
// interface ExamListResponseDTO {
//   itemCode: string;
//   itemName: string;
//   largeFieldName: string;
//   type: string;
//   startDate: string;
//   endDate: string;
//   description: string;
// }

// // 백엔드 ExamCountResponseDTO 규격과 1:1 매칭
// interface ExamCountResponseDTO {
//   totalCount: number;
//   activeCount: number;
//   upcomingCount: number;
// }

// // 백엔드 전체 응답 구조
// interface ExamSummaryResponse {
//   counts: ExamCountResponseDTO;
//   activeExams: ExamListResponseDTO[];
//   upcomingExams: ExamListResponseDTO[];
// }

// export default function Home() {
//   const { getExamSummary } = certApi();

//   // 상태 관리
//   const [stats, setStats] = useState<ExamCountResponseDTO>({
//     totalCount: 0,
//     upcomingCount: 0,
//     activeCount: 0
//   });

//   const [currentDate] = useState(new Date()); // 오늘 날짜
//   const [activeApplications, setActiveApplications] = useState<Exam[]>([]);
//   const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);

//   const [isLoading, setIsLoading] = useState(true);

//   // 백엔드 DTO를 프론트엔드 Exam 타입으로 변환하는 함수
//   const mapDtoToExam = (dto: ExamListResponseDTO, status: string): Exam => ({
//     id: `${dto.itemCode}-${dto.type}-${status}`, // 고유 키 생성
//     itemCode: dto.itemCode,
//     itemName: dto.itemName,
//     category: dto.largeFieldName as ExamCategory,
//     type: dto.type as any, // WR, WE 등
//     startDate: dto.startDate,
//     endDate: dto.endDate,
//     description: dto.description,
//     status: status as ExamStatus,
//   });

//   useEffect(() => {
//       const loadHomeData = async () => {
//         try {
//           setIsLoading(true);
//           // GET /certs/exams/summary 호출
//           const data: ExamSummaryResponse = await getExamSummary();
//           console.log("백엔드에서 온 생데이터:", data);
//           if (data) {
//           // 통계 데이터 설정
//           setStats(data.counts);
          
//           // 리스트 데이터 변환 및 설정
//           setActiveApplications(
//             data.activeExams.map(dto => mapDtoToExam(dto, '접수중'))
//           );
//           setUpcomingExams(
//             data.upcomingExams.map(dto => mapDtoToExam(dto, '접수예정'))
//           );
//         }
//       } catch (error) {
//         console.error('홈 데이터 로드 실패:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadHomeData();
//   }, []);


//   return (
//     <div className="space-y-8">
//       <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
//         <h1 className="text-3xl font-bold mb-2">국가시험 일정 관리 시스템</h1>
//         <p className="text-blue-100 opacity-90">종목별 상세 직무 분야와 실시간 시험 일정을 확인하세요</p>
//         <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm">
//           오늘 날짜: {format(currentDate, 'yyyy. MM. d (EEEE)', { locale: ko })}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard
//           title="전체 시험"
//           count={stats.totalCount}
//           icon={<Calendar className="text-blue-600" />}
//           color="bg-blue-100"
//         />
//         <StatCard
//           title="접수 중"
//           count={stats.activeCount}
//           icon={<Clock className="text-orange-600" />}
//           color="bg-orange-100"
//         />
//         <StatCard
//           title="접수 예정"
//           count={stats.upcomingCount}
//           icon={<TrendingUp className="text-green-600" />}
//           color="bg-green-100"
//         />
//       </div>

//       {!isLoading && (
//         <div className="space-y-12">
//           {activeApplications.length > 0 && (
//             <section>
//               <SectionHeader title="현재 접수 중인 시험" link="/exams?status=접수중" />
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {activeApplications.map(exam => <ExamCard key={exam.id} exam={exam} />)}
//               </div>
//             </section>
//           )}
//           {upcomingExams.length > 0 && (
//             <section>
//               <SectionHeader title="다가오는 시험" link="/exams" />
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {upcomingExams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
//               </div>
//             </section>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function SectionHeader({ title, link }: { title: string; link: string }) {
//   return (
//     <div className="flex justify-between items-center mb-6">
//       <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
//       <Link to={link} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-semibold">
//         전체보기 <ArrowRight className="w-4 h-4" />
//       </Link>
//     </div>
//   );
// }

// function StatCard({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs font-bold text-gray-400 uppercase mb-1">{title}</p>
//           <p className="text-3xl font-bold text-gray-900">{count}</p>
//         </div>
//         <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>{icon}</div>
//       </div>
//     </div>
//   );
// }

////////////////////////////////////////////////

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ExamCard } from '../components/ExamCard';
import { Exam, ExamCategory, ExamStatus } from '../types/exam';
import { Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { certApi } from '../api/certApi';

// 백엔드 ExamListResponseDTO 규격에 맞춘 인터페이스
interface ExamListResponseDTO {
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

// 백엔드 ExamCountResponseDTO 규격과 1:1 매칭
interface ExamCountResponseDTO {
  totalCount: number;
  activeCount: number;
  upcomingCount: number;
}

// 백엔드 전체 응답 구조
interface ExamSummaryResponse {
  counts: ExamCountResponseDTO;
  activeExams: ExamListResponseDTO[];
  upcomingExams: ExamListResponseDTO[];
}

export default function Home() {
  const { getExamSummary } = certApi();

  // 상태 관리
  const [stats, setStats] = useState<ExamCountResponseDTO>({
    totalCount: 0,
    upcomingCount: 0,
    activeCount: 0
  });
  const [currentDate] = useState(new Date()); // 오늘 날짜
  const [activeApplications, setActiveApplications] = useState<Exam[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 백엔드 DTO를 프론트엔드 Exam 타입으로 변환하는 함수
  const mapDTOToExam = (dto: ExamListResponseDTO, status: string): any => ({
    itemCode: dto.itemCode,
    itemName: dto.itemName,
    category: dto.largeFieldName,
    type: dto.type, 
    startDate: dto.startDate,
    endDate: dto.endDate,
    description: dto.description,
    status: status,
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        const data: ExamSummaryResponse = await getExamSummary();
        console.log("백엔드에서 온 생데이터:", data);
        if (data && data.counts) {
          setStats(data.counts);
          
          if (data.activeExams) {
            console.log("접수 중 시험 데이터:", data.activeExams);
            setActiveApplications(
              data.activeExams.map(dto => mapDTOToExam(dto, '접수중'))
            );
          }

          if (data.upcomingExams) {
            console.log("접수 예정 시험 데이터:", data.upcomingExams);
            setUpcomingExams(
              data.upcomingExams.map(dto => mapDTOToExam(dto, '접수예정'))
            );
          }
        }
      } catch (error) {
        console.error('홈 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">국가시험 일정 관리 시스템</h1>
        <p className="text-blue-100 opacity-90">종목별 상세 직무 분야와 실시간 시험 일정을 확인하세요</p>
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm">
          오늘 날짜: {format(currentDate, 'yyyy. MM. d (EEEE)', { locale: ko })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="전체 시험"
          count={stats.totalCount}
          icon={<Calendar className="text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="접수 중"
          count={stats.activeCount}
          icon={<Clock className="text-orange-600" />}
          color="bg-orange-100"
        />
        <StatCard
          title="접수 예정"
          count={stats.upcomingCount}
          icon={<TrendingUp className="text-green-600" />}
          color="bg-green-100"
        />
      </div>

      {!isLoading && (
        <div className="space-y-12">

          <section>
            <SectionHeader title="접수 중" link="/exams?status=active" />
            {activeApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeApplications.map(exam => (
                  <ExamCard key={`${exam.itemCode}-${exam.type}`} exam={exam} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Clock className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-lg font-medium">현재 접수 중인 시험이 없습니다.</p>
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="접수 예정" link="/exams?status=upcoming" />
            {upcomingExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingExams.map(exam => (
                  <ExamCard key={`${exam.itemCode}-${exam.type}`} exam={exam} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Clock className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-lg font-medium">접수 예정인 시험이 없습니다.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}


function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <Link to={link} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-semibold">
        전체보기 <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function StatCard({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>{icon}</div>
      </div>
    </div>
  );
}