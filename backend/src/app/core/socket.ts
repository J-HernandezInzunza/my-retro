import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

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
    connectedAt: new Date()
  };
  
  onlineUsers.set(socket.id, user);
  
  console.log(`User connected: ${user.displayName} (Total online: ${onlineUsers.size})`);
  
  // Emit updated online users list to all clients
  io.emit('online users', Array.from(onlineUsers.values()));
  
  // Handle requests for online users list
  socket.on('get online users', () => {
    socket.emit('online users', Array.from(onlineUsers.values()));
  });

  socket.on('disconnect', () => {
    // Remove user from online users
    onlineUsers.delete(socket.id);
    console.log(`User disconnected: ${user.displayName} (Total online: ${onlineUsers.size})`);
    
    // Emit updated online users list to all clients
    io.emit('online users', Array.from(onlineUsers.values()));
  });
};
