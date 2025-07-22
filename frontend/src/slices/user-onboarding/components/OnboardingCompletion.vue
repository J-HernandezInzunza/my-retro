<script setup lang="ts">
defineOptions({
  name: 'OnboardingCompletion'
});

const emit = defineEmits<{
  (e: 'completed'): void;
}>();
</script>

<template>
  <div class="onboarding-completion">
    <q-card
      flat
      bordered
      class="text-center q-pa-md"
    >
      <q-card-section>
        <q-icon name="check_circle" color="positive" size="4em" />
        <h2 class="q-mt-md q-mb-xs">All Set!</h2>
        <p class="q-ma-none">
          You're all set up and ready to start your retrospective session.
        </p>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="primary" label="Let's Go!" @click="emit('completed')" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped>
.onboarding-completion {
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
}
</style>
