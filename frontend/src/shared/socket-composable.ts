// src/shared/composables/useSocket.ts
import { onBeforeUnmount, onMounted } from 'vue';

import { socketService } from './socket-service';

export function useSocket() {
  // Connect when the component mounts
  onMounted(() => {
    // Uncomment the line below if you want to connect on component mount
    // socketService.connect();
  });
  
  // Optional: Disconnect when component is unmounted
  // Only do this if socket is specifically for this component
  onBeforeUnmount(() => {
    // Uncomment the line below if you want to disconnect on component unmount
    // socketService.disconnect();
  });
  
  return {
    socket: socketService.getSocket(),
    isSocketConnected: socketService.isConnected,
    emitEvent: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    once: socketService.once.bind(socketService),
    connectSocket: socketService.connect.bind(socketService),
    disconnectSocket: socketService.disconnect.bind(socketService),
  };
}