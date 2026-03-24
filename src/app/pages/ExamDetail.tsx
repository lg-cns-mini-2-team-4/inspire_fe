import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  Calendar,
  Building2,
  ArrowLeft,
  CheckCircle,
  Star,
  Info,
  Clock,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import certApi from '../api/certApi';

// 백엔드 DTO 규격 정의
interface ScheduleInfo {
  implYear: string;
  implSeq: number;
  description: string;
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
}

interface CertificateWithSchedulesDTO {
  itemCode: string;
  itemName: string;
  certTypeName: string;
  seriesName: string;
  largeFieldName: string;
  mediumFieldName: string;
  schedules: ScheduleInfo[];
}

export default function ExamDetail() {
  const { id } = useParams(); // itemCode
  const { user, toggleFavoriteExam, isFavoriteExam } = useAuth();
  const [data, setData] = useState<CertificateWithSchedulesDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFavorite = id ? isFavoriteExam(id) : false;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        // 컨트롤러 7번 엔드포인트 호출: /{itemCode}/detail
        const response = await fetch(`http://localhost:8080/certificate-service/${id}/detail`);
        if (!response.ok) throw new Error('데이터를 가져올 수 없습니다.');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleFavoriteClick = () => {
    if (user && data) toggleFavoriteExam(data.itemCode);
  };

  if (isLoading) return <div className="py-20 text-center text-gray-500 font-bold">상세 정보를 불러오는 중...</div>;

  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-4">시험 정보를 찾을 수 없습니다.</p>
        <Link to="/exams" className="text-blue-600 hover:underline flex items-center justify-center gap-1 font-semibold">
          <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 뒤로가기 */}
      <Link to="/exams" className="inline-flex items-center text-gray-500 hover:text-blue-600 gap-2 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
      </Link>

      {/* 상단 헤더 카드: 자격증 기본 정보 */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold border border-white/20">
                {data.largeFieldName} | {data.mediumFieldName}
              </span>
              <span className="px-3 py-1 bg-blue-400/30 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10">
                {data.certTypeName}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black mb-3">{data.itemName}</h1>
                <p className="text-blue-100 flex items-center gap-2 font-medium">
                  <Award className="w-4 h-4" /> {data.seriesName} 계열 국가기술자격
                </p>
              </div>
              {user && (
                <button
                  onClick={handleFavoriteClick}
                  className={`p-4 rounded-2xl transition-all ${
                    isFavorite ? 'bg-yellow-400 text-yellow-900 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Star className={`w-7 h-7 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 하단 섹션: 각 회차별 시험 일정 (ScheduleInfo 리스트) */}
        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            연간 시행 일정
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {data.schedules.map((schedule, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h3 className="text-xl font-black text-gray-800">
                    {schedule.implYear}년 제 {schedule.implSeq}회 정기시험
                  </h3>
                  <div className="px-4 py-1.5 bg-white rounded-full border border-gray-200 text-sm font-bold text-blue-600 shadow-sm">
                    {schedule.description}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* 필기 일정 섹션 */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-black text-blue-600 uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4" /> 필기시험 (Written)
                    </h4>
                    <div className="space-y-3 bg-white p-5 rounded-xl shadow-sm">
                      <DateRow label="원서 접수" start={schedule.writtenRegStart} end={schedule.writtenRegEnd} />
                      <DateRow label="시험 시행" start={schedule.writtenExamStart} end={schedule.writtenExamEnd} highlight />
                      <DateRow label="합격 발표" start={schedule.writtenPassDate} isSingle />
                    </div>
                  </div>

                  {/* 실기 일정 섹션 */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-black text-purple-600 uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4" /> 실기시험 (Practical)
                    </h4>
                    <div className="space-y-3 bg-white p-5 rounded-xl shadow-sm">
                      <DateRow label="원서 접수" start={schedule.practicalRegStart} end={schedule.practicalRegEnd} />
                      <DateRow label="시험 시행" start={schedule.practicalExamStart} end={schedule.practicalExamEnd} highlight color="text-purple-600" />
                      <DateRow label="최종 발표" start={schedule.practicalPassDate} isSingle />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="bg-blue-50 p-6 rounded-2xl flex gap-4 items-start border border-blue-100">
        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 leading-relaxed">
          <p className="font-bold mb-1">안내사항</p>
          <p className="opacity-80">
            위 일정은 주관 기관의 사정에 따라 변경될 수 있습니다. 정확한 접수 가능 시간과 장소는 접수 당일 공식 홈페이지(Q-Net 등)를 통해 다시 한번 확인하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}

// 날짜 행 렌더링을 위한 헬퍼 컴포넌트
function DateRow({ label, start, end, isSingle = false, highlight = false, color = "text-blue-600" }: { label: string, start: string, end?: string, isSingle?: boolean, highlight?: boolean, color?: string }) {
  if (!start) return null;
  
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className={`font-bold ${highlight ? color : 'text-gray-800'}`}>
        {isSingle 
          ? format(new Date(start), 'yyyy. MM. dd') 
          : `${format(new Date(start), 'MM. dd')} ~ ${format(new Date(end!), 'MM. dd')}`
        }
      </span>
    </div>
  );
}