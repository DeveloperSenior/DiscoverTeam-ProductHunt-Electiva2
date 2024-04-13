const { Product } = require('../../src/models/dto/Product');
const moment = require('moment');
const { DATE_FORMAT } = require('../utilities/Constants');
const { ERROR_MESSAGE, ERROR_CODE, ERROR_TYPE } = require('../utilities/Constants');
const DefaultException = require('../models/exception/DefaultException')


/**
 * Product Service
 * @param {*} productRepository 
 * @returns 
 */
const ProductService = productRepository => {

    /**
     * create Product
     * @param {*} product 
     * @param {*} userSession 
     * @returns 
     */
    const createProduct = async (product, userSession) => {

        const { userId } = userSession;
        const { name, description, url, tags } = product;
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const productBuilder = new Product.Builder()
            .withUser(userId)
            .withName(name)
            .withDescription(description)
            .withUrl(url)
            .withTags(tags)
            .withCreatedAt(currentDate)
            .withUpdatedAt(currentDate).build();

        return await productRepository.createProduct(productBuilder);

    }

    /**
     * launch Product
     * @param {*} product 
     * @param {*} userSession 
     * @returns 
     */
    const launchProduct = async (product, userSession) => {

        const { userId } = userSession;
        const { _id } = product;
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);

        const productToUpdateBuilder = new Product.Builder()
            .withId(_id)
            .withLaunchdAt(currentDate)
            .withUser(userId).build();

        return await productRepository.launchProduct(productToUpdateBuilder);

    }

    /**
     * find Products By Owner
     * @param {*} userSession 
     * @returns 
     */
    const findProductsByOwner = async (userSession) => {
        const { userId } = userSession;

        const productToFindBuilder = new Product.Builder()
            .withUser(userId).build();

        return await productRepository.findProductsByOwner(productToFindBuilder);
    }

    /**
     * find Launched Products Pager
     * @param {*} pageSize 
     * @param {*} pageNumber 
     * @param {*} body 
     * @returns 
     */
    const findLaunchedProductsPager = async (pageSize, pageNumber, body) => {

        return await productRepository.findLaunchedProductsPager(pageSize, Math.max(0, pageNumber), body);
    }

    /**
     * edit Product
     * @param {*} _id 
     * @param {*} product 
     * @param {*} userSession 
     * @returns 
     */
    const editProduct = async (_id, product, userSession) => {

        const { userId } = userSession;

        const existsProduct = await productRepository.findProductsByIdOwner(_id, userId);
        if (!existsProduct) {
            const exception = new DefaultException(ERROR_MESSAGE.PRODUCT_ISNT_SESSION);
            exception.code = ERROR_CODE.VALIDATE;
            exception.type = ERROR_TYPE.VALIDATE;
            throw exception
        }

        product.UpdateAt = moment().format(DATE_FORMAT.DEFAULT);

        return await productRepository.editProduct(_id, userId, product);

    }

    /**
     * remove Product
     * @param {*} _id 
     * @param {*} userSession 
     * @returns 
     */
    const removeProduct = async (_id, userSession) => {

        const { userId } = userSession;

        const existsProduct = await productRepository.findProductsByIdOwner(_id, userId);
        if (!existsProduct) {
            const exception = new DefaultException(ERROR_MESSAGE.PRODUCT_ISNT_SESSION);
            exception.code = ERROR_CODE.VALIDATE;
            exception.type = ERROR_TYPE.VALIDATE;
            throw exception
        }
        return await productRepository.removeProduct(_id, userId);

    }

    return {
        createProduct,
        editProduct,
        launchProduct,
        findProductsByOwner,
        findLaunchedProductsPager,
        removeProduct
    }
}

module.exports = ProductService;