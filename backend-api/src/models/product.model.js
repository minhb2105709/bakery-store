const knex = require('../database/knex');


const product = {
    getAllProducts: function (page, limit) {
        const offset = (page - 1) * limit;
        return knex('bread')
            .select('bread_id', 'bread_name', 'bread_price', 'bread_url', 'type_id', 'bread_amount')
            .limit(limit)
            .offset(offset);
    },

    getProductBySearch: function (search) {
        return knex('bread')
            .join('breadType', 'breadType.type_id', 'bread.type_id')
            .where('bread_name', 'like', `%${search}%`)
            .orWhere('type_name', 'like', `%${search}%`)
            .select('bread.bread_id', 'bread.bread_name', 'bread.bread_price', 'bread.bread_url', 'bread.type_id', 'bread.bread_amount')
    },

    getProductDetails: function (id) {
        return knex('bread')
            .join('breadType', 'breadType.type_id', 'bread.type_id')
            .where('bread_id', id)
            .select('bread_name', 'type_name', 'bread_price', 'bread_desc', 'bread_url', 'bread_amount')
    },

    // Hàm lọc sản phẩm theo type_id
    getFilterProducts: function (typeId, page, limit) {
        const offset = (page - 1) * limit;
        return knex('bread')
            .where('type_id', typeId)
            .select('bread_id', 'bread_name', 'bread_price', 'bread_url', 'type_id', 'bread_amount')
            .limit(limit)
            .offset(offset);
    },

    // Lấy loại sản phẩm
    getTypes: function () {
        return knex('breadType')
            .select('type_id', 'type_name');
    },
};

module.exports = product;