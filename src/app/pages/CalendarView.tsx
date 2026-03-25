// import { useState, useEffect, useMemo } from 'react';
// import { 
//   format, addMonths, subMonths, startOfMonth, endOfMonth, 
//   startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
//   isSameDay, parseISO 
// } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Info, Layers, Bell } from 'lucide-react';

// // 백엔드 DTO
// interface ScheduleCalendarResponseDTO {
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
// }

// interface CalendarEvent {
//   id: string;
//   itemName: string;
//   label: string;
//   date: Date;
//   type: 'start' | 'end' | 'pass' | 'exam';
//   phase: 'written' | 'practical';
//   style: string;
// }

// export default function CalendarView() {
//   const [currentMonth, setCurrentMonth] = useState(new Date('2026-03-23'));
//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date('2026-03-23'));
//   const [rawSchedules, setRawSchedules] = useState<ScheduleCalendarResponseDTO[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCalendar = async () => {
//       try {
//         setIsLoading(true);
//         const year = format(currentMonth, 'yyyy');
//         const response = await fetch(`http://localhost:8080/certificate-service/calendar?year=${year}`);
//         const data = await response.json();
//         setRawSchedules(data);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCalendar();
//   }, [format(currentMonth, 'yyyy')]);

//   const allEvents = useMemo(() => {
//     const events: CalendarEvent[] = [];
//     rawSchedules.forEach((s) => {
//       const add = (dateStr: string, label: string, type: any, phase: any, style: string) => {
//         if (!dateStr) return;
//         events.push({
//           id: `${s.itemCode}-${label}-${dateStr}`,
//           itemName: s.itemName,
//           label,
//           date: parseISO(dateStr),
//           type, phase, style
//         });
//       };

//       // 캘린더 내부에서는 정보를 더 압축해서 보여주기 위해 라벨 최적화
//       add(s.writtenRegStart, '필기접수(始)', 'start', 'written', 'bg-orange-500 text-white');
//       add(s.writtenRegEnd, '필기접수(終)', 'end', 'written', 'bg-orange-400 text-white');
//       add(s.writtenExamStart, '필기시험', 'exam', 'written', 'bg-blue-500 text-white');
//       add(s.writtenPassDate, '필기발표', 'pass', 'written', 'bg-emerald-500 text-white');

//       add(s.practicalRegStart, '실기접수(始)', 'start', 'practical', 'bg-amber-500 text-white');
//       add(s.practicalRegEnd, '실기접수(終)', 'end', 'practical', 'bg-amber-400 text-white');
//       add(s.practicalExamStart, '실기시험', 'exam', 'practical', 'bg-indigo-500 text-white');
//       add(s.practicalPassDate, '최종발표', 'pass', 'practical', 'bg-purple-600 text-white');
//     });
//     return events;
//   }, [rawSchedules]);

//   const days = eachDayOfInterval({
//     start: startOfWeek(startOfMonth(currentMonth)),
//     end: endOfWeek(endOfMonth(currentMonth)),
//   });

//   const selectedDateEvents = useMemo(() => {
//     if (!selectedDate) return [];
//     return allEvents.filter(e => isSameDay(e.date, selectedDate));
//   }, [selectedDate, allEvents]);

//   return (
//     <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4">
//       {/* 1. 상단 디자인 헤더 */}
//       <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row justify-between items-center gap-6">
//         <div className="flex items-center gap-5">
//           <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
//             <CalendarIcon className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//               {format(currentMonth, 'yyyy년 M월')}
//             </h1>
//             <p className="text-gray-400 font-bold text-sm">국가자격시험 마일스톤 캘린더</p>
//           </div>
//         </div>
        
//         <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
//           <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronLeft className="w-6 h-6 text-gray-400" /></button>
//           <button onClick={() => setCurrentMonth(new Date('2026-03-23'))} className="px-6 py-2 text-sm font-black text-gray-600 hover:text-blue-600 transition-colors">오늘</button>
//           <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronRight className="w-6 h-6 text-gray-400" /></button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
//         {/* 2. 메인 캘린더 (왼쪽 3/4) */}
//         <div className="xl:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
//           <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
//             {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
//               <div key={d} className={`py-4 text-center text-[10px] font-black tracking-widest ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-300'}`}>{d}</div>
//             ))}
//           </div>

