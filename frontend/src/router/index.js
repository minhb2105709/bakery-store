import { createWebHistory, createRouter } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Admin from '@/views/Admin.vue';
import Introduction from '@/views/Introduction.vue';
import Contact from '@/views/Contact.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin
    },
    {
        path: '/introduction',
        name: 'introduction',
        component: Introduction
    },
    {
        path: '/contact',
        name: 'contact',
        component: Contact
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
