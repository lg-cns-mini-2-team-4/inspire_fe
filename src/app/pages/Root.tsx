import { Outlet, Link, useLocation } from 'react-router';
import { Calendar, Home, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Root() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">국가시험 관리</span>
            </Link>
            <nav className="flex space-x-4 items-center">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>홈</span>
              </Link>
              <Link
                to="/calendar"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/calendar')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>캘린더</span>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/mypage"
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                      isActive('/mypage')
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title={user.name}
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    title="로그아웃"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>로그인</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 국가시험 일정 관리 시스템. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}