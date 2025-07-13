import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Camera, Plus, Grid3x3, Bookmark, User } from "lucide-react";
import { useGetUserPosts } from '@/lib/postApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { PostDetailModal } from '@/components/PostDetailModal'; // ✅ 모달 import
import { apiClient } from '@/lib/api'; // ✅ API 클라이언트 import
import { processRepresentativeImageUrl } from '@/lib/utils';

const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  
  // Redux에서 사용자 정보 가져오기
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const { data: userPosts, isLoading } = useGetUserPosts(user?.id);

  // hooks는 항상 상단에서 호출
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profileImage || "");
  const [realName, setRealName] = useState(user?.username || "");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  
  // 📊 통계 정보를 위한 state
  const [followersCount, setFollowersCount] = useState<number>(-1);
  const [followingsCount, setFollowingsCount] = useState<number>(-1);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // 📊 팔로워/팔로잉 통계 가져오기
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      
      setIsStatsLoading(true);
      try {
        console.log('📊 사용자 통계 가져오기 시작...', user.id);
        
        // 팔로워 수와 팔로잉 수를 병렬로 가져오기
        const [followersRes, followingsRes] = await Promise.all([
          apiClient.api.getFollowers(user.id),
          apiClient.api.getFollowings(user.id)
        ]);

        const followersCount = followersRes.data?.length || 0;
        const followingsCount = followingsRes.data?.length || 0;

        setFollowersCount(followersCount);
        setFollowingsCount(followingsCount);
        
        console.log('📊 통계 정보 업데이트:', {
          followersCount,
          followingsCount,
          postsCount: userPosts?.content?.length || 0
        });
        
      } catch (error) {
        console.error('❌ 사용자 통계 가져오기 실패:', error);
        // 에러 발생 시 -1로 설정
        setFollowersCount(-1);
        setFollowingsCount(-1);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user?.id, userPosts?.content?.length]);

  // 사용자 정보 확인
  console.log('✅ Redux에서 가져온 사용자 정보:', user);
  console.log('✅ 인증 상태:', isAuthenticated);
  
  // 인증되지 않은 경우 처리
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-instagram-muted">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => setIsEditing(false);

  // ✅ 모달 상태 핸들러들
  const handleOpenPostDetail = (postId: number) => setSelectedPostId(postId);
  const handleClosePostDetail = () => setSelectedPostId(null);

  return (
    <div className="w-full max-w-[935px] mx-auto bg-background min-h-screen px-4 pt-10">
      {/* 프로필 영역 */}
      <div className="flex items-center gap-16 mb-12">
        <label htmlFor="avatar-upload" className="relative group cursor-pointer">
          <Avatar className="w-40 h-40">
            <AvatarImage src={previewImage || "/default-avatar.svg"} alt="Profile" />
            <AvatarFallback>
              <User className="w-10 h-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
            변경
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-light text-profile-text">{user.username}</h2>
            <Button
              variant="secondary"
              size="sm"
              className="text-sm px-4 py-1.5"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "편집 취소" : "프로필 편집"}
            </Button>
            <Button variant="secondary" size="sm" className="text-sm px-4 py-1.5">
              보관된 스토리 보기
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5 text-profile-text" />
            </Button>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex gap-1">
              <span className="text-profile-secondary">게시물</span>
              <span className="font-semibold text-profile-text">{userPosts?.content?.length || 0}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-profile-secondary">팔로워</span>
              <span className="font-semibold text-profile-text">
                {isStatsLoading ? '...' : followersCount === -1 ? '-' : followersCount}
              </span>
            </div>
            <div className="flex gap-1">
              <span className="text-profile-secondary">팔로우</span>
              <span className="font-semibold text-profile-text">
                {isStatsLoading ? '...' : followingsCount === -1 ? '-' : followingsCount}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="border border-gray-300 rounded-sm px-2 py-1 text-sm text-black"
              />
              <Button size="sm" onClick={handleSave}>
                저장
              </Button>
            </div>
          ) : (
            <div className="font-semibold text-profile-text text-sm">{realName}</div>
          )}
        </div>
      </div>

      {/* 스토리 하이라이트 */}
      <div className="mb-8">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="flex flex-col items-center gap-2 min-w-[70px]">
            <div className="w-20 h-20 rounded-full border-2 border-muted flex items-center justify-center bg-muted/50">
              <Plus className="h-9 w-9 text-muted-foreground" />
            </div>
            <span className="text-xs text-profile-secondary">신규</span>
          </div>
        </div>
      </div>

      {/* 탭 영역 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0 border-t border-border">
          {["posts", "saved", "tagged"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex items-center gap-2 py-3 px-4 data-[state=active]:border-t-2 data-[state=active]:border-profile-text data-[state=active]:bg-transparent rounded-none border-t-2 border-transparent"
            >
              {tab === "posts" && <Grid3x3 className="h-4 w-4" />}
              {tab === "saved" && <Bookmark className="h-4 w-4" />}
              {tab === "tagged" && <User className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.toUpperCase()}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts" className="mt-8">
          {isLoading ? (
            <div className="text-center text-gray-500">로딩 중...</div>
          ) : userPosts?.content && userPosts.content.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {userPosts.content.map((post) => (
                <img
                  key={post.postId}
                  src={processRepresentativeImageUrl(post.representativeImageUrl)}
                  alt="Post"
                  className="w-full h-32 object-cover cursor-pointer"
                  onClick={() => handleOpenPostDetail(post.postId)} // ✅ 클릭 시 모달 열기
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Camera}
              title="사진 공유"
              subtitle="사진을 공유하면 회원님의 프로필에 표시됩니다."
              linkText="첫 사진 공유하기"
            />
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-8">
          <EmptyState
            icon={Bookmark}
            title="저장"
            subtitle="다시 보고 싶은 콘텐츠를 저장하세요."
            linkText="저장된 콘텐츠 보기"
          />
        </TabsContent>

        <TabsContent value="tagged" className="mt-8">
          <EmptyState
            icon={User}
            title="내가 나온 사진"
            subtitle="회원님이 태그된 사진이 여기에 표시됩니다."
            linkText="친구 찾아보기"
          />
        </TabsContent>
      </Tabs>

      {/* ✅ PostDetailModal 모달 연결 */}
      {selectedPostId && (
        <PostDetailModal postId={selectedPostId} onClose={handleClosePostDetail} />
      )}
    </div>
  );
};

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  linkText: string;
}

const EmptyState = ({ icon: Icon, title, subtitle, linkText }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 rounded-full border-2 border-profile-text flex items-center justify-center mb-6">
      <Icon className="h-10 w-10 text-profile-text" />
    </div>
    <h3 className="text-2xl font-light text-profile-text mb-2">{title}</h3>
    <p className="text-profile-secondary mb-4 max-w-md">{subtitle}</p>
    <Button variant="link" className="text-instagram-blue font-semibold p-0 h-auto">
      {linkText}
    </Button>
  </div>
);

export default MyProfilePage;
