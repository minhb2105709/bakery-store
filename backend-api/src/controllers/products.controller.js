const JSend = require('../jsend');
const product = require('../models/product.model');
const ApiError = require('../api-error');

// Product List API
// http://localhost:3000/products/
async function getProductList(req, res, next) {
    try {
        const products = await product.getAllProducts();
        if (!products || products.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No products found' }));
        }
        return res.json(JSend.success({ products }));
    } catch (error) {
        console.log(error);
        return res.status(500).json(JSend.error({ message: 'Error retrieving products' }));
    }
}

// Product Search API
// http://localhost:3000/products/search/?name=Chick
async function searchProducts(req, res, next) {
    const searchTerm = req.query.name;

    if (!searchTerm) {
        return res.status(400).json(JSend.error({ message: 'Missing search term' }));
    }

    try {
        const products = await product.getProductBySearch(searchTerm);
        if (!products || products.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No products found' }));
        }
        return res.json(JSend.success({ products }));
    } catch (error) {
        console.log(error);
        return res.status(500).json(JSend.error({ message: 'Error searching products' }));
    }
}

// Product Details API (optional)
// http://localhost:3000/products/details?id=10
async function getProductDetails(req, res) {
    const productId = req.query.id;

    if (!productId) {
        return res.status(400).json(JSend.error({ message: 'Missing product id' }));
    }

    try {
        const productDetails = await product.getProductDetails(productId);
        if (!productDetails) {
            return res.status(404).json(JSend.error({ message: 'Product not found' }));
        }
        return res.json(JSend.success({ productDetails }));
    } catch (error) {
        console.log(error);
        return res.status(500).json(JSend.error({ message: 'Error retrieving product details' }));
    } 
}

module.exports = {
    getProductList,
    searchProducts,
    getProductDetails
};
