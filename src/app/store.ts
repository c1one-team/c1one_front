// ========================================
// 🏪 store.ts - Redux 전역 상태 관리 설정
// ========================================
// 이 파일은 앱 전체에서 사용할 전역 상태(Global State)를 관리하는 설정입니다.
// 사용자 정보, 로그인 상태, 앱 설정 등을 모든 컴포넌트에서 공유할 수 있게 합니다.

// 📦 Redux Toolkit 관련 라이브러리들 가져오기
import { configureStore } from '@reduxjs/toolkit'; // Redux 스토어 생성 도구
import { setupListeners } from '@reduxjs/toolkit/query'; // React Query 리스너 설정
// 각 기능별 상태 관리자들 (Reducer)
import authReducer from '@/features/auth/authSlice'; // 인증 관련 상태 (로그인/로그아웃)
import counterReducer from '@/features/counter/counterSlice'; // 카운터 예제 (테스트용)
import searchReducer from '@/features/search/searchSlice'; // 검색 관련 상태 (검색 패널, 결과)
// API 서비스 (React Query + Redux 통합)
import { apiService } from '@/lib/api';

// 🏪 Redux 스토어 생성 및 설정
export const store = configureStore({
  // 🔧 리듀서 설정 - 각 기능별 상태 관리자들을 등록
  reducer: {
    auth: authReducer, // 인증 상태 관리
    counter: counterReducer, // 카운터 상태 관리 (예제)
    search: searchReducer, // 검색 상태 관리
    [apiService.reducerPath]: apiService.reducer, // API 상태 관리
  },
  
  // 🔧 미들웨어 설정 - API 호출, 로깅, 개발 도구 등
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 직렬화 검사 설정 (Date 객체, 함수 등이 상태에 포함될 때)
      serializableCheck: {
        // 무시할 액션들 (persist 관련 액션)
        ignoredActions: ['persist/PERSIST'],
        // 무시할 경로들 (사용자 객체 등)
        ignoredPaths: ['auth.user'],
      },
    }).concat(apiService.middleware), // API 미들웨어 추가
  // 개발 도구 활성화 (개발 환경에서만)
  devTools: process.env.NODE_ENV !== 'production',
});

// 🔄 React Query 리스너 설정
// 백그라운드에서 API 상태 변화를 감지하고 자동으로 UI 업데이트
setupListeners(store.dispatch);

// 📝 TypeScript 타입 정의
// 다른 파일에서 이 타입들을 사용할 수 있게 내보내기
export type RootState = ReturnType<typeof store.getState>; // 전체 상태 타입
export type AppDispatch = typeof store.dispatch; // 액션 디스패치 함수 타입
