import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { mockExams } from '../data/mockExams';
import { ExamCard } from '../components/ExamCard';
import { ExamCategory, ExamStatus } from '../types/exam';
import { Search, Filter, Calendar as CalendarIcon, List } from 'lucide-react';

export default function ExamList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>(
    'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'all'>(
    (searchParams.get('status') as ExamStatus) || 'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const categories: Array<ExamCategory | 'all'> = [
    'all',
    '공무원',
    '교육',
    '의료',
    '기술/기능',
    '금융',
    '법률',
    '기타',
  ];

  const statuses: Array<ExamStatus | 'all'> = [
    'all',
    '접수예정',
    '접수중',
    '접수마감',
    '시험완료',
  ];

  const filteredExams = useMemo(() => {
    let filtered = mockExams;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((exam) => exam.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((exam) => exam.status === selectedStatus);
    }

    // Sort
    if (sortBy === 'date') {
      filtered = filtered.sort(
        (a, b) =>
          new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
      );
    } else {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">시험 목록</h1>
          <p className="text-gray-600 mt-1">
            총 {filteredExams.length}개의 시험이 있습니다
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="시험명 또는 주관기관 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              분야
            </label>
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as ExamCategory | 'all')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? '전체 분야' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                const status = e.target.value as ExamStatus | 'all';
                setSelectedStatus(status);
                if (status === 'all') {
                  searchParams.delete('status');
                } else {
                  searchParams.set('status', status);
                }
                setSearchParams(searchParams);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? '전체 상태' : status}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정렬
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">시험일 순</option>
              <option value="name">이름 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
