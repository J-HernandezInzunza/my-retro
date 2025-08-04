<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserSessionStore } from '@/slices/user-onboarding/stores/userSessionStore';
import { useTeamStore } from '@/slices/user-onboarding/stores/teamStore';

const userSessionStore = useUserSessionStore();
const teamStore = useTeamStore();
userSessionStore.bindEvents();
teamStore.bindEvents();
</script>

<style>
/* Global styles are handled by Quasar and our layout components */
</style>
