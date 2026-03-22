import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ExamCard } from '../components/ExamCard';
import { Exam, ExamCategory, ExamStatus } from '../types/exam';
import { Calendar, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ScheduleActiveResponseDTO {
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  mediumFieldName: string;
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  writtenPassDate: string;
  practicalRegStart: string;
  practicalRegEnd: string;
  practicalExamStart: string;
  practicalExamEnd: string;
  practicalPassDate: string;
  description: string;
}

interface StatsResponseDTO {
  totalCount: number;
  upcomingCount: number;
  activeCount: number;
  completedCount: number;
}

export default function Home() {
  const [currentDate] = useState(new Date('2026-03-23')); // 오늘 날짜
  const [activeApplications, setActiveApplications] = useState<Exam[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<StatsResponseDTO>({
    totalCount: 0, upcomingCount: 0, activeCount: 0, completedCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const mapDtoToExam = (dto: ScheduleActiveResponseDTO, status: string): Exam => ({
    id: dto.itemCode,
    name: dto.itemName,
    category: dto.largeFieldName as ExamCategory,
    mediumCategory: dto.mediumFieldName,
    status: status as ExamStatus,
    writtenRegStart: dto.writtenRegStart,
    writtenRegEnd: dto.writtenRegEnd,
    writtenExamStart: dto.writtenExamStart,
    writtenExamEnd: dto.writtenExamEnd,
    writtenPassDate: dto.writtenPassDate,
    practicalRegStart: dto.practicalRegStart,
    practicalRegEnd: dto.practicalRegEnd,
    practicalExamStart: dto.practicalExamStart,
    practicalExamEnd: dto.practicalExamEnd,
    practicalPassDate: dto.practicalPassDate,
    description: dto.description,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // 통합 컨트롤러 엔드포인트로 호출
        const [activeRes, upcomingRes, statsRes] = await Promise.all([
          fetch('http://localhost:8080/certificate-service/active'),
          fetch('http://localhost:8080/certificate-service/upcoming'),
          fetch('http://localhost:8080/certificate-service/status-counts')
        ]);

        const activeData = await activeRes.json();
        const upcomingData = await upcomingRes.json();
        const statsData = await statsRes.json();

        setActiveApplications(activeData.map((dto: any) => mapDtoToExam(dto, '접수중')));
        setUpcomingExams(upcomingData.map((dto: any) => mapDtoToExam(dto, '접수예정')));
        setStats(statsData);
      } catch (error) {
        console.error('API Fetch Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="전체 시험" count={stats.totalCount} icon={<Calendar className="text-blue-600" />} color="bg-blue-100" />
        <StatCard title="접수 예정" count={stats.upcomingCount} icon={<TrendingUp className="text-green-600" />} color="bg-green-100" />
        <StatCard title="접수 중" count={stats.activeCount} icon={<Clock className="text-orange-600" />} color="bg-orange-100" />
        <StatCard title="접수 종료" count={stats.completedCount} icon={<CheckCircle className="text-purple-600" />} color="bg-purple-100" />
      </div>

      {!isLoading && (
        <div className="space-y-12">
          {activeApplications.length > 0 && (
            <section>
              <SectionHeader title="현재 접수 중인 시험" link="/exams?status=접수중" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeApplications.map(exam => <ExamCard key={exam.id} exam={exam} />)}
              </div>
            </section>
          )}
          {upcomingExams.length > 0 && (
            <section>
              <SectionHeader title="다가오는 시험" link="/exams" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingExams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
              </div>
            </section>
          )}
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