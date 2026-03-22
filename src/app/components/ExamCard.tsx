import { Link } from 'react-router';
import { Exam } from '../types/exam';
import { Calendar, Clock, Star, Info, ChevronRight } from 'lucide-react';
import { format, isWithinInterval, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
  const isFavorite = isFavoriteExam(exam.id);
  const today = new Date('2026-03-23');

  // 1. 필기/실기 표시 우선순위 판단 로직
  const getDisplayInfo = () => {
    const isPracticalActive = isWithinInterval(today, {
      start: new Date(exam.practicalRegStart),
      end: new Date(exam.practicalExamEnd)
    });

    // 오늘이 실기 접수~시험 기간에 포함된다면 실기 위주 노출
    if (isPracticalActive || isAfter(today, new Date(exam.writtenExamEnd))) {
      return {
        mode: '실기',
        regLabel: '실기시험 원서접수 기간',
        examLabel: '실기시험 기간',
        passLabel: '실기 합격 발표일',
        regStart: exam.practicalRegStart,
        regEnd: exam.practicalRegEnd,
        examStart: exam.practicalExamStart,
        examEnd: exam.practicalExamEnd,
        passDate: exam.practicalPassDate,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      };
    }

    // 기본값: 필기 정보 노출
    return {
      mode: '필기',
      regLabel: '필기시험 원서접수 기간',
      examLabel: '필기시험 기간',
      passLabel: '필기 합격 발표일',
      regStart: exam.writtenRegStart,
      regEnd: exam.writtenRegEnd,
      examStart: exam.writtenExamStart,
      examEnd: exam.writtenExamEnd,
      passDate: exam.writtenPassDate,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    };
  };

  const info = getDisplayInfo();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (user) toggleFavoriteExam(exam.id);
  };

  return (
    <Link to={`/exam/${exam.id}`} className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all relative">
      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-wrap gap-2">
          {/* 대직무 | 중직무 필드 표시 */}
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-blue-100 bg-blue-50 text-blue-700">
            {exam.category} | {exam.mediumCategory}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-green-100 text-green-700">
            {exam.status}
          </span>
        </div>
        {user && (
          <button onClick={handleFavoriteClick} className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-yellow-50 text-yellow-500' : 'text-gray-300 hover:bg-gray-100'}`}>
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
        {exam.name}
      </h3>

      <div className="space-y-4">
        {/* 시험 기간 */}
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-1.5 ${info.bgColor} rounded-lg`}>
            <Calendar className={`w-4 h-4 ${info.color}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{info.examLabel}</p>
            <p className="text-sm font-bold text-gray-700">
              {format(new Date(info.examStart), 'MM. dd')} ~ {format(new Date(info.examEnd), 'MM. dd')}
            </p>
          </div>
        </div>

        {/* 접수 기간 */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-orange-50 rounded-lg">
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{info.regLabel}</p>
            <p className="text-sm font-bold text-gray-700">
              {format(new Date(info.regStart), 'MM. dd')} ~ {format(new Date(info.regEnd), 'MM. dd')}
            </p>
          </div>
        </div>

        {/* 합격 발표일 정보 추가 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2 text-[11px]">
          <span className="text-gray-400 font-medium">{info.passLabel}</span>
          <span className="text-gray-900 font-bold">{format(new Date(info.passDate), 'yyyy. MM. dd')}</span>
        </div>
      </div>

      {/* 설명 (백엔드 데이터 기반) */}
      {exam.description && (
        <div className="mt-5 p-3 bg-gray-50 rounded-xl flex gap-2 items-start">
          <Info className="w-3.5 h-3.5 text-gray-300 mt-0.5" />
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 italic">
            "{exam.description}"
          </p>
        </div>
      )}
      
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5 text-blue-600" />
      </div>
    </Link>
  );
}