//           {isLoading ? (
//             <div className="h-[700px] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>
//           ) : (
//             <div className="grid grid-cols-7">
//               {days.map((day, i) => {
//                 const dayEvents = allEvents.filter(e => isSameDay(e.date, day));
//                 const isSelected = selectedDate && isSameDay(day, selectedDate);
//                 const isCurrentMonth = isSameMonth(day, currentMonth);

//                 return (
//                   <div 
//                     key={i} 
//                     onClick={() => setSelectedDate(day)}
//                     className={`min-h-[140px] p-1.5 border-r border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/20 
//                       ${!isCurrentMonth && 'opacity-20'} ${isSelected && 'bg-blue-50/40 shadow-inner'}`}
//                   >
//                     <div className="flex justify-between items-center mb-1.5 px-1">
//                       <span className={`text-xs font-black ${isSameDay(day, new Date('2026-03-23')) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-md' : 'text-gray-400'}`}>
//                         {format(day, 'd')}
//                       </span>
//                     </div>

//                     {/* 이벤트를 텍스트 바 형태로 최대한 많이 노출 */}
//                     <div className="space-y-1">
//                       {dayEvents.slice(0, 5).map(e => (
//                         <div key={e.id} className={`${e.style.split(' ')[0]} text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate leading-tight shadow-sm border border-black/5`}>
//                           {e.itemName.replace('자격증', '')}
//                         </div>
//                       ))}
//                       {dayEvents.length > 5 && (
//                         <div className="text-[9px] font-black text-blue-500 pl-1 flex items-center gap-1 mt-1">
//                           <Layers className="w-2.5 h-2.5" /> +{dayEvents.length - 5} MORE
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* 3. 우측 상세 리스트 (오른쪽 1/4) */}
//         <div className="xl:col-span-1">
//           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 sticky top-6">
//             <div className="flex items-center gap-3 mb-8">
//               <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
//                 <Bell className="w-5 h-5 text-blue-600" />
//               </div>
//               <h2 className="text-xl font-black text-gray-900 leading-tight">
//                 {selectedDate ? format(selectedDate, 'M월 d일 일지', { locale: ko }) : '날짜 선택'}
//               </h2>
//             </div>

//             {selectedDateEvents.length > 0 ? (
//               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//                 {selectedDateEvents.map(e => (
//                   <div key={e.id} className={`p-4 rounded-2xl border-l-4 shadow-sm transition-all hover:translate-x-1 ${e.style.replace('bg-', 'bg-white border-').replace('text-white', 'text-gray-900')}`}>
//                     <div className="flex items-center gap-2 mb-1">
//                       <div className={`w-2 h-2 rounded-full ${e.style.split(' ')[0]}`}></div>
//                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{e.label}</span>
//                     </div>
//                     <div className="font-bold text-sm text-gray-800">{e.itemName}</div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="py-24 text-center">
//                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                    <CalendarIcon className="w-8 h-8 text-gray-200" />
//                 </div>
//                 <p className="text-gray-400 font-bold">일정이 없는 날입니다.</p>
//               </div>
//             )}
            
//             <div className="mt-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
//               <div className="flex gap-2 items-start text-blue-800">
//                 <Info className="w-4 h-4 shrink-0 mt-0.5" />
//                 <p className="text-[11px] font-bold leading-relaxed">
//                   날짜를 클릭하면 해당 국가시험의 상세 시행 지사와 장소 정보를 확인할 수 있습니다.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
























































import { useState, useEffect, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, parseISO 
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Info, Layers, Bell } from 'lucide-react';

// 1. 백엔드 ExamListResponseDTO 규격과 1:1 매칭
interface ExamListResponseDTO {
  itemCode: string;
  itemName: string;
  largeFieldName: string;
  type: 'WR' | 'WE' | 'PR' | 'PE' | 'PD'; // 필기접수, 필기시험, 실기접수 등
  startDate: string;
  endDate: string;
  description: string;
}

interface CalendarEvent {
  id: string;
  itemName: string;
  label: string;
  date: Date;
  type: 'start' | 'end' | 'exam';
  phase: 'written' | 'practical' | 'etc';
  style: string;
}

