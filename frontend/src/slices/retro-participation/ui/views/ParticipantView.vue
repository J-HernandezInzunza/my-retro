<template>
  <q-page class="q-pa-md">
    <div v-if="session" class="participant-view">
      <!-- Format Switcher for Testing -->
      <div class="q-mb-md format-switcher">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1">Test Renderer Switching</div>
            <q-btn-toggle
              v-model="session.format.type"
              push
              glossy
              toggle-color="primary"
              :options="[
                { label: 'Column', value: 'column' },
                { label: 'Timeline', value: 'timeline' },
                { label: 'Canvas', value: 'canvas' },
                { label: 'Form', value: 'form' },
              ]"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Retro Renderer -->
      <RetroRenderer :session="session" :readonly="false" />
    </div>
    <div v-else class="loading-placeholder">
      <q-spinner-dots color="primary" size="40px" />
      <div>Loading session...</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RetroRenderer from '@/slices/retro-participation/ui/components/format-renderers/RetroRenderer.vue';
import type { RetroSession, RetroFormat } from '@/slices/retro-participation/types/renderer';

// Sample Data for Testing
const sampleColumnFormat: RetroFormat = {
  id: 'format-1',
  name: 'Standard 4Ls',
  description: 'A classic retrospective format with four columns: Liked, Learned, Lacked, Longed For.',
  type: 'column',
  config: {
    columns: [
      { id: 'col-1', title: 'Liked', description: 'What went well?', color: 'positive', icon: 'thumb_up' },
      { id: 'col-2', title: 'Learned', description: 'What did we learn?', color: 'info', icon: 'lightbulb' },
      { id: 'col-3', title: 'Lacked', description: 'What was missing?', color: 'warning', icon: 'search' },
      { id: 'col-4', title: 'Longed For', description: 'What do we wish for?', color: 'accent', icon: 'favorite' },
    ],
  },
};

const sampleSession = ref<RetroSession>({
  id: 'session-123',
  title: 'Sprint 24 Retrospective',
  format: sampleColumnFormat,
  columns: [
    {
      id: 'col-1',
      title: 'Liked',
      items: [
        { id: 'item-1', content: 'The team collaboration was excellent.', author: 'Alice', votes: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: 'item-2', content: 'We shipped the feature on time.', author: 'Bob', votes: 5, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    {
      id: 'col-2',
      title: 'Learned',
      items: [
        { id: 'item-3', content: 'The new library has a steep learning curve.', author: 'Charlie', votes: 0, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    { id: 'col-3', title: 'Lacked', items: [] },
    { id: 'col-4', title: 'Longed For', items: [] },
  ],
  participants: ['Alice', 'Bob', 'Charlie'],
  facilitator: 'David',
  phase: 'collection',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const session = ref(sampleSession);

</script>

<style scoped>
.participant-view {
  max-width: 1400px;
  margin: 0 auto;
}
.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  gap: 1rem;
}
.format-switcher {
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
