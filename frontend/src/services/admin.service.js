/**
* Enhanced fetch utility for API requests
* @param {string} url
* @param {RequestInit} options
* @returns Promise<Response>
*/
async function efetch(url, options = {}) {
    // Merge options với credentials: 'include'
    const finalOptions = {
        ...options,
        credentials: 'include'  // Thêm credentials vào tất cả requests
    };

    let result = {};
    let json = {};

    try {
        result = await fetch(url, finalOptions);  
        json = await result.json();

    } catch (error) {
        throw new Error(error.message);
    }

    if (!result.ok || json.status !== 'success') {
        throw new Error(json.message);
    }
    return json.data;
}

function adminService() {
    const apiURL = 'http://localhost:3000';
    const baseUrl = 'api/v1/admin';

    async function viewAllProducts() {
        return await efetch(`${apiURL}/${baseUrl}/bread`);
    }

    async function getTypes() {
        return await efetch(`${apiURL}/${baseUrl}/Type`);
    }

    async function viewProductsByType(typeID) {
        const url = new URL(`${apiURL}/${baseUrl}/bread`);
        url.searchParams.append('typeID', typeID);
        return await efetch(url);
    }

    async function addNewProduct(data) {
        return await efetch(`${apiURL}/${baseUrl}/addBread`, {
            method: 'POST',
            body: data,
        });
    }

    async function updateProductQuantity(bread_id, new_quantity) {
        return await efetch(`${apiURL}/${baseUrl}/updateAmount`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bread_id, new_quantity }),
        });
    }

    async function updateProductPrice(bread_id, new_price) {
        return await efetch(`${apiURL}/${baseUrl}/updatePrice`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bread_id, new_price }),
        });
    }

    async function updateProductImage(bread_id, new_url) {
        const formData = new FormData();
        formData.append("bread_id", bread_id);
        formData.append("bread_url", new_url);

        return await efetch(`${apiURL}/${baseUrl}/updateImage`, {
            method: 'PUT',
            body: formData
        });
    }

    async function deleteProduct(bread_id) {
        return await efetch(`${apiURL}/${baseUrl}/deleteBread`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bread_id }),
        });
    }

    async function viewAllUsers() {
        return await efetch(`${apiURL}/${baseUrl}/viewUser`);
    }

    async function manageUser(user_id, new_status) {
        return await efetch(`${apiURL}/${baseUrl}/manageUser`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, new_status }),
        });
    }

    return {
        viewAllProducts,
        viewProductsByType,
        addNewProduct,
        updateProductQuantity,
        deleteProduct,
        viewAllUsers,
        manageUser,
        getTypes,
        updateProductPrice,
        updateProductImage,
    }
    
}

export default adminService();