import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Camera, Plus, Grid3x3, Bookmark, User } from "lucide-react";
import { useGetUserPosts, fetchMyBookmarks, BookmarkPostResponse } from '@/lib/postApi';
import { useAuth } from '@/hooks/useAuth';
import { PostDetailModal } from '@/components/PostDetailModal';

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL || "https://uniqrambucket.s3.ap-northeast-2.amazonaws.com/";

const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const auth = useAuth();
  const userId = auth?.userId;
  const { data: userPosts, isLoading } = useGetUserPosts(userId);

  const user = {
    username: "user01",
    realName: "홍길동",
    profileImageUrl: "",
    stats: {
      posts: userPosts?.content?.length || 0,
      followers: 100,
      following: 100,
    },
  };
  
  // 하드코딩된 사용자 정보 사용 알림
  console.log('🧪 HARDCODED: user 변수에 하드코딩된 사용자 정보 설정:', user);

  const [previewImage, setPreviewImage] = useState<string | null>(user.profileImageUrl);
  const [realName, setRealName] = useState(user.realName);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => setIsEditing(false);

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const handleOpenPostDetail = (postId: number) => setSelectedPostId(postId);
  const handleClosePostDetail = () => setSelectedPostId(null);

  // ✅ 북마크 상태 추가
  const [savedPosts, setSavedPosts] = useState<BookmarkPostResponse[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    console.log("✅ activeTab changed:", activeTab);
    if (activeTab === "saved") {
      console.log("✅ saved 탭 들어옴, fetchMyBookmarks 실행");
      setSavedLoading(true);
      fetchMyBookmarks()
        .then((data) => {
          console.log("✅ fetchMyBookmarks data:", data); // ✅ 여기!
          setSavedPosts(data);
        })
        .catch((error) => console.error("❌ 북마크 불러오기 실패:", error))
        .finally(() => setSavedLoading(false));
    }
  }, [activeTab]);

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
              <span className="font-semibold text-profile-text">{user.stats.posts}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-profile-secondary">팔로워</span>
              <span className="font-semibold text-profile-text">{user.stats.followers}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-profile-secondary">팔로우</span>
              <span className="font-semibold text-profile-text">{user.stats.following}</span>
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
              {userPosts.content.map((post) => {
                const imageUrl = post.representativeImageUrl.startsWith('http')
                  ? post.representativeImageUrl
                  : `${S3_BASE_URL}${post.representativeImageUrl}`;
                return (
                  <img
                    key={post.postId}
                    src={imageUrl}
                    alt="Post"
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => handleOpenPostDetail(post.postId)}
                  />
                );
              })}
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
          {savedLoading ? (
            <div className="text-center text-gray-500">로딩 중...</div>
          ) : savedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {savedPosts.map((post) => {
                const imageUrl = post.representativeImageUrl.startsWith('http')
                  ? post.representativeImageUrl
                  : `${S3_BASE_URL}${post.representativeImageUrl}`;
                return (
                  <img
                    key={post.postId}
                    src={imageUrl}
                    alt="Saved Post"
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => handleOpenPostDetail(post.postId)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="저장"
              subtitle="다시 보고 싶은 콘텐츠를 저장하세요."
              linkText="저장된 콘텐츠 보기"
            />
          )}
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
