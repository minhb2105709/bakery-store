<script setup>
import AppHeader from '@/components/AppHeader.vue';
import Category from '@/components/Category.vue';
import SearchResult from '@/components/ResultSeach.vue';
</script>

<template>
    <AppHeader />

    <div class="content-wrapper container">
    <!-- Sử dụng Category với sự kiện @category-change để cập nhật danh mục đã chọn -->
        
        <Category @category-change="onCategoryChange" />
        

        <!-- Truyền selectedCategory vào ProductList -->
        <div class="product-list-container">
            <SearchResult />
        </div>
</div>

</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.product-list-container {
  flex: 3; /* Chiếm 3 phần không gian */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-left: 20px;
  background-color: #fff;
}

.category-container {
  flex: 1; /* Chiếm 1 phần không gian */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
}

footer {
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  background-color: #f1f1f1;
}
</style>