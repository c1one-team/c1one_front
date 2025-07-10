// ========================================
// 🏠 index.tsx - 홈페이지 (메인 피드)
// ========================================
// 이 파일은 사용자가 앱에 처음 들어왔을 때 보게 되는 메인 페이지입니다.
// Instagram의 메인 피드처럼 게시물들을 보여줍니다.

import React from 'react';
// API 호출을 위한 커스텀 훅 (React Query 기반)
import { useGetPostsQuery } from '@/lib/api';
// UI 컴포넌트들

import MainFeed from '@/components/home/MainFeed';     // 게시물 목록을 보여주는 컴포넌트
import { Sidebar } from '@/components/Sidebar';   // 왼쪽 네비게이션 바
import { RightPanel } from '@/components/home/RightPanel'; // 오른쪽 패널 (추천 사용자 등)
import { useMatch, useNavigate } from 'react-router-dom';
import { PostDetailModal } from '@/components/PostDetailModal';

// 🎯 HomePage 컴포넌트 - 메인 페이지
export default function HomePage() {
  const { data: posts, isLoading, error } = useGetPostsQuery({ page: 1, limit: 10 });
  const match = useMatch('/post/:id');
  const navigate = useNavigate();

  const dummyPosts = [
    {
      id: 1,
      userId: 1,
      content: "안녕하세요! 첫 번째 게시물입니다. 🎉",
      images: ["https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Post+1"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 1,
        username: "user1",
        email: "user1@example.com",
        profileImage: "https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=U1"
      },
      likeCount: 5,
      commentCount: 2,
      isLiked: false
    },
    {
      id: 2,
      userId: 2,
      content: "오늘 날씨가 정말 좋네요! ☀️",
      images: ["https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Post+2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 2,
        username: "user2",
        email: "user2@example.com",
        profileImage: "https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=U2"
      },
      likeCount: 12,
      commentCount: 5,
      isLiked: true
    }
  ];

  const displayPosts = error ? dummyPosts : (posts || []);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  return (
    <div className="flex w-full justify-center max-w-6xl mx-auto">
      {/* Main Feed (flex-grow) */}
      <div className="flex-1 max-w-2xl">
        <MainFeed posts={displayPosts} />
      </div>
  
      {/* Right Panel */}
      <div className="hidden lg:block w-80 ml-10 mt-8">
        <RightPanel />
      </div>
    </div>
  );
} 
