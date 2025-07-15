<template>
  <component
    v-if="rendererComponent"
    :is="rendererComponent"
    v-bind="props" />
  <div
    v-else
    class="error-placeholder">
    <q-card flat bordered>
      <q-card-section class="text-center">
        <q-icon name="error_outline" size="xl" color="negative" />
        <div class="text-h6 q-mt-md text-negative">Invalid Renderer</div>
        <div class="text-subtitle2 text-grey-7">The format type '{{ session.format.type }}' is not supported.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { RendererProps } from '../../../types/renderer';

const props = defineProps<RendererProps>();

const renderers = {
  column: defineAsyncComponent(() => import('./ColumnRenderer.vue')),
  timeline: defineAsyncComponent(() => import('./TimelineRenderer.vue')),
  canvas: defineAsyncComponent(() => import('./CanvasRenderer.vue')),
  form: defineAsyncComponent(() => import('./FormRenderer.vue')),
};

const rendererComponent = computed(() => {
  const type = props.session.format.type;
  return renderers[type] || null;
});
</script>

<style scoped>
.error-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
