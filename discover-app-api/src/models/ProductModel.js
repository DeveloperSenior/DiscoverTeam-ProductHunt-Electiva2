"use strict";

const { Schema, model } = require('mongoose');
const { Product } = require('./dto/Product');
const mongoosePaginate = require('mongoose-paginate-v2');

/** 
 * Product Model ODM builder Schema
 */
const productSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        state: String,
        userCreate: { type: String, required: true, index: true },
        creationDate: { type: Date, required: true },
        userUpdate: String,
        launchDate: Date,
        owner: { type: String, required: true, index: true },
        info: {
            name: { type: String, required: true, index: true },
            tags: { type: [String], required: true, index: true },
            links: {
                type: [{
                    link: String,
                    socialMediaLink: { type:[{
                        key: String,
                        value: String
                    }], _id: false}
                }],_id: false, required: true
            },
            description: { type: String, required: true },
            categories: {
                type: [{
                    category: { type: String, required: true, index: true },
                    subCategory: { type: String, required: true, index: true }
                }],_id: false, required: true
            }
            , isOpenSource: { type: Boolean, default: false, required: true }
        },
        imagesMedia: {
            linksImages: { type: [String], required: true },
            linkDemo: String,
            linkVideo: String
        },
        makers: { type: [String], required: true },
        shoutouts: [String],
        extras: {
            pricing: { type: String, required: true, index: true },
            promoCode: {
                type: [{
                    description: { type: String, required: true },
                    code: { type: String, required: true },
                    expirationDate: { type: Date, required: true }
                }],_id: false, required: true
            },
            fundingInfo: { type: [String], required: true },
            firstComment: { type: String, required: true }
        }
    }
);

productSchema.loadClass(Product);
productSchema.plugin(mongoosePaginate);

const ProductModel = model('Product', productSchema);

module.exports = { ProductModel, Product }

