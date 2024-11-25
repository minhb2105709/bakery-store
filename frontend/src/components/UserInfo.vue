<script setup>
import { ref, onMounted } from 'vue';

import customerService from '@/services/customer.service';
import { useUserStore } from '@/stores/user.store';
import Swal from 'sweetalert2';

const userStore = useUserStore();

const userInfo = ref({
    username: '',
    email: '',
    phone: '',
    user_status: '',
});

const fetchUserInfo = async () => {
    try {
        const userId = userStore.userId; 
        console.log('User ID:', userId);
        const user = await customerService.getUserInfo(userId);
        console.log('Fetched user info:', user);
        
        // Cập nhật dữ liệu vào `userInfo`
        userInfo.value = {
            username: user.user.user_name || '',
            email: user.user.user_mail || '',
            phone: user.user.user_phoneNum || '',
            user_status: user.user.user_status || '',
        };
        console.log('this user info:', userInfo.value);
    } catch (error) {
        console.error('Error fetching user info:', error.message);
    }
};

const handleUpdate = async () => {
    try {
        const userId = userStore.userId; 
        const newUserMail = userInfo.value.email; 

        console.log('New User Mail:', newUserMail);

        await customerService.updateUserInfo(userId, newUserMail);

        Swal.fire('Success', 'User info updated successfully!', 'success');

    } catch (error) {
        console.error('Error updating user info:', error.message);
        Swal.fire(`Failed to update user info: ${error.message}`);
    }
};


onMounted(() => {
    fetchUserInfo();
});


</script>

<template>
    <div class="container p-4">
        <div class="form-container">
            <h4 class="form-title">Personal Information</h4>
            <hr class="divider"> 
            <div class="container">
                <div class="mb-4 input-field">
                    <label for="fullname" class="form-label">Username</label>
                    <input
                        type="text"
                        class="form-control"
                        id="fullname"
                        v-model="userInfo.username"
                        disabled
                    />
                </div>
        
                <div class="mb-4 input-field">
                    <label for="email" class="form-label">Email</label>
                    <input
                        type="text"
                        class="form-control"
                        id="email"
                        v-model="userInfo.email"
                    />
                </div>

                <div class="mb-4 input-field">
                    <label for="phone" class="form-label">Phone number</label>
                    <input
                        type="text"
                        class="form-control"
                        id="phone"
                        v-model="userInfo.phone"
                        disabled
                    />
                </div>

                <div class="mb-4 input-field">
                    <label for="status" class="form-label">User status</label>
                    <input
                        type="text"
                        class="form-control text-success"
                        id="status"
                        v-model="userInfo.user_status"
                        disabled
                    />
                </div>

                <button class="update-btn" @click="handleUpdate">Update</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

.form-title {
    color: #2c3e50;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 1.5rem;
}

.divider {
    border: none;
    height: 2px;
    background: linear-gradient(to right, #e0e0e0, #2c3e50, #e0e0e0);
    margin: 1.5rem 0;
}

.input-field {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.form-label {
    flex: 2;
    font-size: 0.9rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.form-control {
    flex: 5;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #2c3e50;
    box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.1);
}

.form-control:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.8;
}

.update-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 2rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
    background-color: #2ecc71;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: auto;
    margin-top: 1rem;
}

.update-btn:hover {
    background-color: #27ae60;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(46, 204, 113, 0.2);
}

.update-btn:active {
    transform: translateY(0);
    box-shadow: none;
}

@media (max-width: 768px) {
    .input-field {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .form-label {
        flex: none;
    }

    .form-control {
        flex: none;
        width: 100%;
    }
}
</style>