import { useState, useMemo } from 'react';
import { mockExams } from '../data/mockExams';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Exam } from '../types/exam';

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-03-13'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const examsOnDate = (date: Date) => {
    return mockExams.filter(exam => isSameDay(new Date(exam.testDate), date));
  };

  const applicationDeadlinesOnDate = (date: Date) => {
    return mockExams.filter(exam => isSameDay(new Date(exam.applicationEndDate), date));
  };

  const selectedDateExams = useMemo(() => {
    if (!selectedDate) return [];
    return examsOnDate(selectedDate);
  }, [selectedDate]);

  const selectedDateDeadlines = useMemo(() => {
    if (!selectedDate) return [];
    return applicationDeadlinesOnDate(selectedDate);
  }, [selectedDate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공무원': return 'bg-blue-500';
      case '교육': return 'bg-purple-500';
      case '의료': return 'bg-red-500';
      case '기술/기능': return 'bg-green-500';
      case '금융': return 'bg-yellow-500';
      case '법률': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLightColor = (category: string) => {
    switch (category) {
      case '공무원': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case '교육': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case '의료': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case '기술/기능': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case '금융': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case '법률': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date('2026-03-13'));
  };

  const handleExamClick = (examId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">시험 캘린더</h1>
          <p className="text-gray-600 mt-1">모든 국가시험 일정을 한눈에 확인하세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {format(currentMonth, 'yyyy년 M월', { locale: ko })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                오늘
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week days header */}
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div
                key={day}
                className={`text-center text-sm font-medium py-2 ${
                  idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day, new Date('2026-03-13'));
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const exams = examsOnDate(day);
              const deadlines = applicationDeadlinesOnDate(day);
              const dayOfWeek = day.getDay();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[120px] p-2 border rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                      : isToday
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      !isCurrentMonth
                        ? 'text-gray-400'
                        : dayOfWeek === 0
                        ? 'text-red-600'
                        : dayOfWeek === 6
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    } ${isToday ? 'font-bold' : ''}`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {exams.map((exam) => (
                      <div
                        key={exam.id}
                        onClick={(e) => handleExamClick(exam.id, e)}
                        className={`text-xs px-1.5 py-1 rounded cursor-pointer transition-colors ${getCategoryLightColor(
                          exam.category
                        )}`}
                        title={exam.name}
                      >
                        <div className="font-medium truncate">{exam.name}</div>
                      </div>
                    ))}
                    {deadlines.map((exam) => (
                      <div
                        key={`deadline-${exam.id}`}
                        onClick={(e) => handleExamClick(exam.id, e)}
                        className="text-xs px-1.5 py-1 rounded bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer transition-colors"
                        title={`${exam.name} 접수마감`}
                      >
                        <div className="font-medium truncate">📋 {exam.name}</div>
                        <div className="text-[10px] opacity-75">접수마감</div>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">범례</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-sm text-gray-600">공무원</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500"></div>
                <span className="text-sm text-gray-600">교육</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm text-gray-600">의료</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm text-gray-600">기술/기능</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-sm text-gray-600">금융</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500"></div>
                <span className="text-sm text-gray-600">법률</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200"></div>
                <span className="text-sm text-gray-600">접수마감</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              {selectedDate
                ? format(selectedDate, 'M월 d일 (E)', { locale: ko })
                : '날짜를 선택하세요'}
            </h3>

            {selectedDate ? (
              <>
                {selectedDateExams.length === 0 && selectedDateDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-500">이 날짜에 일정이 없습니다.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedDateExams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">시험</h4>
                        <div className="space-y-2">
                          {selectedDateExams.map((exam) => (
                            <Link
                              key={exam.id}
                              to={`/exam/${exam.id}`}
                              className={`block p-3 rounded-lg transition-colors ${getCategoryLightColor(exam.category)}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className={`inline-block px-2 py-0.5 rounded text-xs text-white mb-1 ${getCategoryColor(exam.category)}`}>
                                    {exam.category}
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {exam.name}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {exam.organizationName}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDateDeadlines.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">접수 마감</h4>
                        <div className="space-y-2">
                          {selectedDateDeadlines.map((exam) => (
                            <Link
                              key={exam.id}
                              to={`/exam/${exam.id}`}
                              className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="inline-block px-2 py-0.5 rounded text-xs bg-orange-200 text-orange-800 mb-1">
                                    접수마감
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {exam.name}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {exam.organizationName}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                캘린더에서 날짜를 선택하면 해당 일정을 확인할 수 있습니다.
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">이번 달 통계</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">전체 시험</span>
                <span className="text-lg font-bold text-gray-900">
                  {mockExams.filter(
                    (exam) =>
                      new Date(exam.testDate).getMonth() === currentMonth.getMonth() &&
                      new Date(exam.testDate).getFullYear() === currentMonth.getFullYear()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">접수 마감</span>
                <span className="text-lg font-bold text-orange-600">
                  {mockExams.filter(
                    (exam) =>
                      new Date(exam.applicationEndDate).getMonth() === currentMonth.getMonth() &&
                      new Date(exam.applicationEndDate).getFullYear() === currentMonth.getFullYear()
                  ).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}