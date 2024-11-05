const JSend = require('../jsend');
const cart = require('../models/cart.model');
const ApiError = require('../api-error');


async function addToCart(req, res, next) {
    // Lấy thông tin người dùng từ session
    const user = req.session.user;

    // Kiểm tra xem user có trong session không
    if (!user) {
        return res.status(400).json(JSend.error({ message: 'User not logged in' }));
    }

    const userId = user.id;
    const { bread_id} = req.body;

    // Kiểm tra xem bread_id và amount đã được cung cấp chưa
    if (!bread_id) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    try {
        // Gọi hàm addToCart trong cart model
        const result = await cart.addToCart(userId, bread_id);

        // Kiểm tra kết quả trả về từ addToCart
        if (result.success) {
            return res.json(JSend.success({ message: 'Product added to cart successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'Product not found or insufficient stock' }));
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return next(new ApiError(500, 'Error when adding product to cart'));
    }
}


// chỉnh sửa giỏ hàng -- số lượng đặt hàng
async function updateCart(req, res, next) {
    const { userId, bread_id, new_quantity } = req.body;

    if (!userId || !bread_id || !new_quantity) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const result = await cart.updateCart(userId, bread_id, new_quantity);
        if (result.updated) {
            return res.json({ success: true, message: result.message });
        } else {
            return res.status(200).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error(error);
        if (error.message === 'Not enough bread in stock') {
            return res.status(400).json({ success: false, message: 'Not enough bread in stock' });
        }
        return next(new Error('Error updating product quantity'));
    }
}


async function deleteProduct(req, res, next) {
    // Lấy thông tin người dùng từ session
    const user = req.session.user;
    // Kiểm tra xem user có trong session không
    if (!user) {
        return res.status(400).json(JSend.error({ message: 'User not logged in' }));
    }

    const userId = user.id;

    const { bread_id } = req.body;

    if (!bread_id) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    try {
        const deleted = await cart.deleteItem(userId, bread_id);
        if (deleted) {
            return res.json(JSend.success({ message: 'Product deleted successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'Product not found' }));
        }
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'Error deleting product quantity'));
    }

}

async function deleteAllProducts(req, res) {
    // Lấy thông tin người dùng từ session
    const user = req.session.user;
    // Kiểm tra xem user có trong session không
    if (!user) {
        return res.status(400).json(JSend.error({ message: 'User not logged in' }));
    }

    const userId = user.id;

    try {
        const deletedAll = await cart.deleteAllItems(userId);
        if (deletedAll) {
            return res.json(JSend.success({ message: 'Delete All Products successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'Delete All Products Failed' }));
        }
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'Error deleting product quantity'));
    }
}

async function viewCart(req, res, next) {
    // Lấy thông tin người dùng từ session
    const user = req.session.user;

    // Kiểm tra xem user có trong session không
    if (!user) {
        return res.status(400).json(JSend.error({ message: 'User not logged in' }));
    }

    const userId = user.id; // Trích xuất userId từ session

    try {
        // Lấy giỏ hàng của người dùng dựa trên userId
        const cartItems = await cart.getCart(userId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No items found in cart' }));
        }

        return res.json(JSend.success({ cart: cartItems }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving cart items'));
    }
}


module.exports = {
    addToCart,
    updateCart,
    deleteProduct,
    deleteAllProducts,
    viewCart,
};