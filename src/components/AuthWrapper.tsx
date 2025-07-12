// ========================================
// 🔐 AuthWrapper.tsx - 전역 인증 관리 컴포넌트
// ========================================
// 이 컴포넌트는 모든 페이지에서 JWT 토큰을 확인하고,
// 인증되지 않은 사용자를 로그인 페이지로 리다이렉트합니다.

import React, { useEffect, useState } from 'react';
import { getToken, removeToken } from '@/lib/auth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '@/features/auth/authSlice';
import { Navigate } from 'react-router-dom';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // 🔧 환경변수 설정 (.env 파일에서 로드)
  const envConfig = {
    isDevelopment: import.meta.env.DEV || false,
    bypassAuth: import.meta.env.VITE_BYPASS_AUTH === 'true' || false,
    testJWT: import.meta.env.VITE_TEST_JWT === 'true' || false,
    // 추가 환경변수들
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    nodeEnv: import.meta.env.NODE_ENV || 'development'
  };

  // 개발 환경 디버깅을 위한 로그
  if (envConfig.isDevelopment) {
    console.log('🔧 Environment Config:', {
      isDevelopment: envConfig.isDevelopment,
      bypassAuth: envConfig.bypassAuth,
      testJWT: envConfig.testJWT,
      nodeEnv: envConfig.nodeEnv
    });
  }

  // Redux 상태
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  // 🔍 JWT 토큰 유효성 검사 함수
  const validateToken = (token: string): boolean => {
    try {
      // JWT 토큰 구조 확인 (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('❌ Invalid JWT format');
        return false;
      }

      // 페이로드 디코딩
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      // 만료 시간 확인
      if (payload.exp && payload.exp < currentTime) {
        console.log('❌ JWT token expired');
        return false;
      }

      console.log('✅ JWT token is valid');
      return true;
    } catch (error) {
      console.log('❌ JWT token validation failed:', error);
      return false;
    }
  };

  // 🔄 인증 상태 확인 및 처리
  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      try {
        // 🧪 개발 환경 시나리오 1: 인증 우회 (JWT 없이도 모든 페이지 접근 가능)
        if (envConfig.isDevelopment && envConfig.bypassAuth) {
          console.log('🧪 Development: Auth bypassed - No JWT required');
          // 이미 사용자가 설정되어 있지 않을 때만 설정
          if (!user) {
            const devUser = {
              id: 1,
              username: 'dev-user',
              profileImage: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=DEV',
              role: 'USER'
            };
            console.log('🧪 HARDCODED: user 변수에 하드코딩된 개발 사용자 정보 설정:', devUser);
            dispatch(setUser(devUser));
          }
          setIsChecking(false);
          return;
        }

        // 🧪 개발 환경 시나리오 2: JWT 테스트 (실제 JWT 검증 로직 테스트)
        if (envConfig.isDevelopment && envConfig.testJWT) {
          console.log('🧪 Development: Testing JWT validation');
          const token = getToken();
          
          if (!token) {
            console.log('❌ No JWT token found - redirecting to login');
            navigate('/login');
            setIsChecking(false);
            return;
          }

          if (!validateToken(token)) {
            console.log('❌ Invalid JWT token - clearing and redirecting to login');
            removeToken();
            dispatch(clearUser());
            navigate('/login');
            setIsChecking(false);
            return;
          }

          // 유효한 JWT가 있으면 사용자 정보 설정 (이미 설정되어 있지 않을 때만)
          if (!user) {
            const testUser = {
              id: 1,
              username: 'test-user',
              profileImage: 'https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=TEST',
              role: 'USER'
            };
            console.log('🧪 HARDCODED: user 변수에 하드코딩된 테스트 사용자 정보 설정:', testUser);
            dispatch(setUser(testUser));
          }
          setIsChecking(false);
          return;
        }

        // 🚀 프로덕션 환경: 실제 JWT 검증
        if (!envConfig.isDevelopment) {
          console.log('🚀 Production: Full JWT validation');
          const token = getToken();
          
          if (!token) {
            console.log('❌ No JWT token found - redirecting to login');
            navigate('/login');
            setIsChecking(false);
            return;
          }

          if (!validateToken(token)) {
            console.log('❌ Invalid JWT token - clearing and redirecting to login');
            removeToken();
            dispatch(clearUser());
            navigate('/login');
            setIsChecking(false);
            return;
          }
        }

        // 🔧 개발 환경에서 인증 요구 (bypassAuth=false, testJWT=false)
        if (envConfig.isDevelopment && !envConfig.bypassAuth && !envConfig.testJWT) {
          console.log('🔧 Development: Auth required - Checking JWT token');
          const token = getToken();
          
          if (!token) {
            console.log('❌ No JWT token found - redirecting to login');
            navigate('/login');
            setIsChecking(false);
            return;
          }

          if (!validateToken(token)) {
            console.log('❌ Invalid JWT token - clearing and redirecting to login');
            removeToken();
            dispatch(clearUser());
            navigate('/login');
            setIsChecking(false);
            return;
          }

          // 유효한 JWT가 있으면 사용자 정보 설정
          if (!user) {
            const authRequiredUser = {
              id: 1,
              username: 'auth-required-user',
              profileImage: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=AUTH',
              role: 'USER'
            };
            console.log('🧪 HARDCODED: user 변수에 하드코딩된 인증 필요 사용자 정보 설정:', authRequiredUser);
            dispatch(setUser(authRequiredUser));
          }
          setIsChecking(false);
          return;
        }

        // ✅ 인증된 사용자 처리
        if (!user && (isAuthenticated || getToken())) {
          // 사용자 정보가 없지만 토큰이 있으면 기본 사용자 정보 설정
          const authenticatedUser = {
            id: 1,
            username: 'authenticated-user',
            profileImage: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=USER',
            role: 'USER'
          };
          console.log('🧪 HARDCODED: user 변수에 하드코딩된 인증된 사용자 정보 설정:', authenticatedUser);
          dispatch(setUser(authenticatedUser));
        }

        setIsChecking(false);
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        removeToken();
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
  }, [dispatch, navigate, location.pathname, envConfig.isDevelopment, envConfig.bypassAuth, envConfig.testJWT]);

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
  if (isAuthenticated || user || getToken() || location.pathname === '/login' || location.pathname === '/signup' || (envConfig.isDevelopment && envConfig.bypassAuth)) {
    return <>{children}</>;
  }

  // 🚫 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  return <Navigate to="/login" replace />;
};

export default AuthWrapper;
