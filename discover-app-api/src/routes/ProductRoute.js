const express = require('express');
const controller = require('../controllers/ProductController');
const router = express.Router();
const verifyTokenSession = require('../middleware/AuthMiddleware');

/**
 * @swagger
 * components:
 *  schemas:
 *   ProductPagerModel:
 *     type: object
 *     properties:
 *       actualPage:
 *         type: integer
 *       totalPage: 
 *         type: integer
 *       prevPage:
 *         type: integer
 *       nextPage:
 *         type: integer
 *       data:
 *         type: array
 *         items:
 *           type: object
 *           $ref: '#/components/schemas/ProductModel'
 * 
 *   ProductModel:
 *     type: object
 *     required:
 *       - name
 *       - description
 *       - url
 *       - tags
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       url:
 *         type: string
 *       tags:
 *         type: array
 *         items:
 *           type: string
 */

/**
 * @swagger
 * /createProduct:
 *   put:
 *     security:
 *      - Authorization: []
 *     description: Create and launch new product
 *     tags:
 *       - Product
 *     produces:
 *       - application/json
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductModel'
 *     responses:
 *       '201':
 *         description: Product created
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/ProductModel'
 *            type: object
 *       '401':
 *         description: Unauthorized
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/DefaultException'
 *           type: object 
 *       '400':
 *         description: bad request error body
 *         content:
 *          application/json: 
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: array
 *       '500':
 *         description: internal server error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/DefaultException'
 *             type: object
 */
router.put('/createProduct',verifyTokenSession, controller.createProduct);

/**
 * @swagger
 * /launchProduct:
 *   patch:
 *     security:
 *      - Authorization: []
 *     description: Create and launch new product
 *     tags:
 *       - Product
 *     produces:
 *       - application/json
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductModel'
 *                  examples:
 *                      product:
 *                        summary: an example of a product to launch
 *                        value:
 *                           _id: 6613713a95d06ac3b4241bdf
 *     responses:
 *       '201':
 *         description: Product launched
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/ProductModel'
 *            type: object
 *       '401':
 *         description: Unauthorized
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/DefaultException'
 *           type: object 
 *       '400':
 *         description: bad request error body
 *         content:
 *          application/json: 
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: array
 *       '500':
 *         description: internal server error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/DefaultException'
 *             type: object
 */
router.patch('/launchProduct',verifyTokenSession, controller.launchProduct);

/**
 * @swagger
 * /getMyProducts:
 *   get:
 *     security:
 *      - Authorization: []
 *     description: Retrieve all product by Owner with userSession email from token JWT
 *     tags:
 *       - Product
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Product launched
 *         content:
 *          application/json:
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ProductModel'
 *             type: array
 *       '401':
 *         description: Unauthorized
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/DefaultException'
 *           type: object 
 *       '400':
 *         description: bad request error body
 *         content:
 *          application/json: 
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: array
 *       '500':
 *         description: internal server error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/DefaultException'
 *             type: object
 */
router.get('/getMyProducts',verifyTokenSession, controller.findProductsByOwner);

/**
 * @swagger
 * /getLaunchedProducts/{pageSize}/{pageNumber}:
 *   post:
 *     security:
 *      - Authorization: []
 *     description: Retrieve all launched product
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: pageSize
 *         type: integer
 *         required: true
 *         description: Numeric page size of the product to get.
 *       - in: path
 *         name: pageNumber
 *         type: integer
 *         required: true
 *         description: Numeric page number of the product to get.
 *     requestBody:
 *         required: false
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductModel'
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Products launched
 *         content:
 *          application/json:
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ProductPagerModel'
 *             type: array
 *       '400':
 *         description: bad request error body
 *         content:
 *          application/json: 
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: array
 *       '500':
 *         description: internal server error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/DefaultException'
 *             type: object
 */
router.post('/getLaunchedProducts/:pageSize/:pageNumber', controller.findLaunchedProductsPager);

/**
 * @swagger
 * /product/{_id}:
 *   patch:
 *     security:
 *      - Authorization: []
 *     description: Edit product by _id param
 *     tags:
 *       - Product
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductModel'
 *     parameters:
 *       - in: path
 *         name: _id
 *         type: string
 *         required: true
 *         description: _Id of the product to edit.
 *     produces:
 *       - application/json
 *     responses:
 *       '201':
 *         description: Product edited
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductPagerModel'
 *            type: object
 *       '400':
 *         description: bad request error body
 *         content:
 *          application/json: 
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: array
 *       '500':
 *         description: internal server error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/DefaultException'
 *             type: object
 */
router.patch('/product/:_id',verifyTokenSession, controller.editProduct);

/**
 * @swagger
 * /product/{_id}:
 *   delete:
 *     security:
 *      - Authorization: []
 *     description: Remove product by _id param
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: _id
 *         type: string
 *         required: true
 *         description: _Id of the product to edit.
 *     produces:
 *       - application/json
 *     responses:
 *       '201':
 *         description: Product removed
 *       '400':
 *         description: bad request error body
 *         content:
 *          application/json: 
 *            schema:
 *             items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: array
 *       '500':
 *         description: internal server error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/DefaultException'
 *             type: object
 */
router.delete('/product/:_id',verifyTokenSession, controller.removeProduct);

module.exports = router;