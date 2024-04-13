const express = require('express');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   DefaultException:
 *     type: object
 *     required:
 *       - code
 *       - type
 *       - message
 *       - exception
 *     properties:
 *       code:
 *         type: string
 *       type:
 *         type: string
 *       message:
 *         type: string
 *       exception:
 *         type: string
 *   ResponseMessageModel:
 *     type: object
 *     required:
 *       - message
 *     properties:
 *       message:
 *         type: string
 *            
 */

const options = {
  failOnErrors: true,
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'REST - Swagger',
      version: '1.0.0',
      description: 'REST API with Swagger doc',
      contact: {
        email: 'aescoba7@correo.tdea.edu.co',
      },
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'Enter the token without the `Bearer: ` prefix, e.g. "abcde12345".'
        }
      }
    },
    security: {
      Authorization: []
    },
    tags: [
      {
        name: 'Discover API',
        description: 'API by application that helps discover, launch and review products',
      },
    ],
    schemes: ['http'],
    servers: [{
      url: 'http://localhost:{port}/api/{basePath}',
      variables: {
        port: {
          enum: [
            "3000",
            "8443",
            "443"
          ],
          default: "3000"
        },
        basePath: { 
          enum: [
          "v1"
        ],
        default: 'v1' },
      }
    }]
  },
  apis: ['./src/routes/*.js', './src/routes/config/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
//swaggerModelValidator(swaggerSpec);

router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));

module.exports = router