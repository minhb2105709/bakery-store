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

function authenticateService() {
    const apiURL = 'http://localhost:3000';
    const baseUrl = 'api/v1/auth';

    async function login(username, password) {
        const response = await efetch(`${apiURL}/${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                return response.user;
            } else {
                throw new Error('No user data received');
            }
    }

    async function register(username, password, userPhone) {
        const response = await efetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, userPhone })
            
        });
        return response.user;
    }

    async function logout() {
        try {
            await efetch(`${baseUrl}/logout`, {
                method: 'POST'
            });
        } finally {
            // Xóa thông tin user khỏi localStorage khi đăng xuất
            localStorage.removeItem('user');
        }
    }

    
    return {
        login,
        register,
        logout,
    }
}

export default authenticateService();