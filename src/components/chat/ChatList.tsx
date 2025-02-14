'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chatrooms: any[];
  selectedChat: any;
  onSelectChat: (chat: any) => void;
  currentUser: any;
}

export default function ChatList({ chatrooms, selectedChat, onSelectChat, currentUser }: ChatListProps) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/users/${currentUser?.role === 'Doctor' ? 'patients' : 'doctors'}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Available users:', data);
      setAvailableUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch available users');
    }
  };

  const createNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      if (!selectedUserId) {
        setError('Please select a user to chat with');
        return;
      }

      const payload = {
        doctorId: currentUser?.role === 'Doctor' ? currentUser.userId : selectedUserId,
        patientId: currentUser?.role === 'Patient' ? currentUser.userId : selectedUserId
      };

      console.log('Creating chat with payload:', payload);

      const response = await fetch('/api/chat/chatroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat created:', data);

      if (data.chatroom) {
        onSelectChat(data.chatroom);
        setShowNewChatModal(false);
        setError('');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create chat');
    }
  };

  const getOtherUser = (chatroom: any) => {
    return currentUser?.role === 'Doctor' ? chatroom.patient : chatroom.doctor;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={() => {
            setShowNewChatModal(true);
            fetchAvailableUsers();
            setError('');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          New Chat
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-b">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chatrooms.map((chatroom) => {
          const otherUser = getOtherUser(chatroom);
          const lastMessage = chatroom.messages[0];
          
          return (
            <div
              key={chatroom.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chatroom.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectChat(chatroom)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  {otherUser?.profilePicture ? (
                    <Image
                      src={otherUser.profilePicture}
                      alt={`${otherUser.firstName} ${otherUser.lastName}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl text-gray-600">
                        {otherUser?.firstName?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {`${otherUser?.firstName} ${otherUser?.lastName}`}
                    </h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(lastMessage.sentAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage.messageText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a {currentUser?.role === 'Doctor' ? 'patient' : 'doctor'}</option>
              {availableUsers.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setError('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                disabled={!selectedUserId}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
