import { useParams, Link, useNavigate } from 'react-router';
import { mockExams } from '../data/mockExams';
import {
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  FileText,
  Star,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

export default function ExamDetail() {
  const { id } = useParams();
  const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
  const exam = mockExams.find((e) => e.id === id);
  const isFavorite = exam ? isFavoriteExam(exam.id) : false;

  const handleFavoriteClick = () => {
    if (user && exam) {
      toggleFavoriteExam(exam.id);
    }
  };

  if (!exam) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg mb-4">시험을 찾을 수 없습니다</p>
        <Link
          to="/exams"
          className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          시험 목록으로 돌아가기
        </Link>
      </div>
    );
  }

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
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/exams"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        시험 목록으로 돌아가기
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium border ${getCategoryColor(
                    exam.category
                  )}`}
                >
                  {exam.category}
                </span>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {exam.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{exam.name}</h1>
              {exam.description && (
                <p className="text-blue-100">{exam.description}</p>
              )}
            </div>
            {user && (
              <button
                onClick={handleFavoriteClick}
                className={`p-3 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  시험 일정
                </h2>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">시험일</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(exam.testDate), 'yyyy년 M월 d일 (E)', {
                        locale: ko,
                      })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">접수 시작</span>
                    <span className="font-medium text-gray-900">
                      {format(
                        new Date(exam.applicationStartDate),
                        'yyyy년 M월 d일',
                        { locale: ko }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">접수 종료</span>
                    <span className="font-medium text-gray-900">
                      {format(
                        new Date(exam.applicationEndDate),
                        'yyyy년 M월 d일',
                        { locale: ko }
                      )}
                    </span>
                  </div>
                  {exam.resultDate && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">합격자 발표</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(exam.resultDate), 'yyyy년 M월 d일', {
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  주관 기관
                </h2>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {exam.organizationName}
                    </p>
                    {exam.website && (
                      <a
                        href={exam.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mt-1"
                      >
                        홈페이지 방문
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {exam.location && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-900">{exam.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {exam.subjects && exam.subjects.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    시험 과목
                  </h2>
                  <div className="space-y-2">
                    {exam.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exam.eligibility && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    응시 자격
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{exam.eligibility}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {exam.website && (
        <a
          href={exam.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
        >
          공식 홈페이지 방문
          <ExternalLink className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}