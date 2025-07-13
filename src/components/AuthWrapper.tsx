// ========================================
// 🔐 AuthWrapper.tsx - 전역 인증 관리 컴포넌트
// ========================================
// 이 컴포넌트는 모든 페이지에서 JWT 토큰을 확인하고,
// 인증되지 않은 사용자를 로그인 페이지로 리다이렉트합니다.

import React, { useEffect, useState } from 'react';
// HTTP-only 쿠키 방식에서는 토큰 관리 불필요
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '@/features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import { apiClient } from '@/lib/api';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // HTTP-only 쿠키 방식에서는 환경변수 설정 불필요

  // Redux 상태
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  // HTTP-only 쿠키 기반 인증에서는 JWT 토큰 유효성 검사 불필요
  // 브라우저가 쿠키를 자동으로 관리하고 백엔드에서 검증

  // 🔄 인증 상태 확인 및 처리
  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      try {
        // 🎯 이미 Redux에 인증된 사용자 정보가 있으면 스킵
        if (isAuthenticated && user) {
          console.log('✅ User already authenticated in Redux:', user);
          setIsChecking(false);
          return;
        }

        // 🔄 새로고침 시 localStorage에서 사용자 정보 복원
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(savedUserInfo);
            console.log('🔄 localStorage에서 사용자 정보 복원:', parsedUserInfo);
            
            // Redux에 사용자 정보 복원 (토큰은 HTTP-only 쿠키에 이미 있음)
            dispatch(setUser(parsedUserInfo));
            setIsChecking(false);
            return;
          } catch (error) {
            console.error('❌ localStorage 사용자 정보 파싱 실패:', error);
            // 파싱 실패 시 localStorage 정리
            localStorage.removeItem('userInfo');
          }
        }

        // HTTP-only 쿠키 사용 시 토큰 확인 스킵 (쿠키는 브라우저가 자동 관리)
        console.log('🔄 HTTP-only 쿠키 기반 인증 - 백엔드 요청으로 인증 상태 확인');
        
        // 백엔드에 인증 상태 확인 요청 (쿠키가 유효하면 성공)
        try {
          console.log('🔄 백엔드 인증 상태 확인 중...');
          
          // 간단한 인증이 필요한 API 호출로 쿠키 유효성 확인
          const response = await apiClient.api.successTest();
          
          if (response.data) {
            console.log('✅ HTTP-only 쿠키 인증 성공 - 실제 사용자 정보 필요');
            
            // TODO: 실제 사용자 정보를 가져오는 API 호출 추가
            // 현재는 사용자 정보 API가 없으므로 환경변수 조건 확인
            
            console.log('⚠️ 사용자 정보 API 미구현 - 환경변수 조건 확인');
            setIsChecking(false);
            return;
          }
          
        } catch (authError) {
          console.error('❌ HTTP-only 쿠키 인증 실패:', authError);
          
          // 🧪 개발 환경에서만 가짜 유저 정보 사용
          const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true';
          const testJwt = import.meta.env.VITE_TEST_JWT === 'true';
          
          if (bypassAuth && !testJwt) {
            console.log('🧪 개발 환경 조건 만족 - 가짜 유저 정보 사용');
            console.log('🔧 환경변수 - VITE_BYPASS_AUTH:', bypassAuth, 'VITE_TEST_JWT:', testJwt);
            
            const fallbackUser = {
              id: 1,
              username: 'authenticated-user',
              profileImage: '',
              role: 'USER'
            };
            
            console.log('🧪 HARDCODED: 가짜 사용자 정보 설정:', fallbackUser);
            dispatch(setUser(fallbackUser));
            setIsChecking(false);
            return;
          }
          
          console.log('🚪 인증 실패 - 로그인 페이지로 리다이렉트');
          console.log('🔧 환경변수 - VITE_BYPASS_AUTH:', bypassAuth, 'VITE_TEST_JWT:', testJwt);
          
          // 쿠키가 무효하면 로그인 페이지로 리다이렉트
          dispatch(clearUser());
          localStorage.removeItem('userInfo'); // localStorage 정리
          navigate('/login');
          setIsChecking(false);
          return;
        }

        // HTTP-only 쿠키 방식에서는 추가 사용자 정보 가져오기 불필요
        // 로그인 시 이미 Redux에 저장된 정보 사용

        setIsChecking(false);
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        dispatch(clearUser());
        navigate('/login');
        setIsChecking(false);
      }
    };

    // 로그인 페이지에서는 인증 체크 건너뛰기
    if (location.pathname === '/login') {
      setIsChecking(false);
      return;
    }

    checkAuth();
  }, [dispatch, navigate, location.pathname, user, isAuthenticated]);

  // 🔄 로딩 중 표시
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // ✅ 인증된 사용자 또는 로그인 페이지인 경우 자식 컴포넌트 렌더링
  if (isAuthenticated || user || location.pathname === '/login' || location.pathname === '/signup') {
    return <>{children}</>;
  }

  // 🚫 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  return <Navigate to="/login" replace />;
};

export default AuthWrapper;
