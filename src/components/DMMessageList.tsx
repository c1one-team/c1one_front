import React, { useCallback, useEffect, useRef, useState } from 'react';
import useChatWebSocket from '@/hooks/useChatWebSocket';
import { useGetChatMessagesQuery } from '@/lib/api';
import { apiClient, apiService } from '@/lib/api';
import { useAppDispatch } from '@/lib/hooks';
import { skipToken } from '@reduxjs/toolkit/query';



interface Message {
  id: string;
  messageId?: number;
  senderId?: number;
  content: string;
  isMine: boolean;
  timestamp: string;
  isRead: boolean;
}

interface DMMessageListProps {
  roomId: string | null;
}

export default function DMMessageList({ roomId }: DMMessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const myId = getMyId(); //TODO: 실제 내 userId 받아오기

  const dispatch = useAppDispatch();

  //메세지 불러오기
  const { data: messagesData = [], isLoading, error } = useGetChatMessagesQuery(roomId ? Number(roomId) : skipToken);


  useChatWebSocket(roomId, (msg) => {
    // (1) 메시지 스키마 변환(프론트/백엔드 일치 주의)
    const normalized = {
      ...msg,
      messageId: msg.messageId ?? msg.id,
      senderId: msg.senderId,
      content: msg.content || msg.message,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
    };
    // (2) RTK Query 캐시에 바로 반영 (중복 메시지 여부 체크도 추가 가능)
    dispatch(
      apiService.util.updateQueryData('getChatMessages', Number(roomId), (draft = []) => {
        // 중복방지: messageId 기준으로 이미 있으면 추가X
        if (!draft.some((m: any) => m.messageId === normalized.messageId)) {
          draft.push(normalized);
        }
      })
    );
  });




  // 새 메시지가 오면 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messagesData, roomId]);

  if (!roomId) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">대화를 선택하세요</div>;
  }

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto flex flex-col p-4 space-y-reverse space-y-2"
      style={{ minHeight: 0 }}
    >
      {messagesData.map((msg) => (
        <div
          key={msg.messageId}
          className={`flex ${msg.senderId === myId ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.senderId === myId ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}>
            <div>{msg.message}</div>
            <div className="text-xs text-gray-400 text-right mt-1">
              {formatTime(msg.createdAt)} {msg.isRead && <span>읽음</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTime(createdAt: any) {
  // 원하는 형식으로 변환


  // createdAt이 배열이면 LocalDateTime으로 변환
  if (Array.isArray(createdAt)) {
    // [year, month, day, hour, min, sec, nano]
    const [year, month, day, hour, minute, second, nano] = createdAt;
    const date = new Date(
      year,
      month - 1, // JS month: 0-base
      day,
      hour,
      minute,
      second,
      nano ? Math.floor(nano / 1000000) : 0
    );
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  // 문자열인 경우
  if (typeof createdAt === 'string') {
    const date = new Date(createdAt);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
  }
  return '';
}

function getMyId() {
  return Number(localStorage.getItem('userId')) || 1;
}