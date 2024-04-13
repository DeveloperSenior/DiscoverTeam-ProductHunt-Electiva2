const express = require('express');
const controller = require('../controllers/RateProductController');
const router = express.Router();
const verifyTokenSession = require('../middleware/AuthMiddleware');

/**
 * @swagger
 * components:
 *  schemas:
 *   RateProductModel:
 *     type: object
 *     required:
 *       - rate
 *       - comment
 *     properties:
 *       rate:
 *         type: integer
 *       comment:
 *         type: string
 *   ResponseRateProductModel:
 *      type: object
 *      properties:
 *        product:
 *          type: object
 *          $ref: '#/components/schemas/ProductModel'
 *        data:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *               user:
 *                 type: object
 *                 properties:
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *               rate:
 *                 type: integer
 *               createdAt:
 *                 type: string
 */

/**
 * @swagger
 * /rateProduct/{_id}:
 *   put:
 *     security:
 *      - Authorization: []
 *     description: Rate a product
 *     tags:
 *       - Rate Product
 *     produces:
 *       - application/json
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/RateProductModel'
 *     parameters:
 *       - in: path
 *         name: _id
 *         type: string
 *         required: true
 *         description: _Id of the product to rate.
 *     responses:
 *       '201':
 *         description: Rate Product created
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseRateProductModel'
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

router.put('/rateProduct/:_id',verifyTokenSession, controller.rateProduct);

/**
 * @swagger
 * /rateAverage/{_id}:
 *   get:
 *     security:
 *      - Authorization: []
 *     description: Average Ratting product
 *     tags:
 *       - Rate Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: _id
 *         type: string
 *         required: true
 *         description: _Id of the product to rate.
 *     responses:
 *       '201':
 *         description: Rate Product created
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseRateProductModel'
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
router.get('/rateAverage/:_id',verifyTokenSession, controller.averageRateProduct);

/**
 * @swagger
 * /detailProduct/{_id}:
 *   get:
 *     security:
 *      - Authorization: []
 *     description: Detail product
 *     tags:
 *       - Rate Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: _id
 *         type: string
 *         required: true
 *         description: _Id of the product to detail.
 *     responses:
 *       '200':
 *         description: Rate Product created
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                product:
 *                  type: object
 *                  $ref: '#/components/schemas/ProductModel'
 *                commentsRating: 
 *                  type: array
 *                  items:
 *                    type: object
 *                    $ref: '#/components/schemas/RateProductModel' 
 *
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
router.get('/detailProduct/:_id',verifyTokenSession, controller.detailedProductDelivery);

/**
 * @swagger
 * /commentsProduct/{_id}:
 *   get:
 *     security:
 *      - Authorization: []
 *     description: Get all Comments Product
 *     tags:
 *       - Rate Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: _id
 *         type: string
 *         required: true
 *         description: _Id of the product to detail.
 *     responses:
 *       '200':
 *         description: detail rating Product
 *         content:
 *          application/json:
 *            schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/RateProductModel' 
 *
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
router.get('/commentsProduct/:_id',verifyTokenSession, controller.commentsProductDelivery);

module.exports = router;