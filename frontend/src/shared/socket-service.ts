// src/shared/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

// Define the URL where your Socket.IO server is running
const SOCKET_URL = 'http://localhost:3001'; // Change this to match your backend URL

export class SocketService {
  private socket: Socket | null = null;
  public isConnected = ref(false);
  
  // Connect to the socket server
  connect(token?: string) {
    console.log('connect token: ', token);
    if (this.socket) return;
    
    // Connect with auth if token is provided
    this.socket = io(SOCKET_URL, {
      auth: token ? { token } : undefined,
      autoConnect: true,
      reconnection: true
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected.value = true;
    });
    
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected.value = false;
    });
    
    return this.socket;
  }
  
  // Get the socket instance
  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }
  
  // Disconnect the socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected.value = false;
    }
  }
  
  // Emit an event
  emit(event: string, ...args: any[]) {
    if (!this.socket) return;
    this.socket.emit(event, ...args);
  }
  
  // Listen for an event
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) this.connect();
    this.socket?.on(event, callback);
  }
  
  // Listen for an event once
  once(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) this.connect();
    this.socket?.once(event, callback);
  }
  
  // Stop listening for an event
  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

// Create a singleton instance
export const socketService = new SocketService();