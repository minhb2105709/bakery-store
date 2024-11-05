const express = require('express');
const productsController = require('../controllers/products.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');

const router = express.Router();

module.exports.setup = (app) => {
    app.use('/products', router);

    /**
     * @swagger
     * /products:
     *   get:
     *     description: Get all products
     *     tags:
     *       - Products
     *     responses:
     *       200:
     *         description: A list of products
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: 
     *                     - success
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ProductList'
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
     *         description: Products not found
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
     *                   example: Products not found
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
    router.get('/', productsController.getProductList);

    /**
     * @swagger
     * /products/search/:
     *   get:
     *     summary: Search for products
     *     description: Retrieve a list of products based on the search term provided in the query.
     *     tags:
     *       - Products
     *     parameters:
     *       - in: query
     *         name: name
     *         type: string
     *         description: The name of the product to search for
     *         required: true
     *     responses:
     *       '200':
     *         description: A list of products
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: 
     *                     - success
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ProductSearch'
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
     *         description: Products not found
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
     *                   example: Products not found
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
    router.get('/search', productsController.searchProducts);

    /**
     * @swagger
     * /products/details/:
     *   get:
     *     summary: Get detailed product information
     *     description: Returns detailed information about a specific product, including name, type, price, description, URL, and available amount.
     *     tags:
     *       - Products
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         description: The ID of the product to retrieve
     *         schema:
     *           type: integer
     *     responses:
     *       '200':
     *         description: A product
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductDetails'
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
     *         description: Products not found
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
     *                   example: Products not found
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
    router.get('/details', productsController.getProductDetails);

    // Catch all method not allowed requests
    router.all('/', methodNotAllowed);
    router.all('/search', methodNotAllowed)
    router.all('/:id', methodNotAllowed);
};
