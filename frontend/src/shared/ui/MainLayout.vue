<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleSidebar" />
        <q-toolbar-title> My Retro </q-toolbar-title>
        <div>
          <q-btn flat round dense icon="account_circle" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer / Sidebar -->
    <q-drawer v-model="isSidebarOpen" bordered class="bg-grey-1">
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <q-item clickable v-ripple :to="{ name: 'home' }" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Welcome & Overview</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header> Retrospective </q-item-label>

        <q-item clickable v-ripple @click="() => {}">
          <q-item-section avatar>
            <q-icon name="group_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Join Session</q-item-label>
            <q-item-label caption>Join existing retro</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="() => {}">
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Create Session</q-item-label>
            <q-item-label caption>Start new retro</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main Content Area -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
// import { useSocket } from '../../shared/socket-composable';
import { socketService } from '../socket-service';

// Initialize socket connection
// This is the ONLY place in the app where we initialize the socket
const { state } = socketService;
const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

// Set up socket connection when layout mounts - belt and suspenders
onMounted(() => {
  console.log('[MainLayout] App initialization - socket connected:', state.connected);
  if (!state.connected) {
    console.log('[MainLayout] App initialization - requesting socket connection');
    socketService.connect();
  }
});

onUnmounted(() => {
  socketService.disconnect();
})
</script>

<style scoped>
/* Custom styles for the layout */
.q-toolbar {
  min-height: 64px;
}

.q-drawer {
  width: 280px;
}
</style>
