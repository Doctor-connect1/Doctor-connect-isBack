'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chatrooms: any[];
  selectedChat: any;
  onSelectChat: (chat: any) => void;
  currentUser: any;
}

export default function ChatList({ chatrooms, selectedChat, onSelectChat, currentUser }: ChatListProps) {
  const getOtherUser = (chatroom: any) => {
    return currentUser?.role === 'Doctor' ? chatroom.patient : chatroom.doctor;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
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
    </div>
  );
}
