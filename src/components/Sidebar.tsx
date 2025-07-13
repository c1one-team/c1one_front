import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '@/app/store';
import { removeToken } from '@/lib/auth';
import { setLogout } from '@/features/auth/authSlice';
import { apiClient } from '@/lib/api';
import {
  Home,
  Search,
  Plus,
  User,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Compass,
  Heart,
  LayoutDashboard,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: '홈', path: '/' },
  { icon: Search, label: '검색', path: '/search' },
  { icon: Compass, label: '탐색', path: '/explore' },
  { icon: MessageSquare, label: '메시지', path: '/messages' },
  { icon: Bell, label: '알림', path: '/notifications' },
  { icon: Heart, label: '좋아요', path: '/likes' },
  { icon: Plus, label: '만들기', path: '/create' },
  { icon: User, label: '프로필', path: '/profile' },
];

export const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 처리 시작...');
      
      // 1. 백엔드 API 호출 (HTTP-only 쿠키 제거)
      await apiClient.api.logout();
      console.log('✅ 백엔드 로그아웃 API 호출 성공 (HTTP-only 쿠키 제거됨)');
      
    } catch (error) {
      console.error('⚠️ 백엔드 로그아웃 API 실패 (계속 진행):', error);
      // 백엔드 API 실패해도 클라이언트 로그아웃은 계속 진행
    } finally {
      // 2. 클라이언트 측 정리 (항상 실행)
      console.log('🗑️ 클라이언트 인증 정보 제거 중...');
      removeToken();           // localStorage에서 토큰 제거
      dispatch(setLogout());   // Redux에서 사용자 정보 제거
      
      console.log('🚪 로그아웃 완료 - 로그인 페이지로 이동');
      window.location.href = '/login';
    }
  };

  return (
      <div className="w-64 bg-instagram-dark border-r border-instagram-border h-screen sticky top-0 p-4">
        {/* 로고 */}
        <div className="mb-8 p-4">
          <Link to="/" className="text-2xl font-bold text-instagram-text hover:text-instagram-blue transition-colors">
            Uniqram
          </Link>
        </div>

        {/* 메뉴 항목들 */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
              <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      location.pathname === item.path
                          ? 'bg-instagram-gray text-instagram-text'
                          : 'text-instagram-muted hover:bg-instagram-gray hover:text-instagram-text'
                  }`}
              >
                <item.icon size={24} />
                <span className="text-base font-medium">{item.label}</span>
              </Link>
          ))}

          {/* 로그아웃 버튼 */}
          <div
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 text-instagram-muted hover:bg-instagram-gray hover:text-instagram-text"
          >
            <MoreHorizontal size={24} />
            <span className="text-base font-medium">로그아웃</span>
          </div>

          {/* 관리자만 보이는 대시보드 버튼 */}
          {isAdmin && (
              <Link
                  to="/admin/dashboard"
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      location.pathname.startsWith('/admin/dashboard')
                          ? 'bg-instagram-gray text-instagram-text'
                          : 'text-instagram-muted hover:bg-instagram-gray hover:text-instagram-text'
                  }`}
              >
                <LayoutDashboard size={24} />
                <span className="text-base font-medium">대시보드</span>
              </Link>
          )}
        </nav>
      </div>
  );
};
