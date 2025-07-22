import { defineStore } from 'pinia';

import {
  SESSION_EVENTS,
  type UserSession,
  type UserSessionInitializeRequest,
  type UserSessionUpdateRequest,
} from '@shared/backend';
import { socketService } from '@/shared/socket-service';

interface UserSessionState {
  userSession: {
    isLoading: boolean,
    data: UserSession | null,
    error: string | null,
  }
}

/**
 * Store for managing user session state
 * Provides access to session data and operations
 */
export const useUserSessionStore = defineStore('userSession', {
  state: (): UserSessionState => ({
    userSession: {
      isLoading: false,
      data: null,
      error: null,
    },
  }),
  actions: {
    async initializeUserSession(data: UserSessionInitializeRequest = {}): Promise<void> {
      try {
        console.log('[UserSessionStore] Initializing');
        this.userSession.isLoading = true;
        this.userSession.error = null;
        const response = await socketService.emitAsync<typeof SESSION_EVENTS.INITIALIZE>(SESSION_EVENTS.INITIALIZE, data);
  
        if ('error' in response) {
          this.userSession.error = response.error;
          return;
        }
        // Save token in socket service
        socketService.setToken(response.token);
        this.userSession.data = response.session; 
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session';
        this.userSession.error = errorMessage;
      } finally {
        this.userSession.isLoading = false;
      }
    },
    
    /**
     * Fetch the current user session from the server
     */
    async fetchSession(displayName?: string): Promise<void> {
      // TODO:
    },
    
    /**
     * Update user's display name
     */
    async updateDisplayName(data: UserSessionUpdateRequest): Promise<void> {
      try {
        this.userSession.isLoading = true;
        this.userSession.error = null;
        const response = await socketService.emitAsync<typeof SESSION_EVENTS.UPDATE_NAME>(SESSION_EVENTS.UPDATE_NAME, data);

        if ('error' in response) {
          this.userSession.error = response.error;
          return;
        }

        if (!this.userSession.data) {
          return;
        }

        this.userSession.data.displayName = response.session.displayName;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update display name';
        this.userSession.error = errorMessage;
      } finally {
        this.userSession.isLoading = false;
      }
    },
    
    /**
     * Join a team via WebSocket
     */
    async joinTeam(data: UserSessionUpdateRequest): Promise<void> {
      try {
        this.userSession.isLoading = true;
        this.userSession.error = null;
        const response = await socketService.emitAsync<typeof SESSION_EVENTS.JOIN_TEAM>(SESSION_EVENTS.JOIN_TEAM, data);

        if ('error' in response) {
          this.userSession.error = response.error;
          return;
        }

        if (!this.userSession.data) {
          return;
        }

        this.userSession.data.teamId = response.session.teamId;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to join team';
        this.userSession.error = errorMessage;
      } finally {
        this.userSession.isLoading = false;
      }
    },

    /**
     * Reset store state (without clearing backend session)
     */
    reset(): void {
      this.userSession = {
        isLoading: false,
        data: null,
        error: null,
      };
    }
  },
  getters: {
    /**
     * Check if user has identified themselves (has display name)
     */
    isIdentified(state: UserSessionState): boolean {
      const isAnonymous = state.userSession?.data?.displayName.includes('Anonymous User')
      return Boolean(!isAnonymous);
    },
    
    /**
     * Check if user has joined a team
     */
    hasTeam(state: UserSessionState): boolean {
      return Boolean(state.userSession?.data?.teamId);
    },
    
    /**
     * Check if user is fully onboarded (identified and joined team)
     */
    isOnboarded(state: UserSessionState): boolean {
      return Boolean(state.userSession?.data?.displayName && state.userSession?.data?.teamId);
    },
    
    /**
     * Get user's display name or empty string
     */
    displayName(state: UserSessionState): string {
      return state.userSession?.data?.displayName || '';
    },
    
    /**
     * Get user's team ID or null
     */
    teamId(state: UserSessionState): string | null {
      return state.userSession?.data?.teamId || null;
    },
    
    /**
     * Get user's session ID or null
     */
    sessionId(state: UserSessionState): string | null {
      return state.userSession?.data?.id || null;
    },
  }
});
