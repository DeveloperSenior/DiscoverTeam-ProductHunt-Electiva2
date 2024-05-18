const DefaultException = require('../models/exception/DefaultException')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { STATES } = require('../utilities/Constants');
const { UserModel } = require('../models/UserModel');

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
                const { tags, name, rate, isFull, createdAt } = filter;
                optionsfilter.launchAt = { $ne: null };
                optionsfilter.state = STATES.LAUNCHED;
                if( isFull ){
                    optionsfilter = {}
                }
                if ( createdAt ) {
                    const filterDate = new Date(createdAt);
                    optionsfilter.createdAt = filterDate;
                }
                if ( tags ) optionsfilter.tags = {$in: tags};
                if ( name ) optionsfilter.name = {$regex: name, $options: 'i'};
                if ( rate ) optionsfilter.rating = {$eq : rate};
            }
            const data = await DbModel.paginate(
                optionsfilter, // filters
                {
                    page: pageNumber,
                    limit: pageSize,
                    sort: { launchAt: 'asc' },
                    select: '-__v', // Retrieve without __v
                    populate: { path: 'user', select: '-password -__v -followers -followings' }
                });
            const { docs,totalDocs, totalPages, prevPage, nextPage } = data;
            return { actualPage: pageNumber, totalPage: totalDocs, prevPage: prevPage, nextPage: nextPage, data: docs };
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    /**
     * find only Followings Products User
     * @param {*} pageSize 
     * @param {*} pageNumber 
     * @param {*} userId 
     * @param {*} body 
     * @returns 
     */
    const findProductsFollowingsPager = async (pageSize, pageNumber, userId, filter) => {
        try {

            const followings = await UserModel.findOne({_id: userId})
            .select('followings').exec();
            let optionsfilter = { user: { $in: followings.followings } }
            if (filter){
                const { tags, name, rate, createdAt } = filter;

                if ( createdAt ) {
                    const filterDate = new Date(createdAt);
                    optionsfilter.createdAt = filterDate;
                }
                if ( tags ) optionsfilter.tags = {$in: tags};
                if ( name ) optionsfilter.name = {$regex: name, $options: 'i'};
                if ( rate ) optionsfilter.rating = {$eq : rate};
            }
            const data = await DbModel.paginate(
                optionsfilter, // filters
                {
                    page: pageNumber,
                    limit: pageSize,
                    sort: { createdAt: 'asc' },
                    select: '-__v', // Retrieve without __v
                    populate: { path: 'user', select: '-password -__v -followers -followings' }
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
            await DbModel.findOneAndUpdate(options, set);
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


    return {
        createProduct,
        editProduct,
        removeProduct,
        launchProduct,
        findProductsByOwner,
        findLaunchedProductsPager,
        findProductsById,
        findProductsByIdOwner,
        findProductsFollowingsPager
    }


}

module.exports = ProductRepository;