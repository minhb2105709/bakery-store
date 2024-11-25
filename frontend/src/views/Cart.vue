<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import EmptyCartLayout from '@/components/EmptyCartLayout.vue';
import CartLayout from '@/components/CartLayout.vue';
import { useUserStore } from '@/stores/user.store';
import { useCartStore } from '@/stores/cart.store';

const userStore = useUserStore();
const cartStore = useCartStore();
const route = useRoute();

// Tạo computed property để kiểm tra giỏ hàng có trống không
const isCartEmpty = computed(() => {
    return cartStore.getSelectedItems.length === 0;
});

</script>

<template>
    <AppHeader />
    <div v-if="userStore.isLoggedIn">
        <div v-if="!isCartEmpty">
            <CartLayout />
        </div>
        <div v-else>
            <EmptyCartLayout />
        </div>
    </div>
    <div v-else>
        <EmptyCartLayout />
    </div>
</template>