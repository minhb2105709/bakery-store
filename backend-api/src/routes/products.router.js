const express = require('express');
const productsController = require('../controllers/products.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const imageUpload = require('../middlewares/imageUpload.middleware');


const router = express.Router();

module.exports.setup = (app) => {
    app.use('/products', router);

    /**
     * @swagger
     * /products:
     *   get:
     *     description: Get paginated products
     *     tags:
     *       - Products
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: The page number to fetch
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: The number of products per page
     *     responses:
     *       200:
     *         description: A paginated list of products
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
     */
    router.get('/', imageUpload, productsController.getProductList);

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
     * /products/details/{id}:
     *   get:
     *     summary: Get detailed product information
     *     description: Returns detailed information about a specific product, including name, type, price, description, URL, and available amount.
     *     tags:
     *       - Products
     *     parameters:
     *       - in: path
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
     *         description: Product not found
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
     *                   example: Product not found
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
    router.get('/details/:id', productsController.getProductDetails);

    /**
     * @swagger
     * /products/filter:
     *   get:
     *     summary: Filter products by type_id
     *     description: Retrieve a list of products based on the specified type_id with pagination support.
     *     tags:
     *       - Products
     *     parameters:
     *       - in: query
     *         name: typeId
     *         required: true
     *         description: The type_id to filter products by
     *         schema:
     *           type: string
     *       - in: query
     *         name: page
     *         required: false
     *         description: The page number to retrieve. Defaults to 1.
     *         schema:
     *           type: integer
     *           example: 1
     *       - in: query
     *         name: limit
     *         required: false
     *         description: The number of products per page. Defaults to 10.
     *         schema:
     *           type: integer
     *           example: 10
     *     responses:
     *       '200':
     *         description: A list of filtered products with pagination information.
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
     *                   type: object
     *                   properties:
     *                     products:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/ProductList'
     *                     pagination:
     *                       type: object
     *                       properties:
     *                         currentPage:
     *                           type: integer
     *                           example: 1
     *                         totalPages:
     *                           type: integer
     *                           example: 5
     *                         totalProducts:
     *                           type: integer
     *                           example: 50
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   example: 400
     *                 message:
     *                   type: string
     *                   example: Bad request
     *       404:
     *         description: No products found for the given type_id
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   example: 404
     *                 message:
     *                   type: string
     *                   example: No products found for this type
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: integer
     *                   example: 500
     *                 message:
     *                   type: string
     *                   example: Error retrieving filtered products
     */
    router.get('/filter', productsController.getFilterProducts);

    /**
     * @swagger
     * /products/Type:
     *   get:
     *     summary: Get product types
     *     description: Retrieve a list of all product types.
     *     tags:
     *       - Products
     *     responses:
     *       '200':
     *         description: A list of product types
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ProductType'
     */
    router.get('/Type', productsController.getType);

    // Catch all method not allowed requests
    router.all('/', methodNotAllowed);
    router.all('/search', methodNotAllowed)
    router.all('/:id', methodNotAllowed);
    router.all('/filter', methodNotAllowed);  // Added for /filter route
};
