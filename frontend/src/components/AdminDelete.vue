<template>
    <div class="container my-3">
        <h2 class="text-center mb-4">Manage Products</h2>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Type</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in products" :key="product.bread_id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ product.type_name }}</td>
                        <td>{{ product.bread_name }}</td>
                        <td>{{ formatPrice(product.bread_price) }}</td>
                        <td>{{ product.bread_amount }}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" @click="deleteProduct(index)">
                                <i class="fa fa-trash-o" aria-hidden="true"></i> Delete
                            </button>
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

// Fetch products on mount
onMounted(async () => {
    try {
        const response = await adminService.viewAllProducts();
        console.log(response);
        console.log("Fetched products:", response.Products);
        products.value = response.Products;

    } catch (error) {
        console.error("Failed to fetch products:", error.message);
    }
});

// Function to edit price or amount
async function deleteProduct(index) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        try {
            console.log(products.value[index].bread_id);
            await adminService.deleteProduct(products.value[index].bread_id);
            
            // Xóa sản phẩm khỏi mảng sau khi xóa thành công
            products.value.splice(index, 1);

            await Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        } catch (error) {
            Swal.fire('Error', `Failed to delete the product: ${error.message}`, 'error');
        }
    }
}
    

</script>

<style scoped>
.table {
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 0.5rem;
}

.table thead tr:first-child th:first-child {
    border-top-left-radius: 0.5rem;
}

.table thead tr:first-child th:last-child {
    border-top-right-radius: 0.5rem;
}

.table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 0.5rem;
}

.table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 0.5rem;
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

.delete-icon{
    font-size: 12px;
}
</style>