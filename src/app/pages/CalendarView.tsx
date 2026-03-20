// import { useState, useMemo } from 'react';
// import { mockExams } from '../data/mockExams';
// import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
// import { Link, useNavigate } from 'react-router';
// import { Exam } from '../types/exam';

// export default function CalendarView() {
//   const [currentMonth, setCurrentMonth] = useState(new Date('2026-03-13'));
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const navigate = useNavigate();

//   const monthStart = startOfMonth(currentMonth);
//   const monthEnd = endOfMonth(currentMonth);
//   const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
//   const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
//   const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

//   const examsOnDate = (date: Date) => {
//     return mockExams.filter(exam => isSameDay(new Date(exam.testDate), date));
//   };

//   const applicationDeadlinesOnDate = (date: Date) => {
//     return mockExams.filter(exam => isSameDay(new Date(exam.applicationEndDate), date));
//   };

//   const selectedDateExams = useMemo(() => {
//     if (!selectedDate) return [];
//     return examsOnDate(selectedDate);
//   }, [selectedDate]);

//   const selectedDateDeadlines = useMemo(() => {
//     if (!selectedDate) return [];
//     return applicationDeadlinesOnDate(selectedDate);
//   }, [selectedDate]);

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case '공무원': return 'bg-blue-500';
//       case '교육': return 'bg-purple-500';
//       case '의료': return 'bg-red-500';
//       case '기술/기능': return 'bg-green-500';
//       case '금융': return 'bg-yellow-500';
//       case '법률': return 'bg-indigo-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getCategoryLightColor = (category: string) => {
//     switch (category) {
//       case '공무원': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
//       case '교육': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
//       case '의료': return 'bg-red-100 text-red-800 hover:bg-red-200';
//       case '기술/기능': return 'bg-green-100 text-green-800 hover:bg-green-200';
//       case '금융': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
//       case '법률': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
//       default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
//     }
//   };

//   const handlePrevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const handleToday = () => {
//     setCurrentMonth(new Date('2026-03-13'));
//   };

//   const handleExamClick = (examId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     navigate(`/exam/${examId}`);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">시험 캘린더</h1>
//           <p className="text-gray-600 mt-1">모든 국가시험 일정을 한눈에 확인하세요</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Calendar */}
//         <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
//           {/* Calendar Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900">
//               {format(currentMonth, 'yyyy년 M월', { locale: ko })}
//             </h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={handleToday}
//                 className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 오늘
//               </button>
//               <button
//                 onClick={handlePrevMonth}
//                 className="p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={handleNextMonth}
//                 className="p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Calendar Grid */}
//           <div className="grid grid-cols-7 gap-1">
//             {/* Week days header */}
//             {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
//               <div
//                 key={day}
//                 className={`text-center text-sm font-medium py-2 ${
//                   idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-600'
//                 }`}
//               >
//                 {day}
//               </div>
//             ))}

//             {/* Calendar days */}
//             {calendarDays.map((day, idx) => {
//               const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
//               const isToday = isSameDay(day, new Date('2026-03-13'));
//               const isSelected = selectedDate && isSameDay(day, selectedDate);
//               const exams = examsOnDate(day);
//               const deadlines = applicationDeadlinesOnDate(day);
//               const dayOfWeek = day.getDay();

//               return (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedDate(day)}
//                   className={`min-h-[120px] p-2 border rounded-lg transition-all ${
//                     isSelected
//                       ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
//                       : isToday
//                       ? 'bg-yellow-50 border-yellow-300'
//                       : 'border-gray-200 hover:bg-gray-50'
//                   } ${!isCurrentMonth ? 'opacity-40' : ''}`}
//                 >
//                   <div
//                     className={`text-sm font-medium mb-2 ${
//                       !isCurrentMonth
//                         ? 'text-gray-400'
//                         : dayOfWeek === 0
//                         ? 'text-red-600'
//                         : dayOfWeek === 6
//                         ? 'text-blue-600'
//                         : 'text-gray-900'
//                     } ${isToday ? 'font-bold' : ''}`}
//                   >
//                     {format(day, 'd')}
//                   </div>
//                   <div className="space-y-1">
//                     {exams.map((exam) => (
//                       <div
//                         key={exam.id}
//                         onClick={(e) => handleExamClick(exam.id, e)}
//                         className={`text-xs px-1.5 py-1 rounded cursor-pointer transition-colors ${getCategoryLightColor(
//                           exam.category
//                         )}`}
//                         title={exam.name}
//                       >
//                         <div className="font-medium truncate">{exam.name}</div>
//                       </div>
//                     ))}
//                     {deadlines.map((exam) => (
//                       <div
//                         key={`deadline-${exam.id}`}
//                         onClick={(e) => handleExamClick(exam.id, e)}
//                         className="text-xs px-1.5 py-1 rounded bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer transition-colors"
//                         title={`${exam.name} 접수마감`}
//                       >
//                         <div className="font-medium truncate">📋 {exam.name}</div>
//                         <div className="text-[10px] opacity-75">접수마감</div>
//                       </div>
//                     ))}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Legend */}
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <h3 className="text-sm font-medium text-gray-700 mb-3">범례</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-blue-500"></div>
//                 <span className="text-sm text-gray-600">공무원</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-purple-500"></div>
//                 <span className="text-sm text-gray-600">교육</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-red-500"></div>
//                 <span className="text-sm text-gray-600">의료</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-green-500"></div>
//                 <span className="text-sm text-gray-600">기술/기능</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-yellow-500"></div>
//                 <span className="text-sm text-gray-600">금융</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-indigo-500"></div>
//                 <span className="text-sm text-gray-600">법률</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200"></div>
//                 <span className="text-sm text-gray-600">접수마감</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Selected Date Details */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <CalendarIcon className="w-5 h-5 text-blue-600" />
//               {selectedDate
//                 ? format(selectedDate, 'M월 d일 (E)', { locale: ko })
//                 : '날짜를 선택하세요'}
//             </h3>

