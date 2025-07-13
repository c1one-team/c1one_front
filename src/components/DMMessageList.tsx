import React, { useCallback, useEffect, useRef, useState } from 'react';
import useChatWebSocket from '@/hooks/useChatWebSocket';
import { ChatMessageList } from '@/api/api';
import { apiClient } from '@/lib/api';

// 전역 API 클라이언트 사용

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
  const myId = 2; //TODO: 실제 내 userId 받아오기

  // 실시간 수신
  const handleMessage = useCallback((msg: any) => {
    setMessages(prev => [...prev, {
      id: msg.messageId || msg.id,
      content: msg.content,
      isMine: msg.senderId === myId,
      timestamp: formatTime(msg.createdAt),
      isRead: msg.isRead,
      senderId: msg.senderId,
    },
  ]);
  }, [myId]);

  const { sendMessage } = useChatWebSocket(roomId, handleMessage);

  // roomId가 바뀌면 실제 DB에서 메시지 fetch
  useEffect(() => {
    let ignore = false;
    if (roomId) {
      apiClient.api.getChatMessages(Number(roomId))
        .then(res => {
          if (!ignore) {
            const msgs = res.map((msg: any) => ({
              id: msg.messageId || msg.id,
              isMine: msg.senderId === myId,
              senderName: msg.senderName,
              content: msg.content || msg.message,
              timestamp: formatTime(msg.createdAt),
              isRead: msg.isRead,
            }));
            setMessages(msgs);
          }
        });
    } else {
      setMessages([]);
    }
    return () => { ignore = true; };
  }, [roomId, myId]);



  // 새 메시지가 오면 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, roomId]);

  if (!roomId) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">대화를 선택하세요</div>;
  }

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto flex flex-col p-4 space-y-reverse space-y-2"
      style={{ minHeight: 0 }}
    >
      {messages.map((msg, idx) => (
        <div
          key={msg.messageId ?? msg.senderId ?? idx}
          className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.isMine ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}>
            <div>{msg.content}</div>
            <div className="text-xs text-gray-400 text-right mt-1">
              {msg.timestamp} {msg.isRead && <span>읽음</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTime(createdAt: any) {
  // 원하는 형식으로 변환
  // const date = new Date(dateString);
  // return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

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