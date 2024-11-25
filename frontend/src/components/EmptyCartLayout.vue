<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'; // Import userStore
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
<div class="container mt-5 mb-5">
    <h4 class="text-left mb-4"><i class="fa-solid fa-bag-shopping"></i> GIỎ HÀNG <span class="text-muted">(0 sản phẩm)</span></h4>
    <div class="empty-cart mx-auto col-md-8 col-lg-6">
        <img src="../assets/image/ico_emptycart.svg" alt="Empty Cart Icon" class="empty-cart-icon mb-4">
        <p class="mb-3">Chưa có sản phẩm trong giỏ hàng của bạn.</p>
        <router-link to="/" class="btn shop-now-btn">MUA SẮM NGAY</router-link>
    </div>
</div>
</template>

<style scoped>
.empty-cart {
    background-color: #fff;
    border: 1px solid #f2f2f2;
    border-radius: 10px;
    padding: 2rem;
    text-align: center;
    margin-top: 2rem;
    width: 100%;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}
.empty-cart-icon {
    width: 150px;
    height: 150px;
    opacity: 0.8;
}
.shop-now-btn {
    background-color: #dc3545;
    color: #fff;
    border-radius: 5px;
    padding: 0.75rem 1.5rem;
    font-weight: bold;
}
.shop-now-btn:hover {
    background-color: #c82333;
}
</style>