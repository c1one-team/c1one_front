import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProfileGrid } from './ProfileGrid';
import { Grid3X3, Play, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGetUserPosts } from '@/lib/postApi';

export const ProfileTabs = () => {
  const auth = useAuth();
  const userId = auth?.userId;
  console.log('✅ [ProfileTabs] userId:', userId);

  const { data: userPosts, isLoading, isError, error } = useGetUserPosts(userId);

  console.log('✅ userId:', userId);
console.log('✅ userPosts:', userPosts);
console.log('✅ isError:', isError);
console.log('✅ error:', error);

  const [activeTab, setActiveTab] = useState('posts');

  if (isLoading) return <div className="text-center p-4">로딩 중...</div>;
  if (isError) return <div className="text-center p-4 text-red-500">게시물 로드 실패 😢</div>;

  return (
    <div className="border-t border-instagram-border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-center bg-transparent h-auto p-0">
          <TabsTrigger value="posts" className="flex items-center gap-2 px-6 py-4 text-instagram-muted data-[state=active]:text-instagram-text data-[state=active]:border-t-2 data-[state=active]:border-instagram-text bg-transparent rounded-none">
            <Grid3X3 size={12} />
            <span className="text-xs font-semibold tracking-wider">게시물</span>
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center gap-2 px-6 py-4 text-instagram-muted data-[state=active]:text-instagram-text data-[state=active]:border-t-2 data-[state=active]:border-instagram-text bg-transparent rounded-none">
            <Play size={12} />
            <span className="text-xs font-semibold tracking-wider">릴스</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2 px-6 py-4 text-instagram-muted data-[state=active]:text-instagram-text data-[state=active]:border-t-2 data-[state=active]:border-instagram-text bg-transparent rounded-none">
            <User size={12} />
            <span className="text-xs font-semibold tracking-wider">태그됨</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <ProfileGrid userId={userId} type="posts" posts={userPosts?.content || []} />
        </TabsContent>

        <TabsContent value="reels" className="mt-0">
          <ProfileGrid userId={userId} type="reels" posts={[]} />
        </TabsContent>

        <TabsContent value="tagged" className="mt-0">
          <ProfileGrid userId={userId} type="tagged" posts={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
