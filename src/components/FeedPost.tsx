import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Plus, MoreHorizontal, Bookmark } from 'lucide-react';
import { HomePostResponse } from '@/lib/postApi';
import { PostDetailModal } from './PostDetailModal';

interface FeedPostProps {
  post: HomePostResponse;
  onCommentClick?: () => void;
  onBookmarkToggle?: (postId: number, isBookmarked: boolean) => void; // ✅ 부모에게 알릴 콜백 추가
}

const S3_PREFIX = 'https://uniqrambucket.s3.ap-northeast-2.amazonaws.com/';

export const FeedPost: React.FC<FeedPostProps> = ({ post, onCommentClick, onBookmarkToggle }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [saved, setSaved] = useState(post.bookmarkedByMe || false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('✅ saved 값이 업데이트됨:', saved);
  }, [saved]);

  const imageUrl =
  Array.isArray(post.mediaUrls) &&
  post.mediaUrls.length > 0
    ? post.mediaUrls[0].startsWith('http')
      ? post.mediaUrls[0]
      : S3_PREFIX + post.mediaUrls[0]
    : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop';


  const handleBookmarkClick = async () => {
    try {
      const res = await axios.post('/api/bookmarks', { postId: post.postId });
      console.log('✅ bookmark API success:', res);
      const isBookmarked = res.data.data; // 서버에서 true/false 반환
      setSaved(isBookmarked); // 로컬 state 업데이트
      onBookmarkToggle?.(post.postId, isBookmarked); // ✅ 부모에게 상태 변경 알림
    } catch (error) {
      console.error('❌ bookmark API error:', error);
      alert('북마크 처리 실패!');
    }
  };

  return (
    <>
      <article className="bg-instagram-dark border border-instagram-border rounded-lg overflow-hidden">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 story-ring rounded-full p-0.5">
              <div className="w-full h-full bg-instagram-dark rounded-full p-0.5">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=32&h=32&fit=crop&crop=face"
                  alt={post.username || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-sm text-white">
                  {post.username || 'Unknown User'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-400">방금 전</span>
              </div>
              <span className="text-xs text-gray-400">{post.location || ''}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />

          </button>
        </div>

        {/* Post Image */}
        <div className="relative">
          <img src={imageUrl} alt="Post content" className="w-full h-96 object-cover" />
        </div>

        {/* Post Actions */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`transition-colors ${
                  liked ? 'text-red-500' : 'text-white hover:text-gray-300'
                }`}
              >
                <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="text-white hover:text-gray-300"
              >
                <MessageSquare size={24} />
              </button>
              <button className="text-white hover:text-gray-300">
                <Plus size={24} />
              </button>
            </div>
            <button
              onClick={handleBookmarkClick}
              className="text-white hover:text-gray-300"
            >
              <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Likes Count */}
          <div className="text-sm font-semibold text-white">
            좋아요 {post.likeCount || 0}개
          </div>

          {/* Caption */}
          <div className="text-sm">
            <span className="font-semibold text-white mr-2">
              {post.username || 'Unknown User'}
            </span>
            <span className="text-white">{post.content || ''}</span>
          </div>

          {/* Comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-1">
              {post.comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="text-sm">
                  <span className="font-semibold text-white mr-2">
                    {comment.userName || 'Unknown User'}
                  </span>
                  <span className="text-white">{comment.content || ''}</span>
                </div>
              ))}
              {post.comments.length > 2 && (
                <div className="text-sm text-gray-400">
                  댓글 {post.comments.length}개 모두 보기
                </div>
              )}
            </div>
          )}

          {/* Add Comment */}
          <div className="border-t border-instagram-border pt-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=24&h=24&fit=crop&crop=face"
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="댓글 달기..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none"
              />
              <button className="text-blue-500 text-sm font-semibold">게시</button>
            </div>
          </div>
        </div>
      </article>

      {/* PostDetailModal 모달 */}
      {showModal && (
        <PostDetailModal postId={post.postId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
