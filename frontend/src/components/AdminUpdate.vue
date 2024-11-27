<template>
    <div class="container my-5">
        <h2 class="text-center mb-4">Update Products</h2>
        <div class="table-responsive">
            <table class="table table-hover table-rounded table-bordered">
                <colgroup>
                    <col style="width: 5%;" />
                    <col style="width: 10%;" />
                    <col style="width: 22%;" />
                    <col style="width: 15%;" />
                    <col style="width: 13%;" />
                    <col style="width: 15%;" />
                </colgroup>
                <thead class="table-dark">
                    <tr>
                        <th scope="col" class="align-middle">#</th>
                        <th scope="col" class="text-start align-middle">Type</th>
                        <th scope="col" class="text-start align-middle">Name</th>
                        <th scope="col" class="align-middle">Price</th>
                        <th scope="col" class="align-middle">Amount</th>
                        <th scope="col" class="align-middle">Image</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in products" :key="product.id">
                        <th scope="row" class="align-middle">{{ index + 1 }}</th>
                        <td class="text-start align-middle">{{ product.type_name }}</td>
                        <td class="text-start align-middle">{{ product.bread_name }}</td>
                        <td class="align-middle">
                            <div class="edit-container">
                                <span class="edit-text">{{ formatPrice(product.bread_price) }}</span>
                                <button class="btn btn-sm btn-primary edit-btn ml-5" @click="editField(index, 'price')">
                                    <i class="fa-solid fa-dollar-sign"></i>
                                </button>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="edit-container">
                                <span class="edit-text">{{ product.bread_amount }}</span>
                                <button class="btn btn-sm btn-primary edit-btn" @click="editField(index, 'amount')">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="edit-container">
                                <div class="image-container">
                                    <img
                                        v-if="product.bread_url"
                                        :src="product.bread_url"
                                        alt="Product Image"
                                        class="img-fluid img-thumbnail"
                                        style="max-width: 80px; max-height: 80px;"
                                    />
                                    <span
                                        v-else
                                        class="text-truncate"
                                        :title="product.bread_url"
                                        style="max-width: 100px;"
                                    >
                                        {{ product.bread_url }}
                                    </span>
                                </div>
                                <button class="btn btn-sm btn-primary edit-btn" @click="updateImage(index, 'image')">
                                    <i class="fa-regular fa-image"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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

// Rest of the script remains the same as in the original file
onMounted(async () => {
    try {
        const response = await adminService.viewAllProducts();
        console.log("Fetched products:", response.Products);
        products.value = response.Products;
    } catch (error) {
        console.error("Failed to fetch products:", error.message);
    }
});

async function editField(index, field) {
    const currentValue = field === 'price' ? products.value[index].bread_price : products.value[index].bread_amount;
    const { value: newValue } = await Swal.fire({
        title: `Edit ${field === 'price' ? 'Price' : 'Amount'}`,
        input: 'number',
        inputLabel: `Enter new ${field === 'price' ? 'price' : 'amount'}`,
        inputValue: currentValue,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value || isNaN(value) || value < 0) {
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
    // Same implementation as original file
    if (field === 'image') {
        const { value: file } = await Swal.fire({
            title: "Select image",
            input: "file",
            inputAttributes: {
                accept: "image/*",
                "aria-label": "Upload the product image"
            }
        });

        if (file) {
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
                await adminService.updateProductImage(products.value[index].bread_id, file);
                Swal.fire("Image updated successfully");
                products.value[index].bread_url = URL.createObjectURL(file);
            } catch (error) {
                Swal.fire("Error", `Failed to update image: ${error.message}`, "error");
            }
        }
    }
}
</script>

<style scoped>
.table.table-hover.table-rounded {
    border-radius: 0.5rem !important;
    overflow: hidden;
}

.edit-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.edit-text {
    text-align: left;
    flex-grow: 1;
    margin-right: 10px;
}

.edit-btn {
    flex-shrink: 0;
}

.image-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 1;
    margin-right: 10px;
}

.table td {
    vertical-align: middle;
    padding: 8px;
}

/* Remaining styles from the original file */
input[type="number"] {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    appearance: none;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>