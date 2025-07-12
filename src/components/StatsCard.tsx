import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageCircle, Heart } from "lucide-react";

interface Stats {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
}

interface StatsCardProps {
    stats?: Stats; // optional 처리
}

export function StatsCard({ stats }: StatsCardProps) {
    if (!stats) {
        return (
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        통계 데이터를 불러올 수 없습니다.
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    const statItems = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            gradient: "bg-gradient-primary",
            color: "text-primary-foreground"
        },
        {
            title: "Total Posts",
            value: stats.totalPosts.toLocaleString(),
            icon: FileText,
            gradient: "bg-gradient-success",
            color: "text-success-foreground"
        },
        {
            title: "Total Comments",
            value: stats.totalComments.toLocaleString(),
            icon: MessageCircle,
            gradient: "bg-gradient-info",
            color: "text-info-foreground"
        },
        {
            title: "Total Likes",
            value: stats.totalLikes.toLocaleString(),
            icon: Heart,
            gradient: "bg-gradient-warning",
            color: "text-warning-foreground"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Card key={item.title} className="relative overflow-hidden border-0 shadow-lg">
                        <div className={`absolute inset-0 ${item.gradient} opacity-10`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {item.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${item.gradient}`}>
                                <Icon className={`h-4 w-4 ${item.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-bold text-foreground">{item.value}</div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
