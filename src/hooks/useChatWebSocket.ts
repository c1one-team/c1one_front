import { useEffect, useRef } from 'react';
import { Client, IMessage, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type MessageHandler = (msg: Message) => void;

function getMyId(): number {
  return Number(localStorage.getItem('userId'));
}
function getMyName(): string {
  return localStorage.getItem('userName') || '익명';
}

export default function useChatWebSocket(roomId: string | null, onMessage: MessageHandler) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // 1. WebSocket 연결
    const socket = new SockJS('/ws-chat'); // 백엔드 엔드포인트
    const client = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      // 2. 채팅방 구독
      client.subscribe(`/topic/chatroom.${roomId}`, (message: IMessage) => {
        const body = JSON.parse(message.body);
        console.log('수신 메시지:', body); 
        onMessage(body);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId, onMessage]);

  // 3. 메시지 전송 함수 반환
  const sendMessage = (msg: { roomId: string; content: string }) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: `/app/${msg.roomId}`,
        body: JSON.stringify({
          senderId: getMyId(),
          message: msg.content,
          createdAt: new Date().toISOString(),
          chatroomId: msg.roomId,
          senderName: getMyName(),
        }),
      });
    }
  };

  return { sendMessage };
}