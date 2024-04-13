const DefaultException = require('../../../infrastructure/exception/DefaultException')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { STATES } = require('../../../infrastructure/utilities/Constants');

/**
 * Product Repository
 * @param {*} DbModel 
 * @returns 
 */
const ProductRepository = DbModel => {

    /**
     * Create new product
     * @param {Product} product to launch
     * @returns 
     */
    const createProduct = async (product) => {
        try {
            product._id = new ObjectId;
            product.state = STATES.INITIAL;
            const newUser = new DbModel(product);
            await newUser.save();
            return await DbModel.findOne({ _id: product._id }).select("-__v") // Retrieve without __v
                .populate('user', '-password -__v'); // Retrieve without password and __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * launch Product
     * @param {Product} product 
     * @returns 
     */
    const launchProduct = async (product) => {

        const { _id, launchAt } = product;
        const options = { _id: _id };
        const toLaunchUpdate = {
            state: STATES.LAUNCHED,
            launchAt: launchAt
        };
        try {
            await DbModel.updateOne(options, toLaunchUpdate);
            return await DbModel.findOne({ _id: _id }).select("-__v") // Retrieve without __v
                .populate('user', '-password -__v'); // Retrieve without password and __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }

    }

    /**
     * find Products By Owner
     * @param {Product} product 
     * @returns 
     */
    const findProductsByOwner = async (product) => {
        try {
            return await DbModel.find({ user: product.user }).select("-__v") // Retrieve without __v
                .populate('user', '-password -__v'); // Retrieve without password and __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * find Products By Id
     * @param {Product} product 
     * @returns 
     */
    const findProductsById = async (_id) => {
        try {
            return await DbModel.findOne({ _id: _id }).select("-__v") // Retrieve without __v
                .populate('user', '-password -__v'); // Retrieve without password and __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * find Products By Owner
     * @param {Product} product 
     * @returns 
     */
    const findProductsByIdOwner = async (_id, owner) => {
        try {
            return await DbModel.findOne({ _id: _id, user: owner }).select("-__v") // Retrieve without __v
                .populate('user', '-password -__v'); // Retrieve without password and __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * find Launched Products Pager
     * @param {*} pageSize 
     * @param {*} pageNumber 
     * @returns 
     */
    const findLaunchedProductsPager = async (pageSize, pageNumber, filter) => {
        try {
            let optionsfilter = { launchAt: { $ne: null }, state: STATES.LAUNCHED }
            if (filter){
                const { tags, name, rate } = filter;
                if ( tags ) optionsfilter.tags = {$in: tags};
                if ( name ) optionsfilter.name = {$regex: name, $options: 'i'};
                if ( rate ) optionsfilter.rating = {$eq : rate};
                optionsfilter.launchAt = { $ne: null };
                optionsfilter.state = STATES.LAUNCHED;
            }
            console.log(optionsfilter);
            const data = await DbModel.paginate(
                optionsfilter, // filters
                {
                    page: pageNumber,
                    limit: pageSize,
                    sort: { launchAt: 'asc' },
                    select: '-__v', // Retrieve without __v
                    populate: { path: 'user', select: '-password -__v' }
                });
            const { docs, totalPages, prevPage, nextPage } = data;
            return { actualPage: pageNumber, totalPage: totalPages, prevPage: prevPage, nextPage: nextPage, data: docs };
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * edit Product by id
     * @param {*} product 
     * @returns 
     */
    const editProduct = async (_id, owner, product) => {
        const options = { _id: _id, user: owner };
        const set = {
            $set: product
        }
        try {
            const update= await DbModel.findOneAndUpdate(options, set);
            return await DbModel.findOne(options).select("-__v")// Retrieve without __v
                .populate('user', '-password -__v'); // Retrieve without password and __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * remove Product by Id
     * @param {*} product 
     * @returns 
     */
    const removeProduct = async (_id, userId) => {
        try {

            return await DbModel.deleteOne({ _id: _id, user: userId });

        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * filter Products
     * @param {*} filters 
     */
    const filterProducts = async (filters) => {



    }


    return {
        createProduct,
        editProduct,
        removeProduct,
        filterProducts,
        launchProduct,
        findProductsByOwner,
        findLaunchedProductsPager,
        findProductsById,
        findProductsByIdOwner
    }


}

module.exports = ProductRepository;