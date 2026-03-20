import { useParams, Link, useNavigate } from 'react-router';
import {
  Calendar, MapPin, Building2, ExternalLink, ArrowLeft,
  CheckCircle, FileText, Star, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

interface ScheduleInfo {
  implYear: string;
  implSeq: number;
  description: string;
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  writtenPassDate: string;
  practicalRegStart: string | null;
  practicalRegEnd: string | null;
  practicalExamStart: string | null;
  practicalExamEnd: string | null;
  practicalPassDate: string | null;
  officeName: string | null;
  examLocation: string | null;
}

interface CertificateDetail {
  itemCode: string;
  itemName: string;
  certTypeName: string;
  seriesName: string;
  largeFieldName: string;
  mediumFieldName: string;
  schedules: ScheduleInfo[];
}

export default function ExamDetail() {
  const { id } = useParams();
  const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
  const [exam, setExam] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const isFavorite = exam ? isFavoriteExam(exam.itemCode) : false;

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/api/certificates/${id}/detail`);
        if (!response.ok) throw new Error('not found');
        const data: CertificateDetail = await response.json();
        setExam(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleFavoriteClick = () => {
    if (user && exam) toggleFavoriteExam(exam.itemCode);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg mb-4">시험을 찾을 수 없습니다</p>
        <Link to="/exams" className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          시험 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const latestSchedule = exam.schedules[0];

  return (
    <div className="space-y-6">
      <Link to="/exams" className="inline-flex items-center text-blue-600 hover:text-blue-700 gap-1">
        <ArrowLeft className="w-4 h-4" />
        시험 목록으로 돌아가기
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded text-sm font-medium border bg-green-50 text-green-700 border-green-200">
                  {exam.certTypeName}
                </span>
                <span className="px-3 py-1 rounded text-sm font-medium bg-blue-50 text-blue-700">
                  {exam.seriesName}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{exam.itemName}</h1>
              {latestSchedule && (
                <p className="text-blue-100">{latestSchedule.description}</p>
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
              >
                <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 자격증 정보 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  자격증 정보
                </h2>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">대직무분야</span>
                    <span className="font-medium text-gray-900">{exam.largeFieldName}</span>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">중직무분야</span>
                    <span className="font-medium text-gray-900">{exam.mediumFieldName}</span>
                  </div>
                </div>
              </div>

              {/* 시험 일정 */}
              {latestSchedule && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    필기 시험 일정
                  </h2>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">원서접수</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(latestSchedule.writtenRegStart), 'yyyy.MM.dd')} ~ {format(new Date(latestSchedule.writtenRegEnd), 'yyyy.MM.dd')}
                      </span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">시험일</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(latestSchedule.writtenExamStart), 'yyyy.MM.dd')} ~ {format(new Date(latestSchedule.writtenExamEnd), 'yyyy.MM.dd')}
                      </span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">합격 발표</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(latestSchedule.writtenPassDate), 'yyyy.MM.dd')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 실기 일정 */}
            <div className="space-y-6">
              {latestSchedule?.practicalExamStart && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    실기 시험 일정
                  </h2>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    {latestSchedule.practicalRegStart && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">원서접수</span>
                          <span className="font-medium text-gray-900">
                            {format(new Date(latestSchedule.practicalRegStart), 'yyyy.MM.dd')} ~ {format(new Date(latestSchedule.practicalRegEnd!), 'yyyy.MM.dd')}
                          </span>
                        </div>
                        <div className="border-t border-gray-200"></div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">시험일</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(latestSchedule.practicalExamStart), 'yyyy.MM.dd')} ~ {format(new Date(latestSchedule.practicalExamEnd!), 'yyyy.MM.dd')}
                      </span>
                    </div>
                    {latestSchedule.practicalPassDate && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">합격 발표</span>
                          <span className="font-medium text-gray-900">
                            {format(new Date(latestSchedule.practicalPassDate), 'yyyy.MM.dd')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 시험장소 */}
              {latestSchedule?.examLocation && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    시험 장소
                  </h2>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    {latestSchedule.officeName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">지사명</span>
                        <span className="font-medium text-gray-900">{latestSchedule.officeName}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{latestSchedule.examLocation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}