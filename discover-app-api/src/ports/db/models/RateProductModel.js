"use strict";

const { Schema, model } = require('mongoose');
const { RateProduct } = require('../../../domain/products/dto/RateProduct');
const mongoosePaginate = require('mongoose-paginate-v2');


/** 
 * RateProduct Model ODM builder Schema
 */
const rateProductSchema = new Schema(
    {
        _id: Schema.Types.ObjectId, // _id RateProduct Document
        rate: { type: Number, required: true, index: true },
        comment: { type: String, required: true},
        user: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User'},
        product: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Product' },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, index: true }
    }
);

rateProductSchema.loadClass(RateProduct);
rateProductSchema.plugin(mongoosePaginate);

const RateProductModel = model('RateProduct', rateProductSchema);

module.exports = { RateProductModel }

