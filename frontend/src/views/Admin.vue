<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
import { ref, onMounted } from 'vue'
import AdminViewBread from '@/components/AdminViewBread.vue';
import AdminDelete from '@/components/AdminDelete.vue';
import AdminUpdate from '@/components/AdminUpdate.vue';
import AdminForm from '@/components/AdminForm.vue';
import { useUserStore } from '@/stores/user.store'; // Import userStore
import auth from '@/services/auth.service';
import { useRouter } from 'vue-router';


const router = useRouter();
const userStore = useUserStore();

const handleLogout = async () => {
    try {
        await auth.logout();
        router.push('/login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
}; 


</script>

<template>
    <div class="wrapper">
        <AdminSidebar />

        <div class="main">
            <nav class="navbar navbar-expand px-3 border-bottom">
                <!-- Button for sidebar toggle -->
                <button class="btn" type="button" data-bs-theme="dark">
                    <span class="navbar-toggler-icon"></span>
                </button>

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
                            v-if="userStore.isLoggedIn"
                        >
                            <ul class="user__ability-list">
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
            </nav>

            <main class="content px-3 py-2">
                <div class="container-fluid">
                    <router-view />
                </div>
            </main>
        </div>
    </div>
</template>

<style src="../assets/css/adminsidebar.css">
</style>

<style scoped>
.admin-components-container {
    display: flex;
    flex-direction: column; /* Stack components vertically */
    gap: 20px; /* Add some space between the components */
}

.admin-form-container,
.admin-update-container,
.admin-delete-container {
    /* Style each component container individually */
    background-color: var(--white-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-form-container {
    /* Specific styles for AdminForm component */
}

.admin-update-container {
    /* Specific styles for AdminUpdate component */
}

.admin-delete-container {
    /* Specific styles for AdminDelete component */
}
</style>
