import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '@/app/store';
import { 
  closeSearchPanel, 
  setSearchKeyword, 
  searchUsers,
  clearSearchResults 
} from '@/features/search/searchSlice';
import { 
  Search, 
  X, 
  User, 
  Loader2 
} from 'lucide-react';

// 검색 패널 컴포넌트
export const SearchPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, searchResults, isLoading, error, searchKeyword } = useSelector(
    (state: RootState) => state.search
  );
  
  const [inputValue, setInputValue] = useState('');

  // 검색 결과 변경 시 로깅
  useEffect(() => {
    if (searchResults) {
      console.log('📥 SearchPanel에서 검색 결과 수신:', {
        count: searchResults.length,
        keyword: searchKeyword,
        results: searchResults
      });
    }
  }, [searchResults, searchKeyword]);

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    if (inputValue.trim()) {
      dispatch(setSearchKeyword(inputValue));
      dispatch(searchUsers(inputValue));
    } else {
      dispatch(clearSearchResults());
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 패널 닫기 핸들러
  const handleClose = () => {
    dispatch(closeSearchPanel());
    setInputValue('');
  };

  // 검색 결과 아이템 렌더링
  const renderSearchResult = (result: any, index: number) => {
    // 필수 정보 체크 및 파싱
    const userId = result.userid || result.id;
    const username = result.username;
    
    if (!userId || !username) {
      console.warn('❌ 검색 결과 파싱 실패:', result);
      return null;
    }

    console.log('✅ 검색 결과 아이템 파싱:', { userId, username });
  
    return (
      <Link
        key={`user-${userId}-${index}`}
        to={`/profile/${userId}`}
        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{username}</p>
          <p className="text-gray-400 text-sm">사용자 ID: {userId}</p>
        </div>
      </Link>
    );
  };

  // 패널이 열리지 않았으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* 검색 패널 */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 패널 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">검색</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="사용자 검색..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                           focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                         disabled:cursor-not-allowed text-white rounded-lg transition-colors 
                         flex items-center gap-2 min-w-[80px] justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>검색</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-400">검색 중...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-4">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && (!searchResults || searchResults.length === 0) && searchKeyword && (
            <div className="text-gray-400 text-center py-8">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>"{searchKeyword}"에 대한 검색 결과가 없습니다.</p>
            </div>
          )}

          {!isLoading && !error && searchResults && searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm font-medium mb-3">
                "{searchKeyword}" 검색 결과
              </h3>
              {searchResults?.map(renderSearchResult)}
            </div>
          )}

          {/* 검색 키워드가 없을 때 */}
          {!searchKeyword && (
            <div className="text-gray-400 text-center py-8">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>사용자 이름을 입력하고 검색 버튼을 눌러주세요.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 