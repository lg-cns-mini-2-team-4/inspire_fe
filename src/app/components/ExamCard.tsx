import { Link } from 'react-router';
import { Exam } from '../types/exam';
import { Calendar, MapPin, Building2, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
  const isFavorite = isFavoriteExam(exam.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleFavoriteExam(exam.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수예정':
        return 'bg-gray-100 text-gray-700';
      case '접수중':
        return 'bg-green-100 text-green-700';
      case '접수마감':
        return 'bg-orange-100 text-orange-700';
      case '시험완료':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공무원':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '교육':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '의료':
        return 'bg-red-50 text-red-700 border-red-200';
      case '기술/기능':
        return 'bg-green-50 text-green-700 border-green-200';
      case '금융':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case '법률':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Link
      to={`/exam/${exam.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(
                exam.category
              )}`}
            >
              {exam.category}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                exam.status
              )}`}
            >
              {exam.status}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {exam.name}
          </h3>
        </div>
        {user && (
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            시험일: {format(new Date(exam.testDate), 'yyyy년 M월 d일 (E)', { locale: ko })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            접수: {format(new Date(exam.applicationStartDate), 'M/d', { locale: ko })} ~{' '}
            {format(new Date(exam.applicationEndDate), 'M/d', { locale: ko })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span>{exam.organizationName}</span>
        </div>
        {exam.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{exam.location}</span>
          </div>
        )}
      </div>

      {exam.description && (
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {exam.description}
        </p>
      )}
    </Link>
  );
}