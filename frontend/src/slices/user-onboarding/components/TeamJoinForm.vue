<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserSessionStore } from '../stores/userSessionStore';

defineOptions({
  name: 'TeamJoinForm'
});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'error', message: string): void;
  (e: 'back'): void;
}>();

const userSessionStore = useUserSessionStore();
const { userSession } = storeToRefs(userSessionStore);
const teamId = ref('');

const submitForm = async () => {
  try {
    if (!teamId.value.trim()) return;

    await userSessionStore.joinTeam(teamId.value);
    emit('completed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join team';
    emit('error', message);
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
            :loading="userSession.isLoading"
            :error="!!userSession.error"
            :error-message="userSession.error || ''"
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
              :disable="userSession.isLoading"
              @click="emit('back')"
              data-cy="back-button"
            />
            <q-btn
              type="submit"
              color="primary"
              label="Join Team"
              :loading="userSession.isLoading"
              :disable="!teamId || userSession.isLoading"
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
