// ========================================
// 🏠 index.tsx - 홈페이지 (메인 피드)
// ========================================
// 이 파일은 사용자가 앱에 처음 들어왔을 때 보게 되는 메인 페이지입니다.
// Instagram의 메인 피드처럼 게시물들을 보여줍니다.

import React, { useEffect, useState } from 'react';
// API 클라이언트 import (Swagger 통일)
import { Api, HomePostResponse } from '@/api/api';
import customAxiosInstance from '@/lib/axios'; // 토큰 인터셉터가 설정된 axios 인스턴스
// UI 컴포넌트들
import MainFeed from '@/components/home/MainFeed';     // 게시물 목록을 보여주는 컴포넌트
import { RightPanel } from '@/components/home/RightPanel'; // 오른쪽 패널 (추천 사용자 등)

// 🎯 HomePage 컴포넌트 - 메인 페이지
export default function HomePage() {
  const [posts, setPosts] = useState<HomePostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  // API 클라이언트 인스턴스 생성 (토큰 인터셉터가 설정된 axios 사용)
  const api = new Api(customAxiosInstance);

  // 더미 데이터 정의 (HomePostResponse 타입으로 통일)
  const dummyPosts: HomePostResponse[] = [
    {
      postId: 1,
      content: "안녕하세요! 첫 번째 게시물입니다. 🎉",
      mediaUrls: ["https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Post+1"],
      memberId: 1,
      username: "user1",
      likeCount: 5,
      likeUsers: [],
      likedByMe: false,
      comments: [],
      location: "서울"
    },
    {
      postId: 2,
      content: "오늘 날씨가 정말 좋네요! ☀️",
      mediaUrls: ["https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Post+2"],
      memberId: 2,
      username: "user2",
      likeCount: 12,
      likeUsers: [],
      likedByMe: true,
      comments: [],
      location: "부산"
    },
    {
      postId: 3,
      content: "맛있는 커피 한 잔 ☕",
      mediaUrls: ["https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Post+3"],
      memberId: 3,
      username: "user3",
      likeCount: 8,
      likeUsers: [],
      likedByMe: false,
      comments: [],
      location: "대구"
    }
  ];
  

  // 백엔드 API 호출 함수
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 백엔드 API 호출 시도: /api/posts/home/following');
      
      // 백엔드 API 호출 (팔로잉 게시물 가져오기)
      const response = await api.posts.getFollowingRecentPosts();
      // 백엔드 API 호출 (추천 게시물 가져오기)
      // const response = await api.posts.getRecommendedPosts();
      
      // 응답이 HTML인지 확인 (백엔드 서버가 없을 때)
      if (typeof response.data === 'string' && (response.data as string).includes('<!DOCTYPE html>')) {
        throw new Error('백엔드 서버가 HTML을 반환함');
      }

      // 백엔드 API 성공
      console.log('✅ 백엔드 API 성공:', response.data);
      
      const homePostsArray = Array.isArray(response.data) ? response.data : [];
      // 이제 변환 없이 바로 사용
      setPosts(homePostsArray);
      setUsingDummyData(false);
      
    } catch (err: any) {
      console.error('❌ 백엔드 API 실패, 더미 데이터 사용:', err);
      
      // 백엔드 실패 시 더미 데이터 사용
      console.log('🧪 HARDCODED: posts 변수에 하드코딩된 더미 데이터 설정:', dummyPosts);
      setPosts(dummyPosts);
      setUsingDummyData(true);
      
      // 에러 메시지 설정
      const errorMessage = err.response?.status 
        ? `백엔드 연결 실패 (${err.response.status}): ${err.response.data?.message || err.message}`
        : `백엔드 연결 실패: ${err.message}`;
      
      setError(errorMessage);
      
      if (err.code === 'ECONNABORTED') {
        setError('타임아웃 - Spring 서버가 실행 중인지 확인하세요 (포트 8080)');
      } else if (err.code === 'ERR_NETWORK') {
        setError('네트워크 에러 - Spring 서버가 실행 중인지 확인하세요 (포트 8080)');
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchPosts();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-instagram-blue mx-auto mb-4"></div>
          <p className="text-instagram-muted">게시물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center max-w-6xl mx-auto">
      {/* Main Feed (flex-grow) */}
      <div className="flex-1 max-w-2xl">
        {/* 백엔드 연결 상태 표시 */}
        {usingDummyData && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-black text-sm">
              🧪 <strong>개발 모드:</strong> 백엔드 서버 연결 실패 - 더미 데이터 사용 중
            </p>
            {error && (
              <p className="text-black text-xs mt-1">
                오류: {error}
              </p>
            )}
          </div>
        )}
        
        {!usingDummyData && posts.length > 0 && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">
              ✅ <strong>백엔드 연결 성공!</strong> 실제 서버에서 {posts.length}개의 게시물을 불러왔습니다.
            </p>
          </div>
        )}

        <MainFeed posts={posts} />
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
};
