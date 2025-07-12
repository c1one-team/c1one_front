import React from 'react';
import { useGetPostDetail, deletePost } from '@/lib/postApi';
import { PostDetailView } from './PostDetailView';

export const PostDetailModal = ({ postId, onClose }) => {
  const {
    data: post,
    isLoading,
    error,
  } = useGetPostDetail(Number(postId)); // ✅ post + comments 같이 불러오기

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 게시물 상세 뷰 */}
        <PostDetailView post={post} onClose={onClose} />
      </div>
    </div>
  );
};
