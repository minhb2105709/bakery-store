<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import { useCartStore } from '@/stores/cart.store';
import cartService from '@/services/cart.service';
import Swal from 'sweetalert2';

const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();

// Sử dụng getter từ store để lấy selected items
const selectedItems = computed(() => cartStore.getSelectedItems);

// Kiểm tra nếu không có sản phẩm được chọn, chuyển về trang cart
onMounted(() => {
    if (selectedItems.value.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No items selected',
            text: 'Please select items from your cart first',
            confirmButtonText: 'Back to Cart'
        }).then(() => {
            router.push('/cart');
        });
    }
});

// Format price helper
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Tính tổng giá trị đơn hàng
const totalCost = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.cost, 0);
});

// Hàm xử lý thanh toán
const handleCheckout = async () => {
    try {
        // Hiển thị confirm dialog
        const result = await Swal.fire({
            title: 'Confirm Payment',
            text: 'Are you sure you want to proceed with payment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, pay now',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            // Gọi API thanh toán
            const invoice_id = selectedItems.value[0].invoice_id; // Lấy invoice_id từ item đầu tiên
            await cartService.checkout(userStore.userId, invoice_id);

            cartStore.clearCart();

            // Hiển thị thông báo thành công
            await Swal.fire({
                title: 'Payment Successful!',
                text: 'Your order has been processed successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Refresh cart data hoặc chuyển hướng
            router.push('/cart'); // hoặc trang khác tùy vào flow của ứng dụng
        }
    } catch (error) {
        // Xử lý lỗi
        Swal.fire({
            title: 'Payment Failed',
            text: error.message || 'There was an error processing your payment',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};

</script>

<template>
    <div class="container mt-4 bg-white p-4 mb-4">
        <h5 class="mb-4 form-name pb-2">Review Product</h5>
        <div v-if="selectedItems.length > 0">
            <div
                v-for="(item, index) in selectedItems" 
                :key="index"
                class="cart-item border-bottom align-items-center mb-2 p-2">
                <img
                    :src="item.bread_url" 
                    :alt="item.bread_name"  
                    class="product-img me-3"
                />
                <div class="product-name-price">
                    <p class="mb-1 cart-product-name">{{ item.bread_name }}</p>
                    <p class="text-danger fw-bold mb-0">{{ formatPrice(item.bread_price) }}</p>
                </div>
                <div class="quantity-controls">
                    <span class="px-2">x {{ item.quantity }}</span>
                </div>
                <p class="text-danger fw-bold ms-3 cost-data">{{ formatPrice(item.cost) }}</p>
            </div>
            <div class="payment-line pt-4">
                <div class="checkout ">
                    <button @click="handleCheckout" class="checkout-sbt btn btn-success"> <i class="fa-regular fa-money-bill-1"></i> Payment</button>
                </div>
                <div class="d-flex  text-danger">
                    <p class="fw-bold me-3">Total: {{ formatPrice(totalCost) }}</p>
                </div>
    
            </div>
        </div>
        <div v-else class="text-center py-4">
            <p>No items selected. Please return to cart and select items.</p>
        </div>
    </div>
</template>

<style scoped>
.container-item{
    background-color: #fff;
    border-radius: 2%;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);

}
.product-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
}
.cart-item {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.quantity-controls {
    display: flex;
    align-items: center;
    width: 100px;
    justify-content: space-between;
}
.summary-card {
    background-color: #fff;
    border: 1px solid #f2f2f2;
    border-radius: 10px;
}
.progress-bar {
    background-color: #007bff;
}

p{
    margin: 0;
}

.me-3 {
    margin-right: 4rem !important;
}

.cart-product-name{
    max-width: 324px;
    overflow: hidden;
    text-wrap: nowrap;
}

.product-name-price{
    width: 300px;
}
.cost-data{
    width: 120px;
    text-align: right;
}

.edit-button{
    background: none;
    border: none;
    padding: 12px;
    margin: 0;
    color: inherit;
    font-size: 1rem;
    opacity: 0.8;
}

.edit-button:hover {
    cursor: pointer;
    opacity: 1;
    color: #0d6efd;
}

.payment-line{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.checkout{
    margin-left: 74px;
}

.checkout-sbt:hover{
    background-color: #28a745; /* Màu nền thay đổi khi hover */
    transform: scale(1.1); /* Phóng to nút khi hover */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Thêm bóng đổ */
}
</style>