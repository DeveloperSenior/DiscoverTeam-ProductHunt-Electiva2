const { pipe } = require('../utilities/Utilities');
const { HTTP_CODE } = require('../utilities/Constants');
const productRepository = require('../db/ProductRepository');
const productService = require('../services/ProductService');
const { ProductModel } = require('../models/ProductModel');
const { validateProduct,
    validateProductLaunch,
    validateEditProduct,
    validateRemoveProduct,
    validatePagerParameter
} = require('../validators/ProductValidator');
const { getSession } = require('../utilities/Utilities');

/**
 * create Product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
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

/**
 * launch Product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
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

/**
 * find Products By Owner
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const findProductsByOwner = async (request, response) => {
    try {
        const { params } = request;
        const { _idUser } = params;
        const productServicesInject = pipe(productRepository, productService)(ProductModel);
        const userSession = getSession(request);
        if(_idUser){
         userSession.userId = _idUser;
        }
        const myProducts = await productServicesInject.findProductsByOwner(userSession);
        return response.status(HTTP_CODE.OK).json(myProducts);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

/**
 * findLaunched Products Pager
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const findLaunchedProductsPager = async (request, response) => {

    try {
        const { params, body } = request;

        // Validate pager parameters
        const validate = validatePagerParameter(params);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const { pageSize, pageNumber } = params;

        const productServicesInject = pipe(productRepository, productService)(ProductModel);

        const allLaunchedProducts = await productServicesInject.findLaunchedProductsPager(pageSize, pageNumber, body);

        return response.status(HTTP_CODE.OK).json(allLaunchedProducts);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

/**
 * find all Products Pager
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const findProductsPager = async (request, response) => {

    try {
        const { params, body } = request;

        // Validate pager parameters
        const validate = validatePagerParameter(params);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const { pageSize, pageNumber } = params;

        const productServicesInject = pipe(productRepository, productService)(ProductModel);
        body.isFull = true; // enable full query
        const allProducts = await productServicesInject.findLaunchedProductsPager(pageSize, pageNumber, body);

        return response.status(HTTP_CODE.OK).json(allProducts);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

/**
 * find only Followings Products User
 * 
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const findProductsFollowingsPager = async (request, response) => {

    try {
        const { params, body } = request;
        const userSession = getSession(request);
        
        // Validate pager parameters
        const validate = validatePagerParameter(params);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const { pageSize, pageNumber } = params;

        const productServicesInject = pipe(productRepository, productService)(ProductModel);
        const onlyFollowersProducts = await productServicesInject.findProductsFollowingsPager(pageSize, pageNumber,userSession, body);

        return response.status(HTTP_CODE.OK).json(onlyFollowersProducts);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

/**
 * edit Product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const editProduct = async (request, response) => {

    try {
        const { body, params } = request;
        const { _id } = params;
        const userSession = getSession(request);

        // Validate product Model to edit
        const validate = validateEditProduct(_id, body);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const productServicesInject = pipe(productRepository, productService)(ProductModel);

        const editedProduct = await productServicesInject.editProduct(_id, body, userSession);

        return response.status(HTTP_CODE.CREATED).json(editedProduct);

    } catch (error) {
        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

/**
 * remove Product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const removeProduct = async (request, response) => {
    try {
        const { params } = request;
        const { _id } = params;
        const userSession = getSession(request);

        // Validate product Model to remove
        const validate = validateRemoveProduct(_id);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const productServicesInject = pipe(productRepository, productService)(ProductModel);

        await productServicesInject.removeProduct(_id, userSession);

        return response.status(HTTP_CODE.CREATED).send();

    } catch (error) {
        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

module.exports = {
    createProduct,
    launchProduct,
    findProductsByOwner,
    findLaunchedProductsPager,
    editProduct,
    removeProduct, 
    findProductsPager,
    findProductsFollowingsPager
}
