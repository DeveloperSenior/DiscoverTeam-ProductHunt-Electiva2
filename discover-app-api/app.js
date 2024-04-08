/**
 * Crear API expres con enrutadores propios
 */
const express = require('express');
const cors = require('cors');
const routerVersion = express.Router();
const routersApp = require('./src/routes/config/SuscriptionRoutesAppConf');

var app = express();

/**
 * Habilita cors
 */
app.use(cors());
/**
 * Se parsean los payload (Request y Response) a tipos JSON
 */
app.use(express.json());
/**
 * Lee las varibales de entorno del archivo .env solo ambiente local
 */
const apiPath = process.env.API_PATH || '/api/v1';
const apiVersion = process.env.VERSION || '1.0';

/**
 * Lista de routers que se van a exponer en el API
 */
const apiRoutesList = [routerVersion, ...routersApp];
app.use(apiPath, ...apiRoutesList);

/**
 * Se define recurso GET para verificar la version disponible del API path /version
 */
routerVersion.get('/version', (req, res) => {
    res.json({ version: apiVersion });
});

//Run Node APP  
module.exports = app