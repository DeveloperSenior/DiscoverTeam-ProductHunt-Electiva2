
# Electiva-II
# Team
- Discover Team
# Integrantes del Equipo
- [Andres Escobar](https://github.com/DeveloperSenior)
# Tecnología en que se desarrolló
- NodeJS v18.19.1
# Nombre del Proyecto
`Discover App` es un aplicacion Back y Front, que busca centralizar productos, lanzarlos a una comunidad y estos puedan ser reseñados y calificados tambien es un Repositorio para el espacio de aprendizaje sobre NodeJs enfocado a Back-end, buenas practicas de desarrollo y patrones de diseño.
# Estructura del proyecto Back-End
El proyecto se desarrollo para el back-end con NodeJS v18.19.1, utilizando las siguientes librerias de apoyo:

1. `express` para la creacion del contenedor del 
servidor y uso de API Rest
2. `nodemon` herramienta que ayuda a desarrollar aplicaciones basadas en Node.js reiniciando automáticamente la aplicación del nodo cuando se detectan cambios en los archivos en el directorio.
3. `rxjs` Libreria de extensiones reactivas para JavaScript
4. `fluent-json-schema` Generador de esquemas JSON
5. `ajv` Validador de estructuras JSON basado en esquemas de objetos javascript (JSON).
6. `swagger-jsdoc`, `swagger-model-validator`, `swagger-ui-express` Este módulo le permite ofrecer documentos API generados automáticamente por swagger-ui desde Express, en función de un swagger spec con `swagger-jsdoc`. El resultado es documentación viva para el API alojada desde el servidor API a través de una rutas.
7. `mongoose` como ODM para persistir documentos JSON en MongoDB y `mongoose-paginate-v2` para realizar consultas paginadas a MongoDB.
8. `jsonwebtoken` para autenticar y autorizar cada transaccion en la apis expuestas por `express`.
9. `bcrypt` para encriptar y validar contraseñas que se almacenan en MongoDB

```
discover-app-api
  L src
    L controllers
    L db
        L conf
           L config.js
    L middleware
         L AuthMiddleware.js
    L models
       L dto
       L exception
       L schema
    L routes
       L config
          L SuscriptionRoutesAppConf.js
          L SwaggerRouteConf.js
    L services
    L utilities
        L Base64Util.js
        L Constants.js
        L Utilities.js
    L validator
  L test
     L controllers
     L db
     L middleware
     L models
     L routes
     L services
     L utilities
     L validators
  L discover-app-api.postman_collection
  L package.json
  L .env
  L app.js
  L server.js
  L jest.config.js
discover-app-front
  L src
L .gitignore
L README.md
``` 

# Como ejecutar el proyecto
1. **Clonar el Repositorio:**
```bash
git clone
https://github.com/DeveloperSenior/DiscoverTeam-ProductHunt-Electiva2.git
```
2. **Instalar modulos de node:**
```bash
cd discover-app-api
npm install
```
3. **Ejecutar test unitarios con JEST:**
```bash
npm run test
```
*NOTA:* Para ver el informe de cobertura abrir el archivo `./coverage/index.html`

4. **Ejecutar la aplicacion local:**
```bash
npm run runDev
```
5. Abrir en el navegador http://localhost:3000/api/v1/version si responde un `JSON` asi:
```json
{"version": "1.0"}
```
significa que está arriba nuestro servidor.

6. **Visualizar Documentación :**
La documentacion del API está en la url http://localhost:3000/api/v1/api-docs/

6. **Coleccion postman :**
En la herramienta Postman importar el archivo `discover-app-api.postman_collection` el cual se encuentra en la raiz del proyecto.


# Estructura del proyecto Front-End

`En construcción`