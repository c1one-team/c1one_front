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
  // 🔄 API 호출: 게시물 목록을 가져오기
  // useGetPostsQuery는 React Query를 사용한 커스텀 훅
  // { page: 1, limit: 10 } = 첫 번째 페이지에서 10개 게시물 가져오기
  const { data: posts, isLoading, error } = useGetPostsQuery({ page: 1, limit: 10 });
  const match = useMatch('/post/:id');
  const navigate = useNavigate();

  // 📝 더미 데이터 (백엔드 서버가 없을 때 사용)
  // 실제 개발에서는 백엔드 API가 없어도 프론트엔드가 작동하도록
  const dummyPosts = [
    {
      id: 1, // 게시물 고유 ID
      userId: 1, // 작성자 ID
      content: "안녕하세요! 첫 번째 게시물입니다. 🎉", // 게시물 내용
      images: ["https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Post+1"], // 이미지 URL 배열
      createdAt: new Date().toISOString(), // 생성 시간
      updatedAt: new Date().toISOString(), // 수정 시간
      user: { // 작성자 정보
        id: 1,
        username: "user1", // 사용자명
        email: "user1@example.com",
        profileImage: "https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=U1" // 프로필 이미지
      },
      likeCount: 5, // 좋아요 수
      commentCount: 2, // 댓글 수
      isLiked: false // 내가 좋아요 눌렀는지 여부
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
      isLiked: true // 이 게시물은 내가 좋아요를 눌른 상태
    }
  ];

  // 🎯 표시할 게시물 결정
  // error가 있으면 (백엔드 연결 실패) 더미 데이터 사용
  // 그렇지 않으면 실제 API에서 가져온 데이터 사용
  const displayPosts = error ? dummyPosts : (posts || []);

  // ⏳ 로딩 중일 때 표시할 화면
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* 회전하는 로딩 스피너 */}
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />
      
      <div className="flex flex-1 justify-center">
        <div className="flex justify-between w-full max-w-6xl">
          <MainFeed posts={displayPosts} />
  
          <div className="ml-2 w-80 mt-10">
            <RightPanel />
          </div>
        </div>
      </div>
  
      {match && (
        <PostDetailModal 
          postId={match.params.id} 
          onClose={() => navigate('/')} 
        />
      )}
    </div>
  );  
} 