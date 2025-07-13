import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 👤 사용자 정보 인터페이스
interface User {
  id: number;
  username: string;
  profileImage?: string;
  // 필요한 다른 사용자 정보 추가
  role: string;
}

// 🔐 인증 상태 인터페이스
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentUsername: string | null; // username을 currentUsername으로 저장
}

// 🎯 초기 상태
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  currentUsername: null,
};

// 🏗️ 인증 슬라이스 생성
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🔑 로그인 액션
    setLogin: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.currentUsername = action.payload.username; // username을 currentUsername으로 저장
    },
    
    // 🚪 로그아웃 액션
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.currentUsername = null;
    },
    
    // 👤 사용자 정보 설정 액션 (AuthWrapper에서 사용)
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.currentUsername = action.payload.username; // username을 currentUsername으로 저장
    },
    
    // 🗑️ 사용자 정보 삭제 액션 (AuthWrapper에서 사용)
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.currentUsername = null;
    },
  },
});

// 📤 액션들을 내보내기
export const { setLogin, setLogout, setUser, clearUser } = authSlice.actions;

// 📤 리듀서 내보내기
export default authSlice.reducer;
