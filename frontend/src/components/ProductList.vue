<template>
  <div class="product-list">
    <div class="grid">
      <div
        v-if="loading"
        class="product-list__loading"
      >
        Loading...
      </div>
      <div
        v-else-if="error"
        class="product-list__error"
      >
        {{ error }}
      </div>
      <template v-else>
        <div
          v-for="(product, index) in breads"
          :key="product.bread_id"
          class="grid__column-2"
        >
          <div
            class="home__product-item" 
          >
            <router-link
              class="Detail-item text-body" style="text-decoration: none;"
              :to="`/detail/${product.bread_id}`"
            >
              <div class="home__product-item-img">
                <img
                  width="100"
                  height="100"
                  :src="product.bread_url"
                  :alt="product.bread_name"
                />
              </div>
  
              <h4 class="home__product-item-name">{{ product.bread_name }}</h4>
              <div class="home__product-item-info">
                <div class="home__product-item-amount">Amount: {{ product.bread_amount }}</div>
                <div class="home__product-item-price">{{ formatPrice(product.bread_price) }} đ</div>
              </div>
              <form @submit.prevent="addToCart(product.bread_id)">
                <input
                  type="hidden"
                  name="br_amount"
                  value="1"
                />
                <input
                  type="hidden"
                  name="brID"
                  :value="product.bread_id"
                />
                <button
                  type="submit"
                  class="btn home__product-item-addToCartBtn"
                >
                  <i class="fa-solid fa-cart-shopping home__product-item-icon"></i>
                  Add to Cart
                </button>
              </form>
            </router-link>
            <!-- Hiển thị hình ảnh sản phẩm -->
          </div>
        </div>
      </template>
    </div>
    
  <!-- Pagination Controls -->
    <div class="pagination">
      <button 
        class="pagination__btn" 
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        <i class="fa-solid fa-chevron-left"></i> Previous
      </button>
      <span class="pagination__info">Page {{ currentPage }}</span>
      <button 
        class="pagination__btn" 
        :disabled="breads.length < limit"
        @click="nextPage"
      >
        Next <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import makeProductsService from '@/services/products.service';

export default {
  name: 'ProductList',
  props: {
    selectedCategory: {
      type: String,
    }
  },
  setup(props) {
    const breads = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const limit = ref(8);

    const fetchProducts = async (page = 1, category = '') => {
      loading.value = true;
      error.value = null;

      try {
        let response;
        // Nếu không có category hoặc category là 'all' thì lấy tất cả sản phẩm
        if (!category || category === 'all') {
          response = await makeProductsService.getProductList(page, limit.value);
        } else {
          // Ngược lại thì filter theo category
          response = await makeProductsService.getFilterProducts(category, page, limit.value);
        }
        breads.value = response.products;
      } catch (err) {
        console.error('Error fetching products:', err);
        error.value = 'Failed to load products. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
        // Truyền cả category hiện tại vào khi chuyển trang
        fetchProducts(currentPage.value, props.selectedCategory);
      }
    };

    const nextPage = () => {
      if (breads.value.length === limit.value) {
        currentPage.value += 1;
        // Truyền cả category hiện tại vào khi chuyển trang
        fetchProducts(currentPage.value, props.selectedCategory);
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Theo dõi sự thay đổi của selectedCategory
    watch(
      () => props.selectedCategory,
      (newCategory) => {
        currentPage.value = 1; // Reset về trang 1 khi đổi category
        fetchProducts(1, newCategory); // Gọi API với category mới
      },
      { immediate: true } // Đảm bảo chạy ngay khi component được tạo
    );

    // Không cần onMounted nữa vì watch với immediate: true sẽ thực hiện ngay
    
    return {
      breads,
      loading,
      error,
      currentPage,
      limit,
      fetchProducts,
      formatPrice,
      prevPage,
      nextPage
    };
  }
};
</script>


<style>
.product-list {
  margin-top: 10px;
}

.home__product-item-info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  font-size: 1rem;
}

.product-list .grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Tạo 4 cột trong mỗi hàng */
  gap: 20px; /* Khoảng cách giữa các sản phẩm */
}
.product-list .home__product-item-img {
  position: relative;
  width: 100%; /* Đảm bảo hình ảnh chiếm toàn bộ chiều rộng của khung */
  padding-top: 100%; /* Tạo tỷ lệ khung vuông để giữ hình ảnh có tỷ lệ đúng */
  background-repeat: no-repeat;
  background-size: cover; /* Làm cho hình ảnh đầy khung mà không bị biến dạng */
  background-position: center;
  overflow: hidden;
}

.product-list .home__product-item-img img {
  position: absolute; /* Đảm bảo hình ảnh được đặt trong khung đúng cách */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Căn giữa hình ảnh */
  width: 100%; /* Đảm bảo hình ảnh chiếm hết chiều rộng */
  height: 100%; /* Đảm bảo hình ảnh chiếm hết chiều cao */
  object-fit: cover; /* Đảm bảo hình ảnh vừa vặn và không bị biến dạng */
}

.product-list .grid__column-2 {
  padding-left: 5px;
  padding-right: 5px;
}

.product-list .home__product-item {
  background-color: var(--white-color);
  margin-top: 10px;
  position: relative;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  transition: transform ease-in 0.1s;
  will-change: transform;
  text-decoration: none;
  display: block;
  border: 1px solid #afaeae;
}

.product-list .home__product-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.05);
}

.product-list .home__product-item-img {
  padding-top: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.product-list .home__product-item-name {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-color);
  line-height: 1.8rem;
  margin: 10px;
  height: 2rem;
  overflow: hidden;
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-align: right;
  text-transform: uppercase;
}

.product-list .home__product-item-price {
  font-size: 1rem;
  text-align: right;
  font-weight: 400;
  color: var(--primary-color);
  margin: 6px 10px;
}


.product-list .home__product-item-addToCartBtn {
  background-color: #f67514;
  color: var(--white-color);
  padding: 8px 20px;
  border: none;
  border-radius: 2px;
  width: calc(100% - 20px);
  margin: 10px;
  cursor: pointer;
}

.home__product-item-addToCartBtn:hover {
  cursor: pointer;
  opacity: 0.9;
  color: #fff;
}

.product-list .home__product-item-icon {
  margin-right: 4px;
}

.product-list .product-list__loading,
.product-list .product-list__error {
  text-align: center;
  padding: 20px;
  font-size: 1.4rem;
}

.product-list .product-list__error {
  color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination__btn {
  padding: 8px 16px;
  background-color: #f67514;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s ease;
}

.pagination__btn:hover:not(:disabled) {
  opacity: 0.9;
}

.pagination__btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination__info {
  font-size: 1rem;
  color: #666;
  min-width: 100px;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .product-list .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-list .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-list .grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
