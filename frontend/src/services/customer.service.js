/**
* @param {string} url
* @param {RequestInit} options
* @returns Promise<Response>
*/

async function efetch(url, options = {}) {
    let result = {};
    let json = {};

    try {
        result = await fetch(url, options);
        json = await result.json();
    } catch (error) {
        throw new Error(error.message);
    }

    if (!result.ok || json.status !== 'success') {
        throw new Error(json.message);
    }

    return json.data;
}


function customerService() {
    const apiURL = 'http://localhost:3000';
    const baseUrl = 'customers';

    /**
     * @returns {Promise<ProductList[]>} 
     */
    async function getUserInfo(userId) {
        if (!userId) throw new Error('User ID is required');
        return efetch(`${apiURL}/${baseUrl}/user_info?user_id=${userId}`);
    }

    async function updateUserInfo(user_id, new_user_mail) {
        return efetch(`${apiURL}/${baseUrl}/update_user_info`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, new_user_mail }),
        });
    }
    
    async function orderHistory(userId) {
        if (!userId) throw new Error('User ID is required');
        return efetch(`${apiURL}/${baseUrl}/order_history?user_id=${userId}`);
    } 

    return {
        getUserInfo,
        updateUserInfo,
        orderHistory
    };
}

export default customerService();