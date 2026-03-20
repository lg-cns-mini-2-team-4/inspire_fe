// import { useState, useMemo } from 'react';
// import { useSearchParams } from 'react-router';
// import { mockExams } from '../data/mockExams';
// import { ExamCard } from '../components/ExamCard';
// import { ExamCategory, ExamStatus } from '../types/exam';
// import { Search, Filter, Calendar as CalendarIcon, List } from 'lucide-react';

// export default function ExamList() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>(
//     'all'
//   );
//   const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>(
//     (searchParams.get('status') as ExamStatus) || 'all'
//   );
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

//   const categories: Array<ExamCategory | 'all'> = [
//     'all',
//     '공무원',
//     '교육',
//     '의료',
//     '기술/기능',
//     '금융',
//     '법률',
//     '기타',
//   ];

//   const statuses: Array<ExamStatus | 'all'> = [
//     'all',
//     '접수예정',
//     '접수중',
//     '접수마감',
//     '시험완료',
//   ];

//   const filteredExams = useMemo(() => {
//     let filtered = mockExams;

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (exam) =>
//           exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           exam.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Category filter
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter((exam) => exam.category === selectedCategory);
//     }

//     // Status filter
//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter((exam) => exam.status === selectedStatus);
//     }

//     // Sort
//     if (sortBy === 'date') {
//       filtered = filtered.sort(
//         (a, b) =>
//           new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
//       );
//     } else {
//       filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
//     }

//     return filtered;
//   }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">시험 목록</h1>
//           <p className="text-gray-600 mt-1">
//             총 {filteredExams.length}개의 시험이 있습니다
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setViewMode('grid')}
//             className={`p-2 rounded-lg border transition-colors ${
//               viewMode === 'grid'
//                 ? 'bg-blue-100 border-blue-300 text-blue-700'
//                 : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <CalendarIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => setViewMode('list')}
//             className={`p-2 rounded-lg border transition-colors ${
//               viewMode === 'list'
//                 ? 'bg-blue-100 border-blue-300 text-blue-700'
//                 : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <List className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="시험명 또는 주관기관 검색..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4">
//           {/* Category Filter */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <Filter className="w-4 h-4 inline mr-1" />
//               분야
//             </label>
//             <select
//               value={selectedCategory}
//               onChange={(e) =>
//                 setSelectedCategory(e.target.value as ExamCategory | 'all')
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? '전체 분야' : category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               상태
//             </label>
//             <select
//               value={selectedStatus}
//               onChange={(e) => {
//                 const status = e.target.value as ExamStatus | 'all';
//                 setSelectedStatus(status);
//                 if (status === 'all') {
//                   searchParams.delete('status');
//                 } else {
//                   searchParams.set('status', status);
//                 }
//                 setSearchParams(searchParams);
//               }}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {statuses.map((status) => (
//                 <option key={status} value={status}>
//                   {status === 'all' ? '전체 상태' : status}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sort */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               정렬
//             </label>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="date">시험일 순</option>
//               <option value="name">이름 순</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Results */}
//       {filteredExams.length === 0 ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//           <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">검색 결과가 없습니다</p>
//         </div>
//       ) : (
//         <div
//           className={
//             viewMode === 'grid'
//               ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//               : 'space-y-4'
//           }
//         >
//           {filteredExams.map((exam) => (
//             <ExamCard key={exam.id} exam={exam} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ExamCard } from '../components/ExamCard';
import { Exam, ExamCategory, ExamStatus } from '../types/exam';
import { Search, Filter, Calendar as CalendarIcon, List as ListIcon, Loader2 } from 'lucide-react';

// 백엔드 DTO 규격
interface ScheduleResponseDTO {
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  description: string;
  officeName: string;
  examLocation: string;
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  practicalRegStart: string;
  practicalRegEnd: string;
  practicalExamStart: string;
  practicalExamEnd: string;
}

export default function ExamList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. URL 파라미터에서 초기 상태 읽기
  const initialStatus = (searchParams.get('status') as ExamStatus) || 'all';

  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>(initialStatus);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  // 오늘 날짜 기준 상태 계산 로직 (프로젝트 기준일: 2026-03-13)
  const calculateStatus = (dto: ScheduleResponseDTO): ExamStatus => {
    const now = new Date('2026-03-13');
    const regStart = new Date(dto.writtenRegStart);
    const regEnd = new Date(dto.writtenRegEnd);
    const examEnd = new Date(dto.practicalExamEnd || dto.writtenExamEnd);

    if (now < regStart) return '접수예정';
    if (now >= regStart && now <= regEnd) return '접수중';
    if (now > regEnd && now <= examEnd) return '접수마감';
    return '시험완료';
  };

  // API 데이터 호출
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/exams');
        if (!response.ok) throw new Error('데이터 로딩 실패');
        
        const data: ScheduleResponseDTO[] = await response.json();
        
        const mappedExams: Exam[] = data.map(dto => ({
          id: dto.itemCode,
          name: dto.itemName,
          category: dto.largeFieldName as ExamCategory,
          status: calculateStatus(dto),
          description: dto.description,
          organizationName: dto.officeName,
          location: dto.examLocation,
          writtenRegStart: dto.writtenRegStart,
          writtenRegEnd: dto.writtenRegEnd,
          writtenExamStart: dto.writtenExamStart,
          writtenExamEnd: dto.writtenExamEnd,
          practicalRegStart: dto.practicalRegStart,
          practicalRegEnd: dto.practicalRegEnd,
          practicalExamStart: dto.practicalExamStart,
          practicalExamEnd: dto.practicalExamEnd,
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
  }, []);

  // 상태 변경 시 URL 파라미터 업데이트
  const handleStatusChange = (status: ExamStatus | 'all') => {
    setSelectedStatus(status);
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  // 필터링 및 정렬 로직
  const filteredExams = useMemo(() => {
    let filtered = [...exams];

    if (searchQuery) {
      filtered = filtered.filter(exam =>
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exam => exam.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(exam => exam.status === selectedStatus);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [exams, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const categories: Array<ExamCategory | 'all'> = ['all', '정보통신', '기술/기능', '공무원', '교육', '의료', '금융', '법률', '기타'];
  const statuses: Array<ExamStatus | 'all'> = ['all', '접수예정', '접수중', '접수마감', '시험완료'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">시험 목록</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? '최신 정보를 동기화 중입니다...' : `총 ${filteredExams.length}개의 일정이 검색되었습니다`}
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="시험 명칭 또는 시행 기관 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1.5 block">분야</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? '전체 분야' : c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1.5 block">상태</label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'all' ? '전체 상태' : s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1.5 block">정렬</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none"
            >
              <option value="date">시험일 순</option>
              <option value="name">이름 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-20 text-center">
          <p className="text-gray-500 font-medium text-lg">해당 조건의 시험이 없습니다.</p>
          <button onClick={() => handleStatusChange('all')} className="mt-4 text-blue-600 hover:underline">모든 시험 보기</button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}