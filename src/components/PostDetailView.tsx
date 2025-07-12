import React from 'react';
import { X } from 'lucide-react';
import { PostImageCarousel } from './PostImageCarousel';
import { PostComments } from './PostComments';
import { Post, Comment } from '@/lib/api';
import { HomePostResponse } from '@/lib/postApi'; 

interface PostDetailViewProps {
  post: HomePostResponse;
  onClose: () => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 클릭 이벤트가 모달 내부가 아니라 배경에서만 발생했을 때만 onClose 호출
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-instagram-dark w-full lg:w-[900px] h-full lg:h-[600px] flex rounded-lg overflow-hidden">
        {/* Left: Image Carousel */}
        <div className="hidden lg:block lg:w-2/3 bg-black">
          <PostImageCarousel images={post.mediaUrls || []} />
        </div>

        {/* Right: Comments & Details */}
        <div className="w-full lg:w-1/3 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-instagram-border">
            <h1 className="text-lg font-semibold text-instagram-text">댓글</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Comments Area */}
          <div className="flex-1 overflow-y-auto">
          <PostComments post={post} comments={post.comments} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
