import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/app/store';
import { removeToken } from '@/lib/auth';
import { setLogout } from '@/features/auth/authSlice';
import { openSearchPanel } from '@/features/search/searchSlice';
import { apiClient } from '@/lib/api';
// API 훅들은 필요시 추가
import { useToast } from '@/hooks/use-toast';
import PostMakeModal from '@/components/PostMakeModal';
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

export const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  // 모달 상태 관리
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // API 훅들 (필요 시 추가)

  // 검색 패널 열기 핸들러
  const handleSearchClick = () => {
    dispatch(openSearchPanel());
  };

  // 게시물 만들기 모달 열기 핸들러
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  // 프로필 버튼 클릭 핸들러
  const handleProfileClick = () => {
    console.log('🔘 프로필 버튼 클릭됨');
    
    if (!user) {
      console.log('❌ 사용자가 로그인되지 않음');
      toast({
        variant: "destructive",
        title: "오류",
        description: "로그인이 필요합니다.",
      });
      return;
    }

    // localStorage에서 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = user.id || userInfo.id;
    
    console.log('🔍 사용자 정보 확인:', { 
      reduxUser: user, 
      localStorageUserInfo: userInfo, 
      finalUserId: userId 
    });

    if (!userId) {
      console.log('❌ 사용자 ID를 찾을 수 없음');
      toast({
        variant: "destructive",
        title: "오류",
        description: "사용자 ID를 찾을 수 없습니다.",
      });
      return;
    }

    // 🚀 프로필 페이지로 이동 (데이터는 페이지에서 useGetUserProfileQuery로 가져옴)
    console.log('🚀 프로필 페이지로 이동:', `/profile/${userId}`);
    navigate(`/profile/${userId}`);
  };

  // 동적으로 메뉴 아이템 생성 (프로필 경로에 사용자 ID 포함)
  const menuItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Search, label: '검색', onClick: handleSearchClick }, // 검색은 onClick으로 변경
    { icon: Compass, label: '탐색', path: '/explore' },
    { icon: MessageSquare, label: '메시지', path: '/messages' },
    { icon: Bell, label: '알림', path: '/notifications' },
    { icon: Heart, label: '좋아요', path: '/likes' },
    { icon: Plus, label: '만들기', onClick: handleCreateClick }, // 만들기도 onClick으로 변경
    { icon: User, label: '프로필', onClick: handleProfileClick }, // 프로필도 onClick으로 변경
  ];

  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 처리 시작...');
      
      // 로그아웃 전 상태 확인
      console.log('🔍 로그아웃 전 localStorage 확인:');
      console.log('  - token:', localStorage.getItem('token'));
      console.log('  - userInfo:', localStorage.getItem('userInfo'));
      console.log('  - currentUsername:', localStorage.getItem('currentUsername'));
      console.log('🔍 로그아웃 전 Redux 상태:', user);
      
      // 1. 백엔드 API 호출 (HTTP-only 쿠키 제거)
      console.log('🌐 백엔드 로그아웃 API 요청: POST /api/auth/logout');
      await apiClient.api.logout();
      console.log('✅ 백엔드 로그아웃 API 호출 성공 (HTTP-only 쿠키 제거됨)');
      
    } catch (error) {
      console.error('⚠️ 백엔드 로그아웃 API 실패 (계속 진행):', error);
      console.error('⚠️ 에러 상세:', error.response?.status, error.response?.data);
      // 백엔드 API 실패해도 클라이언트 로그아웃은 계속 진행
    } finally {
      // 2. 클라이언트 측 정리 (항상 실행)
      console.log('🗑️ 클라이언트 인증 정보 제거 중...');
      
      // 각 단계별로 제거 확인
      console.log('🗑️ 1. localStorage 토큰 제거...');
      removeToken();           // localStorage에서 토큰 제거
      console.log('   - 토큰 제거 후:', localStorage.getItem('token'));
      
      console.log('🗑️ 2. localStorage 사용자 정보 제거...');
      localStorage.removeItem('userInfo'); // localStorage에서 사용자 정보 제거
      console.log('   - userInfo 제거 후:', localStorage.getItem('userInfo'));
      
      console.log('🗑️ 3. localStorage 기타 정보 제거...');
      localStorage.removeItem('currentUsername'); // 기타 사용자 관련 정보 제거
      console.log('   - currentUsername 제거 후:', localStorage.getItem('currentUsername'));
      
      console.log('🗑️ 4. Redux 상태 제거...');
      dispatch(setLogout());   // Redux에서 사용자 정보 제거
      console.log('   - Redux 상태 제거 완료');
      
      console.log('🚪 로그아웃 완료 - 로그인 페이지로 이동');
      window.location.href = '/login';
    }
  };

  return (
      <>
        <div className="w-64 bg-instagram-dark border-r border-instagram-border h-screen sticky top-0 p-4">
          {/* 로고 */}
          <div className="mb-8 p-4">
            <Link to="/" className="text-2xl font-bold text-instagram-text hover:text-instagram-blue transition-colors">
              Uniqram
            </Link>
          </div>

          {/* 메뉴 항목들 */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              // 검색 버튼은 onClick 핸들러가 있으므로 버튼으로 렌더링
              if (item.onClick) {
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 text-instagram-muted hover:bg-instagram-gray hover:text-instagram-text w-full text-left"
                  >
                    <item.icon size={24} />
                    <span className="text-base font-medium">{item.label}</span>
                  </button>
                );
              }
              
              // 나머지 메뉴는 Link로 렌더링
              return (
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
              );
            })}

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

        {/* 게시물 만들기 모달 */}
        <PostMakeModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </>
  );
};