//             {selectedDate ? (
//               <>
//                 {selectedDateExams.length === 0 && selectedDateDeadlines.length === 0 ? (
//                   <p className="text-sm text-gray-500">이 날짜에 일정이 없습니다.</p>
//                 ) : (
//                   <div className="space-y-4">
//                     {selectedDateExams.length > 0 && (
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">시험</h4>
//                         <div className="space-y-2">
//                           {selectedDateExams.map((exam) => (
//                             <Link
//                               key={exam.id}
//                               to={`/exam/${exam.id}`}
//                               className={`block p-3 rounded-lg transition-colors ${getCategoryLightColor(exam.category)}`}
//                             >
//                               <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                   <div className={`inline-block px-2 py-0.5 rounded text-xs text-white mb-1 ${getCategoryColor(exam.category)}`}>
//                                     {exam.category}
//                                   </div>
//                                   <p className="text-sm font-medium text-gray-900">
//                                     {exam.name}
//                                   </p>
//                                   <p className="text-xs text-gray-600 mt-1">
//                                     {exam.organizationName}
//                                   </p>
//                                 </div>
//                               </div>
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {selectedDateDeadlines.length > 0 && (
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">접수 마감</h4>
//                         <div className="space-y-2">
//                           {selectedDateDeadlines.map((exam) => (
//                             <Link
//                               key={exam.id}
//                               to={`/exam/${exam.id}`}
//                               className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
//                             >
//                               <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                   <div className="inline-block px-2 py-0.5 rounded text-xs bg-orange-200 text-orange-800 mb-1">
//                                     접수마감
//                                   </div>
//                                   <p className="text-sm font-medium text-gray-900">
//                                     {exam.name}
//                                   </p>
//                                   <p className="text-xs text-gray-600 mt-1">
//                                     {exam.organizationName}
//                                   </p>
//                                 </div>
//                               </div>
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p className="text-sm text-gray-500">
//                 캘린더에서 날짜를 선택하면 해당 일정을 확인할 수 있습니다.
//               </p>
//             )}
//           </div>

//           {/* Quick Stats */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">이번 달 통계</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">전체 시험</span>
//                 <span className="text-lg font-bold text-gray-900">
//                   {mockExams.filter(
//                     (exam) =>
//                       new Date(exam.testDate).getMonth() === currentMonth.getMonth() &&
//                       new Date(exam.testDate).getFullYear() === currentMonth.getFullYear()
//                   ).length}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">접수 마감</span>
//                 <span className="text-lg font-bold text-orange-600">
//                   {mockExams.filter(
//                     (exam) =>
//                       new Date(exam.applicationEndDate).getMonth() === currentMonth.getMonth() &&
//                       new Date(exam.applicationEndDate).getFullYear() === currentMonth.getFullYear()
//                   ).length}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

// 백엔드 캘린더 DTO 규격 정의
interface ScheduleCalendarResponseDTO {
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  writtenRegStart: string;
  writtenRegEnd: string;
  writtenExamStart: string;
  writtenExamEnd: string;
  writtenPassDate: string;
  practicalExamStart: string;
  practicalExamEnd: string;
}

// 화면에 표시할 이벤트 객체 타입
interface CalendarEvent {
  id: string;
  name: string;
  label: string;
  type: 'start' | 'end' | 'pass'; // 스타일 구분을 위한 타입
  category: string;
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-03-13'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [rawExams, setRawExams] = useState<ScheduleCalendarResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // API 데이터 호출 (연도별 데이터 요청)
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        const year = currentMonth.getFullYear();
        const response = await fetch(`http://localhost:8080/api/schedules/calendar?year=${year}`);
        
        if (!response.ok) {
          throw new Error('캘린더 데이터를 불러오는 중 에러가 발생했습니다.');
        }

        const data: ScheduleCalendarResponseDTO[] = await response.json();
        setRawExams(data);
      } catch (error) {
        console.error('Calendar API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentMonth.getFullYear()]);

  // 캘린더 계산 로직
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 특정 날짜에 해당하는 상세 이벤트 리스트 추출 (시작/종료 전수 체크)
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    rawExams.forEach((exam) => {
      // 1. 필기 원서접수
      if (isSameDay(new Date(exam.writtenRegStart), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '📝 필기접수 시작', type: 'start', category: exam.largeFieldName });
      }
      if (isSameDay(new Date(exam.writtenRegEnd), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '⚠️ 필기접수 마감', type: 'end', category: exam.largeFieldName });
      }

      // 2. 필기 시험일
      if (isSameDay(new Date(exam.writtenExamStart), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '✍️ 필기시험 시작', type: 'start', category: exam.largeFieldName });
      }
      if (isSameDay(new Date(exam.writtenExamEnd), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '🏁 필기시험 종료', type: 'end', category: exam.largeFieldName });
      }

      // 3. 필기 합격 발표
      if (isSameDay(new Date(exam.writtenPassDate), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '🎉 필합 발표', type: 'pass', category: exam.largeFieldName });
      }

      // 4. 실기 시험일
      if (isSameDay(new Date(exam.practicalExamStart), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '🛠 실기시험 시작', type: 'start', category: exam.largeFieldName });
      }
      if (isSameDay(new Date(exam.practicalExamEnd), date)) {
        events.push({ id: exam.itemCode, name: exam.itemName, label: '🏁 실기시험 종료', type: 'end', category: exam.largeFieldName });
      }
    });

    return events;
  };

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  }, [selectedDate, rawExams]);

  // 이벤트 성격별 스타일 (시작은 Blue계열, 종료는 Orange/Red계열)
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'start': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'end': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'pass': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date('2026-03-13'));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">시험 캘린더</h1>
          <p className="text-gray-600 mt-1">접수부터 합격 발표까지 모든 상세 일정을 확인하세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Main */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {format(currentMonth, 'yyyy년 M월', { locale: ko })}
            </h2>
            <div className="flex gap-2">
              <button onClick={handleToday} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">오늘</button>
              <button onClick={handlePrevMonth} className="p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={handleNextMonth} className="p-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          {isLoading ? (
            <div className="min-h-[500px] flex items-center justify-center text-gray-400">데이터를 동기화 중입니다...</div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div key={day} className={`bg-gray-50 text-center text-xs font-bold py-3 ${idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-500'}`}>
                  {day}
                </div>
              ))}

              {calendarDays.map((day, idx) => {
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isToday = isSameDay(day, new Date('2026-03-13'));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayEvents = getEventsForDate(day);
                const dayOfWeek = day.getDay();

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[120px] bg-white p-2 transition-all text-left flex flex-col group relative ${
                      isSelected ? 'ring-2 ring-inset ring-blue-500 z-10' : 
                      isToday ? 'bg-yellow-50/50' : 'hover:bg-gray-50'
                    } ${!isCurrentMonth ? 'bg-gray-50/30' : ''}`}
                  >
                    <div className={`text-xs font-semibold mb-2 ${
                      !isCurrentMonth ? 'text-gray-300' : 
                      dayOfWeek === 0 ? 'text-red-600' : 
                      dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'
                    } ${isToday ? 'bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[85px]">
                      {dayEvents.map((event, eIdx) => (
                        <div
                          key={`${event.id}-${eIdx}`}
                          onClick={(e) => { e.stopPropagation(); navigate(`/exam/${event.id}`); }}
                          className={`text-[10px] leading-tight px-1.5 py-1 rounded border shadow-sm font-bold truncate ${getEventStyle(event.type)}`}
                          title={`${event.name}: ${event.label}`}
                        >
                          {event.name}
                          <div className="text-[9px] font-normal mt-0.5 opacity-90">{event.label.split(' ')[1]}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Details Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm min-h-[400px]">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 border-b pb-4">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              {selectedDate ? format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko }) : '날짜 선택'}
            </h3>

            <div className="space-y-3">
              {selectedDate ? (
                selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/exam/${event.id}`)}
                      className={`p-4 rounded-xl border-2 cursor-pointer hover:scale-[1.02] transition-all ${getEventStyle(event.type)}`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60">
                        {event.category}
                      </div>
                      <div className="text-sm font-black text-gray-900 mb-1">{event.name}</div>
                      <div className="text-xs font-bold flex items-center gap-1">
                         {event.label}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-sm text-gray-400 font-medium">선택한 날짜에<br/>등록된 일정이 없습니다.</p>
                  </div>
                )
              ) : (
                <div className="py-20 text-center">
                   <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    달력에서 날짜를 클릭하여<br/>상세 시험 정보를 확인하세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-5 text-white">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              오늘의 안내
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              원서접수 시작일과 마감일을 꼭 확인하시고, 접수는 마감일 18:00 전까지 완료해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}