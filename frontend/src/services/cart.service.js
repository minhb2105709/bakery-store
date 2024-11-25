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

function cartService() {
    const apiURL = 'http://localhost:3000';
    const baseUrl = 'api/v1/cart';

    async function viewCart() {
        return await efetch(`${apiURL}/${baseUrl}/`);
    }

    async function addToCart( bread_id, amount) {
        return await efetch(`${apiURL}/${baseUrl}/addToCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bread_id, amount }), 
        });
    }

    async function deleteProduct(userId, bread_id) {
        return await efetch(`${apiURL}/${baseUrl}/deleteProduct`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, bread_id }), 
        });
    }

    async function updateProductQuantity(userId, bread_id, new_quantity) {
        return await efetch(`${apiURL}/${baseUrl}/updateQuantity`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, bread_id, new_quantity }), 
        });
    }

    async function checkout(userId, invoice_id) {
        return await efetch(`${apiURL}/${baseUrl}/checkout`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, invoice_id }), 
        });
    }

    return {
        viewCart,
        addToCart,
        deleteProduct,
        updateProductQuantity,
        checkout,
    }
}

export default cartService();