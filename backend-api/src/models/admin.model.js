const knex = require('../database/knex');

const admin = {
    // Lấy tất cả người dùng
    getAllUsers: function () {
        return knex('userInfo')
            .select('user_name', 'user_role', 'user_phoneNum','user_status')
            .where('user_role', 0);
    },

    // Láy tất cả sản phẩm có trong Kho hãng
    getAllProducts: function () {
        return knex('bread')
            .select('bread_id', 'bread_name', 'bread_price', 'bread_desc', 'bread_url', 'bread_amount')
    },

    // Lấy sản phẩm theo loại
    getProductsByType: function (type) {
        return knex('bread')
            .join('breadType', 'breadType.type_id', 'bread.type_id')
            .where('bread.type_id', type)
            .select('*');
    },

    // Thêm sản phẩm vào kho
    addNewProduct: function (data) {
        return knex('bread').insert({
            type_id: data.type_id,
            bread_name: data.bread_name,
            bread_price: data.bread_price,
            bread_amount: data.bread_amount
        });
    },

    // Cập nhật số lượng còn lại trong Kho hàng
    updateProductQuantity: function (bread_id, new_quantity) {
        return knex('bread')
            .where('bread_id', bread_id)
            .update({
                bread_amount: new_quantity
            });
    },

    // xoá sản phẩm
    deleteProduct: function (bread_id) {
        return knex('bread')
            .where('bread_id', bread_id)
            .del();
    },

    // Cấp nhật trạng thái của người dùng
    manageUser: function (user_id, new_status) {
        return knex('userInfo')
            .where('user_id', user_id)
            .update({
                user_status: new_status
            });
    }

}

module.exports = admin