

import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useUser } from '../hooks/user';
import { useSchedules, useCreateSchedule, useDeleteSchedule } from '../hooks/schedules';
import { useFavorites } from '../hooks/favorite';
import { getMonthRange } from '../util/dateUtil';
import { ScheduleData } from '@schemas/schedule';
import {
    Mail,
    Calendar as CalendarIcon,
    Edit,
    Plus,
    Trash2,
    X,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Star,
    Building2,
    MapPin,
} from 'lucide-react';
import { format, isSameDay, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function MyPage() {
    const navigate = useNavigate();
    const today = new Date();

    /** ------------------- 훅 최상단 호출 ------------------- **/
    const [currentMonth, setCurrentMonth] = useState(today);
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [expandedCategories, setExpandedCategories] = useState({
        all: false,
        study: false,
        exam: false,
        deadline: false,
    });
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: format(today, 'yyyy-MM-dd'),
        type: 'STUDY',
        description: '',
    });

    /** ------------------- 데이터 가져오기 ------------------- **/
    const { startDate, endDate } = getMonthRange(currentMonth);

    const { data: user, isLoading: userLoading } = useUser();
    const { data: schedules = [], isLoading: scheduleLoading } = useSchedules(startDate, endDate);
    const { data: favorites = [], isLoading: favoriteLoading } = useFavorites(today);

    const createSchedule = useCreateSchedule();
    const deleteSchedule = useDeleteSchedule();

    /** ------------------- 메모이제이션 ------------------- **/
    const calendarDays = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);

    const currentMonthEvents = useMemo(
        () =>
            schedules.filter(
                (s) =>
                    new Date(s.date).getMonth() === currentMonth.getMonth() &&
                    new Date(s.date).getFullYear() === currentMonth.getFullYear()
            ),
        [schedules, currentMonth]
    );

    const currentMonthStudyEvents = useMemo(
        () => currentMonthEvents.filter((e) => e.type === 'STUDY'),
        [currentMonthEvents]
    );

    const currentMonthExamEvents = useMemo(
        () => currentMonthEvents.filter((e) => e.type === 'EXAM'),
        [currentMonthEvents]
    );

    const eventsOnDate = (date: Date) => schedules.filter((s) => isSameDay(new Date(s.date), date));

    const selectedDateEvents = useMemo(() => (selectedDate ? eventsOnDate(selectedDate) : []), [
        selectedDate,
        schedules,
    ]);

    /** ------------------- 헬퍼 함수 ------------------- **/
    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'STUDY':
                return 'bg-blue-500';
            case 'EXAM':
                return 'bg-red-500';
            case 'DEADLINE':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getEventTypeName = (type: string) => {
        switch (type) {
            case 'STUDY':
                return '학습';
            case 'EXAM':
                return '시험';
            case 'DEADLINE':
                return '마감';
            default:
                return '기타';
        }
    };

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.date) return alert('제목과 날짜를 입력해주세요.');
        if (!user) return;

        createSchedule.mutate({
            userId: user.userId,
            title: newEvent.title,
            date: newEvent.date,
            type: newEvent.type,
            description: newEvent.description,
        });
        setNewEvent({ title: '', date: format(today, 'yyyy-MM-dd'), type: 'STUDY', description: '' });
        setIsAddEventOpen(false);
    };

    const handleCancelEvent = () => {
        setNewEvent({ title: '', date: format(today, 'yyyy-MM-dd'), type: 'STUDY', description: '' });
        setIsAddEventOpen(false);
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setNewEvent((prev) => ({
            ...prev,
            date: format(date, 'yyyy-MM-dd'),
        }));
    }

    const handleDeleteEvent = (id: number) => {
        if (window.confirm('일정을 삭제하시겠습니까?')) deleteSchedule.mutate(id);
    };

    const toggleCategory = (category: 'all' | 'study' | 'exam' | 'deadline') =>
        setExpandedCategories({ ...expandedCategories, [category]: !expandedCategories[category] });

    const updateProfile = () => {
        console.log('프로필 업데이트:', profileForm);
        // 실제 API 호출 시 여기에 mutate 넣기
        setEditingProfile(false);
    };

    /** ------------------- 로딩 처리 ------------------- **/
    if (userLoading || scheduleLoading || favoriteLoading) return <div>로딩중...</div>;

    /** ------------------- profileForm 초기값 세팅 ------------------- **/
    if (!editingProfile && user && profileForm.name === '') {
        setProfileForm({ name: user.name, email: user.email });
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                <p className="text-gray-600 mt-1">프로필 정보와 개인 일정을 관리하세요</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">프로필</h2>
                            <button className="text-blue-600 hover:text-blue-700">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                                {user.name}
                            </div>
                            {editingProfile ? (
                                <input
                                    type="text"
                                    value={user.name}
                                    className="text-xl font-bold text-gray-900 text-center mb-2 px-2 py-1 border border-gray-300 rounded"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-4 h-4" />
                                {editingProfile ? (
                                    <input
                                        type="email"
                                        value={user.email}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                ) : (
                                    <span className="text-sm">{user.email}</span>
                                )}
                            </div>

                            {editingProfile && (
                                <button
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    저장
                                </button>
                            )}
                        </div>

                    </div>
                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">이번 달 일정</h3>
                        <div className="space-y-2">
                            {/* All Events */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleCategory('all')}
                                    className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {expandedCategories.all ? (
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700">전체 일정</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {currentMonthEvents.length}
                                    </span>
                                </button>
                                {expandedCategories.all && (
                                    <div className="p-3 space-y-2 bg-white">
                                        {currentMonthEvents.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-2">일정이 없습니다</p>
                                        ) : (
                                            currentMonthEvents
                                                .sort((a: ScheduleData, b: ScheduleData) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                .map((event: ScheduleData) => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-start justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}></div>
                                                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 ml-4">
                                                                {format(new Date(event.date), 'M월 d일 (E)', { locale: ko })}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1 ml-4">
                                                                {event.description}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Study Events */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleCategory('study')}
                                    className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {expandedCategories.study ? (
                                            <ChevronDown className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-blue-600" />
                                        )}
                                        <span className="text-sm font-medium text-blue-700">학습 일정</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">
                                        {currentMonthStudyEvents.length}
                                    </span>
                                </button>
                                {expandedCategories.study && (
                                    <div className="p-3 space-y-2 bg-white">
                                        {currentMonthStudyEvents.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-2">학습 일정이 없습니다</p>
                                        ) : (
                                            currentMonthStudyEvents
                                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                .map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-start justify-between p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {format(new Date(event.date), 'M월 d일 (E)', { locale: ko })}
                                                            </p>
                                                            {event.description && (
                                                                <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Exam Events */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleCategory('exam')}
                                    className="w-full flex justify-between items-center p-3 bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {expandedCategories.exam ? (
                                            <ChevronDown className="w-4 h-4 text-red-600" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className="text-sm font-medium text-red-700">시험 일정</span>
                                    </div>
                                    <span className="text-lg font-bold text-red-600">
                                        {currentMonthExamEvents.length}
                                    </span>
                                </button>
                                {expandedCategories.exam && (
                                    <div className="p-3 space-y-2 bg-white">
                                        {currentMonthExamEvents.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-2">시험 일정이 없습니다</p>
                                        ) : (
                                            currentMonthExamEvents
                                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                .map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-start justify-between p-2 bg-red-50 rounded hover:bg-red-100 transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {format(new Date(event.date), 'M월 d일 (E)', { locale: ko })}
                                                            </p>
                                                            {event.description && (
                                                                <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Favorite Exams */}








                    {favorites && favorites.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-yellow-600 fill-current" />
                                <h2 className="text-xl font-bold text-gray-900">즐겨찾기한 시험</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {favorites.map((exam: ScheduleData) => (
                                    <Link
                                        key={exam.id}
                                        to={`/exam/${exam.id}`}
                                        className="block bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">

                                            </div>
                                            <Star className="w-4 h-4 text-yellow-600 fill-current flex-shrink-0" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {exam.title}
                                        </h3>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDeleteEvent(exam.id);
                                                    }} />
                                                <span>
                                                    시험: {format(new Date(exam.date), 'M월 d일', { locale: ko })}
                                                </span>
                                            </div>

                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}







                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddEventOpen(true)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    일정 추가
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
                        <div className="grid grid-cols-7 gap-1 mb-6">
                            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                                <div
                                    key={day}
                                    className={`text-center text-sm font-medium py-2 ${idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-600'
                                        }`}
                                >
                                    {day}
                                </div>
                            ))}

                            {calendarDays.map((day, idx) => {
                                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                                const isToday = isSameDay(day, new Date('2026-03-13'));
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const events = eventsOnDate(day);
                                const dayOfWeek = day.getDay();

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleDateClick(day)}
                                        className={`min-h-[80px] p-1 border rounded-lg transition-all ${isSelected
                                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                            : isToday
                                                ? 'bg-yellow-50 border-yellow-300'
                                                : 'border-gray-200 hover:bg-gray-50'
                                            } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                                    >
                                        <div
                                            className={`text-sm font-medium mb-1 ${!isCurrentMonth
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
                                        <div className="space-y-0.5">
                                            {events.slice(0, 2).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventTypeColor(
                                                        event.type
                                                    )}`}
                                                    title={event.title}
                                                >
                                                    {event.title.length > 6 ? event.title.substring(0, 6) + '...' : event.title}
                                                </div>
                                            ))}
                                            {events.length > 2 && (
                                                <div className="text-xs text-gray-500">+{events.length - 2}</div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Date Events */}
                        {selectedDate && (
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                    {format(selectedDate, 'M월 d일 (E)', { locale: ko })} 일정
                                </h3>

                                {selectedDateEvents.length === 0 ? (
                                    <p className="text-sm text-gray-500">이 날짜에 일정이 없습니다.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedDateEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className={`inline-block px-2 py-0.5 rounded text-xs text-white mb-1 ${getEventTypeColor(event.type)}`}>
                                                        {getEventTypeName(event.type)}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                    {event.description && (
                                                        <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {isAddEventOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">새 일정 추가</h3>
                            <button
                                onClick={() => setIsAddEventOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    제목 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="일정 제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    날짜 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    유형
                                </label>
                                <select
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as PersonalEvent['type'] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="STUDY">학습</option>
                                    <option value="EXAM">시험</option>
                                    <option value="DEADLINE">마감</option>
                                    <option value="OTHER">기타</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    설명
                                </label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="일정에 대한 설명을 입력하세요 (선택사항)"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddEvent}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    추가
                                </button>
                                <button
                                    onClick={handleCancelEvent}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}