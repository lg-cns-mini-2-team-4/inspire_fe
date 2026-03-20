// import { Link } from 'react-router';
// import { Exam } from '../types/exam';
// import { Calendar, MapPin, Building2, Clock, Star } from 'lucide-react';
// import { format } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import { useAuth } from '../context/AuthContext';

// interface ExamCardProps {
//   exam: Exam;
// }

// export function ExamCard({ exam }: ExamCardProps) {
//   const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
//   const isFavorite = isFavoriteExam(exam.id);

//   const handleFavoriteClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (user) {
//       toggleFavoriteExam(exam.id);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case '접수예정':
//         return 'bg-gray-100 text-gray-700';
//       case '접수중':
//         return 'bg-green-100 text-green-700';
//       case '접수마감':
//         return 'bg-orange-100 text-orange-700';
//       case '시험완료':
//         return 'bg-blue-100 text-blue-700';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case '공무원':
//         return 'bg-blue-50 text-blue-700 border-blue-200';
//       case '교육':
//         return 'bg-purple-50 text-purple-700 border-purple-200';
//       case '의료':
//         return 'bg-red-50 text-red-700 border-red-200';
//       case '기술/기능':
//         return 'bg-green-50 text-green-700 border-green-200';
//       case '금융':
//         return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//       case '법률':
//         return 'bg-indigo-50 text-indigo-700 border-indigo-200';
//       default:
//         return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   return (
//     <Link
//       to={`/exam/${exam.id}`}
//       className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-2">
//             <span
//               className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(
//                 exam.category
//               )}`}
//             >
//               {exam.category}
//             </span>
//             <span
//               className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
//                 exam.status
//               )}`}
//             >
//               {exam.status}
//             </span>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             {exam.name}
//           </h3>
//         </div>
//         {user && (
//           <button
//             onClick={handleFavoriteClick}
//             className={`p-2 rounded-full transition-colors ${
//               isFavorite
//                 ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
//                 : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
//             }`}
//             title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
//           >
//             <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
//           </button>
//         )}
//       </div>

//       <div className="space-y-2 text-sm text-gray-600">
//         <div className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-gray-400" />
//           <span>
//             시험일: {format(new Date(exam.testDate), 'yyyy년 M월 d일 (E)', { locale: ko })}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Clock className="w-4 h-4 text-gray-400" />
//           <span>
//             접수: {format(new Date(exam.applicationStartDate), 'M/d', { locale: ko })} ~{' '}
//             {format(new Date(exam.applicationEndDate), 'M/d', { locale: ko })}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Building2 className="w-4 h-4 text-gray-400" />
//           <span>{exam.organizationName}</span>
//         </div>
//         {exam.location && (
//           <div className="flex items-center gap-2">
//             <MapPin className="w-4 h-4 text-gray-400" />
//             <span>{exam.location}</span>
//           </div>
//         )}
//       </div>

//       {exam.description && (
//         <p className="mt-4 text-sm text-gray-600 line-clamp-2">
//           {exam.description}
//         </p>
//       )}
//     </Link>
//   );
// }

import { Link } from 'react-router';
import { Exam } from '../types/exam';
import { Calendar, MapPin, Building2, Clock, Star, BookOpen } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
  const isFavorite = isFavoriteExam(exam.id);

  // 현재 기준 날짜 (프로젝트 기준일인 2026-03-13으로 설정하거나 new Date() 사용)
  const today = new Date('2026-03-13');

  // 실기 접수 기간 내에 있는지 확인
  const isPracticalPhase = isWithinInterval(today, {
    start: new Date(exam.practicalRegStart),
    end: new Date(exam.practicalExamEnd),
  });

  // 표시할 데이터 설정 (실기 vs 필기)
  const displayInfo = isPracticalPhase 
    ? {
        regLabel: '실기시험 원서접수 기간',
        examLabel: '실기시험 기간',
        regStart: exam.practicalRegStart,
        regEnd: exam.practicalRegEnd,
        examStart: exam.practicalExamStart,
        examEnd: exam.practicalExamEnd,
        iconColor: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
      }
    : {
        regLabel: '필기시험 원서접수 기간',
        examLabel: '필기시험 기간',
        regStart: exam.writtenRegStart,
        regEnd: exam.writtenRegEnd,
        examStart: exam.writtenExamStart,
        examEnd: exam.writtenExamEnd,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) toggleFavoriteExam(exam.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수예정': return 'bg-gray-100 text-gray-700';
      case '접수중': return 'bg-green-100 text-green-700';
      case '접수마감': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '공무원': 'bg-blue-50 text-blue-700 border-blue-200',
      '기술/기능': 'bg-green-50 text-green-700 border-green-200',
      '의료': 'bg-red-50 text-red-700 border-red-200',
      '교육': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDateRange = (start: string, end: string) => {
    return `${format(new Date(start), 'MM.dd')} ~ ${format(new Date(end), 'MM.dd')}`;
  };

  const formatDateWithDay = (start: string, end: string) => {
    return `${format(new Date(start), 'yyyy.MM.dd(E)', { locale: ko })} ~ ${format(new Date(end), 'MM.dd(E)', { locale: ko })}`;
  };

  return (
    <Link
      to={`/exam/${exam.id}`}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${getCategoryColor(exam.category)}`}>
            {exam.category}
          </span>
          <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${getStatusColor(exam.status)}`}>
            {exam.status}
          </span>
        </div>
        {user && (
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold text-blue-600 mb-6 group-hover:text-blue-800 transition-colors">
        {exam.name}
      </h3>

      <div className="space-y-4 text-sm text-gray-600">
        {/* 시험 기간 (필기/실기 동적) */}
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-1.5 ${displayInfo.bgColor} rounded-lg`}>
            <BookOpen className={`w-4 h-4 ${displayInfo.iconColor}`} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{displayInfo.examLabel}</p>
            <p className="font-semibold text-gray-700">
              {formatDateWithDay(displayInfo.examStart, displayInfo.examEnd)}
            </p>
          </div>
        </div>

        {/* 원서접수 기간 (필기/실기 동적) */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-orange-50 rounded-lg">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{displayInfo.regLabel}</p>
            <p className="font-semibold text-gray-700">
              {formatDateRange(displayInfo.regStart, displayInfo.regEnd)}
            </p>
          </div>
        </div>

        {/* 하단 시행 정보 */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">|</span>
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700 truncate">{exam.location || '전국 고사장'}</span>
        </div>
      </div>

      {/* 설명 박스 */}
      {exam.description && (
        <div className="mt-5 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {exam.description}
          </p>
        </div>
      )}
    </Link>
  );
}