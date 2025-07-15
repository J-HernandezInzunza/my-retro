import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

export const initSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Example: Listen for a custom event from the client
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      // Broadcast the message to all other clients
      socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
