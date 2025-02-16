'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { Send, Paperclip, Video, Phone, MoreVertical, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  sender: string;
  content: string;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
  timestamp: Date;
  roomId: string;
}

interface OnlineDoctor {
  id: string;
  name: string;
  isOnline: boolean;
}

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId;
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [onlineDoctors, setOnlineDoctors] = useState<OnlineDoctor[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:4000', {
      auth: { 
        token: localStorage.getItem('token'),
        userId: user.id
      },
      query: { 
        userId: user.id,
        role: user.role,
        name: user.name
      }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('authenticate', {
        userId: user.id,
        role: user.role,
        name: user.name
      });

      if (user.role === 'DOCTOR') {
        newSocket.emit('doctor-connect', {
          id: user.id,
          name: user.name
        });
      }
    });

    newSocket.on('online-doctors', (doctors: OnlineDoctor[]) => {
      setOnlineDoctors(doctors);
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.emit('get-online-doctors');
    newSocket.emit('join-room', roomId);

    return () => {
      if (user.role === 'DOCTOR') {
        newSocket.emit('doctor-disconnect', user.id);
      }
      newSocket.disconnect();
    };
  }, [user, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomId) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      roomId: roomId as string
    };

    socket.emit('message', message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socket || !roomId) return;

    const fileUrl = URL.createObjectURL(file);
    const message: Message = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      content: 'Sent a file',
      type: 'file',
      fileUrl,
      fileName: file.name,
      timestamp: new Date(),
      roomId: roomId as string
    };

    socket.emit('message', message);
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 gap-4">
      {/* Online Doctors Sidebar */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Online Doctors</h2>
        <div className="space-y-3">
          {onlineDoctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Dr. {doctor.name}</span>
            </div>
          ))}
          {onlineDoctors.length === 0 && (
            <p className="text-sm text-gray-500">No doctors online</p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-3 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-teal-600 font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-lg">
                  {user?.role === 'DOCTOR' ? `Dr. ${user.name}` : user?.name}
                </h2>
                <p className="text-teal-600">Text Consultation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/consultation/${roomId}`)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Video className="h-6 w-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <Phone className="h-6 w-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <MoreVertical className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === user?.name ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === user?.name
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  {message.type === 'text' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        {message.fileName}
                      </a>
                    </div>
                  )}
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <form onSubmit={sendMessage} className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="h-6 w-6" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="bg-teal-600 text-white rounded-lg p-2 hover:bg-teal-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
