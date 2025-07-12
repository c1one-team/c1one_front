import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { MembersList } from "@/components/MembersList";
import { OnlineUsers } from "@/components/OnlineUsers";
import api from "@/lib/axios";

export const AdminDashboard = () => {
    // 통계
    const { data: rawStats, isLoading: statsLoading } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: () => api.get("/api/admin/dashboard").then((res) => res.data),
    });

    // 전체 유저
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: () => api.get("/api/admin/users").then((res) => res.data),
    });

    // 온라인 유저
    const { data: onlineUsers, isLoading: onlineLoading } = useQuery({
        queryKey: ["admin-online-users"],
        queryFn: () => api.get("/api/admin/users/online").then((res) => res.data),
    });

    if (statsLoading || usersLoading || onlineLoading) {
        return <p>로딩 중...</p>;
    }

    // stats 변환
    const stats = rawStats
        ? {
            totalUsers: rawStats.userCount,
            totalPosts: rawStats.postCount,
            totalComments: rawStats.commentCount,
            totalLikes: rawStats.postLikeCount + rawStats.commentLikeCount,
        }
        : undefined;

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h2 className="text-2xl font-bold text-foreground">관리자 DashBoard</h2>
                <p className="text-muted-foreground text-sm">
                    UNIQRAM 통계
                </p>
            </div>

            {/* 통계 카드 */}
            <StatsCard stats={stats} />

            {/* 차트 자리 (User Growth Chart 나중에 추가할 수 있음) */}
            {/* <UserGrowthChart data={growthData} /> */}

            {/* 2단 그리드로 정렬 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MembersList users={users} />
                <OnlineUsers users={onlineUsers} />
            </div>
        </div>
    );
};

export default AdminDashboard;