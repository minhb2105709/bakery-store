<template>
    <h2 class="text-center mb-3">- View All Products -</h2>
    <div class="ml-5">
        <table class="table table-striped table-hover ">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Type</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in products" :key="product.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ product.type_name }}</td>
                        <td>{{ product.bread_name }}</td>
                        <td>{{ formatPrice(product.bread_price) }}</td>
                        <td>{{ product.bread_amount }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminService from '@/services/admin.service';

const products = ref([]);

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(async () => {
    try {
        const response = await adminService.viewAllProducts();
        products.value = response.Products;  // Assign only the array to products
        console.log(products.value);
    } catch (error) {
        console.error("Failed to fetch products:", error.message);
    }
});
</script>