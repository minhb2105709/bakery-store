<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user.store';
import customerService from '@/services/customer.service';
import Swal from 'sweetalert2';


const userStore = useUserStore();
const orderHistory = ref([]);
const isLoading = ref(false);
const error = ref(null);

const fetchOrderHistory = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
        const userId = userStore.userId;
        console.log('User ID:', userId);
        if (!userId) {
            throw new Error('User ID is required');
        }

        const data = await customerService.orderHistory(userId);
        console.log('Order history data:', data);
        
        orderHistory.value = data.orders || [];
        
    } catch (err) {
        console.error('Error:', err);
        error.value = err.message;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No Order History Found`,
        });
    } finally {
        isLoading.value = false;
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(() => {
    fetchOrderHistory();
});
</script>

<template>
    <div class="container p-4">
        <div class="title-container">
            <h4 class="title">Payment History</h4>
            <div class="title-underline"></div>
        </div>

        <div v-if="isLoading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else class="container">
            <div v-if="orderHistory.length === 0" class="text-center text-muted">
                <h4 class="text-muted text-uppercase">No order history found</h4>
            </div>
            
            <table v-else class="table table-hover table-bordered">
                <thead>
                    <tr class="table-info">
                        <th scope="col" class="text-center">#</th>
                        <th scope="col">Bread Name</th>
                        <th scope="col" class="text-end">Amount</th>
                        <th scope="col" class="text-end">Cost</th>
                        <th scope="col" class="text-end">Date</th>
                        <th scope="col" class="text-end">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in orderHistory" :key="index">
                        <th scope="row" class="text-center">{{ index + 1 }}</th>
                        <td>{{ order.breadName || order.bread_name }}</td>
                        <td class="text-end">{{ order.quantity }}</td>
                        <td class="text-end">{{ formatPrice(order.cost) }}</td>
                        <td class="text-end">{{ new Date(order.invoice_date).toLocaleDateString() }}</td>
                        <td class="text-success text-end">
                            {{ order.status }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
/* Title styling */
.title-container {
    position: relative;
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 0.5rem;
}

.title {
    color: #2c3e50;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;
    padding: 0 1rem;
}

.title-underline {
    position: relative;
    height: 4px;
    width: 50px;
    background: #3498db;
    margin: 0 auto;
    border-radius: 2px;
}

.title-underline::before,
.title-underline::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 50%;
    background: #2980b9;
    top: 0;
}

.title-underline::before {
    left: -50px;
}

.title-underline::after {
    right: -50px;
}

/* Table styling */
.table {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
}

.table thead th {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    padding: 1rem;
    font-weight: 600;
    color: #2c3e50;
}

.table tbody tr:hover {
    background-color: #f8f9fa;
}

.table td, .table th {
    padding: 1rem;
    vertical-align: middle;
    border-bottom: 1px solid #dee2e6;
}

/* Status column */
.text-success {
    color: #28a745 !important;
    font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
    .table {
        font-size: 0.9rem;
    }
    
    .table td, .table th {
        padding: 0.75rem;
    }
    
    .title {
        font-size: 1.5rem;
    }
}
</style>