import { createWebHistory, createRouter } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';

import Introduction from '@/views/Introduction.vue';
import Contact from '@/views/Contact.vue';
import Register from '@/views/Register.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import Cart from '@/views/Cart.vue';
import Payment from '@/views/Payment.vue';
import SearchResult from '@/views/SearchResult.vue';


import AdminViewBread from '@/components/AdminViewBread.vue';
import AdminForm from '@/components/AdminForm.vue';
import AdminUpdate from '@/components/AdminUpdate.vue';
import AdminDelete from '@/components/AdminDelete.vue';

import UserInfo from '@/components/UserInfo.vue';
import OrderHistory from '@/components/OrderHistory.vue';


const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/detail/:id',  // Thay đổi thành route parameter :id
        name: 'product-detail',
        component: ProductDetail,
        //props: true  // Truyền `id` dưới dạng prop cho ProductDetail
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/admin',
        component: () => import('@/views/Admin.vue'),
        children: [
            {
                path: '',
                redirect: '/admin/view-products'
            },
            {
                path: 'view-products',
                component: AdminViewBread,
            },
            {
                path: 'add-products',
                component: AdminForm,
            },
            {
                path: 'update-amount',
                component: AdminUpdate,
            },
            {
                path: 'delete-products',
                component: AdminDelete,
            },
        ],
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
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart
    },
    {
        path: '/payment',
        name: 'payment',
        component: Payment
    },
    {
        path: '/search',
        name: 'search',
        component: SearchResult
    },
    {
        path: '/personal',
        component: () => import('@/views/Personal.vue'),
        children: [
            {
                path: '',
                redirect: '/personal/user-info'
            },
            {
                path: 'user-info',
                component: UserInfo,
            },
            {
                path: 'order-history',
                component: OrderHistory,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
