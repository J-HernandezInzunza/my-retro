import { Socket } from 'socket.io';

import { USER_MANAGEMENT_EVENTS } from '../../../../../shared/backend';
import { SocketEventMap } from '../../../../../shared/socket';
import { UserManagementService } from "../business/user-management.service";

const userManagementService = new UserManagementService();

/**
 * Register all user management event handlers for a socket
 * @param socket The connected socket
 */
export const registerUserManagementHandlers = (socket: Socket): void => {
  socket.on(
    USER_MANAGEMENT_EVENTS.UPGRADE,
    async (
      data: SocketEventMap[typeof USER_MANAGEMENT_EVENTS.UPGRADE]['request'],
      callback?: (response: SocketEventMap[typeof USER_MANAGEMENT_EVENTS.UPGRADE]['response']) => void
    ) => {
      try {
        // Get session ID from socket data
        const sessionId = socket.data.session?.id;
        
        if (!sessionId) {
          return callback?.({ error: 'No active session' });
        }

        if (!data.email || !data.email.includes('@')) {
          return callback?.({ error: 'Valid email is required' });
        }

        // Upgrade session to user
        const user = await userManagementService.upgradeSessionToUser(sessionId, data);

        // Broadcast to any other connected clients for this user
        socket.broadcast.emit(USER_MANAGEMENT_EVENTS.UPDATED, { user });
        
        // Return newly created user to client
        callback?.({ user });
      } catch (error) {
        console.error('Upgrade session error:', error);
        callback?.({ error: 'Failed to upgrade session' });
      }
    }
  );

  socket.on(
    USER_MANAGEMENT_EVENTS.GET_USER,
    async (
      data: SocketEventMap[typeof USER_MANAGEMENT_EVENTS.GET_USER]['request'],
      callback?: (response: SocketEventMap[typeof USER_MANAGEMENT_EVENTS.GET_USER]['response']) => void
    ) => {
      try {
        // Get session ID from socket data
        const sessionId = socket.data.session?.id;
        const userId = data.userId;
        
        if (!sessionId) {
          return callback?.({ error: 'No active session' });
        }

        // Get user by ID
        const user = await userManagementService.getUser(userId);

        // Return user to client
        callback?.({ user });
      } catch (error) {
        console.error('Get user error:', error);
        callback?.({ error: 'Failed to get user' });
      }
    }
  )
}