const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for statistics and reporting
 */

/**
 * @swagger
 * /api/v1/dashboard/total-revenue:
 *   get:
 *     summary: Get total revenue
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_revenue:
 *                       type: number
 *                       example: 15000
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/total-revenue', dashboardController.getTotalRevenue);

/**
 * @swagger
 * /api/v1/dashboard/daily-revenue:
 *   get:
 *     summary: Get daily revenue statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved daily revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: 2024-11-25
 *                       daily_revenue:
 *                         type: number
 *                         example: 2000
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/daily-revenue', dashboardController.getDailyRevenue);

/**
 * @swagger
 * /api/v1/dashboard/total-sold-products:
 *   get:
 *     summary: Get total sold products
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved total sold products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bread_name:
 *                         type: string
 *                         example: Baguette
 *                       total_sold:
 *                         type: number
 *                         example: 500
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/total-sold-products', dashboardController.getTotalSoldProducts);

/**
 * @swagger
 * /api/v1/dashboard/revenue-by-type:
 *   get:
 *     summary: Get revenue by product type
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved revenue by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type_name:
 *                         type: string
 *                         example: Bread
 *                       total_revenue:
 *                         type: number
 *                         example: 7500
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/revenue-by-type', dashboardController.getRevenueByType);

/**
 * @swagger
 * /api/v1/dashboard/total-orders:
 *   get:
 *     summary: Get total orders
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved total orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                       example: 250
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/total-orders', dashboardController.getTotalOrders);

/**
 * @swagger
 * /api/v1/dashboard/top-customers:
 *   get:
 *     summary: Get top customers
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved top customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_name:
 *                         type: string
 *                         example: John Doe
 *                       user_phoneNum:
 *                         type: string
 *                         example: 123456789
 *                       total_orders:
 *                         type: number
 *                         example: 10
 *                       total_spent:
 *                         type: number
 *                         example: 2000
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/top-customers', dashboardController.getTopCustomers);

/**
 * @swagger
 * /api/v1/dashboard/stock-remaining:
 *   get:
 *     summary: Get remaining stock
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved remaining stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bread_name:
 *                         type: string
 *                         example: Baguette
 *                       stock_remaining:
 *                         type: number
 *                         example: 100
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/stock-remaining', dashboardController.getStockRemaining);

/**
 * @swagger
 * /api/v1/dashboard/monthly-revenue:
 *   get:
 *     summary: Get monthly revenue statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved monthly revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: number
 *                         example: 11
 *                       year:
 *                         type: number
 *                         example: 2024
 *                       monthly_revenue:
 *                         type: number
 *                         example: 30000
 *       404:
 *         description: No statistics found
 *       500:
 *         description: Server error
 */
router.get('/monthly-revenue', dashboardController.getMonthlyRevenue);

module.exports.setup = (app) => {
    app.use('/api/v1/dashboard', router);
};
