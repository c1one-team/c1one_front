import axios from 'axios'
import { useQuery } from '@tanstack/react-query';

export interface HomePostResponse {
    postId: number;
    content: string;
    location: string | null;
    mediaUrls: string[];
    memberId: number;
    username: string;
  
    likeCount: number;
    likeUsers: LikeUserDto[];
    likedByMe: boolean;

    bookmarkedByMe: boolean; 
  
    comments: CommentResponse[];
}

export interface LikeUserDto {
    postId: number;      
    userId: number;
    username: string;
}

export interface CommentResponse {
    commentId: number;
    userId: number;
    userName: string;        
    content: string;
    likeCount: number;
    createdAt: string;
    modifiedAt: string;
    parentCommentId: number | null;
    postId: number;
  }

  export interface UserPostResponse {
    postId: number;
    representativeImageUrl: string;
  }
  
  export interface PageResponse<T> {
    content: T[];
    pageable: any; // 필요하면 더 구체화
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: any;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }

  export interface PostCreateRequest {
    content: string;
    location: string;
    mediaUrls: string[];
  }

  export interface PostUpdateRequest {
    content: string;
    location: string;
    remainImageUrls: string[];
  }

  export interface BookmarkRequest {
    postId: number;
  }

  export interface BookmarkPostResponse {
    postId: number;
    representativeImageUrl: string;
  }

  // 팔로잉한 사람의 게시물 조회
  export const getFollowingRecentPosts = async (): Promise<HomePostResponse[]> => {
    try {
      const response = await axios.get('/api/posts/home/following');
      console.log('response.data:', response.data);
      return response.data;
    } catch (error) {
      console.error('🚨 axios error:', error);
      return [];  // 실패 시 빈 배열 반환
    }
  };

export const useGetFollowingRecentPosts = () => {
  return useQuery<HomePostResponse[]>({
    queryKey: ['followingRecentPosts'],
    queryFn: getFollowingRecentPosts,
  });
};


// 유저의 게시물(대표사진) 조회
export const useGetUserPosts = (
  userId: number | undefined,
  page = 0,
  size = 10
) => {
  return useQuery<PageResponse<UserPostResponse>>({
    queryKey: ['userPosts', userId, page],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/profile/${userId}`, {
        params: { page, size },
      });
      console.log('✅ 요청 URL:', response.config.url);
      console.log('✅ 실제 응답:', response.data);
      return response.data;
    },
    enabled: !!userId,  // ✅ userId 있을 때만 실행
  });
};


// 게시물 상세정보 조회
export const getPostDetail = async (postId: number): Promise<HomePostResponse> => {
  try {
    const response = await axios.get(`/api/posts/${postId}`);
    console.log('😅 response:', response);
    return response.data;
  } catch (error) {
    console.error('❌ axios error:', error);
    if (error.response) {
      console.error('❌ server responded with:', error.response.data);
    }
    throw error;
  }
};

export const useGetPostDetail = (postId: number | undefined) => {
  return useQuery<HomePostResponse>({
    queryKey: ['postDetail', postId],
    queryFn: async () => {
      if (postId === undefined) throw new Error('postId is undefined');
      return getPostDetail(postId);
    },
    enabled: !!postId,
  });
};

// 게시물 삭제
export const deletePost = async (postId: number) => {
  const response = await axios.delete(`/api/posts/${postId}`);
  return response.data;
};

// 게시물 생성
export const createPost = async (data: PostCreateRequest) => {
  const response = await axios.post('/api/posts', data);
  return response.data.data;
};

// 게시물 수정
export const updatePost = async (postId: number, data: PostUpdateRequest) => {
  const response = await axios.patch(`/api/posts/${postId}`, data);
  return response.data;
};

export const toggleBookmark = async (postId: number): Promise<boolean> => {
  const response = await axios.post('/api/bookmarks', { postId });
  return response.data.data; // Boolean (true: 등록, false: 해제)
};

export const fetchMyBookmarks = async (): Promise<BookmarkPostResponse[]> => {
  const res = await axios.get('/api/bookmarks');
  return res.data.data;
};