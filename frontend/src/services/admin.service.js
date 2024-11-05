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
    const baseUrl = 'api/v1/auth';

    
}

export default adminService();