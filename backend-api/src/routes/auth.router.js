const express = require('express');
const authController = require('../controllers/auth.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const authorization = require('../middlewares/authorization');

const router = express.Router();


module.exports.setup = (app) => {
    app.use('/api/v1/auth', router);
    // đăng nhập    
    /**
     * @swagger
     * paths:
     *   /api/v1/auth/login:
     *     post:
     *       summary: Login with username and password
     *       tags:
     *         - Authentication
     *       requestBody:
     *         required: true
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginRequest'
     *       responses:
     *         '200':
     *           description: Successful login
     *           content:
     *             application/json:
     *               schema:
     *                 type: object
     *                 properties:
     *                   status:
     *                     type: string
     *                     description: Status of the response.
     *                     example: success
     *                   data:
     *                     type: object
     *                     properties:
     *                       message:
     *                         type: string
     *                         example: Login successful, Hello your_username
     *                       user:
     *                         type: object
     *                         properties:   
     *                           name:
     *                             type: string
     *                             description: Username.
     *                             example: your_username
     *         '400':
     *           description: Missing username or password
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/ApiError'
     *         '401':
     *           description: Invalid username or password
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/ApiError'
     */
    router.post('/login', authController.login);

    // đăng ký
    /**
     * @swagger
     * paths:
     *   /api/v1/auth/register:   # Register path for new users
     *     post:
     *       summary: Register a new user
     *       tags:
     *         - Authentication
     *       requestBody:
     *         required: true
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RegisterRequest'
     *       responses:
     *         '201':
     *           description: Successful registration
     *           content:
     *             application/json:
     *               schema:
     *                 type: object
     *                 properties:
     *                   status:
     *                     type: string
     *                     description: Status of the response.
     *                     example: success
     *                   data:
     *                     type: object
     *                     properties:
     *                       message:
     *                         type: string
     *                         example: Registration successful!! Hello minh
     *                       user:
     *                         type: object
     *                         properties:
     *                           username:
     *                             type: string
     *                             description: Username of the new user.
     *                             example: minh
     *                           phone:
     *                             type: string
     *                             description: Phone number of the new user.
     *                             example: "0123456789"
     *         '400':
     *           description: Missing username, password, or phone number
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/ApiError'
     *         '401':
     *           description: Registration failed
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/ApiError'
     */

    router.post('/register', authController.register);

    // Sử dụng POST cho logout
    router.post('/logout', authController.logout);

    // // kiểm tra quyền
    // router.get('/check', authorization.roleCheck);

    router.all('/', methodNotAllowed);
};

