const DefaultException = require('../models/exception/DefaultException')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { STATES } = require('../utilities/Constants');

const ProductRepository = ProductModel => {

    /**
     * Create new product
     * @param {Product} product to launch
     * @returns 
     */
    const createProduct = async (product) => {
        try {
            product._id = new ObjectId;
            product.state = STATES.INITIAL;
            const newUser = new ProductModel(product);
            return await newUser.save();
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    const launchProduct = async (product) => {

        const { _id, userUpdate, launchDate } = product;
        try {
            await ProductModel.updateOne({ _id: _id }, { state: STATES.LAUNCHED, userUpdate: userUpdate, launchDate: launchDate });
            return await ProductModel.findOne({ _id: _id }).select("-__v"); // Retrieve without __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }

    }

    const findProductsByOwner = async (product) => {
        try {
            return await ProductModel.find({ owner: product.owner }).select("-__v"); // Retrieve without __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    const findLaunchedProductsPager = async (pageSize, pageNumber) => {
        try {
            const data = await ProductModel.paginate(
                { launchDate: { $ne: null }, state: STATES.LAUNCHED }, // filters
                {
                    page: pageNumber,
                    limit: pageSize,
                    sort: { lauchDate: 'asc' },
                    select: '-__v' // Retrieve without __v
                });
            const { docs, totalPages, prevPage, nextPage } = data;
            return { actualPage: pageNumber, totalPage: totalPages, prevPage: prevPage, nextPage: nextPage, data: docs };
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    const editProduct = async (product) => {
        try {
            const newUser = new ProductModel(product);
            await newUser.save();
            return true;
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    const removeProduct = async (product) => {
        try {
            const newUser = new ProductModel(product);
            await newUser.save();
            return true;
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    const filterProducts = async (filters) => {



    }


    return { createProduct, editProduct, removeProduct, filterProducts, launchProduct, findProductsByOwner, findLaunchedProductsPager }
    s

}

module.exports = ProductRepository;