<script setup lang="ts">
import { ref } from 'vue';
import { useUserSession } from '../composables/useUserSession';

defineOptions({
  name: 'UserIdentificationForm'
});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'update:loading', value: boolean): void;
  (e: 'error', message: string): void;
}>();

const { loading, error, updateDisplayName, fetchSession } = useUserSession();
const displayName = ref('');

const submitForm = async () => {
  if (!displayName.value.trim()) return;
  
  emit('update:loading', true);
  
  try {
    // Try to initialize with display name first
    await fetchSession(displayName.value);
    
    // If that didn't set the name, update it
    await updateDisplayName(displayName.value);
    
    if (error.value) {
      emit('error', error.value);
    } else {
      emit('completed');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save your name';
    emit('error', message);
  } finally {
    emit('update:loading', false);
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
            :loading="loading"
            :error="!!error"
            :error-message="error || ''"
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
              :loading="loading"
              :disable="!displayName || loading"
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
