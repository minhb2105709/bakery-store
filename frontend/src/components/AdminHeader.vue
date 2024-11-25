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
                            @click="toggleDropdown"
                        >
                            <img
                                src="@/assets/image/images.png"
                                alt="User Avatar"
                                class="header__utility-img"
                            />
                            <h4 class="header__utility-uname">
                                {{ 'Admin' }} <!-- Thêm giá trị mặc định -->
                            </h4>
                        </div>

                        <div
                            class="header__utility-user-ability"
                            v-show="isDropdownOpen"
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
                                        class="user__ability-link"
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
import Swal from 'sweetalert2'

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
            const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: `Goodbye! See you later!`
                });
            router.push('/login');
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
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

.header__utility-img{
    width: 24px;
    height: 22px;
}
</style>
