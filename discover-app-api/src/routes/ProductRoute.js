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
 *   PromoCodeProductModel:
 *     type: object
 *     required:
 *       - code
 *       - description
 *       - expirationDate
 *     properties:
 *       code: 
 *         type: string
 *       description:
 *         type: string
 *       expirationDate:
 *         type: string
 * 
 *   ImageMediaProductModel:
 *     type: object
 *     required:
 *       - linksImages
 *       - linkDemo
 *       - linkVideo
 *     properties:
 *        linksImages:
 *           type: array
 *           items:
 *              type: string
 *        linkDemo:
 *           type: string
 *        linkVideo:
 *           type: string
 * 
 *   CategoryProductModel:
 *     type: object
 *     required:
 *        - category
 *        - subCategory
 *     properties:
 *        category: 
 *           type: string
 *        subCategory: 
 *           type: string
 * 
 *   LinkProduct:
 *      type: object
 *      required:
 *         - link
 *         - socialMediaLink
 *      properties:
 *         link:
 *           type: string
 *         socialMediaLink:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *                - key
 *                - value
 *             properties:
 *                key: 
 *                 type: string
 *                value: 
 *                 type: string
 * 
 *   InfoProductModel:
 *      type: object
 *      required:
 *         - name
 *         - tags
 *         - links
 *         - description
 *         - categories
 *         - isOpenSource
 *      properties:
 *         name:
 *           type: string
 *         tags:
 *           items:
 *              type: string
 *           type: array
 *         description:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             $ref: '#/components/schemas/CategoryProductModel'
 *         isOpenSource:
 *             type: boolean
 * 
 *   ProductModel:
 *     type: object
 *     required:
 *       - info
 *       - imagesMedia
 *       - makers
 *       - extras
 *     properties:
 *       info:
 *         type: object
 *         $ref: '#/components/schemas/InfoProductModel'
 *       imagesMedia:
 *         type: object
 *         $ref: '#/components/schemas/ImageMediaProductModel'
 *       makers:
 *         type: array
 *         items:
 *           type: string
 *       shoutouts:
 *         type: array
 *         items:
 *           type: string
 *       extras:
 *          type: object
 *          $ref: '#/components/schemas/PromoCodeProductModel'
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
 *                  examples:
 *                      product:
 *                        summary: an example of a product
 *                        value:
 *                           info: 
 *                             name: TestProduct
 *                             tags: [ dev, software ]
 *                             links: [ { link: https://github/testProducto, socialMediaLink: [{key: twitter, value: '@test_dev'}] }]
 *                             description: Dev product to test
 *                             categories : [{ category: Software, subCategory: NodeJS }]
 *                             isOpenSource: true
 *                           imagesMedia:
 *                             linksImages: [ https://images/1, https://images/2, https://images/3] 
 *                             linkDemo: https://demo-test/demo
 *                             linkVideo: https://video-test/video
 *                           makers: [ '@developersenior', '@developer' ]
 *                           shoutouts: ['@developersenior']
 *                           extras:
 *                             pricing: Free  
 *                             promoCode: [{ description: BlackPromo, code: BLCK, expirationDate: '2024-04-07' }]
 *                             fundingInfo: [ 'I plan to seek VC funding in the near future.', 'I have raised venture-backed funding for this product.' ]
 *                             firstComment: MY FIRST COMMENT PRODUCT LAUNCH.
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
 *   get:
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
router.get('/getLaunchedProducts/:pageSize/:pageNumber', controller.findLaunchedProductsPager);


module.exports = router;