
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import { User } from '@/lib/api';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      {/* Profile Picture */}
              <div className="flex justify-center md:justify-start">
          <Avatar className="w-32 h-32 md:w-40 md:h-40">
            {user.profileImage ? (
              <AvatarImage src={user.profileImage} alt="프로필" />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full"></div>
            )}
            <AvatarFallback className="text-2xl bg-instagram-gray">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

      {/* Profile Info */}
      <div className="flex-1 text-center md:text-left">
        {/* Username and Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <h1 className="text-2xl font-light">{user.username}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-instagram-gray text-instagram-text hover:bg-instagram-border">
              프로필 편집
            </Button>
            <Button variant="secondary" size="icon" className="bg-instagram-gray text-instagram-text hover:bg-instagram-border">
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center md:justify-start gap-8 mb-4">
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-instagram-muted text-sm">게시물</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-instagram-muted text-sm">팔로워</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-instagram-muted text-sm">팔로잉</div>
          </div>
        </div>

        {/* Bio */}
        <div className="text-sm">
          <div className="font-medium mb-1">{user.username}</div>
          <div className="text-instagram-muted">
            소개 없음
          </div>
        </div>
      </div>
    </div>
  );
};

