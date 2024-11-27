<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'; // Import userStore
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();


onMounted(() => {
  const toggler = document.querySelector('.btn');
  toggler?.addEventListener('click', function() {
    document.querySelector('#sidebar').classList.toggle('collapsed');
  });
  // Kiểm tra trạng thái đăng nhập khi component được mount
  userStore.checkUserStatus(); // Gọi hàm từ Pinia store
});


function toggleExpand(event) {
    const target = event.currentTarget;
    const isExpanded = target.getAttribute('aria-expanded') === 'true';
    target.setAttribute('aria-expanded', !isExpanded);
  }




</script>

<template>
    <!-- Sidebar -->
    <aside id="sidebar">
      <div class="h-100">
        <div class="sidebar-logo">
          <a href="#" class="logo-link">Bakery Store</a>
        </div>
        <!-- Sidebar Menu -->
        <ul class="sidebar-nav">
          <li class="sidebar-header">
            Tools and Components
          </li>
          <li class="sidebar-item">
            <a href="#" class="sidebar-link">
              <i class="fa fa-list-ul pe-2" aria-hidden="true"></i>
              Profile
            </a>
          </li>
          <li class="sidebar-item">
            <a href="#" class="sidebar-link collapsed" data-bs-toggle="collapse"
              data-bs-target="#pages" aria-expanded="false" aria-controls="pages"
              @click="toggleExpand">
              <i class="fa-solid fa-sliders"></i>
              Products
            </a>
              <ul id="pages" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                <li class="sidebar-item">
                  <router-link to="/admin/view-products" class="sidebar-link">
                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                    View Products
                  </router-link>
                </li>
                <li class="sidebar-item">
                  <router-link to="/admin/add-products" class="sidebar-link">
                    <i class="fa-solid fa-folder-plus"></i>
                    Add Products
                  </router-link>
                </li>
                <li class="sidebar-item">
                  <router-link to="/admin/update-amount" class="sidebar-link">
                    <i class="fa fa-edit" aria-hidden="true"></i>
                    Update Amount
                  </router-link>
                </li>
                <li class="sidebar-item">
                  <router-link to="/admin/delete-products" class="sidebar-link">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    Delete Products
                  </router-link>
                </li>
              </ul>
          </li>

          <!-- <li class="sidebar-item">
            <a href="#" class="sidebar-link collapsed" data-bs-toggle="collapse"
            data-bs-target="#dashboard" aria-expanded="false" aria-controls="dashboard"
            @click.prevent>
              <i class="fa fa-user" aria-hidden="true"></i>
              User Management
            </a>
              <ul id="dashboard" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                <li class="sidebar-item">
                  <a href="#" class="sidebar-link">View Users</a>
                </li>
                <li class="sidebar-item">
                  <a href="#" class="sidebar-link">Manage User</a>
                </li>
              </ul>
          </li> -->
        </ul>
      </div>
    </aside>

</template>

<style src="../assets/css/adminsidebar.css">
</style>

<style scoped>
  
</style>
