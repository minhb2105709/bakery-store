const JSend = require('../jsend');
const product = require('../models/product.model');
const ApiError = require('../api-error');

// Product List API
// http://localhost:3000/products/
async function getProductList(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
        const limit = parseInt(req.query.limit) || 10; // Số sản phẩm mỗi trang mặc định là 10

        const products = await product.getAllProducts(page, limit);

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
    const productId = req.params.id; // Lấy ID từ route parameters

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

// Filter Products by Type API
// http://localhost:3000/products/filter?typeId=1
async function getFilterProducts(req, res, next) {
    const { typeId } = req.query;

    const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
    const limit = parseInt(req.query.limit) || 10;

    if (!typeId) {
        return res.status(400).json(JSend.error({ message: 'Missing typeId parameter' }));
    }

    try {
        const products = await product.getFilterProducts(typeId, page, limit);
        if (!products || products.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No products found for this type' }));
        }
        return res.json(JSend.success({ products }));
    } catch (error) {
        console.log(error);
        return res.status(500).json(JSend.error({ message: 'Error retrieving filtered products' }));
    }
}

async function getType(req, res, next) {
    try {
        const Types = await product.getTypes(); 
        if (!Types || Types.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Types found' }));
        }
        return res.json(JSend.success({ Types }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving Types'));
    }
}

module.exports = {
    getProductList,
    searchProducts,
    getProductDetails,
    getFilterProducts,
    getType
};
