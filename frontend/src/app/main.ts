import '../assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(Quasar, {
  plugins: {
    Notify,
  },
})

app.mount('#app')
