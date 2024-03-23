/**
 * Modulo que define los router a publicar en el contenedor
 */
const routersApp = [
    require('./SwaggerRouteConf'),
    require('../UserRoute')
    /** Import routes here */
];

module.exports = routersApp