export default function CalendarView() {
  // 기준 날짜 2026-03-25 (현재 시점 반영)
  const today = new Date('2026-03-25');
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [rawSchedules, setRawSchedules] = useState<ExamListResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 백엔드 /certs/exams API 호출 (페이징 없이 대량 조회 위해 size 크게 설정)
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        // 캘린더는 한 달 치 혹은 1년 치를 다 봐야 하므로 size를 2000으로 설정하여 전체 호출
        const response = await fetch(`http://localhost:8080/certs/exams?size=2000`);
        const data = await response.json();
        
        // Spring Data Page 객체의 content 배열 추출
        if (data && data.content) {
          setRawSchedules(data.content);
        }
      } catch (error) {
        console.error('Calendar Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalendarData();
  }, []); // 초기 1회 로드

  // 3. 평면형 데이터를 캘린더 이벤트로 변환 (Type별 분기 처리)
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    rawSchedules.forEach((s) => {
      const isWritten = s.type.startsWith('W');
      const isPractical = s.type.startsWith('P');
      const phase = isWritten ? 'written' : isPractical ? 'practical' : 'etc';
      
      // 스타일 정의
      const baseStyle = isWritten ? 'bg-orange-500' : isPractical ? 'bg-indigo-500' : 'bg-gray-500';
      const examStyle = isWritten ? 'bg-blue-600' : 'bg-purple-600';

      // 시작일 이벤트 (접수 시작 등)
      events.push({
        id: `${s.itemCode}-${s.type}-start`,
        itemName: s.itemName,
        label: `${s.type === 'WR' ? '필기접수' : s.type === 'PR' ? '실기접수' : '시험'} 시작`,
        date: parseISO(s.startDate),
        type: 'start',
        phase,
        style: `${baseStyle} text-white`
      });

      // 종료일 이벤트 (접수 마감 등)
      events.push({
        id: `${s.itemCode}-${s.type}-end`,
        itemName: s.itemName,
        label: `${s.type === 'WR' ? '필기접수' : s.type === 'PR' ? '실기접수' : '시험'} 마감`,
        date: parseISO(s.endDate),
        type: 'end',
        phase,
        style: `${baseStyle} opacity-80 text-white`
      });
    });
    return events;
  }, [rawSchedules]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return allEvents.filter(e => isSameDay(e.date, selectedDate));
  }, [selectedDate, allEvents]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4">
      {/* 헤더 부분 */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <CalendarIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {format(currentMonth, 'yyyy년 M월')}
            </h1>
            <p className="text-gray-400 font-bold text-sm">국가기술자격 통합 일정 관리</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronLeft className="w-6 h-6 text-gray-400" /></button>
          <button onClick={() => { setCurrentMonth(startOfMonth(today)); setSelectedDate(today); }} className="px-6 py-2 text-sm font-black text-gray-600 hover:text-blue-600 transition-colors">오늘</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronRight className="w-6 h-6 text-gray-400" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* 메인 캘린더 */}
        <div className="xl:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100 font-black text-[10px] tracking-widest">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
              <div key={d} className={`py-4 text-center ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-300'}`}>{d}</div>
            ))}
          </div>

          {isLoading ? (
            <div className="h-[700px] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>
          ) : (
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dayEvents = allEvents.filter(e => isSameDay(e.date, day));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[140px] p-1.5 border-r border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/20 
                      ${!isCurrentMonth && 'opacity-20'} ${isSelected && 'bg-blue-50/40'}`}
                  >
                    <div className="flex justify-between items-center mb-1 px-1">
                      <span className={`text-xs font-black ${isSameDay(day, today) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-md' : 'text-gray-400'}`}>
                        {format(day, 'd')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 4).map(e => (
                        <div key={e.id} className={`${e.style.split(' ')[0]} text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate text-white`}>
                          {e.itemName.replace('자격증', '')}
                        </div>
                      ))}
                      {dayEvents.length > 4 && (
                        <div className="text-[9px] font-black text-blue-500 pl-1">+{dayEvents.length - 4} MORE</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 상세 리스트 */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 sticky top-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              {selectedDate ? format(selectedDate, 'M월 d일 일정', { locale: ko }) : '날짜 선택'}
            </h2>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map(e => (
                  <div key={e.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${e.style}`}>
                        {e.label}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-800">{e.itemName}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-300 font-bold">일정 없음</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}