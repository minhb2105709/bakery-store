<template>
    <div class="add-product-container">
        <div class="card shadow-lg">
            <div class="card-header bg-primary text-white">
                <h2 class="text-center mb-0">
                    <i class="bi bi-plus-circle me-2"></i>Add a new Product
                </h2>
            </div>
            
            <div class="card-body">
                <Form
                    @submit="submitForm"
                    :validation-schema="validationSchema"
                    class="product-form"
                    novalidate
                >
                    <div class="row g-3">
                        <!-- Tên bánh -->
                        <div class="col-md-6">
                            <label for="bread_name" class="form-label">
                                <i class="bi bi-tag me-2"></i>Bread Name
                            </label>
                            <div class="input-group has-validation">
                                <Field
                                    id="bread_name"
                                    name="bread_name"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.bread_name }"
                                    v-model="bread_name"
                                    placeholder="Enter bread name"
                                />
                                <div class="invalid-feedback">
                                    <ErrorMessage name="bread_name" />
                                </div>
                            </div>
                        </div>

                        <!-- Loại bánh -->
                        <div class="col-md-6">
                            <label for="type_name" class="form-label">
                                <i class="bi bi-collection me-2"></i>Bread's Type
                            </label>
                            <div class="input-group has-validation">
                                <Field
                                    id="type_name"
                                    name="type_name"
                                    as="select"
                                    class="form-select"
                                    :class="{ 'is-invalid': errors.type_name }"
                                    v-model="type_name"
                                >
                                    <option disabled value="">-- choose type --</option>
                                    <option 
                                        v-for="Type in Types" 
                                        :key="Type.type_id" 
                                        :value="Type.type_id"
                                    >
                                        {{ Type.type_name }}
                                    </option>
                                </Field>
                                <div class="invalid-feedback">
                                    <ErrorMessage name="type_name" />
                                </div>
                            </div>
                        </div>

                        <!-- Giá -->
                        <div class="col-md-6">
                            <label for="price" class="form-label">
                                <i class="bi bi-currency-dollar me-2"></i>Price
                            </label>
                            <div class="input-group has-validation">
                                <span class="input-group-text">₫</span>
                                <Field
                                    id="price"
                                    name="price"
                                    type="number"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.price }"
                                    v-model.number="price"
                                    placeholder="Price"
                                />
                                <div class="invalid-feedback">
                                    <ErrorMessage name="price" />
                                </div>
                            </div>
                        </div>

                        <!-- Số lượng -->
                        <div class="col-md-6">
                            <label for="amount" class="form-label">
                                <i class="bi bi-boxes me-2"></i>Quantity
                            </label>
                            <div class="input-group has-validation">
                                <Field
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.amount }"
                                    v-model.number="amount"
                                    placeholder="Quantity"
                                />
                                <div class="invalid-feedback">
                                    <ErrorMessage name="amount" />
                                </div>
                            </div>
                        </div>

                        <!-- Hình ảnh -->
                        <div class="col-12">
                            <label for="image" class="form-label">
                                <i class="bi bi-image me-2"></i>Bread Image
                            </label>
                            <div class="input-group">
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    class="form-control"
                                    :class="{ 'is-invalid': imageError }"
                                    @change="handleImageUpload"
                                    accept="image/*"
                                />
                                <div v-if="imagePreview" class="input-group-text">
                                    <img 
                                        :src="imagePreview" 
                                        alt="Preview" 
                                        class="img-thumbnail"
                                        style="max-width: 100px; max-height: 100px;"
                                    />
                                </div>
                                <div v-if="imageError" class="invalid-feedback">
                                    {{ imageError }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="text-center mt-4">
                        <button 
                            type="submit" 
                            class="btn btn-primary btn-lg"
                            :disabled="isSubmitting"
                        >
                            <span 
                                v-if="isSubmitting" 
                                class="spinner-border spinner-border-sm me-2"
                            ></span>
                            Submit
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import adminService from '@/services/admin.service';
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';

const router = useRouter();
const { errors } = useForm();

// Reactive state variables
const bread_name = ref('');
const type_name = ref('');
const price = ref('');
const amount = ref('');
const Types = ref([]);
const imagePreview = ref(null);
const imageError = ref(null);
const isSubmitting = ref(false);

// Validation Schema
const validationSchema = toTypedSchema(
    z.object({
        bread_name: z
            .string()
            .min(2, { message: 'Tên sản phẩm ít nhất 2 ký tự.' })
            .max(200, { message: 'Tên sản phẩm có nhiều nhất 200 ký tự.' }),
        type_name: z
            .string()
            .min(1, { message: 'Vui lòng chọn loại bánh.' }),
        price: z
            .number()
            .min(1000, { message: 'Giá bánh phải lớn hơn 1000đ.' })
            .positive({ message: 'Giá phải là số dương.' }),
        amount: z
            .number()
            .int()
            .positive({ message: 'Số lượng phải là số nguyên dương.' })
    })
);

// Fetch product types on component mount
onMounted(async () => {
    try {
        const response = await adminService.getTypes();
        Types.value = response.Types || [];
    } catch (error) {
        console.error("Không thể tải loại bánh:", error.message);
        Types.value = [];
    }
});

// Image upload handler
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    imageError.value = null;

    if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            imageError.value = 'Kích thước ảnh không được vượt quá 5MB';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            imageError.value = 'Chỉ chấp nhận ảnh JPG, PNG hoặc GIF';
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// Form submission handler
const submitForm = async () => {
    // Prevent multiple submissions
    if (isSubmitting.value) return;

    // Validate before submission
    try {
        isSubmitting.value = true;

        const data = new FormData();
        data.append("type_id", type_name.value);
        data.append("bread_name", bread_name.value);
        data.append("bread_price", price.value);
        data.append("bread_amount", amount.value);
        
        // Only append image if it exists
        if (imagePreview.value) {
            const imageFile = document.getElementById('image').files[0];
            data.append("bread_url", imageFile);
        }
        
        const response = await adminService.addNewProduct(data);
        
        // Success notification
        await Swal.fire({
            icon: 'success',
            title: 'Thêm Sản Phẩm Thành Công!',
            text: 'Sản phẩm mới đã được thêm vào danh sách.',
            confirmButtonText: 'OK'
        });

        // Reset form
        resetForm();
    } catch (error) {
        // Error notification
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Không thể thêm sản phẩm. Vui lòng thử lại.',
        });
    } finally {
        isSubmitting.value = false;
    }
};

// Reset form method
const resetForm = () => {
    bread_name.value = '';
    type_name.value = '';
    price.value = '';
    amount.value = '';
    imagePreview.value = null;
    document.getElementById('image').value = '';
};
</script>

<style scoped>
.add-product-container {
    background-color: #f8f9fa;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
}

.card {
    width: 100%;
    max-width: 800px;
    border: none;
}

.card-header {
    background-color: #007bff !important;
    color: white;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Enhanced form control styles */
.form-control, .form-select {
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    border-color: #0d6efd;
}

/* Image preview styling */
.img-thumbnail {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 8px;
}
</style>