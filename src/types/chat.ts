// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Doctor' | 'Patient';
  username: string;
}

// Chat room types
export interface ChatRoom {
  id: number;
  doctorID: number;
  patientID: number;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
  };
  patient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Message types
export interface ChatMessage {
  id: number;
  chatroomID: number;
  senderID: number;
  messageText: string;
  sentAt: string;
  sender: any;
  chatroom: any;
  createdAt: string;
  updatedAt: string;
}

// Component prop types
export interface ChatLayoutProps {
  currentUser: User;
}

export interface UsersListProps {
  currentUser: User;
  onSelectRoom: (room: ChatRoom) => void;
  selectedRoom: ChatRoom | null;
}

export interface ChatAreaProps {
  currentUser: User;
  selectedRoom: ChatRoom | null;
}

export interface MessageProps {
  message: ChatMessage;
  isOwn: boolean;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

// Socket event types
export interface SocketAuthData {
  userId: number;
  role: string;
}

export interface SocketMessageData {
  id: number;
  chatroomId: number;
  senderId: number;
  message: string;
  sentAt: string;
  sender: any; // Replace with your User type
  chatroom: any; // Replace with your Chatroom type
}

export interface OnlineUser {
  userId: number;
  role: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
}

export interface RoomResponse {
  room: ChatRoom;
}

export interface RoomsResponse {
  rooms: ChatRoom[];
}

export interface Message {
  id: number;
  chatroomID: number;
  senderID: number;
  messageText: string;
  sentAt: string;
}
