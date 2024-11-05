const express = require('express');
const cartController = require('../controllers/cart.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng (POST /api/v1/cart/:productId)
router.post('/addToCart', cartController.addToCart);

// Cập nhật giỏ hàng (PUT /api/v1/cart/updateQuantity)
/**
 * @swagger
 * /api/v1/cart/updateQuantity:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       description: Update the quantity of a product in the user's cart
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCart'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found or cart detail not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.put('/updateQuantity', cartController.updateCart);


// Xóa sản phẩm khỏi giỏ hàng (DELETE /api/v1/cart/)
/**
 * @swagger
 * /api/v1/cart/deleteProduct:
 *   delete:
 *     summary: Delete a product from the cart
 *     description: Deletes a specific product from the user's cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteFromCart'
 *     responses:
 *       '200':
 *         description: Product deleted successfully
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
 *                     message:
 *                       type: string
 *                       example: Product deleted successfully
 *       '400':
 *         description: User not logged in or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Error deleting product from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/deleteProduct', cartController.deleteProduct);

// Xóa tất cả sản phẩm khỏi giỏ hàng 
/**
 * @swagger
 * /api/v1/cart/deleteAll:
 *   delete:
 *     summary: Delete all products from the cart
 *     description: Deletes all products from the user's cart that are marked as "chưa thanh toán".
 *     tags:
 *       - Cart
 *     responses:
 *       '200':
 *         description: All products deleted successfully
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
 *                     message:
 *                       type: string
 *                       example: Delete All Products successfully
 *       '400':
 *         description: User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         description: No products found to delete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         description: Error deleting all products from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/deleteAll', cartController.deleteAllProducts);



// Xem giỏ hàng (GET /api/v1/cart)
/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: View the user's cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose cart is being viewed
 *     responses:
 *       200:
 *         description: The user's cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_name:
 *                         type: string
 *                         description: The name of the user
 *                       bread_name:
 *                         type: string
 *                         description: The name of the bread
 *                       quantity:
 *                         type: integer
 *                         description: The quantity of the bread in the cart
 *                       cost:
 *                         type: number
 *                         format: float
 *                         description: The total cost for the bread
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get('/', cartController.viewCart);


router.all('/', methodNotAllowed); 

module.exports.setup = (app) => {
    app.use('/api/v1/cart', router);
};

