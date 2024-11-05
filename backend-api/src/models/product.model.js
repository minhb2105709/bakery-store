const knex = require('../database/knex');


const product = {
    getAllProducts: function () {
        return knex('bread')
            .select('bread_name', 'bread_price')
    },

    getProductBySearch: function (search) {
        return knex('bread')
            .where('bread_name', 'like', `%${search}%`)
            .select('bread_name', 'bread_price')
    },

    getProductDetails: function (id) {
        return knex('bread')
            .join('breadType', 'breadType.type_id', 'bread.type_id')
            .where('bread_id', id)
            .select('bread_name', 'type_name', 'bread_price', 'bread_desc', 'bread_url', 'bread_amount')
    }
};

module.exports = product;