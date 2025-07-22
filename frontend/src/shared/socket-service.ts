// src/shared/services/socketService.ts
import type { EventRequestType, EventResponseType, SocketUserEventMap } from '@shared/backend';
import { io, Socket } from 'socket.io-client';
import { reactive } from 'vue';

// Define the URL where your Socket.IO server is running
const SOCKET_URL = 'http://localhost:3001'; // Change this to match your backend URL

// Token storage key
const TOKEN_STORAGE_KEY = 'myretro_session_token';

export class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  public state = reactive({
    connected: false,
  });
  
  /**
   * Connect to the socket server
   * Uses stored token from localStorage if available
   */
  connect(token?: string) {
    // Check if we have a token in localStorage or passed to the function
    if (token) {
      this.setToken(token)
    } else if (this.loadToken()) {
      this.setToken(this.loadToken()!)
    }
    
    console.log('[SocketService] Connection attempt - token status:', this.token ? 'present' : 'missing');
    
    // If already connected, update auth
    if (this.socket) {
      if (this.token) {
        this.socket.auth = { token: this.token };
      }
      return this.socket;
    }
    
    // Connect with auth if token is provided
    this.socket = io(SOCKET_URL, {
      auth: this.token ? { token: this.token } : undefined,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    this.setupSocketListeners();
    
    return this.socket;
  }
  
  /**
   * Set up standard socket event listeners
   */
  private setupSocketListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      console.log('[SocketService] Connection established - socket.io ID:', this.socket?.id);
      this.state.connected = true;
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log(`[SocketService] Connection closed - reason: ${reason}`);
      this.state.connected = false;
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Connection failed - error:', error.message);
      this.state.connected = false;
      
      // If error is due to authentication, clear invalid token
      if (error.message?.includes('auth')) {
        console.warn('Auth error detected, clearing token');
        this.clearToken();
      }
    });
  }
  
  /**
   * Get the socket instance
   * Will connect if not already connected
   */
  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }
  
  /**
   * Get the current token
   */
  getToken(): string | null {
    return this.token;
  }
  
  /**
   * Set a new token and reconnect with it
   */
  setToken(token: string): void {
    if (!token) return;
    
    this.token = token;
    this.saveToken(token);
    
    // Update socket auth with new token
    if (this.socket) {
      this.socket.auth = { token };
      console.log('Updated socket auth with new token');
    }
  }
  
  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }
  
  /**
   * Load token from localStorage
   */
  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  
  /**
   * Clear the stored token
   */
  clearToken(): void {
    this.token = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  
  /**
   * Disconnect the socket
   * If clearToken is true, will also remove stored token
   */
  disconnect(clearToken: boolean = false) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    if (clearToken) {
      this.clearToken();
    }
  }

  public emitAsync<E extends keyof SocketUserEventMap>(
    eventName: E,
    data?: EventRequestType<E>,
  ): Promise<EventResponseType<E>> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      
      socket.emit(eventName, data, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }
}

// Create a singleton instance
export const socketService = new SocketService();