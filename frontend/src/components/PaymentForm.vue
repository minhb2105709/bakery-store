<script>

</script>

<template>
    <div class="container mt-4 bg-white p-4 mb-4">
        <form>
            <h5 class="mb-4 form-name pb-2">User's information</h5>
            <div class="mb-3 input-field">
                <label for="fullname" class="form-label">Fullname</label>
                <input type="text" class="form-control" id="fullname" placeholder="Khúc Bảo Minh">
            </div>

            <div class="mb-3 input-field">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" placeholder="H6kMw@example.com">
            </div>

            <div class="mb-3 input-field">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="phone" placeholder="0776xxxxxx">
            </div>

            <div class="mb-3 input-field">
                <label for="city" class="form-label">City</label>
                <input type="text" class="form-control" id="city" placeholder="Cần Thơ">        
            </div>

            <div class="mb-3 input-field">
                <label for="district" class="form-label">District</label>
                <input type="text" class="form-control" id="district" placeholder="Ninh Kiều">
            </div>

            <div class="mb-3 input-field">
                <label for="ward" class="form-label">Ward</label>
                <input type="text" class="form-control" id="ward" placeholder="An Nghiệp">
            </div>

            <div class="mb-3 input-field">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" placeholder="27 Nguyễn Tác Duy, An Nghiệp, Cần Thơ">
            </div>
        </form>
    </div>

    <div class="container mt-4 bg-white p-4 mb-4">
        <form>
            <h5 class="mb-4 form-name pb-2">Payment method</h5>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                <label class="form-check-label ml-5" for="flexRadioDefault1">
                    <i class="fa-regular fa-money-bill-1"></i>
                    <span class="ms-2 text-inline">Cash on Delivery</span>
                </label>
            </div>
        </form>
    </div>
</template>

<style src="../assets/css/payment.css"></style>