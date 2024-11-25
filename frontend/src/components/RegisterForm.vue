<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';
import { useUserStore } from '@/stores/user.store';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import Swal from 'sweetalert2'

const router = useRouter();
const username = ref('');
const password = ref('');
const phone = ref('');
const errorMessage = ref('');

const validationSchema = toTypedSchema(
    z.object({
        username: z
            .string()
            .min(2, { message: 'Tên đăng nhập ít nhất 2 ký tự.' })
            .max(50, { message: 'Tên đăng nhập có nhiều nhất 50 ký tự.' }),
        password: z
            .string()
            .min(6, { message: 'mật khẩu phải ít nhất 6 ký tự.' })  // Sửa validation cho mật khẩu
            .max(50, { message: 'mật khẩu tối đa 50 ký tự.' }),
        phone: z
            .string()
            .regex(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g, {
                message: 'Số điện thoại không hợp lệ.'
            })
    })
);

const handleSubmit = async () => {
    try {
        console.log({
            username: username.value,
            password: password.value,
            phone: phone.value
        });
        const response = await authService.register(username.value, password.value, phone.value);

        if (response) {
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
                title: `Hello! ${username.value}`
            });
            router.push('/login');
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${errorMessage.value}`,
            });
        }
    } catch (error) {
        errorMessage.value = error.message;
        Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${errorMessage.value}`,
            });
    }
};
</script>

<template>
    <div class="container__registerForm">
        <Form
            class="registerForm"
            :validation-schema="validationSchema"
            @submit="handleSubmit"
        >
            <div class="mb-3">
                <h3 class="registerForm__Title text-dark">Sign Up</h3>

                <label for="username" class="form-label fw-bold">Username</label>
                <Field
                    id="username"
                    name="username"
                    v-model="username"
                    class="registerForm__input form-control"
                    placeholder="Your Username"
                    required
                    autocomplete="username"
                    />
                <ErrorMessage name="username" class="error-message" />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label fw-bold">Password</label>
                <Field
                    type="password"
                    id="password"
                    name="password"
                    v-model="password"
                    class="registerForm__input form-control"
                    placeholder="Your Password"
                    required
                    autocomplete="current-password"
                />
                <ErrorMessage name="password" class="error-message" />
            </div>

            <div class="mb-3">
                <label for="phone" class="form-label fw-bold">Phone number</label>
                <Field
                    type="text"
                    id="phone"
                    name="phone"
                    v-model="phone"
                    class="registerForm__input form-control"
                    placeholder="Your Phone"
                    required
                />
                <ErrorMessage name="phone" class="error-message" />
            </div>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <div class="mb-2">
                <button type="submit" class="registerForm__button btn btn-primary">
                    Submit
                </button>
            </div>

            <p class="registerForm__redirect">
                You have an account?
                <RouterLink to="/login" class="registerForm__redirect-link">
                    Sign In
                </RouterLink>
            </p>
        </Form>
    </div>
</template>

<style scoped>
/* Styles remain unchanged */
</style>

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