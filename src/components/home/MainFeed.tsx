
import React, { useState } from 'react';
import { StoryCarousel } from '@/components/StoryCarousel';
import { FeedPost } from '@/components/FeedPost';
import { HomePostResponse } from '@/lib/postApi';
import { PostDetailModal } from '@/components/PostDetailModal';

interface MainFeedProps {
  posts: HomePostResponse[];
}

const MainFeed: React.FC<MainFeedProps> = ({ posts }) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const safePosts = Array.isArray(posts) ? posts : [];
  
  return (
    <div className="flex-1 max-w-2xl mx-auto">
      {/* Story Carousel */}
      <div className="pt-6 pb-4">
        <StoryCarousel />
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
      {safePosts.length > 0 ? (
        safePosts.map((post) => (
          <FeedPost
            key={post.postId}
            post={post}
            onCommentClick={() => setSelectedPostId(post.postId)}
          />
        ))
      ) : (
        <div className="text-center py-8 text-instagram-muted">게시물이 없습니다.</div>
      )}
    </div>
    {safePosts.length > 0 ? (
        safePosts.map((post) => (
          <FeedPost
            key={post.postId}
            post={post}
            onCommentClick={() => setSelectedPostId(post.postId)}
          />
        ))
      ) : (
        <div className="text-center py-8 text-instagram-muted">게시물이 없습니다.</div>
      )}
    </div>
  );
};

export default MainFeed;

