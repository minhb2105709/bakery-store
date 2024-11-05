const express = require('express');
const adminController = require('../controllers/admin.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const authorization = require('../middlewares/authorization');

const router = express.Router();
// Products
// Xem sản phẩm theo loại (GET /api/v1/admin)
/**
 * @swagger
 * /api/v1/admin/bread:
 *   get:
 *     summary: View products by type
 *     description: Retrieve all bread products filtered by their type.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: typeID
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the bread type to filter products by.
 *     responses:
 *       '200':
 *         description: List of products retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '404':
 *         description: No products found for the specified type
 *       '500':
 *         description: Server error
 */
router.get('/bread/', adminController.viewTypeProduct);


// Xem sản phẩm (GET /api/v1/admin)
// router.get('/bread', adminController.viewAllProduct);


// Thêm sản phẩm vào Kho hàng (POST /api/v1/admin/addbread)
/**
 * @swagger
 * /api/v1/admin/addBread:
 *   post:
 *     summary: Add a new product to the inventory
 *     description: Add a new bread product to the inventory with its type, name, price, and amount.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *     responses:
 *       '200':
 *         description: Product successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/NewProduct'
 *       '400':
 *         description: Missing required fields
 *       '500':
 *         description: Server error
 */
router.post('/addBread', adminController.addNewProduct);

// Cập nhật Kho hàng (PUT /api/v1/admin/:productId)
/**
 * @swagger
 * /api/v1/admin/updateAmount:
 *   put:
 *     summary: Update product quantity
 *     description: Update the quantity of an existing bread product in the inventory.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductQuantityUpdate'
 *     responses:
 *       '200':
 *         description: Quantity updated successfully
 *       '400':
 *         description: Missing required fields
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */
router.put('/updateAmount', adminController.updateProductQuantity);


// Xóa sản phẩm khỏi Kho hàng (DELETE /api/v1/admin/:productId)
/**
 * @swagger
 * /api/v1/admin/deleteBread:
 *   delete:
 *     summary: Delete a product from the inventory
 *     description: Delete a bread product from the inventory based on its unique ID.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteProduct'
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '400':
 *         description: Missing required fields
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */
router.delete('/deleteBread', adminController.deleteProduct);

//Users
// Lấy thông tin của user (GET /api/v1/admin)
/**
 * @swagger
 * /api/v1/admin/viewUser:
 *   get:
 *     summary: Retrieve all users
 *     description: Allows administrators to view a list of all registered users. This endpoint requires admin authentication.
 *     tags: [Admin, Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: integer
 *                         description: The user's unique identifier
 *                       username:
 *                         type: string
 *                         description: The user's username
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: The user's email address
 *                       status:
 *                         type: string
 *                         description: The user's current status
 *       401:
 *         description: Unauthorized - User is not authenticated or not an admin
 *       500:
 *         description: Internal server error
 */
router.get('/viewUser', adminController.viewAllUser);

// chỉnh sửa quyền hạn của user (DELETE /api/v1/admin/:userId)
// chỉnh sửa quyền hạn của user (PUT /api/v1/admin/manageUser)
/**
 * @swagger
 * /api/v1/admin/manageUser:
 *   put:
 *     summary: Manage user status
 *     description: Update the status of a user (e.g., active, banned).
 *     tags:
 *       - Admin
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserStatusUpdate'
 *     responses:
 *       '200':
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User status updated successfully."
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid user ID or status."
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating the user status."
 */
router.put('/manageUser', adminController.manageUser);
router.get('/', (req, res) => {
    res.send('Welcome to the Admin Page');
});


router.all('/', methodNotAllowed);

module.exports.setup = (app) => {
    app.use('/api/v1/admin', authorization.checkAuthorization, router);
};
