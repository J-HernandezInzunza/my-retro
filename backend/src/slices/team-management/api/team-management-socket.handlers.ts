import { Socket } from 'socket.io';

import { TEAM_MANAGEMENT_EVENTS } from '../../../../../shared/backend';
import { SocketEventMap } from '../../../../../shared/socket';
import { TeamManagementService } from '../business/team-management.service';

const teamManagementService = new TeamManagementService();

/**
 * Register all team management event handlers for a socket
 * @param socket The connected socket
 */
export const registerTeamManagementHandlers = (socket: Socket): void => {
  socket.on(
    TEAM_MANAGEMENT_EVENTS.JOIN_TEAM,
    async (
      data: SocketEventMap[typeof TEAM_MANAGEMENT_EVENTS.JOIN_TEAM]['request'],
      callback?: (response: SocketEventMap[typeof TEAM_MANAGEMENT_EVENTS.JOIN_TEAM]['response']) => void
    ) => {
      try {
        // Get session ID from socket data
        const sessionId = socket.data.session?.id;
        
        if (!sessionId) {
          return callback?.({ error: 'No active session' });
        }

        if (!data.inviteCode) {
          return callback?.({ error: 'Invite code is required' });
        }

        // Update session with team ID
        const teamDetailsResponse = await teamManagementService.joinTeam({ userId: data.userId, inviteCode: data.inviteCode });
        
        if (!teamDetailsResponse) {
          return callback?.({ error: 'Team not found' });
        }
        
        // Return updated session to client
        callback?.(teamDetailsResponse);
      } catch (error) {
        console.error('Join team error:', error);
        callback?.({ error: 'Failed to join team' });
      }
    }
  );
};
