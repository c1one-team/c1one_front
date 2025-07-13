import React, { useState } from 'react';
import { Heart, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HomePostResponse, CommentResponse, useDeletePostMutation } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface PostCommentsProps {
  post: HomePostResponse;
  comments: CommentResponse[];
  onClose: () => void; // ✅ 모달 닫기 함수 추가
}

export const PostComments: React.FC<PostCommentsProps> = ({ post, comments, onClose }) => {
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [newComment, setNewComment] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const [deletePost] = useDeletePostMutation();

  const handleDeletePost = async () => {
    try {
      await deletePost(post.postId).unwrap();
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      alert('삭제 완료');
      onClose(); // ✅ 모달 닫기
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      handleDeletePost();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-instagram-border relative">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 story-ring rounded-full p-0.5">
            <div className="w-full h-full rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm text-instagram-text">{post.username}</span>
              <span className="text-instagram-muted">•</span>
              <span className="text-sm text-instagram-muted">방금 전</span>
            </div>
          </div>
        </div>

        {/* 점세개 버튼 */}
        <button
          className="text-instagram-muted hover:text-instagram-text"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <MoreHorizontal size={20} />
        </button>

        {/* 메뉴 팝업 */}
        {menuOpen && (
          <div className="absolute top-10 right-4 bg-white border rounded shadow p-2 z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
              onClick={() => alert('수정하기는 아직 미구현입니다')}
            >
              수정하기
            </button>
            <div className="border-t border-black mx-2"></div>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>

      {/* Post Caption */}
      <div className="p-4 border-b border-instagram-border">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="text-sm">
              <span className="font-semibold text-instagram-text mr-2">{post.username}</span>
              <span className="text-instagram-text whitespace-pre-wrap">{post.content}</span>
            </div>
            <div className="mt-2 text-xs text-instagram-muted">방금 전</div>
          </div>
        </div>
      </div>

      {/* Likes */}
      <div className="px-4 py-3 border-b border-instagram-border">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 transition-colors ${
            liked ? 'text-instagram-red' : 'text-instagram-text hover:text-instagram-muted'
          }`}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <div className="mt-2 text-sm font-semibold text-instagram-text">
          좋아요 {likesCount}개
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.userId} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-semibold text-instagram-text mr-2">{comment.userName}</span>
                    <span className="text-instagram-text">{comment.content}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-instagram-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    <button className="text-xs text-instagram-muted hover:text-instagram-text">답글 달기</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-instagram-muted">댓글이 없습니다.</div>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t border-instagram-border p-4">
        <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=24&h=24&fit=crop&crop=face"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <Input
            type="text"
            placeholder="댓글 달기..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-instagram-text placeholder-instagram-muted focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            disabled={!newComment.trim()}
            className="text-instagram-blue bg-transparent hover:bg-transparent text-sm font-semibold p-0 h-auto disabled:opacity-50"
          >
            게시
          </Button>
        </form>
      </div>
    </div>
  );
};
