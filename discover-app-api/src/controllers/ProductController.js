const { pipe } = require('../utilities/Utilities');
const { HTTP_CODE } = require('../utilities/Constants');
const productRepository = require('../db/ProductRepository');
const productService = require('../services/ProductService');
const { ProductModel } = require('../models/ProductModel');
const { validateProduct, validateProductLaunch } = require('../validators/ProductValidator');
const { getSession } = require('../utilities/Utilities');

const createProduct = async (request, response) => {

    try {
        const productServicesInject = pipe(productRepository, productService)(ProductModel);
        const { body } = request;
        const userSession = getSession(request);

        // Validate product Model
        const validate = validateProduct(body);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const productCreated = await productServicesInject.createProduct(body, userSession);

        return response.status(HTTP_CODE.CREATED).json(productCreated);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

const launchProduct = async (request, response) => {

    try {
        const productServicesInject = pipe(productRepository, productService)(ProductModel);
        const { body } = request;
        const userSession = getSession(request);
        // Validate product Model
        const validate = validateProductLaunch(body);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }
        const productLaunched = await productServicesInject.launchProduct(body, userSession);

        return response.status(HTTP_CODE.CREATED).json(productLaunched);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

const findProductsByOwner = async (request, response) => {
    try {
        const productServicesInject = pipe(productRepository, productService)(ProductModel);
        const userSession = getSession(request);

        const myProducts = await productServicesInject.findProductsByOwner(userSession);

        return response.status(HTTP_CODE.OK).json(myProducts);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

const findLaunchedProductsPager = async (request, response) => {

    try {

        const { pageSize, pageNumber } = request.params;

        if ( !pageSize ) pageSize = 5;
        if ( !pageNumber ) pageNumber = 1

        const productServicesInject = pipe(productRepository, productService)(ProductModel);

        const allLaunchedProducts = await productServicesInject.findLaunchedProductsPager(pageSize,pageNumber);

        return response.status(HTTP_CODE.OK).json(allLaunchedProducts);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

module.exports = { createProduct, launchProduct, findProductsByOwner, findLaunchedProductsPager }
