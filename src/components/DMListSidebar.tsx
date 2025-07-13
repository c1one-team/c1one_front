import { ChatRoomList, MemberDto } from '@/api/api';
import { apiClient } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { useGetChatRoomsQuery } from '@/lib/api';

// 전역 API 클라이언트 사용
interface DMListSidebarProps {
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number) => void;
}

function isMe(userId?: number) {
  // 예: localStorage, useContext, Redux 등에서 본인 ID 불러오기
  const myId = Number(localStorage.getItem('userId')) || 1;
  return userId === myId;
}

export default function DMListSidebar({ onSelectRoom, selectedRoomId }: DMListSidebarProps)  {

  
  const { data: chatRooms = [], isLoading, error } = useGetChatRoomsQuery();

  useEffect(() => {
    console.log('채팅방 목록 데이터:', chatRooms);
    if (error) console.log('채팅방 목록 에러:', error);
  }, [chatRooms, error]);

  
  return (
    <aside className="w-80 border-r border-gray-800 flex flex-col">
      <div className="p-4 text-xl font-bold">메시지</div>
      <ul className="flex-1 overflow-y-auto">
        {chatRooms.map(room => {
          // 1:1 DM이면 "나"를 제외한 멤버를 표시, 그룹이면 members[0]
          const displayMember = (room.members ?? []).find(m => !isMe(m.userId)) ?? room.members?.[0] ?? {};
          return (
            <li
              key={room.chatroomId}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-900 ${selectedRoomId === room.chatroomId ? 'bg-gray-900' : ''}`}
              onClick={() => room.chatroomId && onSelectRoom(room.chatroomId)}
            >
              <div className="flex-1">
                <div className="font-semibold">{displayMember.username || '알수없음'}</div>
                <div className="text-sm text-gray-400 truncate">{room.lastMessage || '메시지 없음'}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}