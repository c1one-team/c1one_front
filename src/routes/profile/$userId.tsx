import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserProfileQuery } from '@/lib/api';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProfileGrid } from '@/components/ProfileGrid';
import { ProfileTabs } from '@/components/ProfileTabs';
import { useGetUserPosts } from '@/lib/postApi';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, error } = useGetUserProfileQuery(Number(userId) || 1);
  const { data: userPosts, isLoading: isUserPostsLoading, isError } = useGetUserPosts(user?.id);

  if (isLoading || isUserPostsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">사용자 정보를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader user={user} />
        <ProfileTabs />
        <ProfileGrid userId={user.id} posts={userPosts?.content || []} />
      </div>
    </div>
  );
};

export default ProfilePage;
