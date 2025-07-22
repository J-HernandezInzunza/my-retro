import { Socket } from 'socket.io';
import { UserSessionService } from '../business/user-session.service';
import { SocketUserEventMap, SESSION_EVENTS } from '../../../../../shared/backend';

const userSessionService = new UserSessionService();

/**
 * Register all user session event handlers for a socket
 * @param socket The connected socket
 */
export const registerUserSessionHandlers = (socket: Socket): void => {
  /**
   * Initialize a session via WebSocket
   * If token is provided, attempt to resume that session
   * Otherwise create a new session
   */
  socket.on(
    SESSION_EVENTS.INITIALIZE,
    async (
      data: SocketUserEventMap[typeof SESSION_EVENTS.INITIALIZE]['request'],
      callback?: (response: SocketUserEventMap[typeof SESSION_EVENTS.INITIALIZE]['response']) => void
    ) => {
    try {
      // Check if there's a token in the auth
      const token = socket.handshake.auth?.token;
      let sessionId = socket.data.session?.id;
      
      // If we have a token but no session data, it means token was invalid
      // In that case, create a new session
      if (token && !sessionId) {
        // Token was invalid, will create new session
        sessionId = undefined;
      }

      // Initialize or retrieve session
      const result = await userSessionService.initializeSession(sessionId, { 
        displayName: data.displayName 
      });
      
      // Store session in socket data
      socket.data.session = result.session;

      // Store token in socket auth for reconnections
      const newToken = result.session.id; // For now, token is the session ID
      socket.handshake.auth.token = newToken;

      // Broadcast to any other connected clients for this user
      socket.broadcast.emit(SESSION_EVENTS.UPDATED, { session: result.session });
      
      // Return session data and token to client
      callback?.({
        session: result.session,
        token: newToken
      });
    } catch (error) {
      console.error('Session initialize error:', error);
      callback?.({ error: 'Failed to initialize session' });
    }
  });

  /**
   * Update display name via WebSocket
   */
  socket.on(
    SESSION_EVENTS.UPDATE_NAME,
    async (
      data: SocketUserEventMap[typeof SESSION_EVENTS.UPDATE_NAME]['request'],
      callback?: (response: SocketUserEventMap[typeof SESSION_EVENTS.UPDATE_NAME]['response']) => void
    ) => {
    try {
      // Get session ID from socket data
      const sessionId = socket.data.session?.id;
      
      if (!sessionId) {
        return callback?.({ error: 'No active session' });
      }

      if (!data.displayName || typeof data.displayName !== 'string' || data.displayName.trim() === '') {
        return callback?.({ error: 'Valid display name is required' });
      }

      // Update session in database
      const updatedSession = await userSessionService.updateSession(sessionId, { displayName: data.displayName });
      
      if (!updatedSession) {
        return callback?.({ error: 'Session not found' });
      }

      // Update session in socket data
      socket.data.session = updatedSession;

      // Broadcast to any other connected clients for this user
      socket.broadcast.emit(SESSION_EVENTS.UPDATED, { session: updatedSession });
      
      // Return updated session to client
      callback?.({ session: updatedSession });
      
    } catch (error) {
      console.error('Update display name error:', error);
      callback?.({ error: 'Failed to update display name' });
    }
  });

  /**
   * Join team via WebSocket
   */
  socket.on(SESSION_EVENTS.JOIN_TEAM, async (
    data: SocketUserEventMap[typeof SESSION_EVENTS.JOIN_TEAM]['request'],
    callback?: (response: SocketUserEventMap[typeof SESSION_EVENTS.JOIN_TEAM]['response']) => void
  ) => {
    try {
      // Get session ID from socket data
      const sessionId = socket.data.session?.id;
      
      if (!sessionId) {
        return callback?.({ error: 'No active session' });
      }

      if (!data.teamId) {
        return callback?.({ error: 'Team ID is required' });
      }

      // Update session with team ID
      const updatedSession = await userSessionService.updateSession(sessionId, { teamId: data.teamId });
      
      if (!updatedSession) {
        return callback?.({ error: 'Session not found' });
      }

      // Update session in socket data
      socket.data.session = updatedSession;

      // Broadcast to any other connected clients for this user
      socket.broadcast.emit(SESSION_EVENTS.UPDATED, { session: updatedSession });
      
      // Return updated session to client
      callback?.({ session: updatedSession });
      
    } catch (error) {
      console.error('Join team error:', error);
      callback?.({ error: 'Failed to join team' });
    }
  });

  /**
   * Clear session via WebSocket
   */
  socket.on(SESSION_EVENTS.CLEAR, async (
    _data: SocketUserEventMap[typeof SESSION_EVENTS.CLEAR]['request'],
    callback?: (response: SocketUserEventMap[typeof SESSION_EVENTS.CLEAR]['response']) => void
  ) => {
    try {
      // Get session ID from socket data
      const sessionId = socket.data.session?.id;
      
      if (!sessionId) {
        return callback?.({ success: true }); // Already no session
      }

      // Delete session from database
      await userSessionService.deleteSession(sessionId);

      // Clear session from socket data
      socket.data.session = null;

      // Clear token from socket auth
      delete socket.handshake.auth.token;

      // Broadcast to any other connected clients for this user
      socket.broadcast.emit(SESSION_EVENTS.CLEARED);
      
      // Return success to client
      callback?.({ success: true });
      
    } catch (error) {
      console.error('Clear session error:', error);
      callback?.({ error: 'Failed to clear session' });
    }
  });
};
