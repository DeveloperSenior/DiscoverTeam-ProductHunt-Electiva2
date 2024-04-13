"use strict";

const { Schema, model } = require('mongoose');
const { Product } = require('../../../domain/products/dto/Product');
const mongoosePaginate = require('mongoose-paginate-v2');

/** 
 * Product Model ODM builder Schema
 */
const productSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name: { type: String, required: true, index: true },
        description: { type: String, required: true },
        url: String,
        tags: { type: [String], required: true, index: true },
        state: String,
        createdAt: { type: Date, required: true },
        launchAt: Date,
        updatedAt: Date,
        user: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
        rating: { type: Number, index: true, default: 0.0 }
        
    }
);


productSchema.loadClass(Product);
productSchema.plugin(mongoosePaginate);

const ProductModel = model('Product', productSchema);

module.exports = { ProductModel }

