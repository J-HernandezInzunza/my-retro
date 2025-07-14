<template>
  <q-page class="flex flex-center">
    <div class="text-center q-pa-lg">
      <div class="text-h3 text-primary q-mb-md">About My Retro</div>

      <div class="text-body1 text-grey-8 q-mb-lg" style="max-width: 600px">
        My Retro is a modern web-based retrospective tool designed for distributed teams with hybrid
        workflow support. It enables teams to conduct effective retrospectives with both
        asynchronous item collection and real-time discussion phases.
      </div>

      <q-card class="q-ma-md" style="max-width: 500px">
        <q-card-section>
          <div class="text-h6 text-primary">Key Features</div>
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>4-Column Retrospective Layout</q-item-label>
                <q-item-label caption
                  >What went well, What didn't, What learned, What puzzles</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Hybrid Workflow Support</q-item-label>
                <q-item-label caption>Async item collection + real-time discussion</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Real-time Collaboration</q-item-label>
                <q-item-label caption>Live updates during discussion phase</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Format Flexibility</q-item-label>
                <q-item-label caption>Support for multiple retrospective formats</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <div class="q-mt-lg">
        <q-btn color="primary" label="Get Started" icon="arrow_forward" :to="{ name: 'home' }" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// About page for My Retro application
</script>

<style scoped>
.q-page {
  min-height: calc(100vh - 64px);
}
</style>
