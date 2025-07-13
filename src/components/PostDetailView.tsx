import React from 'react';
import { X } from 'lucide-react';
import { PostImageCarousel } from './PostImageCarousel';
import { PostComments } from './PostComments';
import { HomePostResponse } from '@/lib/postApi';

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL || "https://uniqrambucket.s3.ap-northeast-2.amazonaws.com/";

interface PostDetailViewProps {
  post: HomePostResponse;
  onClose: () => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ✅ S3 URL 변환
  const imageUrls = post.mediaUrls.map((url) =>
    url.startsWith('http') ? url : `${S3_BASE_URL}${url}`
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-instagram-dark w-full lg:w-[900px] h-full lg:h-[600px] flex rounded-lg overflow-hidden">
        {/* Left: Image Carousel */}
        <div className="hidden lg:block lg:w-2/3 bg-black">
          <PostImageCarousel images={imageUrls} />
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
