import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { registerUserSessionHandlers } from '../../slices/user-session/api/user-session-socket.handlers';
import { SESSION_EVENTS } from '../../slices/user-session/types/user-session';

// Track online users
export interface OnlineUser {
  socketId: string;
  displayName: string;
  sessionId: string | null;
  teamId: string | null;
  connectedAt: Date;
}

// Store online users
const onlineUsers: Map<string, OnlineUser> = new Map();

// Create Socket.IO server
export const createSocketServer = (httpServer: HttpServer) => {
  return new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
};

// Handle a single socket connection
export const handleSocketConnection = (io: Server, socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);
  const session = socket.data.session || null;
  
  // Add user to online users
  const user: OnlineUser = {
    socketId: socket.id,
    displayName: session?.displayName || 'Anonymous',
    sessionId: session?.id || null,
    teamId: session?.teamId || null,
    connectedAt: new Date(),
  };
  
  // Emit updated online users list to all clients (including newly connected user)
  onlineUsers.set(socket.id, user);
  console.log(`User connected: ${user.displayName} (Total online: ${onlineUsers.size})`);
  io.emit(SESSION_EVENTS.ONLINE_USERS, Array.from(onlineUsers.values()));
  
  // Register user session event handlers
  registerUserSessionHandlers(socket);

  // Handle disconnection
  socket.on('disconnect', () => handleSocketDisconnection(socket));
};

export const handleSocketDisconnection = (socket: Socket) => {
  const user = onlineUsers.get(socket.id);
  console.log(`User disconnected: ${user?.displayName} (Total online: ${onlineUsers.size})`);
  // Remove user from online users
  onlineUsers.delete(socket.id);
  
  // Emit updated online users list to all clients
  socket.broadcast.emit(SESSION_EVENTS.ONLINE_USERS, Array.from(onlineUsers.values()));
};
