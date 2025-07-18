import { ref, onMounted, type Ref } from 'vue';
import { storeToRefs } from 'pinia';

import type { UserSession } from '@shared/backend';
import { useUserSessionStore } from '../stores/userSessionStore';

export interface UseUserSessionOptions {
  /**
   * Auto-fetch session on mount
   * @default true
   */
  autoFetch?: boolean;
}

export interface UseUserSession {
  /** Current user session data */
  session: Ref<UserSession | null>;
  /** Whether a fetch request is in progress */
  loading: Ref<boolean>;
  /** Error message if any operation failed */
  error: Ref<string | null>;
  isIdentified: Ref<boolean>;
  isOnboarded: Ref<boolean>;
  fetchSession: (displayName?: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  joinTeam: (teamId: string) => Promise<void>;
  clearSession: () => Promise<void>;
}

/**
 * Composable hook for managing user session
 * Provides reactive access to session state and operations
 */
export function useUserSession(options: UseUserSessionOptions = {}): UseUserSession {
  const { autoFetch = true } = options;
  // Use the Pinia store for state management
  const store = useUserSessionStore();
  // Create reactive references to store state
  const { session, loading, error, isIdentified, isOnboarded } = storeToRefs(store);
  
  // Auto-fetch session on mount if enabled
  onMounted(() => {
    if (autoFetch) {
      store.fetchSession();
    }
  });
  
  return {
    session,
    loading,
    error,
    isIdentified,
    isOnboarded,
    fetchSession: store.fetchSession,
    updateDisplayName: store.updateDisplayName,
    joinTeam: store.joinTeam,
    clearSession: store.clearSession
  };
}
