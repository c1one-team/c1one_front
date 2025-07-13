import React, { useState } from 'react';
import { useGetPostDetail } from '@/lib/postApi';
import { PostDetailView } from './PostDetailView';
import PostEditModal from './post/PostEditModal'; // ✅ 추가

export const PostDetailModal = ({ postId, onClose }) => {
  const { data: post, isLoading, error } = useGetPostDetail(Number(postId));
  const [isEditOpen, setIsEditOpen] = useState(false); // ✅ Edit modal 상태

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-8" onClick={(e) => e.stopPropagation()}>
          <p className="text-red-500">게시물을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex relative" onClick={(e) => e.stopPropagation()}>
          <PostDetailView post={post} onClose={onClose} />

          {/* ✅ 수정 버튼 */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="absolute top-2 right-10 bg-blue-500 text-white px-3 py-1 rounded"
          >
            수정
          </button>

          {/* 닫기 버튼 */}
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
            ✕
          </button>
        </div>
      </div>

      {/* ✅ PostEditModal 띄우기 */}
      {isEditOpen && (
        <PostEditModal
          postId={post.postId}
          initialContent={post.content}
          initialLocation={post.location}
          initialImages={post.mediaUrls}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
};
