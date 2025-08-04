import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserSessionStore } from '@/slices/user-onboarding/stores/userSessionStore';
import { useTeamStore } from '@/slices/user-onboarding/stores/teamStore';

/**
 * Composable for managing cross-slice onboarding state
 * Combines user session and team stores to provide unified onboarding logic
 */
export function useOnboardingState() {
  const userSessionStore = useUserSessionStore();
  const teamStore = useTeamStore();
  
  // Extract reactive refs from both stores
  const { userSession, isRegistered } = storeToRefs(userSessionStore);
  const { hasTeam, currentTeamName, currentTeamId } = storeToRefs(teamStore);
  
  // Combined onboarding state logic
  const isFullyOnboarded = computed(() => {
    // User is fully onboarded if they have both a user account and team membership
    return isRegistered.value && hasTeam.value;
  });
  
  const canAccessDashboard = computed(() => {
    return isFullyOnboarded.value;
  });
  
  // Actions that coordinate between stores
  const initializeOnboarding = async () => {
    await userSessionStore.initializeUserSession();
    // Note: Team data will be loaded when user joins a team
  };
  
  const fetchUserTeams = async () => {
    // Only fetch teams if user is registered and has a userId
    if (isRegistered.value && userSession.value.data?.userId) {
      await teamStore.fetchUserTeams(userSession.value.data.userId);
    }
  };
  
  return {
    // State
    userSession,
    isRegistered,
    hasTeam,
    currentTeamName,
    currentTeamId,
    
    // Computed
    isFullyOnboarded,
    canAccessDashboard,
    
    // Actions
    initializeOnboarding,
    fetchUserTeams,
    
    // Store references (for direct access if needed)
    userSessionStore,
    teamStore,
  };
}

// Utility type to extract the value type of an object type
type ValueOf<T> = T[keyof T];

// OnboardingStep as both const object (for runtime) and type (for TypeScript)
export const OnboardingStep = {
  Loading: 'loading',
  Identification: 'identification',
  TeamJoin: 'team-join',
  Completed: 'completed'
} as const;

export type OnboardingStep = ValueOf<typeof OnboardingStep>;

// OnboardingStatus as both const object (for runtime) and type (for TypeScript)
export const OnboardingStatus = {
  NeedsRegistration: 'needs-registration',
  NeedsTeam: 'needs-team',
  Completed: 'completed',
  InProgress: 'in-progress'
} as const;

export type OnboardingStatus = ValueOf<typeof OnboardingStatus>;