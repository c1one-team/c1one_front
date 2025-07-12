import React, { useCallback, useState } from 'react';
import DMMessageList from './DMMessageList';
import DMMessageInput from './DMMessageInput';
import useChatWebSocket from '@/hooks/useChatWebSocket';

export default function DMChatWindow({ roomId }) {

  const [messages, setMessages] = useState([]);

  // 새 메시지 수신 시 처리
  const handleMessage = useCallback((msg) => {
    setMessages(prev => {
      if (prev.some(m => m.messageId === msg.messageId)) return prev;
      return [...prev, msg];
  });
  }, []);

  const { sendMessage } = useChatWebSocket(roomId, handleMessage);
  
  if (!roomId) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">대화를 선택하세요</div>;
  }
  return (
    <section className="flex-1 flex flex-col h-full">
      <DMMessageList roomId={roomId} />
      <DMMessageInput roomId={roomId} sendMessage={sendMessage} />
    </section>
  );
}