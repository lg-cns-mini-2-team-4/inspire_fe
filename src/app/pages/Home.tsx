import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { mockExams } from '../data/mockExams';
import { ExamCard } from '../components/ExamCard';
import {
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Home() {
  const [currentDate] = useState(new Date('2026-03-13'));

  const stats = useMemo(() => {
    const total = mockExams.length;
    const upcoming = mockExams.filter((exam) =>
      isAfter(new Date(exam.testDate), currentDate)
    ).length;
    const inProgress = mockExams.filter(
      (exam) => exam.status === '접수중'
    ).length;
    const completed = mockExams.filter(
      (exam) => exam.status === '시험완료'
    ).length;

    return { total, upcoming, inProgress, completed };
  }, [currentDate]);

  const upcomingExams = useMemo(() => {
    return mockExams
      .filter((exam) => isAfter(new Date(exam.testDate), currentDate))
      .sort(
        (a, b) =>
          new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
      )
      .slice(0, 3);
  }, [currentDate]);

  const activeApplications = useMemo(() => {
    return mockExams.filter((exam) => exam.status === '접수중');
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">국가시험 일정 관리 시스템</h1>
        <p className="text-blue-100 mb-6">
          모든 국가시험 정보를 한 곳에서 관리하세요
        </p>
        <div className="text-sm text-blue-100">
          오늘 날짜: {format(currentDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">전체 시험</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">예정된 시험</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.upcoming}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">접수중</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.inProgress}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">완료된 시험</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Applications */}
      {activeApplications.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              현재 접수중인 시험
            </h2>
            <Link
              to="/exams?status=접수중"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeApplications.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Exams */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">다가오는 시험</h2>
          <Link
            to="/exams"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            전체보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </div>
  );
}