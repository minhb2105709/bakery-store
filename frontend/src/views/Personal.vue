<script setup>
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
    <AppHeader />
    <div class="container mt-4 mb-4">
        <div class="row">
            <div class="col-2 sidebar">
                <div class="list-group">
                    <router-link 
                        to="/personal/user-info" 
                        class="list-group-item list-group-item-action"
                        :class="{ active: $route.path === '/personal/user-info' }"
                    >
                        Thông tin cá nhân
                    </router-link>
                    <router-link 
                        to="/personal/order-history" 
                        class="list-group-item list-group-item-action"
                        :class="{ active: $route.path === '/personal/order-history' }"
                    >
                        Danh sách đơn hàng
                    </router-link>
                </div>
            </div>
    
            <div class="col-10 container-item">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-item {
    border: 1px solid #000;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
    min-height: 400px;
}

.list-group-item {
    border-radius: 0 !important;
    border-left: 3px solid transparent;
    transition: all 0.3s ease;
}

.list-group-item:hover {
    background-color: #f8f9fa;
    border-left: 3px solid #007bff;
}

.list-group-item.active {
    background-color: #007bff;
    border-color: #007bff;
    border-left: 3px solid #0056b3;
}

.sidebar {
    padding-right: 20px;
}
</style>