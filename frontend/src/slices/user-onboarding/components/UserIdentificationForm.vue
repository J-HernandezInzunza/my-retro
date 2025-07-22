<script setup lang="ts">
import { ref } from 'vue';
import { useUserSessionStore } from '../stores/userSessionStore';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'UserIdentificationForm'
});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'error', message: string): void;
}>();

const userSessionStore = useUserSessionStore();
const { userSession } = storeToRefs(userSessionStore);
const displayName = ref('');

const submitForm = async () => {  
  try {
    if (!displayName.value.trim()) return;

    await userSessionStore.updateDisplayName(displayName.value);
    emit('completed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save your name';
    emit('error', message);
  }
};
</script>

<template>
  <div class="user-identification-form">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Welcome to My Retro</div>
        <div class="text-subtitle2">Please identify yourself to continue</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <q-input
            v-model="displayName"
            label="Your Name"
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

          <div class="row justify-end q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="Continue"
              :loading="userSession.isLoading"
              :disable="!displayName || userSession.isLoading"
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
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
}
</style>
