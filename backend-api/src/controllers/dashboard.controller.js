const JSend = require('../jsend');
const ApiError = require('../api-error');
const dashboard = require('../models/dashboard.model');

async function getTotalRevenue(req, res, next) {
    try {
        const total_revenue = await dashboard.getTotalRevenue();
        if (!total_revenue || total_revenue.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Statistics' }));
        }
        return res.json(JSend.success({ total_revenue }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving'));
    }
}

// Doanh thu theo ngày
async function getDailyRevenue(req, res, next) {
    try {
        const dailyRevenue = await dashboard.getDailyRevenue();
        if (!dailyRevenue || dailyRevenue.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Statistics' }));
        }
        return res.json(JSend.success({ dailyRevenue }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving daily revenue'));
    }
}

// Số lượng sản phẩm bán ra
async function getTotalSoldProducts(req, res, next) {
    try {
        const totalSoldProducts = await dashboard.getTotalSoldProducts();
        if (!totalSoldProducts || totalSoldProducts.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Products Sold' }));
        }
        return res.json(JSend.success({ totalSoldProducts }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving sold products'));
    }
}

// Doanh thu theo loại sản phẩm
async function getRevenueByType(req, res, next) {
    try {
        const revenueByType = await dashboard.getRevenueByType();
        if (!revenueByType || revenueByType.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Revenue by Type' }));
        }
        return res.json(JSend.success({ revenueByType }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving revenue by type'));
    }
}

// Tổng số đơn hàng
async function getTotalOrders(req, res, next) {
    try {
        const totalOrders = await dashboard.getTotalOrders();
        if (!totalOrders || totalOrders.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Orders' }));
        }
        return res.json(JSend.success({ totalOrders }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving total orders'));
    }
}

// Khách hàng mua nhiều nhất
async function getTopCustomers(req, res, next) {
    try {
        const topCustomers = await dashboard.getTopCustomers();
        if (!topCustomers || topCustomers.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Top Customers' }));
        }
        return res.json(JSend.success({ topCustomers }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving top customers'));
    }
}

// Sản phẩm tồn kho
async function getStockRemaining(req, res, next) {
    try {
        const stockRemaining = await dashboard.getStockRemaining();
        if (!stockRemaining || stockRemaining.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Stock Remaining' }));
        }
        return res.json(JSend.success({ stockRemaining }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving stock remaining'));
    }
}

// Doanh thu theo tháng
async function getMonthlyRevenue(req, res, next) {
    try {
        const monthlyRevenue = await dashboard.getMonthlyRevenue();
        if (!monthlyRevenue || monthlyRevenue.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No Monthly Revenue' }));
        }
        return res.json(JSend.success({ monthlyRevenue }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Error retrieving monthly revenue'));
    }
}

module.exports = {
    getTotalRevenue,
    getDailyRevenue,
    getTotalSoldProducts,
    getRevenueByType,
    getTotalOrders,
    getTopCustomers,
    getStockRemaining,
    getMonthlyRevenue,
};
