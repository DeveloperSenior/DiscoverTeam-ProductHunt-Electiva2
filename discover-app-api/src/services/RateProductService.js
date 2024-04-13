const { RateProduct } = require('../models/dto/RateProduct');
const moment = require('moment');
const { DATE_FORMAT } = require('../utilities/Constants');
const { ERROR_MESSAGE, ERROR_CODE, ERROR_TYPE } = require('../utilities/Constants');
const DefaultException = require('../models/exception/DefaultException')


/**
 * RateProductService
 * @param {*} rateProductRepository 
 * @param {*} productRepository 
 * @returns 
 */
const RateProductService = (rateProductRepository, productRepository) => {

    /**
     * rate Product
     * @param {*} productId 
     * @param {*} rateProduct 
     * @param {*} userSession 
     * @returns 
     */
    const rateProduct = async (productId, rateProduct, userSession) => {

        const { userId } = userSession;
        const findProduct = await productRepository.findProductsById(productId);
        if (!findProduct) {
            const excepcion = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
            throw excepcion;
        }


        const { rate, comment } = rateProduct;
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const productBuilder = new RateProduct.Builder()
            .withUser(userId)
            .withProduct(findProduct._id)
            .withRate(rate)
            .withComment(comment)
            .withCreatedAt(currentDate)
            .withUpdatedAt(currentDate).build();
        
        const data = await rateProductRepository.rateProduct(productBuilder);
        
        const average = await averageRateProduct(findProduct._id);

        const editRateIdProdcut = await productRepository.editProduct(findProduct._id,findProduct.user._id,{rating: average.rating[0].average} );
        return {product: editRateIdProdcut, data: data};

    }

    /**
     * average Rate Product
     * @param {*} productId 
     * @returns 
     */
    const averageRateProduct = async (productId) => {

        const findedProduct = await productRepository.findProductsById(productId);
        if (!findedProduct) {
            const excepcion = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
            throw excepcion;
        }

        const productBuilder = new RateProduct.Builder()
            .withProduct(findedProduct._id).build();
        
        const average = await rateProductRepository.averageRateProduct(productBuilder);

        return {product: findedProduct, rating: average} ;
    }

    /**
     * detailed Product Delivery
     * @param {*} productId 
     * @returns 
     */
    const detailedProductDelivery = async (productId) => {
        const findProduct = await productRepository.findProductsById(productId);
        if (!findProduct) {
            const excepcion = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
            throw excepcion;
        }

        const data =  await rateProductRepository.findRatesByProduct(findProduct._id);

        return {product: findProduct, commentsRating: data};
    }

    /**
     * comments Product Delivery
     * @param {*} productId 
     * @returns 
     */
    const commentsProductDelivery = async (productId) => {
        const findProduct = await productRepository.findProductsById(productId);
        if (!findProduct) {
            const excepcion = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
            throw excepcion;
        }

        return await rateProductRepository.findRatesByProduct(findProduct._id);     
    }

    return { rateProduct, averageRateProduct, detailedProductDelivery, commentsProductDelivery }
}

module.exports = RateProductService;