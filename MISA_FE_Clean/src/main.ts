import { createApp } from 'vue'
import App from './App.vue'

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import { createPinia } from 'pinia'
import router from './router';


createApp(App)
.use(FloatingVue)
.use(createPinia())
.use(router)
.mount('#app')
