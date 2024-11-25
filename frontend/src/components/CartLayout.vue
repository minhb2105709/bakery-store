<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user.store';
import cartService from '@/services/cart.service';
import makeProductsService from '@/services/products.service';
import { useCartStore } from '@/stores/cart.store';

import Swal from 'sweetalert2';

const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();
const cartItems = ref([]);  // Holds cart data

// Function to fetch cart details
const fetchCart = async (id) => {
    try {
        if (userStore.userId) {
            console.log('User ID:', userStore.userId);
            const response = await cartService.viewCart(id);
            console.log(response.cart);
            cartItems.value = response.cart;
            console.log('Fetched cart details:', cartItems.value);
        } else {
            console.error('User is not logged in or does not have an ID');
        }
    } catch (error) {
        console.error('Failed to fetch cart details:', error);
    }
};

const deleteProduct = async (index) => {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            await cartService.deleteProduct(userStore.userId, cartItems.value[index].bread_id);
            cartItems.value.splice(index, 1); // Xóa sản phẩm khỏi danh sách
            Swal.fire({
                title: "Deleted!",
                text: "Your product has been deleted.",
                icon: "success",
            });
        }
    } catch (error) {
        console.error("Failed to delete product:", error);
        Swal.fire("Error", "Failed to delete product", "error");
    }
};


// Function to edit product quantity in the cart
async function editQuantity(index) {
    try {
        const currentQuantity = cartItems.value[index].quantity;

        // Prompt user to enter the new quantity
        const { value: newQuantity } = await Swal.fire({
            title: "Edit Quantity",
            input: "number",
            inputLabel: "Enter new quantity",
            inputValue: currentQuantity,
            showCancelButton: true,
            inputAttributes: {
                min: 1,
                step: 1,
            },
            inputValidator: (value) => {
                if (!value || isNaN(value) || value <= 0) {
                    return "Please enter a valid quantity greater than 0!";
                }
            },
        });

        // If user enters a new quantity
        if (newQuantity && newQuantity !== currentQuantity) {
            // Update local quantity
            cartItems.value[index].quantity = newQuantity;
            try {
                console.log('Updating quantity for Product ID:', cartItems.value[index].bread_id);
                console.log('New quantity:', newQuantity);
                await cartService.updateProductQuantity(
                    userStore.userId,
                    cartItems.value[index].bread_id,
                    newQuantity
                );

                // Update local state
                cartItems.value[index] = {
                    ...cartItems.value[index],
                    quantity: parseInt(newQuantity),
                    cost: cartItems.value[index].bread_price * parseInt(newQuantity)
                };
                // Success alert
                Swal.fire({
                    icon: "success",
                    title: "Quantity updated successfully!",
                    text: `New quantity: ${newQuantity}`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to update quantity",
                    text: error.message || "An error occurred while updating the quantity.",
                })
            }
        }
    } catch (error) {
        // Error handling
        console.error("Error updating quantity:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to update quantity",
            text: error.message || "An error occurred while updating the quantity.",
        });
    }
}



onMounted(() => {
    fetchCart(userStore.userId);
});

// Compute total price of selected items
// const selectedTotal = computed(() => {
//     return cartItems.value
//         .filter(item => item.selected)
//         .reduce((total, item) => total + item.cost, 0);
// });

const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.cost, 0);
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// const isAnyItemSelected = computed(() => {
//     return cartItems.value.some(item => item.selected);
// });


const checkout = () => {
    const selectedItems = cartItems.value;
    if (selectedItems.length > 0) {
        cartStore.setSelectedItems(selectedItems);
        console.log('Selected items:', selectedItems);
        router.push('/payment');
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'No items selected',
            text: 'Please select at least one item to checkout.',
        })
    }
};
</script>

<template>
<div class="container mt-5 mb-5">
    <h4 class="text-left mb-4"><i class="fa-solid fa-bag-shopping"></i> SHOPPING CART <span class="text-muted">( {{ cartItems.length }} items)</span></h4>

    <div class="row">
        <!-- Left: Cart Items List -->
        <div class="col-lg-8 container-item">
            <div class="py-3">
                <div
                    v-for="(item, index) in cartItems" :key="item.id"
                    class="cart-item border-bottom align-items-center mb-2 p-2">
                    <!-- <input type="checkbox" v-model="item.selected" class="form-check-input me-3" /> -->
                    <img
                        :src="item.bread_url" :alt="item.bread_name"  class="product-img me-3"
                        />
                    <div class="product-name-price">
                        <p class="mb-1 cart-product-name">{{ item.bread_name }}</p>
                        <p class="text-danger fw-bold mb-0">{{ formatPrice(item.bread_price) }}</p>
                    </div>
                    <div class="quantity-controls">
                        <span class="px-2">{{ item.quantity }}</span>
                        <button 
                            @click="editQuantity(index)" class="edit-button">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                    </div>
                        <p class="text-danger fw-bold ms-3 cost-data">{{ formatPrice(item.cost) }}</p>
                        <button 
                            @click="deleteProduct(index)" 
                            class="btn btn-outline-danger btn-sm ms-3"
                        >
                                <i class="fa-regular fa-trash-can"></i>
                        </button>
                </div>
            </div>
        </div>

        <!-- Right: Summary & Promotion Section -->
        <div class="col-lg-4">
            <!-- <div class="summary-card p-3 mb-3">
                <h5 class="text-primary">KHUYẾN MÃI</h5>
                <p>MÃ GIẢM 10K - TOÀN SÀN</p>
                <div class="progress mb-2">
                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <p class="small text-muted">Mua thêm 130.000 đ để nhận mã</p>
                <button class="btn btn-primary w-100">Mua Thêm</button>
            </div>

            <div class="summary-card p-3 mb-3">
                <h5 class="text-primary">Nhận quà</h5>
                <a href="#" class="btn btn-link">Chọn quà</a>
            </div> -->

            <div class="summary-card p-3">
                <p class="mb-1">Total Cost</p>
                <p class="text-end">{{ formatPrice(totalPrice) }}</p>
                <hr />
                <p class="fw-bold">Total Cost (including VAT)</p>
                <p class="text-end fw-bold text-danger">{{ formatPrice(totalPrice) }}</p>
                <button 
                    class="btn w-100 checkout-btn btn-danger"
                    @click="checkout">CHECK OUT</button>
                <p class="small text-muted mt-2">Web discounts are only available for retail</p>
            </div>
        </div>
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
    margin-right: 2rem !important;
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


</style>
