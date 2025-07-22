import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { UserSessionService } from '../business/user-session.service';

const userSessionService = new UserSessionService();

/**
 * Socket.io middleware to attach session information to socket using token authentication
 */
const userSessionSocketMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    // Get token from socket handshake (sent by client)
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    
    if (!token) {
      // Allow connection without session (for public features)
      socket.data.session = null;
      return next();
    }

    // For now, token is the session ID
    // In future, implement proper token validation/decoding
    const sessionId = token as string;

    // Validate session exists and is active
    const session = await userSessionService.getSession(sessionId);
    
    if (!session) {
      console.log(`Socket ${socket.id} authentication failed: Invalid token`);
      // Session doesn't exist, allow connection but mark as no session
      socket.data.session = null;
      return next();
    }

    // Update last active time for the session
    await userSessionService.updateSessionActivity(sessionId);

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