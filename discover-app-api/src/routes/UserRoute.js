const express = require('express')
const controller = require('../controllers/UserController');
const router = express.Router();
const verifyTokenSession = require('../middleware/AuthMiddleware');

/**
 * @swagger
 * components:
 *  schemas:
 *   UserModel:
 *     type: object
 *     required:
 *       - name
 *       - nickName
 *       - email
 *       - accessToken
 *     properties:
 *       name:
 *         type: string
 *       nickName:
 *         type: string
 *       email:
 *         type: string
 *       accessToken:
 *         type: string
 * 
 *   AuthModel:
 *     type: object
 *     required:
 *       - email
 *       - tokenId
 *     properties:
 *       email:
 *         type: string
 *       tokenId:
 *         type: string
 *
 *   LoginModel:
 *     type: object
 *     required:
 *       - email
 *       - accessToken
 *     properties:
 *       email:
 *         type: string
 *       accessToken:
 *         type: string  
 */

/**
 * @swagger
 * /user:
 *   get:
 *     security:
 *      - Authorization: []
 *     description: Retrieve all users
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     responses:
 *      '200':
 *         description: return all users
 *         content:
 *          application/json:
 *            schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/UserModel'
 *      '401':
 *         description: Unauthorized
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/DefaultException'
 *           type: object
 *      '400':
 *         description: bad request error
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *             type: object
 *      '500':
 *         description: internal server error
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/DefaultException'
 *           type: object
 */
router.get('/user', verifyTokenSession, controller.getUsers);

/**
 * @swagger
 * /user:
 *   post:
 *     security:
 *      - Authorization: []
 *     description: create user
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UserModel'
 *     responses:
 *       '201':
 *         description: user created
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/AuthModel'
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
router.post('/user', controller.signin);

/**
 * @swagger
 * /login:
 *   post:
 *     security:
 *      - Authorization: []
 *     description: login user
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginModel'
 *     responses:
 *       '200':
 *         description: user created
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/AuthModel'
 *           type: object
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
 *           schema:
 *            items:
 *              $ref: '#/components/schemas/ResponseMessageModel'
 *            type: array
 *       '500':
 *         description: internal server error
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/DefaultException'
 *           type: object
 */
router.post('/login', controller.login);

module.exports = router
