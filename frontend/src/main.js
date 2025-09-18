import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

// Tạo Vue app
const app = createApp(App)

// ✅ QUAN TRỌNG: Phải use router trước khi mount
app.use(router)

// Mount app vào DOM
app.mount('#app')

console.log('🚀 App started with router!');