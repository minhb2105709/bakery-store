<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';
import { useUserStore } from '@/stores/user.store'; // Import userStore

import Swal from 'sweetalert2'


const router = useRouter();
const userStore = useUserStore(); // Sử dụng userStore
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
    try {
        // Đăng nhập qua authService
        const response = await authService.login(username.value, password.value);
        console.log(response);
        console.log(response.id);
        //localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userName', response.name);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('userId', response.id);
        
        // Cập nhật trạng thái người dùng trong store
        userStore.checkUserStatus(); // Cập nhật trạng thái đăng nhập từ localStorage
        console.log(userStore.isAdmin); // Kiểm tra xem người dùng có phải là admin không
        
        // Chuyển hướng dựa trên role từ userStore
        if (userStore.isAdmin) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: `Welcome Back! ${response.name}`
            });
            router.push('/admin');  // Nếu là admin, chuyển hướng đến trang admin
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: `Welcome Back! ${response.name}`
            });
            router.push('/'); // Nếu không phải admin, chuyển hướng về trang chủ
        }
    } catch (error) {
        errorMessage.value = error.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
        Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: `${errorMessage.value}`,
        });
    }
}
</script>

<template>
    <div class="container__registerForm">
        <form class="registerForm" @submit.prevent="handleSubmit">
            <div class="mb-3">
                <h3 class="registerForm__Title text-dark">Sign In</h3>
                
                <label for="Username" class="form-label fw-bold">Username</label>
                <input 
                    type="text" 
                    id="Username"
                    class="registerForm__input form-control" 
                    v-model="username"
                    placeholder="username" 
                    required
                    autocomplete="username"
                >
            </div>
            <div class="mb-3">
                <label for="password" class="form-label fw-bold">Password</label>
                
                <input 
                    type="password" 
                    id="password"
                    class="registerForm__input form-control" 
                    v-model="password"
                    placeholder="password" 
                    required
                    autocomplete="current-password"
                >
            </div>
            
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            
            <div class="mb-2">
                <button type="submit" class="registerForm__button btn btn-primary">
                    Sign In
                </button>
            </div>
            
            <p class="registerForm__redirect">
                You don't have any accounts yet? 
                <RouterLink to="/register" class="registerForm__redirect-link">
                    Sign Up
                </RouterLink>
            </p>
        </form>
    </div>
</template>

<style scoped>
/*#app {
    background-image: url(../assets/image/register_background.jpg);
}*/

.container__registerForm {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;

}

.registerForm {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.registerForm__Title {
    text-align: center;
    margin-bottom: 1.5rem;
}

.registerForm__input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.registerForm__button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.registerForm__button:hover {
    background-color: #0056b3;
}

.registerForm__redirect {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
}

.registerForm__redirect-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.registerForm__redirect-link:hover {
    text-decoration: underline;
}

.error-message {
    color: #dc3545;
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
}
</style>