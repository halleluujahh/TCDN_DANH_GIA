import { createApp } from 'vue'
import { createPinia } from 'pinia';

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import App from './App.vue'
import router from './router';

createApp(App)
.use(FloatingVue)
.use(createPinia())
.use(router)
.mount('#app');


