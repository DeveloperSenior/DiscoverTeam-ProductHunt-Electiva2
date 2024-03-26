const express = require('express')
const controller = require('../controllers/UserController');
const router = express.Router();

/**
 * @swagger
 * definitions:
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
 */

/**
 * @swagger
 * /user:
 *   get:
 *     description: Retrieve all users
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     responses:
*       200:
 *         description: return all users
 *         schema:
 *           items:
 *              $ref: '#/definitions/UserModel'
 *           type: array
 *       400:
 *         description: bad request error
 *         schema:
 *           items:
 *              $ref: '#/definitions/ResponseMessageModel'
 *           type: array
 *       500:
 *         description: internal server error
 *         schema:
 *           $ref: '#/definitions/DefaultException'
 */
router.get('/user', controller.getUsers);

/**
 * @swagger
 * /user:
 *   post:
 *     description: create user
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user to create
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserModel'
 *     responses:
 *       201:
 *         description: user created
 *         schema:
 *           $ref: '#/definitions/ResponseMessageModel'
 *       400:
 *         description: bad request error body
 *         schema:
 *           items:
 *              $ref: '#/definitions/ResponseMessageModel'
 *           type: array
 *       500:
 *         description: internal server error
 *         schema:
 *           $ref: '#/definitions/DefaultException'
 */
router.post('/user', controller.createUser);

module.exports = router
