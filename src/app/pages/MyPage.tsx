import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { mockExams } from '../data/mockExams';
import {
  User,
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
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PersonalEvent {
  id: string;
  title: string;
  date: string;
  type: 'study' | 'exam' | 'deadline' | 'other';
  description?: string;
}

export default function MyPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-03-13'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{
    all: boolean;
    study: boolean;
    exam: boolean;
  }>({
    all: false,
    study: false,
    exam: false,
  });

  // Redirect to login if not authenticated
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate('/login');
    return null;
  }

  // Mock user profile data
  const [profile, setProfile] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    avatar: '',
  });

  // Mock personal events
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([
    {
      id: '1',
      title: '국어 모의고사',
      date: '2026-03-15',
      type: 'study',
      description: '국어 실전 모의고사 풀이',
    },
    {
      id: '2',
      title: '행정법 스터디',
      date: '2026-03-18',
      type: 'study',
      description: '주간 스터디 모임',
    },
    {
      id: '3',
      title: '영어 단어 암기',
      date: '2026-03-20',
      type: 'study',
    },
    {
      id: '4',
      title: '모의시험',
      date: '2026-03-25',
      type: 'exam',
      description: '최종 모의시험',
    },
  ]);

  const [newEvent, setNewEvent] = useState<Partial<PersonalEvent>>({
    title: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    type: 'study',
    description: '',
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventsOnDate = (date: Date) => {
    return personalEvents.filter(event => isSameDay(new Date(event.date), date));
  };

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsOnDate(selectedDate);
  }, [selectedDate, personalEvents]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-500';
      case 'exam': return 'bg-red-500';
      case 'deadline': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'study': return '학습';
      case 'exam': return '시험';
      case 'deadline': return '마감';
      default: return '기타';
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert('제목과 날짜를 입력해주세요.');
      return;
    }

    const event: PersonalEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as PersonalEvent['type'],
      description: newEvent.description,
    };

    setPersonalEvents([...personalEvents, event]);
    setNewEvent({ title: '', date: '', type: 'study', description: '' });
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setPersonalEvents(personalEvents.filter(e => e.id !== id));
    }
  };

  const toggleCategory = (category: 'all' | 'study' | 'exam') => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };

  const currentMonthEvents = useMemo(() => {
    return personalEvents.filter(
      (event) =>
        new Date(event.date).getMonth() === currentMonth.getMonth() &&
        new Date(event.date).getFullYear() === currentMonth.getFullYear()
    );
  }, [personalEvents, currentMonth]);

  const currentMonthStudyEvents = useMemo(() => {
    return currentMonthEvents.filter((event) => event.type === 'study');
  }, [currentMonthEvents]);

  const currentMonthExamEvents = useMemo(() => {
    return currentMonthEvents.filter((event) => event.type === 'exam');
  }, [currentMonthEvents]);

  const favoriteExams = useMemo(() => {
    if (!user || !user.favoriteExams) return [];
    return mockExams.filter(exam => user.favoriteExams?.includes(exam.id));
  }, [user]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공무원':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '교육':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '의료':
        return 'bg-red-50 text-red-700 border-red-200';
      case '기술/기능':
        return 'bg-green-50 text-green-700 border-green-200';
      case '금융':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case '법률':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수예정':
        return 'bg-gray-100 text-gray-700';
      case '접수중':
        return 'bg-green-100 text-green-700';
      case '접수마감':
        return 'bg-orange-100 text-orange-700';
      case '시험완료':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const updateProfile = (profile: any) => {
    // 여기에 프로필 업데이트 로직을 추가하세요
    console.log('프로필 업데이트:', profile);
  };

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
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {profile.name.charAt(0)}
              </div>
              {editingProfile ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-xl font-bold text-gray-900 text-center mb-2 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h3>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                {editingProfile ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  <span className="text-sm">{profile.email}</span>
                )}
              </div>

              {editingProfile && (
                <button
                  onClick={() => {
                    updateProfile(profile);
                    setEditingProfile(false);
                  }}
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
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => (
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
          {favoriteExams.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-600 fill-current" />
                <h2 className="text-xl font-bold text-gray-900">즐겨찾기한 시험</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteExams.map((exam) => (
                  <Link
                    key={exam.id}
                    to={`/exam/${exam.id}`}
                    className="block bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(
                            exam.category
                          )}`}
                        >
                          {exam.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            exam.status
                          )}`}
                        >
                          {exam.status}
                        </span>
                      </div>
                      <Star className="w-4 h-4 text-yellow-600 fill-current flex-shrink-0" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {exam.name}
                    </h3>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>
                          시험: {format(new Date(exam.testDate), 'M월 d일', { locale: ko })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{exam.organizationName}</span>
                      </div>
                      {exam.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{exam.location}</span>
                        </div>
                      )}
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
                  className={`text-center text-sm font-medium py-2 ${
                    idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-600'
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
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[80px] p-1 border rounded-lg transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                        : isToday
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
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
                  <option value="study">학습</option>
                  <option value="exam">시험</option>
                  <option value="deadline">마감</option>
                  <option value="other">기타</option>
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
                  onClick={() => setIsAddEventOpen(false)}
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