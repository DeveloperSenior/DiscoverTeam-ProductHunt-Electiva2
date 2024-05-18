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
 *       - userName
 *       - bio
 *       - avatar
 *       - email
 *       - password
 *     properties:
 *       userName:
 *         type: string
 *       bio:
 *         type: string
 *       avatar:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       createdAt:
 *         type: string
 *       updatedAt:
 *         type: string
 *       followings:
 *         type: array
 *         items:
 *           type: object
 *           $ref: '#/components/schemas/UserModel'
 *       followers:
 *         type: array
 *         items:
 *           type: object
 *           $ref: '#/components/schemas/UserModel'
 * 
 *   AuthModel:
 *     type: object
 *     required:
 *       - email
 *       - password
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
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
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
 * /user/{email}:
 *   get:
 *     security:
 *      - Authorization: []
 *     description: Retrieve all users
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: false
 *         description: User email filter.
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
router.get('/user/:email', verifyTokenSession, controller.getUsers);

/**
 * @swagger
 * /signin:
 *   put:
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
router.put('/signin', controller.signin);

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

/**
 * @swagger
 * /follow/{_idFollowUser}:
 *   patch:
 *     security:
 *      - Authorization: []
 *     description: follow a user
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: _idFollowUser
 *         type: string
 *         required: true
 *         description: Followed User Id.
 *     responses:
 *       '201':
 *         description: User followed
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/UserModel'
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
router.patch('/follow/:_idFollowUser',verifyTokenSession, controller.followUser);

/**
 * @swagger
 * /unfollow/{_idUnfollowUser}:
 *   patch:
 *     security:
 *      - Authorization: []
 *     description: Unfollow a user
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: _idUnfollowUser
 *         type: string
 *         required: true
 *         description: UnFollow User Id.
 *     responses:
 *       '201':
 *         description: User Unfollow
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/UserModel'
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
router.patch('/unfollow/:_idUnfollowUser',verifyTokenSession, controller.unfollowUser);


module.exports = router
