'use client';

import { useState, useEffect } from 'react';
import ChatList from '@/components/chat/ChatList';
import ChatConversation from '@/components/chat/ChatConversation';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Decode JWT token to get user info
    const user = JSON.parse(atob(token.split('.')[1]));
    setCurrentUser(user);

    // Fetch chatrooms
    fetchChatrooms(user.userId, user.role, token);
  }, []);

  const fetchChatrooms = async (userId: number, role: string, token: string) => {
    try {
      const response = await fetch(`/api/chat/chatroom?userId=${userId}&role=${role}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setChatrooms(data.chatrooms);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat list sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <ChatList 
          chatrooms={chatrooms}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          currentUser={currentUser}
        />
      </div>

      {/* Chat conversation */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <ChatConversation 
            chatroom={selectedChat}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
