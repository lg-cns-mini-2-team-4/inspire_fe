import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ExamCard } from '../components/ExamCard';
import { Exam, ExamCategory, ExamStatus } from '../types/exam';
import { Search, Filter, Calendar as CalendarIcon, List as ListIcon, Loader2, RotateCcw } from 'lucide-react';

// 1. 최신 백엔드 DTO 규격 반영
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

export default function ExamList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL 파라미터 기반 초기 필터 설정
  const initialStatus = (searchParams.get('status') as ExamStatus) || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>(initialStatus);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  // 오늘 날짜 기준 (프로젝트 기준일: 2026-03-23)
  const today = new Date('2026-03-23');

  // 2. 실시간 상태 계산 로직 (DTO 기반)
  const calculateStatus = (dto: ScheduleActiveResponseDTO): ExamStatus => {
    const regStart = new Date(dto.writtenRegStart);
    const regEnd = new Date(dto.writtenRegEnd);
    const examEnd = new Date(dto.practicalExamEnd || dto.writtenExamEnd);

    if (today < regStart) return '접수예정';
    if (today >= regStart && today <= regEnd) return '접수중';
    if (today > regEnd && today <= examEnd) return '접수마감';
    return '시험완료';
  };

  // 3. 통합 컨트롤러 엔드포인트 연동
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        // 컨트롤러의 @RequestMapping("/certificate-service") 반영
        // status가 '접수중'일 때만 파라미터 전달하여 백엔드 필터링 활용
        const statusParam = selectedStatus === '접수중' ? '?status=접수중' : '';
        const response = await fetch(`http://localhost:8080/certificate-service/exams${statusParam}`);
        
        if (!response.ok) throw new Error('데이터 로딩 실패');
        const data: ScheduleActiveResponseDTO[] = await response.json();

        const mappedExams: Exam[] = data.map(dto => ({
          id: dto.itemCode,
          name: dto.itemName,
          category: dto.largeFieldName as ExamCategory,
          mediumCategory: dto.mediumFieldName, // 중직무분야 추가
          status: calculateStatus(dto),
          description: dto.description,
          // 10종 날짜 매핑
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
          // 호환용 데이터
          testDate: dto.writtenExamStart,
          applicationStartDate: dto.writtenRegStart,
          applicationEndDate: dto.writtenRegEnd,
        }));

        setExams(mappedExams);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [selectedStatus]); // 상태 필터 변경 시 재호출 (백엔드 /exams 로직 활용)

  const handleStatusChange = (status: ExamStatus | 'all') => {
    setSelectedStatus(status);
    if (status === 'all') searchParams.delete('status');
    else searchParams.set('status', status);
    setSearchParams(searchParams);
  };

  // 클라이언트 측 필터링 (검색어, 카테고리, 정렬)
  const filteredExams = useMemo(() => {
    let result = [...exams];
    if (searchQuery) {
      result = result.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== 'all') {
      result = result.filter(e => e.category === selectedCategory);
    }
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [exams, searchQuery, selectedCategory, sortBy]);

  const categories: Array<ExamCategory | 'all'> = ['all', '기술/기능', '공무원', '교육', '의료', '금융', '법률', '기타'];
  const statuses: Array<ExamStatus | 'all'> = ['all', '접수예정', '접수중', '접수마감', '시험완료'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">시험 일정 목록</h1>
          <p className="text-gray-500 mt-2 font-medium">
            {isLoading ? '최신 정보를 동기화 중...' : `총 ${filteredExams.length}개의 국가자격 시험이 검색되었습니다`}
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><CalendarIcon className="w-5 h-5" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><ListIcon className="w-5 h-5" /></button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="찾으시는 자격증 명칭을 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterSelect label="직무 분야" value={selectedCategory} options={categories} onChange={(v) => setSelectedCategory(v as any)} />
          <FilterSelect label="현재 상태" value={selectedStatus} options={statuses} onChange={(v) => handleStatusChange(v as any)} />
          <FilterSelect label="정렬 순서" value={sortBy} options={['date', 'name']} onChange={(v) => setSortBy(v as any)} isSort />
        </div>
      </div>

      {/* 결과 영역 */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
          <p className="font-bold">데이터를 불러오고 있습니다</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
          <p className="text-gray-400 font-medium">검색 결과가 없습니다.</p>
          <button onClick={() => {setSearchQuery(''); handleStatusChange('all'); setSelectedCategory('all');}} className="mt-4 text-blue-600 flex items-center gap-1 mx-auto hover:underline"><RotateCcw className="w-4 h-4" /> 필터 초기화</button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredExams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange, isSort = false }: { label: string, value: string, options: string[], onChange: (v: string) => void, isSort?: boolean }) {
  return (
    <div>
      <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1.5 block tracking-widest">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-blue-500 shadow-sm text-sm font-semibold text-gray-700"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {isSort ? (opt === 'date' ? '시험일 빠른 순' : '이름순') : (opt === 'all' ? `전체` : opt)}
          </option>
        ))}
      </select>
    </div>
  );
}