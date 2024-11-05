const express = require('express');
const customersController = require('../controllers/customers.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const authorization = require('../middlewares/authorization');

const router = express.Router();

module.exports.setup = (app) => {
    app.use('/customers', authorization.checkAuthorization , router);

    /**
     * @swagger
     * /customers/update_user_info:
     *   put:
     *     summary: Update user information
     *     description: Update the username and email of a customer by their ID.
     *     tags:
     *       - Customers
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           shema:
     *             $ref: '#/components/schemas/UpdateUserInfo'
     *     responses:
     *       '200':
     *         description: User information updated successfully
     *         content: 
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/UserUpdateInfo'
     *                     message:
     *                       type: string
     *                       description: The success message
     *  
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   description: The error code
     *                   example: 400
     *                 message:
     *                   type: string
     *                   description: The error message
     *                   example: Bad request
     *       404:
     *         description: Customer not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   description: The error code
     *                   example: 404
     *                 message:
     *                   type: string
     *                   description: The error message
     *                   example: customer not found
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   description: The error code
     *                   example: 500
     *                 message:
     *                   type: string
     *                   description: The error message
     *                   example: Internal server error
     */
    router.put('/update_user_info/', customersController.updateUserInfo);

    /**
     * @swagger
     * /customers/order_history/:
     *   get:
     *     summary: Get order history
     *     description: Get the order history of a customer by their ID.
     *     tags:
     *       - Customers
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the customer
     *     responses:
     *       '200':
     *         description: User's order history retrieved successfully
     *         content: 
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     orders:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/InvoiceDetails'
     * 
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   description: The error code
     *                   example: 400
     *                 message:
     *                   type: string
     *                   description: The error message
     *                   example: Bad request
     *       404:
     *         description: Customer not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   description: The error code
     *                   example: 404
     *                 message:
     *                   type: string
     *                   description: The error message
     *                   example: Customer not found
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   description: The error code
     *                   example: 500
     *                 message:
     *                   type: string
     *                   description: The error message
     *                   example: Internal server error
     */
    router.get('/order_history/', customersController.getOrderHistory);

    //  Method not allowed handlers
    router.all('/update_user_info/', methodNotAllowed);
    router.all('/order_history/', methodNotAllowed);

    router.get('/', (req, res) => {
    res.send('Welcome to the Customer Page');
});
};