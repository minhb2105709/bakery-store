// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        isAdmin: false,
        username: '',
    }),
    actions: {
        checkUserStatus() {
            // Lấy thông tin người dùng từ localStorage
            //const user_id = localStorage.getItem('userId');
            const role_id = localStorage.getItem('userRole');
            const username = localStorage.getItem('userName');

            // Kiểm tra xem người dùng đã đăng nhập chưa
            this.isLoggedIn = !!username; // Nếu có username thì người dùng đã đăng nhập
            this.isAdmin = role_id === '1';  // Kiểm tra quyền admin
            this.username = username || '';  // Nếu có username, gán vào, nếu không thì gán rỗng
        },
        logout() {
            // Xóa thông tin người dùng trong localStorage
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            this.isLoggedIn = false;
            this.isAdmin = false;
            this.username = '';
        }
    }
});
