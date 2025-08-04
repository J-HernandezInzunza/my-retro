<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useOnboardingState, OnboardingStep } from '@/shared/composables/useOnboardingState';
import UserIdentificationForm from './UserIdentificationForm.vue';
import TeamJoinForm from './TeamJoinForm.vue';
import OnboardingCompletion from './OnboardingCompletion.vue';

defineOptions({
  name: 'OnboardingView'
});

// Define emits for parent components to react to
const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'error', message: string): void;
}>();

const router = useRouter();
const {
  userSession,
  isRegistered,
  hasTeam,
  isFullyOnboarded,
  initializeOnboarding,
  fetchUserTeams,
} = useOnboardingState();
const currentStep = ref<OnboardingStep>(OnboardingStep.Loading);

// Computed properties to control component visibility based on current step
const showLoadingStep = computed(() => currentStep.value === OnboardingStep.Loading)
const showIdentificationForm = computed(() => currentStep.value === OnboardingStep.Identification);
const showTeamJoinForm = computed(() => currentStep.value === OnboardingStep.TeamJoin);
const showCompletedStep = computed(() => currentStep.value === OnboardingStep.Completed);

// Reset error and show new error
const showError = (message: string) => {
  // Instead of directly mutating error state, emit event for parent to handle
  emit('error', message);
};

// Initialize session and determine initial step
const initializeSession = async () => {
  try {
    // Let the composable handle loading and error state
    await initializeOnboarding();

    // Determine next step based on session state
    if (!isRegistered.value) {
      handleBeginOnboarding();
      return;
    }

    if (isRegistered.value && !hasTeam.value) {
      handleIdentificationComplete();
      return;
    }

    if (isFullyOnboarded.value) {
      handleTeamJoinComplete();
      return;
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
    showError(errorMessage);
    handleBeginOnboarding();
  }
};

const handleBeginOnboarding = () => {
  currentStep.value = OnboardingStep.Identification;
};

// Handle completion of identification step
const handleIdentificationComplete = async () => {
  try {
    // Fetch user's teams to check if they already have a team
    await fetchUserTeams();
    
    // Check if user already has a team after fetching
    if (hasTeam.value) {
      // User already has a team, skip to completion
      handleTeamJoinComplete();
    } else {
      // User needs to join or create a team
      currentStep.value = OnboardingStep.TeamJoin;
    }
  } catch (error) {
    console.error('Failed to fetch user teams:', error);
    // On error, proceed to team join step anyway
    currentStep.value = OnboardingStep.TeamJoin;
  }
};

// Handle completion of team join step
const handleTeamJoinComplete = () => {
  currentStep.value = OnboardingStep.Completed;
};

// Handle completion of onboarding
const handleOnboardingCompleted = () => {
  // Navigate to team dashboard after successful onboarding
  router.push({ name: 'team-dashboard' });
  emit('completed');
};

// Initialize on component mount
onMounted(async() => {
  await initializeSession();
});
</script>

<template>
  <div class="onboarding-view q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h4 q-mt-none q-mb-xs">Welcome To My Retro</h1>
      <p class="text-subtitle1 q-ma-none">Get started with your retrospective session</p>
    </div>

    <!-- Error alert -->
    <q-banner v-if="userSession.error" rounded class="bg-negative text-white q-mb-md">
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ userSession.error }}
      <template #action>
        <q-btn flat label="Dismiss" color="white" @click="userSession.error = null" />
      </template>
    </q-banner>

    <transition name="fade" mode="out-in">
      <!-- Loading state -->
      <div v-if="showLoadingStep" class="flex-center q-py-xl">
        <q-spinner size="3em" color="primary" />
        <div class="q-mt-md">Initializing your session...</div>
      </div>
      <!-- User identification step -->
      <UserIdentificationForm
        v-else-if="showIdentificationForm"
        @completed="handleIdentificationComplete"
        @error="showError"
      />
      <!-- Team join step -->
      <TeamJoinForm
        v-else-if="showTeamJoinForm"
        @completed="handleTeamJoinComplete"
        @error="showError"
        @back="handleBeginOnboarding"
        />
      <!-- Completed step -->
      <OnboardingCompletion
        v-else-if="showCompletedStep"
        @completed="handleOnboardingCompleted"
      />
    </transition>
  </div>
</template>

<style scoped>
.onboarding-view {
  max-width: 750px;
  margin: 0 auto;
  min-height: 400px;
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
