import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api';
import { UserSearchResultDto } from '@/api/api';

// 검색 상태 인터페이스
interface SearchState {
  isOpen: boolean;                    // 검색 패널 열림/닫힘 상태
  searchKeyword: string;              // 현재 검색 키워드
  searchResults: UserSearchResultDto[]; // 검색 결과 (API 타입 직접 사용)
  isLoading: boolean;                 // 로딩 상태
  error: string | null;               // 에러 메시지
}

// 초기 상태
const initialState: SearchState = {
  isOpen: false,
  searchKeyword: '',
  searchResults: [],
  isLoading: false,
  error: null,
};

// 비동기 검색 액션 생성
export const searchUsers = createAsyncThunk(
  'search/searchUsers',
  async (keyword: string, { rejectWithValue }) => {
    try {
      console.log('🔍 사용자 검색 시작:', keyword);
      console.log('🔍 검색 키워드 길이:', keyword.length);
      console.log('🔍 검색 키워드 인코딩:', encodeURIComponent(keyword));
      
      // 검색 키워드가 비어있으면 빈 결과 반환
      if (!keyword.trim()) {
        console.log('❌ 검색 키워드가 비어있음');
        return [];
      }
      
      // API 호출 전 상세 로깅
      console.log('🌐 API 요청 URL:', import.meta.env.VITE_API_BASE_URL + `/api/search/${keyword}`);
      console.log('🌐 API 요청 URL (인코딩):', import.meta.env.VITE_API_BASE_URL + `/api/search/${encodeURIComponent(keyword)}`);
      
      // API 호출
      const response = await apiClient.api.searchResult(keyword);
      console.log('✅ API 응답 상태:', response.status);
      console.log('✅ API 응답 헤더:', response.headers);
      console.log('✅ 검색 결과 원본:', response);
      console.log('✅ 검색 결과 데이터:', response.data);
      console.log('✅ 검색 결과 타입:', typeof response.data);
      
      // swagger-typescript-api에서 data가 null인 경우 직접 파싱
      let results = response.data;
      
      if (results === null || results === undefined) {
        console.log('⚠️ response.data가 null입니다. 직접 파싱을 시도합니다.');
        try {
          // Response 객체에서 직접 JSON 파싱
          const textData = await (response as any).text();
          console.log('📜 응답 텍스트:', textData);
          
          if (textData) {
            results = JSON.parse(textData);
            console.log('✅ 직접 파싱 성공:', results);
          } else {
            results = [];
          }
        } catch (parseError) {
          console.error('❌ 직접 파싱 실패:', parseError);
          results = [];
        }
      }
      
      // 안전하게 배열 반환 (null/undefined 방지)
      const finalResults = Array.isArray(results) ? results : [];
      
      // 빈 배열 체크
      if (finalResults.length === 0) {
        console.log('빈 배열입니다. 정상입니다.');
      } else {
        console.log(`✅ 검색 결과 ${finalResults.length}개 파싱 완료:`, finalResults);
      }
      
      return finalResults;
    } catch (error: any) {
      console.error('❌ 검색 API 에러:', error);
      console.error('❌ 에러 상태:', error.response?.status);
      console.error('❌ 에러 데이터:', error.response?.data);
      console.error('❌ 에러 헤더:', error.response?.headers);
      console.error('❌ 전체 에러 객체:', error);
      
      // 401/403 에러인 경우 인증 문제일 가능성
      if (error.response?.status === 401) {
        console.error('🚨 인증 실패 - HTTP-only 쿠키가 전달되지 않았을 수 있습니다');
      } else if (error.response?.status === 403) {
        console.error('🚨 권한 없음 - 인증된 사용자가 아닐 수 있습니다');
      }
      
      return rejectWithValue(error.response?.data?.message || '검색 중 오류가 발생했습니다.');
    }
  }
);

// 검색 slice 생성
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // 검색 패널 열기
    openSearchPanel: (state) => {
      state.isOpen = true;
    },
    
    // 검색 패널 닫기
    closeSearchPanel: (state) => {
      state.isOpen = false;
      state.searchKeyword = '';  // 패널 닫을 때 검색 키워드 초기화
      state.searchResults = [];   // 검색 결과 초기화
      state.error = null;         // 에러 초기화
    },
    
    // 검색 키워드 설정
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    
    // 검색 결과 초기화
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 검색 시작 (로딩 상태)
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 검색 성공
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      // 검색 실패
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 액션 내보내기
export const { 
  openSearchPanel, 
  closeSearchPanel, 
  setSearchKeyword, 
  clearSearchResults 
} = searchSlice.actions;

// 리듀서 내보내기
export default searchSlice.reducer; 