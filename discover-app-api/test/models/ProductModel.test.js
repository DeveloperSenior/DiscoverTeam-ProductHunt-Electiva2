
const mockingoose = require('mockingoose');
const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { DATE_FORMAT } = require('../../src/utilities/Constants');
const { ProductModel } = require('../../src/models/ProductModel');
const { Product, InfoProduct, ImageMediaProduct, ExtrasProduct, PromoCodeProduct, LinkProduct, CategoryProduct } = require('../../src/models/dto/Product');
/**
 * Mock user mongo document 
 */
const productMock = {
    "_id": {
      "$oid": "6619699f8d0ab598b88859f9"
    },
    "name": "TestProduct",
    "description": "TestProduct",
    "url": "https://github/testProducto",
    "tags": ['dev', 'software'],
    "state": "L",
    "createdAt": {
      "$date": "2024-04-12T00:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2024-04-12T00:00:00.000Z"
    },
    "user": {
      "$oid": "6619690d8c2c9dfd95b6353f"
    },
    "__v": 0,
    "launchAt": {
      "$date": "2024-04-12T00:00:00.000Z"
    },
    "rating": 4
  };

describe("Product Model ", () => {

    it('should save Product', async () => {

        /**
         * Mock request paylod body Product to create
         */
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const createProductMock = new Product.Builder()
            .withName('TestProduct')
            .withDescription('Dev productos to test')
            .withUrl('https://github/testProducto')
            .withTags(['dev', 'software'])
            .withUser('6619690d8c2c9dfd95b6353f')
            .withState('L')
            .withCreatedAt(currentDate).build();

        /**
        * Mock response created product with save function ODM mongoose
        */
        mockingoose(ProductModel).toReturn(productMock, 'save');
        expect.assertions(4);
        const productCreate = await new ProductModel(createProductMock).save();
        const response = productCreate.toObject();
        expect(productCreate).toHaveProperty('_id');
        expect(response.name).toEqual(createProductMock.name);
        expect(response.state).toEqual(createProductMock.state);
        expect(response.tags).toEqual(createProductMock.tags);

    });

});