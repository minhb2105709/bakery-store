<template>
    <h2 class="text-center mb-4 fw-bold text-primary">- View All Products -</h2>
    <div class="container-fluid px-4">
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered shadow-sm">
                        <thead class="table-light">
                            <tr>
                                <th scope="col" class="text-center">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in products" :key="product.id" class="align-middle">
                                <th scope="row" class="text-center">{{ index + 1 }}</th>
                                <td>{{ product.type_name }}</td>
                                <td>{{ product.bread_name }}</td>
                                <td class="text-success fw-bold">{{ formatPrice(product.bread_price) }}</td>
                                <td :class="getAmountClass(product.bread_amount) " data-amount>
                                    {{ product.bread_amount }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Empty state -->
                    <div v-if="products.length === 0" class="text-center py-4 text-muted">
                        <p class="mb-0">No products available</p>
                    </div>
                </div>
            </div>
        </div>
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
        products.value = response.Products;
        console.log(products.value);
    } catch (error) {
        console.error("Failed to fetch products:", error.message);
    }
});

const getAmountClass = (amount) => {
    if (amount > 0) {
        return 'text-success fw-bold';  // Màu xanh khi còn hàng
    } else {
        return 'text-danger fw-bold';   // Màu đỏ khi hết hàng
    }
};
</script>

<style scoped>
/* CSS cho cột Amount */
td[data-amount] {
    text-align: left;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
}



td.text-danger {
    background-color: rgba(220, 53, 69, 0.1); /* Màu đỏ nhạt khi hết hàng */
    color: #dc3545 !important;
}

/* Hiệu ứng hover */
td.text-success:hover {
    background-color: rgba(25, 135, 84, 0.2);
}

td.text-danger:hover {
    background-color: rgba(220, 53, 69, 0.2);
}
</style>