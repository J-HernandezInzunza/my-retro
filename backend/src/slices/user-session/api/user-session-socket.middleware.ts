import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { UserSessionService } from '../business/user-session.service';

const userSessionService = new UserSessionService();

/**
 * Socket.io middleware to attach session information to socket
 */
const userSessionSocketMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    // Get session ID from socket handshake (sent by client)
    const sessionId = socket.handshake.auth?.sessionId || socket.handshake.query?.sessionId;
    
    if (!sessionId) {
      // Allow connection without session (for public features)
      socket.data.session = null;
      return next();
    }

    // Validate session exists and is active
    const session = await userSessionService.getSession(sessionId as string);
    
    if (!session) {
      // Session doesn't exist, allow connection but mark as no session
      socket.data.session = null;
      return next();
    }

    // Update last active time for the session
    await userSessionService.updateSession(sessionId as string, {
      lastActive: new Date()
    });

    // Attach session data to socket
    socket.data.session = {
      id: session.id,
      displayName: session.displayName,
      teamId: session.teamId,
      userId: session.userId,
      createdAt: session.createdAt,
      lastActive: session.lastActive
    };

    console.log(`Socket ${socket.id} authenticated with session: ${session.displayName} (${session.id})`);
    next();
  } catch (error) {
    console.error('Socket session middleware error:', error);
    // Don't block connection on session errors, just proceed without session
    socket.data.session = null;
    next();
  }
};

export default userSessionSocketMiddleware;