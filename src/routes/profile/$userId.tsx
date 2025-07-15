import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Plus, Grid3x3, Bookmark, User, UserPlus, UserMinus, Settings } from "lucide-react"; // Settings 아이콘 추가 임포트 (프로필 편집 버튼용)
import {
  useGetUserPostsQuery,
  useGetUserProfileQuery,
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useCreateProfileMutation,
  useCreateFollowMutation,
  useUnfollowMutation // 언팔로우 뮤테이션 훅 임포트
} from '@/lib/api'; // useDeleteFollowMutation 대신 useUnfollowMutation 사용

import { PostDetailModal } from '@/components/PostDetailModal';
import { processRepresentativeImageUrl, handleImageError, handleImageLoad } from '@/lib/utils';

import { RootState } from '@/app/store';
import { useToast } from '@/hooks/use-toast';

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // 컴포넌트 마운트 확인 (디버깅용)
  console.log('🏠 UserProfilePage 컴포넌트 마운트됨 - userId:', userId);
  console.log('🔍 URL params:', useParams());

  // Redux에서 현재 로그인된 사용자 정보 가져오기
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?.id; // 현재 로그인된 사용자 ID를 변수로 저장
  const isOwnProfile = currentUserId === Number(userId);

  // Redux Toolkit Query 훅들을 사용하여 데이터 가져오기
  const { data: userPosts, isLoading: isPostsLoading } = useGetUserPostsQuery({ userId: Number(userId) });
  const { data: profile, isLoading: isProfileLoading, error: profileError, refetch: refetchProfile } = useGetUserProfileQuery(Number(userId!) || 0);

  // 🎯 팔로워 및 팔로잉 데이터를 가져올 때, 현재 프로필 사용자의 ID를 사용합니다.
  const { data: followers, isLoading: isFollowersLoading, refetch: refetchFollowers } = useGetFollowersQuery(Number(userId!) || 0);
  const { data: followings, isLoading: isFollowingsLoading, refetch: refetchFollowings } = useGetFollowingsQuery(Number(userId!) || 0);

  // 통계 계산
  const followersCount = followers?.length || 0;
  const followingsCount = followings?.length || 0;
  const isStatsLoading = isFollowersLoading || isFollowingsLoading;

  // 🔹 프로필 생성 뮤테이션
  const [createProfile] = useCreateProfileMutation();

  // 🔹 팔로우/언팔로우 관련 뮤테이션
  const [createFollow] = useCreateFollowMutation();
  const [unfollow] = useUnfollowMutation(); // 언팔로우 뮤테이션 훅 사용

  // 🎯 현재 로그인된 사용자가 이 프로필의 사용자를 팔로우하고 있는지 확인
  // `followers` 배열의 각 `FollowDto` 객체에서 `userId` 필드가
  // 현재 로그인된 사용자의 ID와 일치하는지 확인합니다.
  const isFollowing = followers?.some(follower => follower.userId === currentUserId);

  // 디버그 로그 추가
  console.log(`DEBUG: 로그인 유저 ID: ${currentUserId}`);
  console.log(`DEBUG: 프로필 유저 ID: ${Number(userId)}`);
  console.log(`DEBUG: 팔로워 데이터 (followers):`, followers);
  console.log(`DEBUG: 팔로잉 여부 (isFollowing): ${isFollowing}`);


  // 🔄 팔로우/언팔로우 버튼 클릭 핸들러
  const handleFollowClick = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "로그인 필요",
        description: "팔로우 기능을 사용하려면 로그인해야 합니다.",
      });
      navigate('/login'); // 로그인 페이지로 리다이렉트
      return;
    }

    try {
      if (isFollowing) {
        // 언팔로우 로직
        console.log('🔄 언팔로우 요청 시작:', userId);
        await unfollow(Number(userId)).unwrap();
        console.log('✅ 언팔로우 성공');
        toast({
          title: "언팔로우 성공",
          description: "사용자를 언팔로우했습니다.",
        });
      } else {
        // 팔로우 로직
        console.log('🔄 팔로우 요청 시작:', userId);
        await createFollow(Number(userId)).unwrap();
        console.log('✅ 팔로우 성공');
        toast({
          title: "팔로우 성공",
          description: "사용자를 팔로우했습니다.",
        });
      }
      // 성공 후 팔로워/팔로잉 데이터 새로고침
      refetchFollowers();
      refetchFollowings();
      // 프로필 정보도 갱신될 수 있으므로 refetch (예: 팔로우 카운트가 백엔드에서 Profile DTO에 포함될 경우)
      refetchProfile();
    } catch (error) {
      console.error('❌ 팔로우/언팔로우 실패:', error);
      toast({
        variant: "destructive",
        title: "작업 실패",
        description: "팔로우/언팔로우 처리 중 오류가 발생했습니다.",
      });
    }
  };

  // 🔄 에러 처리 (useEffect)
  // 이 로직은 `profileError`가 발생했을 때만 트리거됩니다.
  // 500 에러의 구체적인 원인은 백엔드 로그에서 확인해야 합니다.
  useEffect(() => {
    if (profileError) {
      console.error('❌ 프로필 데이터 가져오기 실패:', profileError);
      console.error('❌ 에러 구조:', JSON.stringify(profileError, null, 2));

      const errorStatus = (profileError as any)?.status || (profileError as any)?.data?.status;
      const isServerError = errorStatus === 500 || errorStatus === 404; // 404도 서버 에러로 간주

      if (isServerError) {
        if (isOwnProfile) {
          console.log('🔄 본인 프로필이 없음 - 프로필 생성 시도');
          createProfile({ bio: "", profileImageUrl: "" })
            .unwrap()
            .then(() => {
              console.log('✅ 프로필 생성 성공 - 데이터 다시 가져오기');
              refetchProfile();
            })
            .catch((createError) => {
              console.error('❌ 프로필 생성 실패:', createError);
              toast({
                variant: "destructive",
                title: "프로필 생성 실패",
                description: "프로필을 생성하는데 실패했습니다. 다시 시도해주세요.",
              });
            });
        } else {
          const errorMessage = "프로필을 생성하지 않았거나, 존재하지 않는 유저입니다.";
          console.log('🚨 서버 에러 발생 - 존재하지 않는 사용자로 판단하여 홈으로 리다이렉트');
          console.log('🍞 Toast 메시지 표시:', errorMessage);

          toast({
            variant: "destructive",
            title: "오류",
            description: errorMessage,
          });
          navigate("/");
        }
        return;
      }

      const errorMessage = isOwnProfile
        ? '프로필 정보를 불러오는데 실패했습니다. 다시 시도해주세요.'
        : '이 사용자의 프로필 정보를 찾을 수 없습니다.';

      console.log('🍞 Toast 메시지 표시:', errorMessage);

      toast({
        variant: "destructive",
        title: "오류",
        description: errorMessage,
      });
    }
  }, [profileError, isOwnProfile, toast, navigate, createProfile, refetchProfile]);

  // ✅ 모달 상태 핸들러들
  const handleOpenPostDetail = (postId: number) => setSelectedPostId(postId);
  const handleClosePostDetail = () => setSelectedPostId(null);

  // 로딩 상태 (프로필 정보가 로딩 중일 때)
  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 (프로필 정보 로딩 실패 및 본인 프로필이 아닐 때)
  if (profileError && !isOwnProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-500">
            이 사용자의 프로필 정보를 찾을 수 없습니다.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mt-4"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[935px] mx-auto bg-background min-h-screen px-4 pt-10">
      {/* 프로필 영역 */}
      <div className="flex items-center gap-16 mb-12">
        <Avatar className="w-40 h-40">
          <AvatarImage src={profile?.profileImageUrl || "/default-avatar.svg"} alt="Profile" />
          <AvatarFallback>
            <User className="w-10 h-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-light text-profile-text">
              {profile?.username || (isOwnProfile ? currentUser?.username : `사용자 ${userId}`)}
            </h2>

            {isOwnProfile ? (
              // 🌟 본인 프로필일 때만 보이는 버튼들
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-sm px-4 py-1.5"
                // onClick={() => navigate('/edit-profile')} // 프로필 편집 페이지로 이동
                >
                  프로필 편집
                </Button>
                <Button variant="secondary" size="sm" className="text-sm px-4 py-1.5">
                  <Settings size={16} /> {/* 설정 아이콘 버튼 */}
                </Button>
              </>
            ) : (
              // 🌟 다른 사용자 프로필일 때만 보이는 버튼들
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-sm px-4 py-1.5"
                  onClick={handleFollowClick}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      언팔로우
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      팔로우
                    </>
                  )}
                </Button>
                {/* 메시지 버튼은 팔로우 여부와 관계없이 다른 사용자에게 항상 보일 수 있습니다. */}
                <Button variant="secondary" size="sm" className="text-sm px-4 py-1.5">
                  메시지
                </Button>
              </>
            )}
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

          <div className="font-semibold text-profile-text text-sm">
            {profile?.bio || '소개가 없습니다.'}
          </div>
        </div>
      </div>

      {/* 스토리 하이라이트 */}
      <div className="mb-8">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="flex flex-col items-center gap-2 min-w-[70px]">
            <div className="w-20 h-20 rounded-full border-2 border-muted flex items-center justify-center bg-muted/50">
              <Plus className="h-9 w-9 text-muted-foreground" />
            </div>
            <span className="text-xs text-profile-secondary">스토리</span>
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
          {isPostsLoading ? (
            <div className="text-center text-gray-500">로딩 중...</div>
          ) : userPosts?.content && userPosts.content.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {userPosts.content.map((post) => {
                console.log('📸 Post 데이터:', post);
                console.log('🖼️ representativeImageUrl:', post.representativeImageUrl);
                return (
                  <img
                    key={post.postId}
                    src={processRepresentativeImageUrl(post.representativeImageUrl)}
                    alt="Post"
                    className="w-full aspect-[3/4] object-cover cursor-pointer"
                    onClick={() => handleOpenPostDetail(post.postId)}
                    onError={(e) => handleImageError(e, post.representativeImageUrl)}
                    onLoad={(e) => handleImageLoad(e, post.representativeImageUrl)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Camera}
              title="게시물 없음"
              subtitle="아직 공유한 사진이 없습니다."
              linkText=""
            />
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-8">
          <EmptyState
            icon={Bookmark}
            title="저장된 게시물"
            subtitle="저장된 콘텐츠가 여기에 표시됩니다."
            linkText=""
          />
        </TabsContent>

        <TabsContent value="tagged" className="mt-8">
          <EmptyState
            icon={User}
            title="태그된 사진"
            subtitle="이 사용자가 태그된 사진이 여기에 표시됩니다."
            linkText=""
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
    {linkText && (
      <Button variant="link" className="text-instagram-blue font-semibold p-0 h-auto">
        {linkText}
      </Button>
    )}
  </div>
);

export default UserProfilePage;