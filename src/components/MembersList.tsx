import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Shield } from "lucide-react";
import api from "@/lib/axios";

interface User {
    id: number;
    username: string;
    avatar?: string;
    role?: string;
    blacklisted?: boolean;
}

interface MembersListProps {
    users?: User[];
}

export function MembersList({ users }: MembersListProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ id, blacklisted }: { id: number; blacklisted: boolean }) => {
            const url = blacklisted
                ? `/api/admin/users/unblacklist/${id}`
                : `/api/admin/users/blacklist/${id}`;
            return api.post(url);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-users"]);
        },
        onError: (error) => {
            console.error("블랙리스트 처리 중 에러:", error);
        },
        onSettled: () => {
            setSelectedUser(null);
        }
    });

    const getRoleIcon = (role: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return <Crown className="h-3 w-3" />;
            case "moderator":
                return <Shield className="h-3 w-3" />;
            default:
                return <Users className="h-3 w-3" />;
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "default";
            case "moderator":
                return "secondary";
            default:
                return "outline";
        }
    };

    return (
        <>
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        All Members ({users?.length ?? 0})
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
                                const role = user.role || "user";

                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                            user.blacklisted
                                                ? "bg-red-900 text-white hover:bg-red-800"
                                                : "bg-muted/30 hover:bg-muted/50"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} alt={name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={getRoleBadgeVariant(role)}
                                                className="text-xs"
                                            >
                                                {getRoleIcon(role)}
                                                <span className="ml-1 capitalize">
                          {user.blacklisted ? "블랙리스트" : role}
                        </span>
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">불러올 회원이 없습니다.</p>
                    )}
                </CardContent>
            </Card>

            {/* 모달 */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-card text-foreground p-6 rounded-lg shadow-xl w-96">
                        <p className="mb-4 text-sm">
                            {selectedUser.blacklisted
                                ? `"${selectedUser.username}" 님의 정지를 해제하시겠습니까?`
                                : `"${selectedUser.username}" 님을 블랙리스트에 등록하시겠습니까?`}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 rounded bg-muted hover:bg-muted/50"
                            >
                                아니요
                            </button>
                            <button
                                onClick={() =>
                                    mutation.mutate({
                                        id: selectedUser.id,
                                        blacklisted: !!selectedUser.blacklisted,
                                    })
                                }
                                className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/80"
                            >
                                예
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
