// import { useState, useMemo, useEffect } from 'react';
// import { useSearchParams } from 'react-router';
// import { ExamCard } from '../components/ExamCard';
// import { Exam, ExamCategory, ExamStatus } from '../types/exam';
// import { Search, Filter, Calendar as CalendarIcon, List as ListIcon, Loader2, RotateCcw } from 'lucide-react';

// // 1. 최신 백엔드 DTO 규격 반영
// interface ScheduleActiveResponseDTO {
//   itemCode: string;
//   itemName: string;
//   largeFieldName: string;
//   mediumFieldName: string;
//   writtenRegStart: string;
//   writtenRegEnd: string;
//   writtenExamStart: string;
//   writtenExamEnd: string;
//   writtenPassDate: string;
//   practicalRegStart: string;
//   practicalRegEnd: string;
//   practicalExamStart: string;
//   practicalExamEnd: string;
//   practicalPassDate: string;
//   description: string;
// }

// export default function ExamList() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // URL 파라미터 기반 초기 필터 설정
//   const initialStatus = (searchParams.get('status') as ExamStatus) || 'all';
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
//   const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>(initialStatus);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

//   // 오늘 날짜 기준 (프로젝트 기준일: 2026-03-23)
//   const today = new Date('2026-03-23');

//   // 2. 실시간 상태 계산 로직 (DTO 기반)
//   const calculateStatus = (dto: ScheduleActiveResponseDTO): ExamStatus => {
//     const regStart = new Date(dto.writtenRegStart);
//     const regEnd = new Date(dto.writtenRegEnd);
//     const examEnd = new Date(dto.practicalExamEnd || dto.writtenExamEnd);

//     if (today < regStart) return '접수예정';
//     if (today >= regStart && today <= regEnd) return '접수중';
//     if (today > regEnd && today <= examEnd) return '접수마감';
//     return '시험완료';
//   };

//   // 3. 통합 컨트롤러 엔드포인트 연동
//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         setIsLoading(true);
//         // 컨트롤러의 @RequestMapping("/certificate-service") 반영
//         // status가 '접수중'일 때만 파라미터 전달하여 백엔드 필터링 활용
//         const statusParam = selectedStatus === '접수중' ? '?status=접수중' : '';
//         const response = await fetch(`http://localhost:8080/certificate-service/exams${statusParam}`);

//         if (!response.ok) throw new Error('데이터 로딩 실패');
//         const data: ScheduleActiveResponseDTO[] = await response.json();

//         const mappedExams: Exam[] = data.map(dto => ({
//           id: dto.itemCode,
//           name: dto.itemName,
//           category: dto.largeFieldName as ExamCategory,
//           mediumCategory: dto.mediumFieldName, // 중직무분야 추가
//           status: calculateStatus(dto),
//           description: dto.description,
//           // 10종 날짜 매핑
//           writtenRegStart: dto.writtenRegStart,
//           writtenRegEnd: dto.writtenRegEnd,
//           writtenExamStart: dto.writtenExamStart,
//           writtenExamEnd: dto.writtenExamEnd,
//           writtenPassDate: dto.writtenPassDate,
//           practicalRegStart: dto.practicalRegStart,
//           practicalRegEnd: dto.practicalRegEnd,
//           practicalExamStart: dto.practicalExamStart,
//           practicalExamEnd: dto.practicalExamEnd,
//           practicalPassDate: dto.practicalPassDate,
//           // 호환용 데이터
//           testDate: dto.writtenExamStart,
//           applicationStartDate: dto.writtenRegStart,
//           applicationEndDate: dto.writtenRegEnd,
//         }));

//         setExams(mappedExams);
//       } catch (error) {
//         console.error('API Error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchExams();
//   }, [selectedStatus]); // 상태 필터 변경 시 재호출 (백엔드 /exams 로직 활용)

//   const handleStatusChange = (status: ExamStatus | 'all') => {
//     setSelectedStatus(status);
//     if (status === 'all') searchParams.delete('status');
//     else searchParams.set('status', status);
//     setSearchParams(searchParams);
//   };

//   // 클라이언트 측 필터링 (검색어, 카테고리, 정렬)
//   const filteredExams = useMemo(() => {
//     let result = [...exams];
//     if (searchQuery) {
//       result = result.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
//     }
//     if (selectedCategory !== 'all') {
//       result = result.filter(e => e.category === selectedCategory);
//     }
//     if (sortBy === 'date') {
//       result.sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
//     } else {
//       result.sort((a, b) => a.name.localeCompare(b.name));
//     }
//     return result;
//   }, [exams, searchQuery, selectedCategory, sortBy]);

