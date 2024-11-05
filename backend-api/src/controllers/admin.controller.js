const JSend = require('../jsend');
const admin = require('../models/admin.model');
const ApiError = require('../api-error');


// Quản lý sản phẩm
// function viewAllProduct(req, res) {
//     return res.json(JSend.success({ contact: {} }));
// }

async function viewAllProduct(req, res, next) {
    try {
        const Products = await admin.getAllProducts(); // Sử dụng hàm getAllUsers từ admin model
        if (!Products || Products.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No product found' }));
        }
        return res.json(JSend.success({ Products }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving Product'));
    }
}

// Quản lý sản phẩm
async function viewTypeProduct(req, res, next) {
    const type = req.query.typeID;  // Lấy biến type từ body parameters

    if (!type) {
        return viewAllProduct(req, res, next)
    }
    try {
        const products = await admin.getProductsByType(type);
        if (!products || products.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No products found for this type' }));
        }
        return res.json(JSend.success({ products }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving products'));
    }
}

async function addNewProduct(req, res, next) {
    const body = req.body;
    const type_id = body.type_id;
    const bread_name = body.bread_name;
    const bread_price = body.bread_price;
    const bread_amount = body.bread_amount;

    // Kiểm tra các trường bắt buộc
    if (!type_id || !bread_name || !bread_price || !bread_amount) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    // Tạo dữ liệu sản phẩm mới
    const data = { type_id, bread_name, bread_price, bread_amount };

    try {
        // Gọi hàm thêm sản phẩm vào cơ sở dữ liệu
        const addBread = await admin.addNewProduct(data);

        if (!addBread) {
            return res.status(500).json(JSend.error({ message: 'Something went wrong during the product insertion' }));
        }

        // Trả về sản phẩm vừa được thêm
        return res.json(JSend.success({ addBread }));
    } catch (error) {
        console.log(error);
        // Xử lý lỗi khi có vấn đề trong quá trình thêm sản phẩm
        return next(new ApiError(500, 'Error adding product'));
    }
}

// cập nhật số lượng sản phẩm
async function updateProductQuantity(req, res, next) {
    const { bread_id, new_quantity } = req.body;

    if (!bread_id || !new_quantity) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    try {
        // Cập nhật số lượng sản phẩm trong bảng `bread`
        const updated = await admin.updateProductQuantity(bread_id, new_quantity);
        if (updated) {
            return res.json(JSend.success({ message: 'Quantity updated successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'Product not found' }));
        }
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'Error updating product quantity'));
    }
}


async function deleteProduct(req, res, next) {
    const { bread_id } = req.body;

    if (!bread_id) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    try {
        const deleted = await admin.deleteProduct(bread_id);
        if (deleted) {
            return res.json(JSend.success({ message: 'Product deleted successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'Product not found' }));
        }
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'Error updating product quantity'));
    }

}

// Quản lý user
// function viewAllUser(req, res) {
//     return res.json(JSend.success({ contact: {} }));
// }
async function viewAllUser(req, res, next) {
    try {
        const users = await admin.getAllUsers(); // Sử dụng hàm getAllUsers từ admin model
        if (!users || users.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No users found' }));
        }
        return res.json(JSend.success({ users }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving users'));
    }
}


async function manageUser(req, res, next) {
    const { user_id, new_status } = req.body;

    if (!user_id || !new_status) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    try {
        // Cập nhật trạng thái trong bảng `users`
        const updated = await admin.manageUser(user_id, new_status);
        if (updated) {
            return res.json(JSend.success({ message: 'User status updated successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'User not found' }));
        }
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'Error updating user status'));
    }
}

module.exports = {
    addNewProduct,
    updateProductQuantity,
    deleteProduct,
    manageUser,
    viewAllProduct,
    viewAllUser,
    viewTypeProduct,
};