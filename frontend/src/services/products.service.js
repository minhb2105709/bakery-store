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

/**
 * @typedef {Object} ProductList
 * @property {number} id 
 * @property {string} name 
 * @property {string} type 
 * @property {number} price 
 */

/**
 * @typedef {Object} ProductDetails
 * @property {number} id 
 * @property {string} name
 * @property {string} type
 * @property {number} price 
 * @property {string} description
 * @property {string} url 
 * @property {number} availableAmount 
 */

function makeProductsService() {
    const apiURL = 'http://localhost:3000';
    const baseUrl = 'products';

    /**
     * @returns {Promise<ProductList[]>} 
     */
    async function getProductList(page, limit) {
        const params = new URLSearchParams({ page, limit });
        return efetch(`${apiURL}/${baseUrl}?${params.toString()}`);
    }
    
    async function getTypes() {
        return await efetch(`${apiURL}/${baseUrl}/Type`);
    }

    /**
     * @param {string} typeId - The type_id of the products to filter by
     * @returns {Promise<ProductList[]>} 
     */
    async function getFilterProducts(typeId, page, limit) {
        const params = new URLSearchParams({ typeId, page, limit });
        return efetch(`${apiURL}/${baseUrl}/filter?${params}`);
    }

    /**
     * @param {string} name -
     * @returns {Promise<ProductList[]>} 
     */
    async function searchProducts(name) {
        const params = new URLSearchParams({ name });
        return efetch(`${apiURL}/${baseUrl}/search?${params}`);
    }

    /**
     * @param {number} id
     * @returns {Promise<ProductDetails>} 
     */
    async function getProductDetails(id) {
        return efetch(`${apiURL}/${baseUrl}/details/${id}`);  // Đặt `id` trực tiếp vào URL
    }

    return {
        getProductList,
        searchProducts,
        getProductDetails,
        getTypes,
        getFilterProducts
    };
}

export default makeProductsService();