//   const categories: Array<ExamCategory | 'all'> = ['all', '기술/기능', '공무원', '교육', '의료', '금융', '법률', '기타'];
//   const statuses: Array<ExamStatus | 'all'> = ['all', '접수예정', '접수중', '접수마감', '시험완료'];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">시험 일정 목록</h1>
//           <p className="text-gray-500 mt-2 font-medium">
//             {isLoading ? '최신 정보를 동기화 중...' : `총 ${filteredExams.length}개의 국가자격 시험이 검색되었습니다`}
//           </p>
//         </div>
//         <div className="flex bg-gray-100 p-1 rounded-xl">
//           <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><CalendarIcon className="w-5 h-5" /></button>
//           <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}><ListIcon className="w-5 h-5" /></button>
//         </div>
//       </div>

//       {/* 필터 섹션 */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="찾으시는 자격증 명칭을 입력하세요..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FilterSelect label="직무 분야" value={selectedCategory} options={categories} onChange={(v) => setSelectedCategory(v as any)} />
//           <FilterSelect label="현재 상태" value={selectedStatus} options={statuses} onChange={(v) => handleStatusChange(v as any)} />
//           <FilterSelect label="정렬 순서" value={sortBy} options={['date', 'name']} onChange={(v) => setSortBy(v as any)} isSort />
//         </div>
//       </div>

//       {/* 결과 영역 */}
//       {isLoading ? (
//         <div className="py-32 flex flex-col items-center justify-center text-gray-400">
//           <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
//           <p className="font-bold">데이터를 불러오고 있습니다</p>
//         </div>
//       ) : filteredExams.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
//           <p className="text-gray-400 font-medium">검색 결과가 없습니다.</p>
//           <button onClick={() => {setSearchQuery(''); handleStatusChange('all'); setSelectedCategory('all');}} className="mt-4 text-blue-600 flex items-center gap-1 mx-auto hover:underline"><RotateCcw className="w-4 h-4" /> 필터 초기화</button>
//         </div>
//       ) : (
//         <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
//           {filteredExams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
//         </div>
//       )}
//     </div>
//   );
// }

// function FilterSelect({ label, value, options, onChange, isSort = false }: { label: string, value: string, options: string[], onChange: (v: string) => void, isSort?: boolean }) {
//   return (
//     <div>
//       <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1.5 block tracking-widest">{label}</label>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-blue-500 shadow-sm text-sm font-semibold text-gray-700"
//       >
//         {options.map(opt => (
//           <option key={opt} value={opt}>
//             {isSort ? (opt === 'date' ? '시험일 빠른 순' : '이름순') : (opt === 'all' ? `전체` : opt)}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
















