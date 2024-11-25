<template>
    <h2 class="text-center mb-3">-- Update Products --</h2>
    <div class="ml-5">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Type</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Image</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in products" :key="product.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>
                        <div class="data-container">
                            {{ product.type_name }}
                        </div>
                    </td>
                    <td>
                        <div class="data-container">
                            {{ product.bread_name }} 
                        </div>
                    </td>
                    <td>
                        <div class="data-container">
                            <span class="data">
                                {{ formatPrice(product.bread_price) }}
                            </span>
                            <button class="edit-button" @click="editField(index, 'price')">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                    </td>
                    <td>
                        <div class="data-container">
                            <div class="data">
                                {{ product.bread_amount }}
                            </div>
                            <button class="edit-button" @click="editField(index, 'amount')">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                        
                    </td>

                    <td class="url-cell">
                        <div class="data-container">
                            <div class="data">
                                {{ product.bread_url }}
                            </div>
                            <button class="edit-button" @click="updateImage(index, 'image')">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import adminService from '@/services/admin.service';


const products = ref([]);

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Fetch products on mount
onMounted(async () => {
    try {
        const response = await adminService.viewAllProducts();
        console.log("Fetched products:", response.Products);
        products.value = response.Products;

    } catch (error) {
        console.error("Failed to fetch products:", error.message);
    }
});

// Function to edit price or amount
async function editField(index, field) {
    const currentValue = field === 'price' ? products.value[index].bread_price : products.value[index].bread_amount;
    const { value: newValue } = await Swal.fire({
        title: `Edit ${field === 'price' ? 'Price' : 'Amount'}`,
        input: 'number',
        inputLabel: `Enter new ${field === 'price' ? 'price' : 'amount'}`,
        inputValue: currentValue,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value || isNaN(value) || value <= 0) {
                return 'Please enter a valid number greater than 0!';
            }
        }
    });

    if (newValue) {
        // Update the local data
        if (field === 'price') {
            products.value[index].bread_price = newValue;
            try {
                // Call updateProductQuantity in adminService
                await adminService.updateProductPrice(products.value[index].bread_id, newValue);
                Swal.fire(`Updated price to ${newValue}`);
            } catch (error) {
                Swal.fire('Error', `Failed to update the price: ${error.message}`, 'error');
            }
        } else {
            products.value[index].bread_amount = newValue;
            try {
                // Call updateProductQuantity in adminService
                await adminService.updateProductQuantity(products.value[index].bread_id, newValue);
                Swal.fire(`Updated Amount to ${newValue}`);
            } catch (error) {
                Swal.fire('Error', `Failed to update the amount: ${error.message}`, 'error');
            }
        }
    } 
}

async function updateImage(index, field) {
    if (field === 'image') {
        // Sử dụng SweetAlert để chọn ảnh
        const { value: file } = await Swal.fire({
            title: "Select image",
            input: "file",
            inputAttributes: {
                accept: "image/*",
                "aria-label": "Upload the product image"
            }
        });

        if (file) {
            // Hiển thị ảnh đã chọn trước khi upload
            const reader = new FileReader();
            reader.onload = (e) => {
                Swal.fire({
                    title: "Your uploaded picture",
                    imageUrl: e.target.result,
                    imageAlt: "The uploaded picture"
                });
            };
            reader.readAsDataURL(file);

            try {
                // Tạo FormData và gửi yêu cầu update ảnh
                await adminService.updateProductImage(products.value[index].bread_id, file);
                Swal.fire("Image updated successfully");

                // Cập nhật URL hình ảnh trong dữ liệu sản phẩm
                products.value[index].bread_url = URL.createObjectURL(file);
            } catch (error) {
                Swal.fire("Error", `Failed to update image: ${error.message}`, "error");
            }
        }
    }
}
</script>

<style scoped>

.table td {
    text-align: center;
}

.table .data-container {
    display: flex;
    align-items: center;
    width: 100%;
}

.table .edit-button {
    background: none;
    border: none;
    padding: 12px;
    margin: 0;
    color: inherit;
    cursor: pointer;
    font-size: 1rem;
}

.table .edit-button i {
    font-size: 0.75rem;
}

.table .data{
    width: 30% !important;
    display: inline-block;
    overflow: hidden;
}

.url-cell{
    max-width: 100px; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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