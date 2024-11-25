<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import makeProductsService from '@/services/products.service';
import cartService from '@/services/cart.service';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import { useCartStore } from '@/stores/cart.store';

import Swal from 'sweetalert2';


const route = useRoute();
const product = ref(null);  // Holds product data
const quantity = ref(1);

const userStore = useUserStore();
const cartStore = useCartStore();

// Function to fetch product details
const fetchProductDetails = async (productId) => {
    try {
        const response = await makeProductsService.getProductDetails(productId);
        console.log(response);
        product.value = response.productDetails[0];  // Assuming 'productDetails' contains all product information
        console.log('Fetched product details:', product.value);
    } catch (error) {
        console.error('Failed to fetch product details:', error);
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const productStatus = computed(() => {
    return product.value?.bread_amount > 0 ? 'In Stock' : 'Out of Stock';
});

const addToCart = async () => {
    if (!userStore.userId) {
        Swal.fire('Error', 'Please log in to add items to the cart.', 'error');
        return;
    }
    if (quantity.value > product.value.bread_amount) {
        Swal.fire('Error', 'Quantity exceeds available stock.', 'error');
        return;
    }
    try {
        console.log('User ID: ', userStore.userId);
        console.log('Product ID: ', route.params.id);
        console.log('Quantity: ', quantity.value);
        const response = await cartService.addToCart(route.params.id, quantity.value);
        cartStore.setSelectedItems(response);
        
        Swal.fire('Success', 'Product added to cart successfully!', 'success');
    } catch (error) {
        console.error('Failed to add product to cart:', error);
        Swal.fire('Error', 'Failed to add product to cart', 'error');
    }
};

// Fetch product details on component mount
onMounted(() => {
    const productId = route.params.id;
    fetchProductDetails(productId);
});

// Đảm bảo giá trị nhập thủ công là số hợp lệ
watch(quantity, (newVal) => {
    if (newVal < 1 || isNaN(newVal)) {
        quantity.value = 1; // Giữ giá trị tối thiểu là 1
    }
});

// Hàm tăng giảm số lượng
const increaseQuantity = () => {
    quantity.value++;
};

const decreaseQuantity = () => {
    if (quantity.value > 1) quantity.value--;
};

</script>
<template>
    <AppHeader/>
    <div class="container mt-4 mb-4">
        <div class="row">
            <div class="col-md-6 d-flex justify-content-center  ">
                <div class="">
                    <img
                        :src="product?.bread_url"
                        alt="Product Image"
                        class="img-fluid rounded product-image"
                        />
                </div>
            </div>

            <div class="col-md-6">
                <div class="product-info">
                    <h3 class="product-title">{{ product?.bread_name }}</h3>  
                    <div class="product-amount-price">
                        <p class="product-amount text-body-secondary ">Amount: {{ product?.bread_amount }}</p>
                        <p class="product-status" 
                        :class="{ 'text-success': productStatus === 'In Stock', 'text-danger': productStatus === 'Out of Stock' }">
                            Status: {{ productStatus }}
                        </p>
                    </div>
                    <p class="product-price text-body-secondary ">{{ formatPrice(product?.bread_price) }}</p>
                    <p class="product-type">Bread's Type: {{ product?.type_name }}</p>
                    <p class="product-description">{{ product?.bread_desc }}</p>
                </div>

                <div class="product-quantity d-flex align-items-center my-3">
                    <label for="quantity" class="me-3">Quantity: </label>
                    <div class="quantity-controls">
                        <button class="btn btn-input-quantity btn-outline-success btn-sm" @click="decreaseQuantity">-</button>
                        <input type="number" class="input-quantity text-center" v-model="quantity" min="1">
                        <button class="btn btn-input-quantity btn-outline-success btn-sm" @click="increaseQuantity">+</button>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" @click="addToCart">
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Tổng thể cho container */
.container {
    max-width: 1200px;
    margin: auto;
}

/* Canh giữa và thêm khoảng cách cho hình ảnh sản phẩm */
.product-image {
    width: 100%;
    max-width: 450px;
    height: auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Định dạng phần thông tin sản phẩm */
.product-info {
    margin-top: 20px;
}

.product-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
}

.product-amount-price {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #666;
}

.product-amount {
    position: relative;
}

.product-amount::after {
    content: "|";
    margin: 0 10px;
    color: #b4b1b1;
}

.product-price {
    font-weight: bold;
    color: #FF5722; /* Màu nổi bật cho giá */
}

.product-type,
.product-description {
    font-size: 1rem;
    color: #555;
    margin-top: 0.5rem;
}

/* Phần nhập số lượng */
.product-quantity {
    margin-top: 1.5rem;
}

#quantity {
    max-width: 80px;
}

/* Button thêm vào giỏ hàng */
.btn-primary {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #fff;
    border: 1px solid #007bff;
    color: #000;
    border-radius: 5px;
    transition: background-color 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);

}

.btn-primary:hover {
    background-color: #007bff;
    color: #fff;
    border: 1px solid #0056b3;
}

.btn-input-quantity{
    width: 25px;
    height: 32px;
    border: 1px solid #ccc;
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

.input-quantity{
    max-width: 40px;
    border: 1px solid #ccc; 
    margin: 4px;
    outline: none;
    height: 32px;
    border-radius: 5px;
}

.quantity-controls{
    display: flex;
    align-items: center;
    
}
</style>
