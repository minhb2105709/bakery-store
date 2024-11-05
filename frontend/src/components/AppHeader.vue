<template>
    <header class="header">
        <div class="grid navbar">
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
                                TRANG CHỦ
                            </router-link>
                        </li>
                        <li class="header__navigation-item nav-item">
                            <router-link
                                to="/introduction"
                                class="header__navigation-link nav-link"
                            >
                                GIỚI THIỆU
                            </router-link>
                        </li>
                        <li class="header__navigation-item nav-item">
                            <router-link
                                to="/contact"
                                class="header__navigation-link nav-link"
                            >
                                LIÊN HỆ
                            </router-link>
                        </li>
                    </ul>
                </nav>

                <!-- Search and Cart -->
                <div class="header__utility d-flex align-items-center">
                    <form
                        @submit.prevent="handleSearch"
                        class="header__utility-search"
                    >
                        <input
                            type="text"
                            v-model="searchQuery"
                            class="header__search-input"
                            placeholder="Nhập để tìm kiếm sản phẩm"
                            @keyup="searchProducts"
                        />
                        <button
                            class="header__search-btn"
                            type="submit"
                        >
                            <i class="header__search-btn-icon fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
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
                                ĐĂNG NHẬP
                            </router-link>
                        </li>
                        <li class="header__utility-item nav-item">
                            <router-link
                                to="/register"
                                class="header__utility-link nav-link"
                            >
                                ĐĂNG KÝ
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
                                        Hồ Sơ Của Tôi
                                    </router-link>
                                </li>
                                <li class="user__ability-item">
                                    <router-link
                                        to="/cart"
                                        class="user__ability-link  "
                                    >
                                        <i class="fas fa-shopping-cart mr-2"></i>
                                        Đơn Mua
                                    </router-link>
                                </li>
                                <li class="user__ability-item">
                                    <a
                                        href="#"
                                        class="user__ability-link text-danger"
                                        @click.prevent="handleLogout"
                                    >
                                        <i class="fas fa-sign-out-alt mr-2"></i>
                                        Đăng Xuất
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
import { ref, onMounted } from 'vue'; // Thêm ref vào import
import auth from '@/services/auth.service';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';

export default {
  name: 'AppHeader',
  setup() {
    const searchQuery = ref('');
    const router = useRouter();
    const userStore = useUserStore();

    onMounted(() => {
      // Kiểm tra trạng thái đăng nhập khi component được mount
      userStore.checkUserStatus(); // Gọi hàm từ Pinia store
    });
    
    const handleLogout = async () => {
      try {
        await auth.logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const handleSearch = () => {
      // Xử lý tìm kiếm
      console.log(`Searching for: ${searchQuery.value}`);
      // Có thể thêm logic tìm kiếm ở đây
    };

    const searchProducts = () => {
      // Xử lý tìm kiếm theo thời gian thực nếu cần
      console.log(`Searching for: ${searchQuery.value}`);
    };

    return {
      userStore, // Trả về userStore để truy cập trạng thái
      handleLogout,
      searchQuery,
      handleSearch,
      searchProducts
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

.user__ability-link:hover{
    opacity: 1;
    color: #f67514;
}

.user__ability-item:last-child{
    border: 1px solid var(--border-color);
}


/*Cart*/

</style>
