import { ChatRoomList, MemberDto } from '@/api/api';
import { apiClient } from '@/lib/api';
import React, { useEffect, useState } from 'react';

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
  //{ onSelectRoom, selectedRoomId } dmlistsidebar()매개변수
  // // 임시 데이터 예시
  // const rooms = [
  //   { id: '1', username: '홍길동', profileImage: '/profile1.png', lastMessage: '뭐하고 있나요?', unreadCount: 2 },
  //   { id: '2', username: '김철수', profileImage: '/profile2.png', lastMessage: '2번쨰?', unreadCount: 0 },
  // ];

  // return (
  //   <aside className="w-80 border-r border-gray-800 flex flex-col">
  //     <div className="p-4 text-xl font-bold">메시지</div>
  //     <ul className="flex-1 overflow-y-auto">
  //       {rooms.map(room => (
  //         <li
  //           key={room.id}
  //           className={`flex items-center p-3 cursor-pointer hover:bg-gray-900 ${selectedRoomId === room.id ? 'bg-gray-900' : ''}`}
  //           onClick={() => onSelectRoom(room.id)}
  //         >
  //           <img src={room.profileImage} className="w-12 h-12 rounded-full mr-3" />
  //           <div className="flex-1">
  //             <div className="font-semibold">{room.username}</div>
  //             <div className="text-sm text-gray-400 truncate">{room.lastMessage}</div>
  //           </div>
  //           {room.unreadCount > 0 && (
  //             <span className="ml-2 bg-blue-500 text-xs rounded-full px-2 py-0.5">{room.unreadCount}</span>
  //           )}
  //         </li>
  //       ))}
  //     </ul>
  //   </aside>
  // );

  const [chatRooms, setChatRooms] = useState<ChatRoomList[]>([]);

  // useEffect(() => {
  //   api.chatrooms.getMyChatRooms()
  //     .then(res => setChatRooms(res.data))
  //     .catch(() => setChatRooms([]));
  // }, []);
  useEffect(() => {
    apiClient.comments.getMyChatRooms()
      .then(res => {
        console.log('채팅방 목록 응답:', res);
        setChatRooms(Array.isArray(res.data) ? res.data: []);
      })
      .catch(() => setChatRooms([]));
  }, []);

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