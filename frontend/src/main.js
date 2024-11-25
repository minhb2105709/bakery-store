import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import SweetAlert2 CSS (tùy chọn)
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import router from './router';
const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');



