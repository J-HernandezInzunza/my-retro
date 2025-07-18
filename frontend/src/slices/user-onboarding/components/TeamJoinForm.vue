<script setup lang="ts">
import { ref } from 'vue';
import { useUserSession } from '../composables/useUserSession';

defineOptions({
  name: 'TeamJoinForm'
});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'update:loading', value: boolean): void;
  (e: 'error', message: string): void;
  (e: 'back'): void;
}>();

const { loading, error, joinTeam } = useUserSession();
const teamId = ref('');

const submitForm = async () => {
  if (!teamId.value.trim()) return;
  
  emit('update:loading', true);
  
  try {
    await joinTeam(teamId.value);
    
    if (error.value) {
      emit('error', error.value);
    } else {
      emit('completed');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join team';
    emit('error', message);
  } finally {
    emit('update:loading', false);
  }
};
</script>

<template>
  <div class="team-join-form">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Join a Retrospective Team</div>
        <div class="text-subtitle2">Enter the team ID to continue</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <q-input
            v-model="teamId"
            label="Team ID"
            :rules="[(val) => !!val || 'Please enter a team ID']"
            :loading="loading"
            :error="!!error"
            :error-message="error || ''"
            autofocus
            data-cy="team-id-input"
          >
            <template #prepend>
              <q-icon name="groups" />
            </template>
          </q-input>

          <div class="row justify-between q-mt-md">
            <q-btn
              flat
              color="grey-7"
              label="Back"
              :disable="loading"
              @click="emit('back')"
              data-cy="back-button"
            />
            <q-btn
              type="submit"
              color="primary"
              label="Join Team"
              :loading="loading"
              :disable="!teamId || loading"
              data-cy="submit-team-id"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.team-join-form {
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
}
</style>
