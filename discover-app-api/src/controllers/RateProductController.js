const { HTTP_CODE } = require('../utilities/Constants');
const rateProductRepository = require('../db/RateProductRepository');
const productRepository = require('../db/ProductRepository');
const { ProductModel } = require('../models/ProductModel');
const rateProductService = require('../services/RateProductService');
const { RateProductModel } = require('../models/RateProductModel');
const { validateRateProduct, validateParamIdProduct } = require('../validators/RateProductValidator');
const { getSession } = require('../utilities/Utilities');

/**
 * rate Product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const rateProduct = async (request, response) => {
    try {
        const { body, params } = request;
        const { _id } = params;
        const userSession = getSession(request);

        // Validate rate product Model
        const validate = validateRateProduct(body,_id);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }
        // Inject dependency repository
        const injectRateRepository = rateProductRepository(RateProductModel);
        const injectProductRepository = productRepository(ProductModel);
        const rateProductCreated = await rateProductService(injectRateRepository,injectProductRepository).rateProduct(_id,body, userSession);
        return response.status(HTTP_CODE.CREATED).json(rateProductCreated);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

/**
 * average Rate Product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const averageRateProduct = async(request, response) => {


    try {
        const { params } = request;
        const { _id } = params;

        // Validate Id product Model
        const validate = validateParamIdProduct(_id);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }
        // Inject dependency repository
        const injectRateRepository = rateProductRepository(RateProductModel);
        const injectProductRepository = productRepository(ProductModel);
        const rateProductCreated = await rateProductService(injectRateRepository,injectProductRepository).averageRateProduct(_id);
        return response.status(HTTP_CODE.CREATED).json(rateProductCreated);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

/**
 * detailed Product Delivery
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const detailedProductDelivery = async (request, response) => {
    try {
        const { params } = request;
        const { _id } = params;

        // Validate product Model
        const validate = validateParamIdProduct(_id);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }
        // Inject dependency repository
        const injectRateRepository = rateProductRepository(RateProductModel);
        const injectProductRepository = productRepository(ProductModel);
        const rateProductCreated = await rateProductService(injectRateRepository,injectProductRepository).detailedProductDelivery(_id);
        return response.status(HTTP_CODE.OK).json(rateProductCreated);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

/**
 * comments Product Delivery
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const commentsProductDelivery = async (request, response) => {
    try {
        const { params } = request;
        const { _id } = params;

        // Validate product Model
        const validate = validateParamIdProduct(_id);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }
        // Inject dependency repository
        const injectRateRepository = rateProductRepository(RateProductModel);
        const injectProductRepository = productRepository(ProductModel);
        const rateProductCreated = await rateProductService(injectRateRepository,injectProductRepository).commentsProductDelivery(_id);
        return response.status(HTTP_CODE.OK).json(rateProductCreated);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

module.exports = { rateProduct, averageRateProduct, detailedProductDelivery, commentsProductDelivery }
