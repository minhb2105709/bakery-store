const knex = require('../database/knex');

const dashboard = {
    // tính tổng doanh thu
    getTotalRevenue: function () {
        return knex('invoiceDetail as id')
            .join('invoice as i', 'id.invoice_ID', 'i.invoice_ID')
            .sum('id.cost as total_revenue')
            .where('i.status', 'đã thanh toán');
    },

    // doanh thu theo ngày 
    getDailyRevenue: function () {
        return knex('invoiceDetail as id')
            .join('invoice as i', 'id.invoice_ID', 'i.invoice_ID')
            .select(knex.raw('DATE(i.invoice_date) as date'))
            .sum('id.cost as daily_revenue')
            .where('i.status', 'đã thanh toán')
            .groupByRaw('DATE(i.invoice_date)')
            .orderBy('date', 'desc');
    },

    // số lượng sản phẩm bán ra
    getTotalSoldProducts: function () {
        return knex('invoiceDetail as id')
            .join('bread as b', 'id.bread_id', 'b.bread_id')
            .join('invoice as i', 'id.invoice_ID', 'i.invoice_ID')
            .select('b.bread_name')
            .sum('id.quantity as total_sold')
            .where('i.status', 'đã thanh toán')
            .groupBy('id.bread_id', 'b.bread_name')
            .orderBy('total_sold', 'desc');
    },

    // doanh thu theo loại sản phẩm
    getRevenueByType: function () {
        return knex('invoiceDetail as id')
            .join('bread as b', 'id.bread_id', 'b.bread_id')
            .join('breadType as bt', 'b.type_id', 'bt.type_id')
            .join('invoice as i', 'id.invoice_ID', 'i.invoice_ID')
            .select('bt.type_name')
            .sum('id.cost as total_revenue')
            .where('i.status', 'đã thanh toán')
            .groupBy('bt.type_name')
            .orderBy('total_revenue', 'desc');
    },

    // tổng số đơn hàng 
    getTotalOrders: function () {
        return knex('invoice')
            .count('* as total_orders')
            .where('status', 'đã thanh toán');
    },

    // khách hàng mua nhiều nhất
    getTopCustomers: function () {
        return knex('userInfo as u')
            .join('invoice as i', 'u.user_ID', 'i.user_ID')
            .join('invoiceDetail as id', 'i.invoice_ID', 'id.invoice_ID')
            .select('u.user_name', 'u.user_phoneNum')
            .count('i.invoice_ID as total_orders')
            .sum('id.cost as total_spent')
            .where('i.status', 'đã thanh toán')
            .groupBy('u.user_ID', 'u.user_name', 'u.user_phoneNum')
            .orderBy('total_spent', 'desc')
            .limit(5);
    },

    // Sản phẩm tồn kho 
    getStockRemaining: function () {
        return knex('bread as b')
            .select('b.bread_name', 'b.bread_amount as stock_remaining')
            .where('b.bread_amount', '>', 0)
            .orderBy('stock_remaining', 'asc');
    },

    // doanh thu theo tháng
    getMonthlyRevenue: function () {
        return knex('userInfo as u')
            .join('invoice as i', 'u.user_ID', 'i.user_ID')
            .join('invoiceDetail as id', 'i.invoice_ID', 'id.invoice_ID')
            .select(
                knex.raw('MONTH(i.invoice_date) as month'),
                knex.raw('YEAR(i.invoice_date) as year')
            )
            .sum('id.cost as monthly_revenue')
            .where('i.status', 'đã thanh toán')
            .groupByRaw('YEAR(i.invoice_date), MONTH(i.invoice_date)')
            .orderBy([{ column: 'year', order: 'desc' }, { column: 'month', order: 'desc' }]);
    },

}

module.exports = dashboard