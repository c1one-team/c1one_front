import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSearchResultDto } from '@/api/api';
import { apiClient } from '@/lib/api';

export const RightPanel = () => {
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState<UserSearchResultDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 전역 API 클라이언트 사용

  const dummyUsers: UserSearchResultDto[] = [
    { userid: 1, username: 'user1' },
    { userid: 2, username: 'user2' },
    { userid: 3, username: 'user3' },
    { userid: 4, username: 'user4' },
    { userid: 5, username: 'user5' }
  ];

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        console.log('🔄 백엔드 API 요청 시도...');
        const response = await apiClient.api.searchResult('추천');

        if (typeof response.data === 'string' && (response.data as string).includes('<!DOCTYPE html>')) {
          throw new Error('백엔드 서버가 응답하지 않음');
        }

        const users = Array.isArray(response.data) ? response.data : dummyUsers;
        console.log('✅ 백엔드 API 성공:', users);
        setSuggestedUsers(users);
      } catch (err) {
        console.error('❌ 백엔드 API 실패, 더미 데이터 사용:', err);
        console.log('🧪 HARDCODED: suggestedUsers 변수에 하드코딩된 더미 사용자 데이터 설정:', dummyUsers);
        setSuggestedUsers(dummyUsers);
        setError('백엔드 연결 실패 - 더미 데이터 사용 중');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleMyProfileClick = () => {
    navigate('/profile'); 
  };

  return (
    <div className="w-80 p-4 hidden lg:block">
      {/* User Profile Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleMyProfileClick}>
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=56&h=56&fit=crop&crop=face"
            alt="Your profile"
          />
          <div>
            <div className="font-semibold text-sm">ts_jdu</div>
            <div className="text-xs text-gray-400">회원님을 위한 추천</div>
          </div>
        </div>
        <button className="text-blue-400 text-sm font-semibold hover:text-blue-500">전환</button>
      </div>

      {/* Recommendations */}
      <div className="mb-4 flex justify-between">
        <span className="text-sm text-gray-400 font-semibold">회원님을 위한 추천</span>
        <button className="text-xs text-gray-600 hover:text-gray-800">모두 보기</button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="text-sm text-gray-400">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-sm text-red-400">{error}</div>
          </div>
        ) : (
          suggestedUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://via.placeholder.com/40"
                  alt={user.username}
                />
                <div>
                  <div className="text-sm font-semibold">{user.username}</div>
                  <div className="text-xs text-gray-400">회원님을 위한 추천</div>
                </div>
              </div>
              <button className="text-blue-400 text-xs font-semibold hover:text-blue-500">팔로우</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
