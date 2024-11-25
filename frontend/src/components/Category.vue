<template>
  <nav class="category">
    <h3 class="category__title"><i class="category__title-icon fa-solid fa-list"></i> Categories</h3>
    <ul class="category__list">
      <li class="category__item" @click="$emit('category-change', 'all')">
        <span class="category__item-link">All</span>
      </li>
      <li
        v-for="(type, index) in Types"
        :key="index"
        class="category__item"
        :class="{ active: selectedCategory === type.type_name }"
        @click="$emit('category-change', type.type_id)"
      >
        <span class="category__item-link">{{ type.type_name }}</span>
      </li>
    </ul>

    <!-- Loading & Error State -->
    <div
      v-if="loading"
      class="category__loading"
    >
      Loading...
    </div>
    <div
      v-if="error"
      class="category__error"
    >
      {{ error }}
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue';
import makeProductsService from '@/services/products.service'; // Ensure correct path

export default {
  name: 'Category',
  setup() {
    const loading = ref(false);
    const error = ref(null);
    const selectedCategory = ref(' '); // Store the selected category
    const Types = ref([]); // Reactive variable to store types fetched from the database

    // Async function to fetch product types from the database
    const fetchTypes = async () => {
      loading.value = true;
      try {
        const response = await makeProductsService.getTypes();
        Types.value = response.Types;
        console.log('Fetched Types:', response); // Inspect response structure
        // if (response && response.Types) {
        //     Types.value = response.Types.map(type => ({
        //         label:  type_name, // Adjust based on your DB field names
        //         value:  type_name
        //     }));
        // } else {
        //     console.error("Unexpected response structure:", response);
        //     Types.value = []; // Assign empty array if response structure is unexpected
        // }
      } catch (err) {
        console.error('Failed to fetch types:', err.message);
        error.value = 'Không thể tải loại sản phẩm.';
      } finally {
        loading.value = false;
      }
    };

    // Call fetchTypes when component is mounted
    onMounted(() => {
      fetchTypes();
    });

    return {
      loading,
      error,
      selectedCategory,
      Types
    };
  }
};
</script>

<style scoped>
.category {
  background-color: #fff;
  border-radius: 2px;
  width: 200px;
  height: 500px;
  padding: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.category__title {
  font-size: 1.2rem;
  color: var(--text-color);
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin: 0;
}

.category__list{
  list-style-type: none;
}

.category__item-link {
  font-size: 1rem;
  padding: 6px 16px;
  display: block;
  color: var(--text-color);
  text-decoration: none;
}

.category__item-link:hover {
  color: #f67514;
  cursor: pointer;
}

.category__loading,
.category__error {
  padding: 12px;
  text-align: center;
  font-size: 1.4rem;
}

.category__error {
  color: red;
}
</style>
