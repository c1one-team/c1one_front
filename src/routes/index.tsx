import React from 'react';
import { HomePostResponse, useGetFollowingRecentPosts } from '@/lib/postApi';
import MainFeed from '@/components/home/MainFeed';
import { RightPanel } from '@/components/home/RightPanel';

const HomePage: React.FC = () => {
  const { data: posts = [], isLoading, error } = useGetFollowingRecentPosts();

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
      bookmarkedByMe: false,
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
      bookmarkedByMe: false,
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
      bookmarkedByMe: false,
      comments: [],
      location: "대구"
    }
  ];

  const displayPosts = error ? dummyPosts : posts;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="text-white mt-4">게시물을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Content */}
      <div className="flex-1 flex justify-center">
        <MainFeed posts={displayPosts} />
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
};

export default HomePage;
