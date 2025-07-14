<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Quasar Framework Test</div>
        <div class="text-subtitle2">Testing basic Quasar components</div>
      </q-card-section>

      <q-card-section>
        <q-btn color="primary" label="Primary Button" @click="showNotification" class="q-mr-sm" />
        <q-btn color="secondary" label="Secondary Button" outline @click="showDialog = true" />
      </q-card-section>

      <q-card-section>
        <q-input v-model="text" label="Test Input" outlined class="q-mb-md" />
        <q-linear-progress :value="progress" color="accent" class="q-mt-md" />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dialog Test</div>
        </q-card-section>

        <q-card-section class="q-pt-none"> Quasar dialog is working correctly! </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const text = ref('')
const progress = ref(0)
const showDialog = ref(false)

const showNotification = () => {
  $q.notify({
    color: 'positive',
    message: 'Quasar notification is working!',
    icon: 'check',
  })
}

onMounted(() => {
  // Animate progress bar
  const interval = setInterval(() => {
    progress.value += 0.1
    if (progress.value >= 1) {
      clearInterval(interval)
    }
  }, 100)
})
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: 0 auto;
}
</style>
