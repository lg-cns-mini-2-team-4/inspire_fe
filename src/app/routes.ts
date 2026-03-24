import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import Home from './pages/Home';
import ExamList from './pages/ExamList';
import ExamDetail from './pages/ExamDetail';
import CalendarView from './pages/CalendarView';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import LoginSuccess from './pages/LoginSuccess';
import OAuthRegister from './pages/OAuthRegister';
import MyPage from './pages/MyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'exams', Component: ExamList },
      { path: 'exam/:id', Component: ExamDetail },
      { path: 'calendar', Component: CalendarView },
      { path: 'mypage', Component: MyPage },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/login-success',
    Component: LoginSuccess
  },
  {
    path: '/oauth-register',
    Component: OAuthRegister
  }
]);