import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ExamCard } from '../components/ExamCard';
import { Exam, ExamCategory, ExamStatus } from '../types/exam';
import { Search, Calendar as CalendarIcon, List as ListIcon, Loader2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { certApi } from '../api/certApi';
import { getDate } from '../util/dateUtil'

// 1. 백엔드 ExamListResponseDTO 규격 (제공해주신 Java DTO와 일치)
interface ExamListResponseDTO {
  id: number;
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

// 2. Spring Data Page 응답 규격
interface PageResponse {
  content: ExamListResponseDTO[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

export default function ExamList() {
  const [searchParams] = useSearchParams();
  const { getExams } = certApi(); // api/certApi.ts에 정의된 함수

  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 필터 상태 (URL 파라미터와 동기화)
  /*
  const [searchQuery, setSearchQuery] = useState(searchParams.get('itemName') || '');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>((searchParams.get('category') as any) || 'all');
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>((searchParams.get('status') as any) || 'all');
  */

  // 첫 로딩은 무조건 기준이 status
  const [itemName, setItemName] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [viewMode, setViewMode] = useState('grid');

  // paging
  const [page, setPage] = useState(0);
  const [pageResponse, setPageResponse] = useState<PageResponse | null>(null);
  const [sort, setSort] = useState<'endDate' | 'itemName'>('endDate');

  // size (기본값)
  const size = 12;

  // 3. Home.tsx와 동일한 매핑 로직 (status는 서버 필터 결과를 바탕으로 주입)
  const mapDTOToExam = (dto: ExamListResponseDTO): Exam => {
    // 현재 날짜 기준으로 상태를 다시 한번 확인하거나, 서버에서 필터링된 결과에 따라 할당
    const today = getDate(new Date()).getTime();
    const start = new Date(dto.startDate).getTime();
    const end = new Date(dto.endDate).getTime();

    let statusLabel: ExamStatus = '접수마감' as any;
    if (today < start) statusLabel = '접수예정';
    else if (today >= start && today <= end) statusLabel = '접수중';

    console.log(`today: ${today}`);
    console.log(`start: ${start}`);
    console.log(`end: ${end}`);
    console.log(`statusLabel: ${statusLabel}`);

    return {
      id: dto.id,
      itemCode: dto.itemCode,
      itemName: dto.itemName,
      category: dto.largeFieldName as ExamCategory,
      type: dto.type as any,
      startDate: dto.startDate,
      endDate: dto.endDate,
      description: dto.description,
      status: statusLabel,
    };
  };

  const getStatusMapper = (type: string) => {
    switch (type) {
      case '접수예정':
        return 'upcoming';
      case '접수중':
        return 'active';
      default:
        return '';
    }
  };


  // 4. 백엔드 통신 로직 (MainController @GetMapping("/exams") 연동)
  useEffect(() => {
    const fetchExamsData = async () => {
      try {
        setIsLoading(true);

        const response: PageResponse = await getExams({
          itemName, status, page, size, sort
        });

        console.log(response);

        if (response && response.content) {
          const mapped = response.content.map(dto => mapDTOToExam(dto));
          setExams(mapped);
          setPageResponse(response);
        }
      } catch (error) {
        console.error('시험 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 디바운스 등을 고려할 수 있으나 현재는 상태 변경 시 즉시 호출
    fetchExamsData();
  }, [status, itemName, page, size]);

  // 카테고리 리스트 (제공해주신 타입 기준)
  const categories: Array<ExamCategory | 'all'> = [
    'all', '경영.회계.사무', '금융', '교육.자연.과학.사회과학', '법률', '보건.의료',
    '사회복지.종교', '문화.예술.디자인.방송', '운전.운송', '영업.판매', '경비.청소',
    '이용.숙박.여행.오락.스포츠', '음식서비스', '건설', '기계', '재료', '화학',
    '섬유.의복', '전기.전자', '정보통신', '식품.가공', '인쇄.목재.가구.공예',
    '농림어업', '안전관리', '환경.에너지', '기타'
  ];

  const statuses: Array<ExamStatus | 'all'> = ['all', '접수중', '접수예정'];

  const goPrevPage = () => setPage(prev => prev - 1);
  const goNextPage = () => setPage(prev => prev + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">시험 일정 목록</h1>
          <p className="text-gray-500 mt-2 font-medium">
            {isLoading ? '최신 정보를 동기화 중...' : `총 ${exams.length}개의 시험이 검색되었습니다`}
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
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
              setPage(0);
            }}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-sans"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 직무 분야는 현재 노답임 */}
          <FilterSelect label="직무 분야" value={''} onChange={(v) => console.log(v)} options={categories} disabled />
          <FilterSelect label="진행 상태" value={status} options={statuses} onChange={(v) => setStatus(getStatusMapper(v))} />
          <FilterSelect label="정렬 방식" value={sort} options={['date', 'name']} onChange={(v) => setSort(v as any)} isSort />
        </div>
      </div>

      {/* 결과 영역 */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
          <p className="font-bold font-sans">데이터를 불러오고 있습니다</p>
        </div>
      ) : pageResponse?.empty ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
          <p className="text-gray-400 font-medium">조건에 맞는 시험 결과가 없습니다.</p>
          <button
            onClick={() => { setItemName(''); setStatus(''); }}
            className="mt-4 text-blue-600 flex items-center gap-1 mx-auto hover:underline font-bold font-sans">
            <RotateCcw className="w-4 h-4" /> 필터 초기화
          </button>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {exams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={goPrevPage}
              disabled={pageResponse?.first}
              className={`p-2 rounded-lg ${pageResponse?.first ? 'text-gray-300' : 'text-blue-600 hover:bg-gray-100'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-gray-700">{(pageResponse?.number || 0) + 1} / {pageResponse?.totalPages || 1}</span>
            <button
              onClick={goNextPage}
              disabled={pageResponse?.last}
              className={`p-2 rounded-lg ${pageResponse?.last ? 'text-gray-300' : 'text-blue-600 hover:bg-gray-100'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

function FilterSelect({ label, value, options, onChange, isSort = false, disabled = false }: { label: string, value: string, options: string[], onChange: (v: string) => void, isSort?: boolean, disabled?: boolean }) {
  return (
    <div>
      <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1.5 block tracking-widest">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-blue-500 shadow-sm text-sm font-bold text-gray-700 font-sans cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt} disabled={disabled}>
            {isSort ? (opt === 'date' ? '시험일 빠른 순' : '이름순') : (opt === 'all' ? `전체 ${label.split(' ')[0]}` : opt)}
          </option>
        ))}
      </select>
    </div>
  );
}