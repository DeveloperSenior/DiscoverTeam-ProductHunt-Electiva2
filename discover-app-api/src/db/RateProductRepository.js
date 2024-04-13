const DefaultException = require('../models/exception/DefaultException')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const RateProductRepository = DbModel => {

    const rateProduct = async (rateProduct) => {
        try {
            rateProduct._id = new ObjectId;
            const newRate = new DbModel(rateProduct);
            await newRate.save();
            return await findRatesByProduct(rateProduct.product);
        } catch (error) {
            const excepcion = new DefaultException(error.message);
            throw excepcion;
        }
    }

    const findRatesByProduct = async (productId) => {
        try {

            return await DbModel.find({ product: productId })
                .populate('user', '-password -_id -__v').select('-product -__v'); // Retrieve without __v
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    const averageRateProduct = async (rateAverage) => {
        try {
            const average = await DbModel.aggregate([
                { $match: { product: rateAverage.product } },
                { $group: { _id: '$product', average: { $avg: '$rate' } } },
                { $unset: "_id" },
                { $project: { average: { $ceil: "$average" }}}
            ]).exec();
            return average;
        } catch (e) {
            const excepcion = new DefaultException(e.message);
            throw excepcion;
        }
    }

    return {
        rateProduct,
        findRatesByProduct,
        averageRateProduct
    }


}

module.exports = RateProductRepository;