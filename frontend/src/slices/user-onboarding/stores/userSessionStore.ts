import { defineStore } from 'pinia';

import {
  SESSION_EVENTS,
  USER_MANAGEMENT_EVENTS,
  // UserRole,
  type UserSession,
  type UserSessionInitializeRequest,
  type UserSessionUpdateRequest,
  type UserSessionUpgradeRequest,
  type User,
} from '@shared/backend';
import { socketService } from '@/shared/socket-service';

interface UserState {
  userSession: {
    isLoading: boolean,
    data: UserSession | null,
    error: string | null,
  }
  user: {
    isLoading: boolean,
    data: User | null,
    error: string | null,
  }
}

/**
 * Store for managing user and session state
 * Provides access to session data and operations
 */
export const useUserSessionStore = defineStore('userSession', {
  state: (): UserState => ({
    userSession: {
      isLoading: false,
      data: null,
      error: null,
    },
    user: {
      isLoading: false,
      data: null,
      error: null,
    },
  }),
  actions: {
    bindEvents() {
      socketService.getSocket().on(SESSION_EVENTS.UPDATED, (session: UserSession) => {
        console.log('Session updated: ', session);
        this.handleSessionUpdated(session);
      });
    },
    handleSessionUpdated(session: UserSession) {
      const previousUserId = this.userSession.data?.userId;
      this.userSession.data = session;
      
      // Reactive: If userId changed from null to a value, fetch user data
      if (!previousUserId && session.userId) {
        this.fetchLinkedUser(session.userId);
      }
      
      // Reactive: If userId was removed, clear user data
      if (previousUserId && !session.userId) {
        this.user.data = null;
      }
    },
    async initializeUserSession(data: UserSessionInitializeRequest = {}): Promise<void> {
      try {
        
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
        
        // Auto-fetch user data if session is already linked to a user
        console.log('response.session.userId: ', response.session.userId);
        if (response.session.userId) {
          await this.fetchLinkedUser(response.session.userId);
        } 
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session';
        this.userSession.error = errorMessage;
      } finally {
        this.userSession.isLoading = false;
      }
    },
    
    /**
     * Fetch user data for a linked session (reactive to session.userId)
     */
    async fetchLinkedUser(userId: string): Promise<void> {
      try {
        this.user.isLoading = true;
        this.user.error = null;
        
        const response = await socketService.emitAsync<typeof USER_MANAGEMENT_EVENTS.GET_USER>(USER_MANAGEMENT_EVENTS.GET_USER, { userId });
        console.log('response: ', response);
        
        if ('error' in response) {
          throw new Error(response.error);
        }
        
        this.user.data = response.user;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
        this.user.error = errorMessage;
        console.error('Failed to fetch linked user:', err);
      } finally {
        this.user.isLoading = false;
      }
    },
    
    /**
     * Upgrade user session to user account
     */
    async upgradeSessionToUser(data: UserSessionUpgradeRequest): Promise<void> {
      try {
        this.user.isLoading = true;
        this.user.error = null;
        const response = await socketService.emitAsync<typeof USER_MANAGEMENT_EVENTS.UPGRADE>(USER_MANAGEMENT_EVENTS.UPGRADE, data);

        if ('error' in response) {
          this.user.error = response.error;
          return;
        }

        this.user.data = response.user;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upgrade session';
        this.user.error = errorMessage;
      } finally {
        this.user.isLoading = false;
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
      this.user = {
        isLoading: false,
        data: null,
        error: null,
      };
    }
  },
  getters: {
    // UI Helper: Current display name (User takes precedence over Session)
    currentDisplayName: (state): string | null => {
      return state.user.data?.displayName || state.userSession.data?.displayName || null;
    },

    // UI Helper: Is user registered (has permanent account)
    isRegistered: (state): boolean => {
      return state.user.data !== null;
    },

    // UI Helper: Can create teams (requires ADMIN role)
    canCreateTeams: (state): boolean => {
      // return state.user.data?.role === UserRole.ADMIN;
      return state.user.data?.role === 'ADMIN';
    },

    // UI Helper: Current user role (null if not registered)
    currentRole: (state): string | null => {
      return state.user.data?.role || null;
    },

    // UI Helper: Session ID for socket operations
    sessionId: (state): string | null => {
      return state.userSession.data?.id || null;
    },

    // UI Helper: Overall loading state
    isLoading: (state): boolean => {
      return state.userSession.isLoading || state.user.isLoading;
    },

    // UI Helper: Any errors
    hasError: (state): boolean => {
      return Boolean(state.userSession.error || state.user.error);
    },

    // UI Helper: Combined error message
    errorMessage: (state): string | null => {
      return state.user.error || state.userSession.error || null;
    },

    // Legacy getters (keeping for backward compatibility)
    // Note: Removed teamId-based getters since UserSession doesn't have teamId
    hasTeam(state: UserState): boolean {
      return Boolean(state.user?.data); // Team membership will be handled by User entity
    },
  },
});
