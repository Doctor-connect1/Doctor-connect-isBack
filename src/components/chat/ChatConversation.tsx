'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface ChatConversationProps {
  chatroom: any;
  currentUser: any;
}

export default function ChatConversation({ chatroom, currentUser }: ChatConversationProps) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMessages();
    scrollToBottom();
  }, [chatroom.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chat/messages?chatroomId=${chatroom.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessages(data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chatroomId: chatroom.id,
          senderId: currentUser.userId,
          messageText: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <div className="relative w-10 h-10">
            {chatroom.doctor?.profilePicture ? (
              <Image
                src={chatroom.doctor.profilePicture}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg text-gray-600">
                  {chatroom.doctor?.firstName?.[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">
              {currentUser.role === 'Doctor' 
                ? `${chatroom.patient?.firstName} ${chatroom.patient?.lastName}`
                : `Dr. ${chatroom.doctor?.firstName} ${chatroom.doctor?.lastName}`
              }
            </h3>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderID === currentUser.userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderID === currentUser.userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <p>{message.messageText}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
