<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h2 text-primary q-mb-md">Welcome to My Retro</div>
      <div class="text-h6 text-grey-7 q-mb-xl">
        A modern retrospective tool for distributed teams
      </div>

      <div class="row q-gutter-md justify-center">
        <q-btn
          color="primary"
          size="lg"
          label="Join Session"
          icon="group_add"
          @click="joinSession"
        />
        <q-btn
          color="secondary"
          size="lg"
          label="Create Session"
          icon="add_circle"
          outline
          @click="createSession"
        />
      </div>

      <!-- Quasar Test Component for validation -->
      <div class="q-mt-xl">
        <QuasarTest />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import QuasarTest from '../components/QuasarTest.vue'

const $q = useQuasar()

function joinSession() {
  $q.notify({
    color: 'positive',
    message: 'Join Session feature coming soon!',
    icon: 'group_add',
  })
}

function createSession() {
  $q.notify({
    color: 'secondary',
    message: 'Create Session feature coming soon!',
    icon: 'add_circle',
  })
}
</script>

<style scoped>
.q-page {
  min-height: calc(100vh - 64px);
}
</style>
