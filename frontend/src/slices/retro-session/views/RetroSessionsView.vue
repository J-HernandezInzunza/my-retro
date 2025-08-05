<template>
  <div class="retro-sessions-view q-pa-md">
    <RetroSessionsList />
  </div>
</template>

<script setup lang="ts">
import RetroSessionsList from '../components/RetroSessionsList.vue';

defineOptions({
  name: 'RetroSessionsView'
});
</script>

<style scoped>
.retro-sessions-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
