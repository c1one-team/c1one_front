import React, { useState } from 'react';

interface DMMessageInputProps {
  roomId: string;
  sendMessage: (msg: { roomId: string; content: string }) => void;
}

export default function DMMessageInput({ roomId, sendMessage }: DMMessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({
      roomId,
      content: text
      // senderId, senderName 등은 WebSocket에서 자동으로 붙이게!
    });
    setText('');
  };


  return (
    <div className="p-4 border-t border-gray-800 flex">
      <input
        className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 outline-none"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="메시지 입력..."
      />
      <button
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full"
        onClick={handleSend}
      >
        전송
      </button>
    </div>
  );
}