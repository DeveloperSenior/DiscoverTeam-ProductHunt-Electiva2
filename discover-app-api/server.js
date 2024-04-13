const app = require("./app");
const { connectDB } = require('./src/infrastructure/db/config/config');

/**
 * Lee las varibales de entorno del archivo .env solo ambiente local
 */
const port = process.env.PORT || 3000;
const apiPath = process.env.API_PATH || '/api/v1';

/**
 * Se levante el contenedor express
 */
app.listen(port, () => {
    console.log(`Server running port ${port} API ${apiPath}`);
    connectDB().then(response => console.log(`Data base connect: host: ${response.host} Name: ${response.name}`)).catch(err => console.error('Error abriendo conexion a la base de datos', err));

});