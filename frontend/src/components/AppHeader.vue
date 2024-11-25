<template>
    <header class="header">
        <div class="grid navbar container">
            <div class="headerbar container-fluid">
                <!-- Logo -->
                <div class="header__logo navbar-brand">
                    <router-link
                        to="/"
                        class="header__logo-link"
                    >
                        <img
                        class="header__logo-img"
                        src="@/assets/image/Bread_logo2.png"
                        alt="store_logo"
                        />
                    </router-link>
                </div>

                <!-- Navigation -->
                <nav class="header__navigation">
                    <ul class="header__navigation-list nav">
                        <li class="header__navigation-item nav-item">
                            <router-link
                                to="/"
                                class="header__navigation-link nav-link"
                            >
                                HOMEPAGE
                            </router-link>
                        </li>
                        <li class="header__navigation-item nav-item">
                            <router-link
                                to="/introduction"
                                class="header__navigation-link nav-link"
                            >
                                INTRODUCTION
                            </router-link>
                        </li>
                        <li class="header__navigation-item nav-item">
                            <router-link
                                to="/contact"
                                class="header__navigation-link nav-link"
                            >
                                CONTACT US
                            </router-link>
                        </li>
                    </ul>
                </nav>

                <!-- Search and Cart -->
                <div class="header__utility d-flex align-items-center">
                    <div class="header__utility-search position-relative">
                        <input
                            type="text"
                            v-model="searchQuery"
                            class="header__search-input"
                            placeholder="Search for products..."
                            @input="searchProducts"
                            @keyup.enter="handleSearch"
                        />
                        <button 
                            class="header__search-btn" 
                            type="button"
                            @click="handleSearch"
                        >
                            <i class="header__search-btn-icon fa-solid fa-magnifying-glass"></i>
                        </button>
                        
                        <!-- Search Results Dropdown -->
                        <div 
                            v-if="showResults && searchResults.length > 0" 
                            class="search-results-dropdown"
                        >
                        
                        <!-- Search Results Dropdown -->
                        
                            <div 
                                v-for="product in searchResults" 
                                :key="product.bread_id"
                                class="search-result-item"
                                @click="goToProduct(product)"
                            >
                            <img 
                                :src="product.bread_url" 
                                :alt="product.bread_name" 
                                class="search-result-image"
                            />
                                <div class="search-result-info">
                                    <div class="search-result-name">{{ product.bread_name }}</div>
                                    <div class="search-result-price">${{ product.bread_price }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="header__utility-cart ms-3">
                        <router-link
                            to="/cart"
                            class="header__utility-link"
                        >
                            <i class="fa-solid fa-cart-shopping"></i>
                        </router-link>
                    </div>
                </div>

                <!-- Auth Links -->
                <div
                    class="header__utility-connect"
                    v-if="!userStore.isLoggedIn"
                >
                    <ul class="header__utility-list nav">
                        <li class="header__utility-item nav-item">
                            <router-link
                                to="/login"
                                class="header__utility-link nav-link"
                            >
                                Sign In
                            </router-link>
                        </li>
                        <li class="header__utility-item nav-item">
                            <router-link
                                to="/register"
                                class="header__utility-link nav-link"
                            >
                                Sign Up
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- UserProfileHeader.vue -->

                <div class="header__utility">
                    <div
                        class="header__utility-connect"
                        v-if="userStore.isLoggedIn"
                    >
                        <div
                            class="header__utility-userIf"
                            
                        >
                            <img
                                src="@/assets/image/images.png"
                                alt="User Avatar"
                                class="header__utility-img"
                            />
                            <h4 class="header__utility-uname">
                                {{ userStore.username || 'Guest' }} <!-- Thêm giá trị mặc định -->
                            </h4>
                        </div>

                        <div
                            class="header__utility-user-ability"
                            
                        >
                            <ul class="user__ability-list">
                                <li class="user__ability-item">
                                    <router-link
                                        to="/personal"
                                        class="user__ability-link"
                                    >
                                        <i class="fas fa-user mr-2"></i>
                                        My Profile
                                    </router-link>
                                </li>
                                <li class="user__ability-item">
                                    <router-link
                                        to="/cart"
                                        class="user__ability-link  "
                                    >
                                        <i class="fas fa-shopping-cart mr-2"></i>
                                        Shopping Cart
                                    </router-link>
                                </li>
                                <li class="user__ability-item">
                                    <a
                                        href="#"
                                        class="user__ability-link text-danger"
                                        @click.prevent="handleLogout"
                                    >
                                        <i class="fas fa-sign-out-alt mr-2"></i>
                                        Log Out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { ref, onMounted } from 'vue';
import auth from '@/services/auth.service';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import makeProductsService from '@/services/products.service';

export default {
name: 'AppHeader',
setup() {
    const searchQuery = ref('');
    const searchResults = ref([]);
    const showResults = ref(false); // Thêm biến showResults
    const router = useRouter();
    const userStore = useUserStore();

    onMounted(() => {
        userStore.checkUserStatus();
    });
    
    const handleLogout = async () => {
        try {
            await auth.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const searchProducts = async () => {
        if (searchQuery.value.trim() === '') {
            searchResults.value = [];
            showResults.value = false; // Ẩn kết quả khi input rỗng
            return;
        }

        try {
            const data = await makeProductsService.searchProducts(searchQuery.value);
            searchResults.value = data.products || [];
            showResults.value = true; // Hiển thị kết quả khi có dữ liệu
        } catch (error) {
            console.error('Error searching products:', error);
            searchResults.value = [];
            showResults.value = false;
        } 
    };

    const goToProduct = (product) => {
        router.push(`/detail/${product.bread_id}`);
        searchResults.value = [];
        searchQuery.value = '';
        showResults.value = false;
    };

    const handleSearch = () => {
        if (searchQuery.value.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
            searchQuery.value = '';
            showResults.value = false;
        }
    };

    return {
        userStore,
        handleLogout,
        searchQuery,
        searchResults, // Return searchResults
        showResults,  // Return showResults
        handleSearch,
        searchProducts,
        goToProduct
    };
}
};
</script>

<style>
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

.header__search-input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  width: 250px;
}

.header__search-btn {
  background: transparent;
  border: none;
  margin-left: -30px;
  cursor: pointer;
}

.header__utility {
  gap: 20px;
}

.header__utility-link {
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
}

/* Hiển thị dropdown khi hover vào tên người dùng */
.header__utility-userIf:hover + .header__utility-user-ability .dropdown-menu {
  display: block;
}

/* Ẩn dropdown mặc định */
.dropdown-menu {
  display: none;
}

/* Optional: Thêm hiệu ứng hover */
.header__utility-user-ability .dropdown-menu {
  transition: opacity 0.3s ease;
  opacity: 0;
}

.header__utility-user-ability:hover .dropdown-menu {
  opacity: 1;
}

.header__utility-userIf{
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
}

.header__utility-img{
    width: 24px;
    height: 22px;
}

.header__utility-uname{
    font-size: 1.2rem;
    font-weight: 400;
    margin-left: 12px;
    margin-bottom: 0px;
}

.header__utility-connect{
    display: flex;
    align-items: center;
    position: relative;
}

.header__utility-connect::after{
    content: "";
    background-color: transparent;
    position: absolute;
    top: 24px;
    right: 0;
    width: 140px;
    height: 20px;
}

.header__utility-connect:hover .header__utility-user-ability{
    display: block;
}

.header__utility-user-ability{
    position: absolute;
    width: 180px;
    background-color: #fff;
    top: 120%;
    right:  0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: none;
}

.user__ability-list{
    list-style: none;
    padding-left: 12px ;
    margin-bottom: 0px;
}

.user__ability-list::before{
    content: "";
    border-style: solid;
    border-width: 10px 13px;
    border-color: transparent transparent #fff transparent;
    position: absolute;
    right: 4px;
    top: -16px;
}

.user__ability-link{
    text-decoration: none;
    font-size: 1rem;
    line-height: 3.2rem;
    color: var(--text-color);
    padding: 0 12px;
    display: block;
    opacity: 0.8;
}

.user__ability-link:hover {
    opacity: 1;
    color: #f67514;
}

.header__navigation-link:hover{
    color: #f67514;
}

.user__ability-item:last-child{
    border: 1px solid var(--border-color);
}

/* Search input and button styles */
.header__utility-search {
    position: relative;
    z-index: 1001; /* Ensure dropdown appears above other elements */
}

.header__search-input {
    padding: 8px 35px 8px 15px; /* Increased padding for search icon */
    border: 1px solid #ccc;
    border-radius: 20px;
    width: 250px;
    transition: all 0.3s ease;
}

.header__search-input:focus {
    outline: none;
    border-color: #f67514;
    box-shadow: 0 0 5px rgba(246, 117, 20, 0.2);
}

.header__search-btn {
    background: transparent;
    border: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
}

.header__search-btn:hover {
    color: #f67514;
}

/* Search Results Dropdown */
.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.search-result-item:hover {
    background-color: #f5f5f5;
}

.search-result-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 12px;
}

.search-result-info {
    flex: 1;
}

.search-result-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
}

.search-result-price {
    font-size: 13px;
    color: #f67514;
    font-weight: 600;
}

/* Scrollbar styles for the dropdown */
.search-results-dropdown::-webkit-scrollbar {
    width: 6px;
}

.search-results-dropdown::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.search-results-dropdown::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.search-results-dropdown::-webkit-scrollbar-thumb:hover {
    background: #999;
}

/* Empty state */
.search-results-empty {
    padding: 15px;
    text-align: center;
    color: #666;
    font-size: 14px;
}

/* Loading state */
.search-results-loading {
    padding: 15px;
    text-align: center;
    color: #666;
}

/*Cart*/

</style>
