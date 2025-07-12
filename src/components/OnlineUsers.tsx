import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Wifi, Clock } from "lucide-react";

interface OnlineUser {
    id: number;
    username: string;
    avatar?: string;
    blacklisted?: boolean;
}

interface OnlineUsersProps {
    users?: OnlineUser[];
}

export function OnlineUsers({ users }: OnlineUsersProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-success";
            case "away":
                return "bg-warning";
            case "busy":
                return "bg-destructive";
            default:
                return "bg-muted";
        }
    };

    const getStatusBadgeVariant = (
        status: string
    ): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case "online":
                return "default";
            case "away":
                return "secondary";
            case "busy":
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-success" />
                    Online Users ({users?.length ?? 0})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {users && users.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {users.map((user) => {
                            const name = user.username || "Unknown";
                            const initials = name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();

                            return (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} alt={name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(
                                                    "online"
                                                )}`} // 항상 온라인으로 표시
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{name}</p>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">방금 전 활동</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant("online")} className="text-xs capitalize">
                                        online
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">현재 접속 중인 사용자가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}
