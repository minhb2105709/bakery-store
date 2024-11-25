<template>
    <h2 class="text-center mb-3">-- Add A New Product --</h2>
    <div class="form-container">

        <Form
            @submit="submitForm"
            :validation-schema="validationSchema"
            class="product-form"
            novalidate
        >
        <!-- Tên bánh -->
        <div class="form-row mt-3">
            <label for="bread_name" class="form-label">Bread Name</label>
            <div class="error-row">
                <Field
                    id="bread_name"
                    name="bread_name"
                    type="text"
                    class="form-control"
                    v-model="bread_name"
                />
                <ErrorMessage name="bread_name" class="text-danger error-message"/>
            </div>
            </div>

        <!-- Loại bánh -->
        <div class="form-row mt-3">
            <label for="type_name" class="form-label">Bread Type</label>
            <div class="error-row">
                <Field
                    id="type_name"
                    name="type_name"
                    as="select"
                    class="form-control"
                    v-model="type_name"
                >
                    <!-- Default option -->
                    <option disabled value="">-- Select a type --</option>
                    <option 
                        v-for="(Type, index) in Types" 
                        :key="Type.type_id" 
                        :value="Type.type_id"
                    >
                        {{ Type.type_name }}
                    </option>
                <!-- Add other options here -->
                </Field>
                <ErrorMessage name="type_name" class="text-danger" />

            </div>
        </div>

        <!-- Giá -->
        <div class="form-row mt-3">
            <label for="price" class="form-label">Bread Price</label>
            <div class="error-row">
                <Field
                    id="price"
                    name="price"
                    type="number"
                    class="form-control"
                    v-model="price"
                />  
                <ErrorMessage name="price" class="text-danger" />
            </div>
        </div>

        <!-- Số lượng -->
        <div class="form-row mt-3">
            <label for="amount" class="form-label">Bread Quantity</label>
            <div class="error-row">
                <Field
                    id="amount"
                    name="amount"
                    type="number"
                    class="form-control"
                    v-model="amount"
                />
                <ErrorMessage name="amount" class="text-danger" />

            </div>
        </div>

        <!-- Hình ảnh -->
        <div class="form-row mt-3">
            <label for="image" class="form-label">Bread Image</label>
            <div class="error-row">
                <Field
                    id="image"
                    name="image"
                    type="file"
                    class="form-control"
                    @change="handleImageUpload"
                />
                <ErrorMessage name="image" class="text-danger" />

            </div>
        </div>

        <!-- Nút Submit -->
        <div class="form-row mt-3">
            <button type="submit" class="btn btn-success form-submit">Xác Nhận</button>
        </div>
        </Form>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import adminService from '@/services/admin.service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';

const router = useRouter();
const bread_name = ref('');
const type_name = ref('');
const price = ref('');
const amount = ref('');
const image = ref(null);
const errorMessage = ref('');

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

const Types = ref([]);


onMounted(async () => {
    try {
        const response = await adminService.getTypes();
        if (response && response.Types) {
            Types.value = response.Types; // Assign the array to `Types`
        } else {
            console.error("Unexpected response structure:", response);
            Types.value = []; // Set an empty array if response is not as expected
        }
    } catch (error) {
        console.error("Failed to fetch types:", error.message);
        Types.value = []; // Set to empty array if there's an error
    }
});


const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log('file :' + file);
    if (file) {
        image.value = file; // Lưu trực tiếp file
    }
}

const submitForm = async () => {
    try {
        const data = new FormData();
        data.append("type_id", type_name.value);
        data.append("bread_name", bread_name.value);
        data.append("bread_price", price.value);
        data.append("bread_amount", amount.value);
        if (image.value) {
            data.append("bread_url", image.value); // Append trực tiếp file
        }
        
        const response = await adminService.addNewProduct(data);
        Swal.fire('Success', 'Product added successfully!', 'success');
        console.log(response);
    } catch (error) {
        errorMessage.value = error.message;
        alert(errorMessage.value);
    }
}

</script>

<style scoped>
.form-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #f4f4f4;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}


.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.form-label {
    width: 30%;
    font-weight: bold;
    color: #333;
    margin-right: 10px;
    text-align: right;
    text-align: center;
}

.form-control {
    width: 100%;
}   

.error-row{
    width: 70%;
}

.form-submit {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    margin-left: auto;
}

.form-submit:hover {
    background-color: #218838;
    transform: scale(1.05);
}

.form-submit:active {
    background-color: #1e7e34;
    transform: scale(0.98);
}

.error-message{
    text-align: center;
}

/* Ẩn dấu mũi tên trong input type="number" */
input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
    -webkit-appearance: none;  /* Chrome, Safari, Opera */
    appearance: none;          /* Standard syntax */
}

/* Đối với các trình duyệt hỗ trợ điều chỉnh chiều cao input */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>