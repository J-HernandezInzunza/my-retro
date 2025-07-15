<template>
  <div class="timeline-renderer-placeholder">
    <q-card flat bordered class="full-height">
      <q-card-section class="text-center">
        <q-icon name="schedule" size="xl" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-7">Timeline Renderer</div>
        <div class="text-subtitle2 text-grey-6">This component is under construction.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { RendererProps } from '../../../types/renderer.ts';

defineProps<RendererProps>();
</script>

<style scoped>
.timeline-renderer-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
