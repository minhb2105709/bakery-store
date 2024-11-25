<script setup lang="ts">
import router from '@/router';
</script>

<template>
<footer class="bg-dark text-white pt-5 pb-4">
    <div class="container text-center text-md-left">
        <div class="row text-center">
            <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
                    Bakery store
                </h5>
                <p>
                    A bakery store is a charming, inviting place where the aroma of freshly baked bread, pastries, and sweets fills the air. Inside, you’ll find shelves lined with a variety of delicious goods: from crusty loaves of sourdough and baguettes to sweet treats like croissants, cookies, cakes, and muffins. Many bakeries showcase their items in glass cases, where customers can see the artistry behind each product.
                </p>
            </div>

            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
                    Usefull - link
                </h5>
                <p>
                    <router-link to="/" class="text-white usefull-item" style="text-decoration: none;">Homepage</router-link>
                </p>
                <p>
                    <router-link to="/introduction" class="text-white usefull-item" style="text-decoration: none;">Introduction</router-link>
                </p>
                <p>
                    <router-link to="/contact" class="text-white usefull-item" style="text-decoration: none;">Contact Us</router-link>
                </p>
            </div>

            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
                    Contact us
                </h5>
                <p>
                    <i class="fa-regular fa-envelope"></i> Gmail: example@student.ctu.edu.vn
                </p>
                <p>
                    <i class="fa-solid fa-phone"></i> Phone: 0775333564
                </p>
                
            </div>

            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
                    Our Brand
                </h5>
                <img class="brand-img" src="../assets/image/Bread_logo2.png" alt="Logo">
            </div>

            <hr class="mb-4">

            <div class="row align-items-center">
                <div class="col-md-7 col-lg-8">
                    <p>
                        <i class="fa-regular fa-copyright"></i>
                        Copyright 2024 All rights reserved by: 
                        <a href="#" style="text-decoration: none;">
                            <strong class="text-warning">The Providers</strong>
                        </a>
                    </p>

                </div>

                <div class="col-md-5 col-lg-4">
                    <div class="text-center text-md-right">
                        <ul class="list-unstyled list-inline">
                            <li class="list-inline-item">
                                <a href="#" 
                                class="btn-floating btn-sm text-white"
                                style="font-size: 23px;">
                                    <i class="fab fa-facebook"></i>
                                </a>
                            </li>

                            <li class="list-inline-item">
                                <a href="#" 
                                class="btn-floating btn-sm text-white"
                                style="font-size: 23px;">
                                    <i class="fab fa-twitter"></i>
                                </a>
                            </li>

                            <li class="list-inline-item">
                                <a href="#" 
                                class="btn-floating btn-sm text-white"
                                style="font-size: 23px;">
                                    <i class="fab fa-google-plus"></i>
                                </a>
                            </li>

                            <li class="list-inline-item">
                                <a href="#" 
                                class="btn-floating btn-sm text-white"
                                style="font-size: 23px;">
                                    <i class="fab fa-instagram"></i>
                                </a>
                            </li>

                            <li class="list-inline-item">
                                <a href="#" 
                                class="btn-floating btn-sm text-white"
                                style="font-size: 23px;">
                                    <i class="fab fa-youtube"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
</template>

<style scoped>
.brand-img{
    width: 150px;
    height: 120px;
    background-color: #f5f5dc;
    border-radius: 5%;
}

/* Animation for fade-in effect */
@keyframes fadeIn {
    from {
        opacity: 0.5;
    }
    to {
        opacity: 1;
    }
}

/* Apply fade-in animation to footer links and icons */
footer a, footer .list-inline-item {
    animation: fadeIn 0.5s ease-in forwards;
    opacity: 0; /* Start with opacity 0 for fade-in */
}

/* Hover effect for footer links */
.usefull-item:hover {
    color: #F67E14;
    transition: color 0.3s ease; /* Smooth color transition */
}

/* Hover effect for social media icons */
footer .list-inline-item a:hover {
    color: #F67E14; /* Change color on hover */
    transform: scale(1.1); /* Scale up slightly */
    transition: color 0.3s ease, transform 0.3s ease; /* Smooth color and scale transition */
}

/* Hover effect for brand image */
.brand-img:hover {
    transform: scale(1.05); /* Scale up slightly */
    transition: transform 0.3s ease; /* Smooth scaling transition */
}
</style>