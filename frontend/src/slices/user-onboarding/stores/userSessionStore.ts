import { defineStore } from 'pinia';

import type { UserSession, UserSessionUpdateRequest } from '@shared/backend';
import { UserSessionApi } from '../api/user-session.api';

interface UserSessionState {
  session: UserSession | null;
  loading: boolean;
  error: string | null;
}

/**
 * Store for managing user session state
 * Provides access to session data and operations
 */
export const useUserSessionStore = defineStore('userSession', {
  state: (): UserSessionState => ({
    session: null,
    loading: false,
    error: null,
  }),
  actions: {
    /**
     * Fetch session (initialize or get existing)
     */
    async fetchSession(displayName?: string): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        this.session = await UserSessionApi.initializeSession({ displayName });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session';
        this.error = errorMessage;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Update user's display name
     */
    async updateDisplayName(displayName: string): Promise<void> {
      if (!displayName?.trim()) {
        this.error = 'Display name cannot be empty';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const payload: UserSessionUpdateRequest = { displayName };
        this.session = await UserSessionApi.updateDisplayName(payload);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update display name';
        this.error = errorMessage;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Join a team
     */
    async joinTeam(teamId: string): Promise<void> {
      if (!teamId?.trim()) {
        this.error = 'Team ID cannot be empty';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const payload: UserSessionUpdateRequest = { teamId };
        this.session = await UserSessionApi.joinTeam(payload);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to join team';
        this.error = errorMessage;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Clear current session
     */
    async clearSession(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        await UserSessionApi.clearSession();
        this.session = null;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to clear session';
        this.error = errorMessage;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Reset store state (without clearing backend session)
     */
    reset(): void {
      this.session = null;
      this.loading = false;
      this.error = null;
    }
  },
  getters: {
    /**
     * Check if user has identified themselves (has display name)
     */
    isIdentified(state: UserSessionState): boolean {
      return Boolean(state.session?.displayName);
    },
    
    /**
     * Check if user has joined a team
     */
    hasTeam(state: UserSessionState): boolean {
      return Boolean(state.session?.teamId);
    },
    
    /**
     * Check if user is fully onboarded (identified and joined team)
     */
    isOnboarded(state: UserSessionState): boolean {
      return Boolean(state.session?.displayName && state.session?.teamId);
    },
    
    /**
     * Get user's display name or empty string
     */
    displayName(state: UserSessionState): string {
      return state.session?.displayName || '';
    },
    
    /**
     * Get user's team ID or null
     */
    teamId(state: UserSessionState): string | null {
      return state.session?.teamId || null;
    },
    
    /**
     * Get user's session ID or null
     */
    sessionId(state: UserSessionState): string | null {
      return state.session?.id || null;
    },
  }
});
