<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserSessionStore } from '../stores/userSessionStore';

defineOptions({
  name: 'UserIdentificationForm'
});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'error', message: string): void;
}>();

// Step tracking for identification flow
enum IdentificationStep {
  Selection = 'selection',
  ReturningUser = 'returning-user',
  NewUser = 'new-user',
}

const userSessionStore = useUserSessionStore();
const { userSession } = storeToRefs(userSessionStore);
const currentStep = ref<IdentificationStep>(IdentificationStep.Selection);
const existingEmail = ref('');
const displayName = ref('');
const newEmail = ref('');

const showSelectionStep = computed(() => currentStep.value === IdentificationStep.Selection);
const showReturningUserStep = computed(() => currentStep.value === IdentificationStep.ReturningUser);
const showNewUserStep = computed(() => currentStep.value === IdentificationStep.NewUser);

// Selection handlers
const selectReturningUser = () => {
  currentStep.value = IdentificationStep.ReturningUser;
};

const selectNewUser = () => {
  currentStep.value = IdentificationStep.NewUser;
};

const goBack = () => {
  currentStep.value = IdentificationStep.Selection;
  // Clear form data when going back
  displayName.value = '';
  existingEmail.value = '';
  newEmail.value = '';
};

const submitNewUserForm = async () => {  
  try {
    if (!displayName.value.trim() || !newEmail.value.trim()) return;

    console.log('submitting new user form');
    await userSessionStore.upgradeSessionToUser({ displayName: displayName.value, email: newEmail.value });
    emit('completed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save your name';
    emit('error', message);
  }
};

const submitReturningUserForm = async () => {
  try {
    if (!existingEmail.value.trim()) return;

    // TODO: Implement user lookup by email
    // For now, just emit completion
    emit('completed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to find your account';
    emit('error', message);
  }
};
</script>

<template>
  <div class="user-identification-form">
    <!-- Initial Selection Step -->
    <div v-if="showSelectionStep" class="selection-cards">
      <div class="row q-gutter-md">
        <div class="col">
          <q-card 
            flat 
            bordered 
            class="selection-card cursor-pointer" 
            @click="selectReturningUser"
            data-cy="returning-user-card"
          >
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="person_search" size="3rem" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-sm">I've used this app before</div>
              <div class="text-subtitle2 text-grey-7">Sign in with your email</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col">
          <q-card 
            flat 
            bordered 
            class="selection-card cursor-pointer" 
            @click="selectNewUser"
            data-cy="new-user-card"
          >
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="person_add" size="3rem" color="secondary" class="q-mb-md" />
              <div class="text-h6 q-mb-sm">I'm new here</div>
              <div class="text-subtitle2 text-grey-7">Create your profile</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Returning User Form -->
    <q-card v-if="showReturningUserStep" flat bordered class="q-pa-md">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn 
            flat 
            round 
            icon="arrow_back" 
            @click="goBack" 
            class="q-mr-sm"
            data-cy="back-button"
          />
          <div>
            <div class="text-h6">Welcome back!</div>
            <div class="text-subtitle2">Enter your email to continue</div>
          </div>
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-form @submit.prevent="submitReturningUserForm" class="q-gutter-md">
          <q-input
            v-model="existingEmail"
            type="email"
            label="Email Address"
            :rules="[
              (val) => !!val || 'Please enter your email',
              (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email'
            ]"
            :loading="userSession.isLoading"
            :error="!!userSession.error"
            :error-message="userSession.error || ''"
            autofocus
            data-cy="email-input"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <div class="row justify-end q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="Continue"
              :loading="userSession.isLoading"
              :disable="!existingEmail || userSession.isLoading"
              data-cy="submit-email"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- New User Form -->
    <q-card v-if="showNewUserStep" flat bordered class="q-pa-md">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn 
            flat 
            round 
            icon="arrow_back" 
            @click="goBack" 
            class="q-mr-sm"
            data-cy="back-button"
          />
          <div>
            <div class="text-h6">Welcome!</div>
            <div class="text-subtitle2">What should we call you?</div>
          </div>
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-form @submit.prevent="submitNewUserForm" class="q-gutter-md">
          <q-input
            v-model="displayName"
            label="Display Name"
            :rules="[(val) => !!val || 'Please enter your name']"
            :loading="userSession.isLoading"
            :error="!!userSession.error"
            :error-message="userSession.error || ''"
            autofocus
            data-cy="display-name-input"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="newEmail"
            label="Email Address"
            :rules="[(val) => !!val || 'Please enter your email']"
            :loading="userSession.isLoading"
            :error="!!userSession.error"
            :error-message="userSession.error || ''"
            data-cy="new-email-input"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <div class="row justify-end q-mt-md">
            <q-btn
              type="submit"
              color="secondary"
              label="Get Started"
              :loading="userSession.isLoading"
              :disable="!displayName || !newEmail || userSession.isLoading"
              data-cy="submit-display-name"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.user-identification-form {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.selection-cards {
  width: 100%;
}

.selection-card {
  transition: all 0.2s ease;
  min-height: 180px;
}

.selection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selection-card:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .selection-cards .row {
    flex-direction: column;
  }
  
  .user-identification-form {
    max-width: 400px;
  }
}
</style>
