<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserSessionStore } from '../stores/userSessionStore';
import { useTeamStore } from '../stores/teamStore';

defineOptions({
  name: 'TeamJoinForm'
});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'error', message: string): void;
  (e: 'back'): void;
}>();

const userSessionStore = useUserSessionStore();
const teamStore = useTeamStore();
const { user } = storeToRefs(userSessionStore);
const { currentTeam } = storeToRefs(teamStore);
const teamInviteCode = ref('');

const submitForm = async () => {
  try {
    if (!teamInviteCode.value.trim() || !user.value.data?.id) return;

    await teamStore.joinTeam(user.value.data.id, teamInviteCode.value);
    emit('completed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join team';
    console.error('Team join error:', message);
  }
};
</script>

<template>
  <div class="team-join-form">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Join a Retrospective Team</div>
        <div class="text-subtitle2">Enter the team invite code to continue</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <q-input
            v-model="teamInviteCode"
            label="Team Invite Code"
            :rules="[(val) => !!val || 'Please enter an invite code']"
            :loading="currentTeam.isLoading"
            :error="!!currentTeam.error"
            :error-message="currentTeam.error || ''"
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
              :disable="currentTeam.isLoading"
              @click="emit('back')"
              data-cy="back-button"
            />
            <q-btn
              type="submit"
              color="primary"
              label="Join Team"
              :loading="currentTeam.isLoading"
              :disable="!user.data?.id || !teamInviteCode || currentTeam.isLoading"
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
