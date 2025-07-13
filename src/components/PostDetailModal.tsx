import React from 'react';
import { useGetPostDetailQuery } from '@/lib/api';
import { PostImageCarousel } from './PostImageCarousel';
import { PostComments } from './PostComments';
import { X } from 'lucide-react';
import { processMediaUrls } from '@/lib/utils';

export const PostDetailModal = ({ postId, onClose }) => {
  const {
    data: post,
    isLoading,
    error,
  } = useGetPostDetailQuery(Number(postId));

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-red-500">게시물을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-instagram-dark w-full lg:w-[900px] h-full lg:h-[800px] flex rounded-lg overflow-hidden">
        {/* Left: Image Carousel */}
        <div className="hidden lg:block lg:w-2/3 bg-black">
          <PostImageCarousel images={processMediaUrls(post.mediaUrls || [])} />
        </div>

        {/* Right: Comments & Details */}
        <div className="w-full lg:w-1/3 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-instagram-border" style={{ backgroundColor: '#212328' }}>
            <h1 className="text-lg font-semibold text-instagram-text">댓글</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-hidden" style={{ backgroundColor: '#212328' }}>
            <PostComments post={post} comments={post.comments || []} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
