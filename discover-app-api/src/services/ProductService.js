const { Product } = require('../../src/models/ProductModel');
const moment = require('moment');
const { DATE_FORMAT } = require('../utilities/Constants');


const ProductService = productRepository => {

    const createProduct = async (product, userSession) => {

        const { email } = userSession;
        const { info, imagesMedia, makers, shoutouts, extras } = product;
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const productBuilder = new Product.Builder()
            .withOwner(email)
            .withUserCreate(email)
            .withCreationDate(currentDate)
            .withInfo(info)
            .withImagesMedia(imagesMedia)
            .withMakers(makers)
            .withShoutouts(shoutouts)
            .withExtras(extras).build();

        return await productRepository.createProduct(productBuilder);

    }

    const launchProduct = async (product, userSession) => {

        const { email } = userSession;
        const { _id } = product;
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);

        const productToUpdateBuilder = new Product.Builder()
            .withId(_id)
            .withUserUpdate(email)
            .withLaunchDate(currentDate)
            .withOwner(email).build();

        return await productRepository.launchProduct( productToUpdateBuilder );

    }

    const findProductsByOwner = async (userSession) => {
        const { email } = userSession;

        const productToFindBuilder = new Product.Builder()
            .withOwner(email).build();

        return await productRepository.findProductsByOwner( productToFindBuilder );
    }

    const findLaunchedProductsPager = async (pageSize,pageNumber) => {

        return await productRepository.findLaunchedProductsPager( pageSize, Math.max(0, pageNumber)  );
    }

    const editProduct = async (product, userSession) => {




    }

    return { createProduct, editProduct, launchProduct, findProductsByOwner, findLaunchedProductsPager }
}

module.exports = ProductService;