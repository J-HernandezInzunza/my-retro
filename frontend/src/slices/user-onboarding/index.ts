// User Onboarding Slice

// API Client
export { UserSessionApi } from './api/user-session.api';

// Store
export { useUserSessionStore } from './stores/userSessionStore';

// Composables
export { useUserSession } from './composables/useUserSession';
export type { UseUserSession, UseUserSessionOptions } from './composables/useUserSession';

// Components
export { default as UserIdentificationForm } from './components/UserIdentificationForm.vue';
export { default as TeamJoinForm } from './components/TeamJoinForm.vue';
export { default as OnboardingView } from './components/OnboardingView.vue';
