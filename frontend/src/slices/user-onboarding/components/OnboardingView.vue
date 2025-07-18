<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { useUserSession } from '../composables/useUserSession';
import UserIdentificationForm from './UserIdentificationForm.vue';
import TeamJoinForm from './TeamJoinForm.vue';

defineOptions({
  name: 'OnboardingView'
});

// Define emits for parent components to react to
const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'error', message: string): void;
}>();

// Step tracking for onboarding flow
enum OnboardingStep {
  Loading = 'loading',
  Identification = 'identification',
  TeamJoin = 'team-join',
  Completed = 'completed'
}

// Initialize user session composable
const { loading, error, session, isIdentified, isOnboarded, fetchSession } = useUserSession();
const currentStep = ref<OnboardingStep>(OnboardingStep.Loading);

// Computed properties to control component visibility based on current step
const showIdentificationForm = computed(() => currentStep.value === OnboardingStep.Identification);
const showTeamJoinForm = computed(() => currentStep.value === OnboardingStep.TeamJoin);

// Reset error and show new error
const showError = (message: string) => {
  error.value = message;
  setTimeout(() => {
    error.value = null;
  }, 5000); // Clear error after 5 seconds
};

// Initialize session and determine initial step
const initializeSession = async () => {
  loading.value = true;
  error.value = null;

  try {
    await fetchSession();

    // Determine the correct step based on session state
    if (!isIdentified.value) {
      currentStep.value = OnboardingStep.Identification;
    } else if (!isOnboarded.value) {
      currentStep.value = OnboardingStep.TeamJoin;
    } else {
      currentStep.value = OnboardingStep.Completed;
      emit('completed');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to initialize session';
    showError(message);
    currentStep.value = OnboardingStep.Identification;
  } finally {
    loading.value = false;
  }
};

// Handle completion of identification step
const handleIdentificationComplete = () => {
  currentStep.value = OnboardingStep.TeamJoin;
};

// Handle completion of team join step
const handleTeamJoinComplete = () => {
  currentStep.value = OnboardingStep.Completed;
  emit('completed');
};

// Handle back button in team join form
const handleTeamJoinBack = () => {
  currentStep.value = OnboardingStep.Identification;
};

// Initialize on component mount
onMounted(initializeSession);
</script>

<template>
  <div class="onboarding-view q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h4 q-mt-none q-mb-xs">My Retro</h1>
      <p class="text-subtitle1 q-ma-none">Get started with your retrospective session</p>
    </div>

    <!-- Loading state -->
    <div v-if="currentStep === 'loading'" class="flex-center q-py-xl">
      <q-spinner size="3em" color="primary" />
      <div class="q-mt-md">Initializing your session...</div>
    </div>

    <!-- Error alert -->
    <q-banner v-if="error" rounded class="bg-negative text-white q-mb-md">
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
      <template #action>
        <q-btn flat label="Dismiss" color="white" @click="error = null" />
      </template>
    </q-banner>

    <!-- User identification step -->
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <UserIdentificationForm
        v-if="showIdentificationForm"
        @completed="handleIdentificationComplete"
        @update:loading="loading = $event"
        @error="showError"
      />
    </transition>

    <!-- Team join step -->
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <TeamJoinForm
        v-if="showTeamJoinForm"
        @completed="handleTeamJoinComplete"
        @update:loading="loading = $event"
        @error="showError"
        @back="handleTeamJoinBack"
      />
    </transition>

    <!-- Completed step (brief success message) -->
    <transition appear enter-active-class="animated fadeIn">
      <q-card
        v-if="currentStep === 'completed'"
        flat
        bordered
        class="text-center q-pa-md"
      >
        <q-card-section>
          <q-icon name="check_circle" color="positive" size="4em" />
          <h2 class="q-mt-md q-mb-xs">All Set!</h2>
          <p class="q-ma-none">
            You're all set up and ready to start your retrospective session.
          </p>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn color="primary" label="Let's Go!" @click="emit('completed')" />
        </q-card-actions>
      </q-card>
    </transition>
  </div>
</template>

<style scoped>
.onboarding-view {
  max-width: 600px;
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
