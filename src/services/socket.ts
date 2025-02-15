import { io, Socket } from 'socket.io-client';
import { SocketAuthData, SocketMessageData, OnlineUser } from '@/types/chat';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private isAuthenticated = false;
  private readonly SOCKET_URL = 'http://localhost:4000';

  private constructor() {
    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      withCredentials: true
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      // Reset auth flag on new connection
      this.isAuthenticated = false;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isAuthenticated = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  // Authentication
  public authenticate(data: SocketAuthData): void {
    if (!this.socket || this.isAuthenticated) return;
    
    this.socket.emit('authenticate', data);
    this.isAuthenticated = true;
  }

  // Chat room events
  public joinRoom(roomId: number): void {
    if (!this.socket) return;
    this.socket.emit('joinRoom', roomId);
  }

  public leaveRoom(roomId: number): void {
    if (!this.socket) return;
    this.socket.emit('leaveRoom', roomId);
  }

  public sendMessage(data: SocketMessageData): void {
    if (!this.socket) return;
    this.socket.emit('sendMessage', data);
  }

  // Event listeners
  public onNewMessage(callback: (data: SocketMessageData) => void): void {
    if (!this.socket) return;
    this.socket.on('newMessage', callback);
  }

  public onOnlineUsers(callback: (users: OnlineUser[]) => void): void {
    if (!this.socket) return;
    this.socket.on('onlineUsers', callback);
  }

  public onUserJoined(callback: (userId: number) => void): void {
    if (!this.socket) return;
    this.socket.on('userJoined', callback);
  }

  public onUserLeft(callback: (userId: number) => void): void {
    if (!this.socket) return;
    this.socket.on('userLeft', callback);
  }

  // Remove event listeners
  public off(event: string): void {
    if (!this.socket) return;
    this.socket.off(event);
  }

  // Cleanup
  public disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
  }
}

export default SocketService;
