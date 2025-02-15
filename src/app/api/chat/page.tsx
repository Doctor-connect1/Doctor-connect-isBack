'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, Paperclip, Video, Phone, MoreVertical, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Home/Navbar';

interface Message {
  id: string;
  sender: string;
  content: string;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
  timestamp: Date;
}

export default function ChatRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Token:', token, 'Role:', role);
    if (!token || !role) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!roomId) return;

    const newSocket = io('http://localhost:3000', {
      query: { roomId }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
    };

    socket.emit('message', message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;

    const fileUrl = URL.createObjectURL(file);

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: 'Sent a file',
      type: 'file',
      fileUrl,
      fileName: file.name,
      timestamp: new Date(),
    };

    socket.emit('message', message);
    setMessages(prev => [...prev, message]);
  };

  const initiateVideoCall = () => {
    if (!params?.roomId) return;
    window.location.href = `/consultation/${params.roomId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        {/* Chat Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-lg font-semibold">Dr. Sarah Johnson</h2>
              <p className="text-sm text-gray-500">Cardiologist</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={initiateVideoCall}
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
        <div className="h-[600px] overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'You' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'You'
                      ? 'bg-blue-600 text-white'
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
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
