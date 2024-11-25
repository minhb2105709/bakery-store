<template>
    <header class="header">
        <div class="grid navbar">
            <div class="headerbar container-fluid">
                <div class="header__logo navbar-brand">
                    <router-link to="/">
                        <img class="header__logo-img" src="@/assets/image/Bread_logo2.png" alt="store_logo" />
                    </router-link>
                </div>
                <nav class="header__navigation">
                    <ul class="header__navigation-list nav">
                        <li class="header__navigation-item nav-item"><router-link class="header__navigation-link nav-link" to="/">HOMEPAGE</router-link></li>
                        <li class="header__navigation-item nav-item"><router-link class="header__navigation-link nav-link" to="/introduction">INTRODUCTION</router-link></li>
                        <li class="header__navigation-item nav-item"><router-link class="header__navigation-link nav-link" to="/contact">CONTACT US</router-link></li>
                    </ul>
                </nav>
                <div class="header__utility nav">
                    <router-link class="header__utility-link nav-link" to="/login">Sign In</router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
// components/LoginHeader.vue
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
    --bs-navbar-padding-x: 0 !important; /* Hoặc giá trị bạn muốn */
    --bs-navbar-padding-y: 0 !important;
}

.header {
    background-color: #f5f5dc; /* Light beige background */
    position: sticky;
    top: 0; /* Giữ nó ở vị trí trên cùng */
    z-index: 1000; /* Đảm bảo nó nằm trên các phần tử khác */
}

.header__logo-img {
    max-width: 100px; /* Make the logo more prominent */
}

.header__navigation-link {
    font-weight: bold;
    color: #333; /* Darker color for the nav links */
    text-transform: uppercase;
    padding: 0 15px;
}

</style>