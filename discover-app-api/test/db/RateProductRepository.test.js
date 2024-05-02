const { RateProductModel } = require('../../src/models/RateProductModel');
const mockingoose = require('mockingoose');
const { RateProduct } = require('../../src/models/dto/RateProduct');
const { Product } = require('../../src/models/dto/Product');
const DefaultException = require('../../src/models/exception/DefaultException');
const moment = require('moment');
const { DATE_FORMAT } = require('../../src/utilities/Constants');

const userSessionMock = { email: 'test@test.com', userId: '6615b9d07547e0fc5387077c' };
const userMock = { name: 'TestUser', email: userSessionMock.email, _id: userSessionMock.userId };
const productMock = new Product.Builder()
    .withId('6619738195230033669607f9')
    .withUser(userMock)
    .withName('TestProduct')
    .withDescription('Test product mock')
    .withUrl('http://test-product-mock/url')
    .withTags(['mock', 'test']).build();
const rateProductMock = {
    "_id": "6619738195230033669607f9",
    "rate": 5,
    "comment": "Excelente producto",
    "user": userMock,
    "product": productMock,
    "createdAt": "2024-04-12",
    "updatedAt": "2024-04-12"
}
const averageMock = { average: 3 }

describe("Rate Product Repository DB", () => {

    afterEach(() => {

        jest.clearAllMocks();

    });

    it("should create the rate Product", async () => {

        /**
         * Mock response created rate product with save function ODM mongoose
         */
        mockingoose(RateProductModel).toReturn(rateProductMock, 'save');
        mockingoose(RateProductModel).toReturn([rateProductMock], 'find');
        /**
         * Mock param RateProduct to create
         */
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const rateMock = new RateProduct.Builder()
            .withProduct(productMock._id)
            .withRate(3)
            .withUser(userMock._id)
            .withComment("many bugs")
            .withCreatedAt(currentDate).build();
        const RateProductRepository = require('../../src/db/RateProductRepository');
        const response = await RateProductRepository(RateProductModel).rateProduct(rateMock);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(1);
    });

    it("should not create the rate Product, error save", async () => {

        /**
         * Mock response created rate producto with save function ODM mongoose
         * true isn't monogo document return save function
         */
        mockingoose(RateProductModel).toReturn(true, 'save');
        /**
         * Mock param RateProduct to create
         */
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const rateMock = new RateProduct.Builder()
            .withProduct(productMock._id)
            .withRate(3)
            .withUser(userMock._id)
            .withComment("many bugs")
            .withCreatedAt(currentDate).build();
        const RateProductRepository = require('../../src/db/RateProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        await RateProductRepository(RateProductModel).rateProduct(rateMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should find Rates By Product", async () => {

        /**
         * Mock response retrieve rate product with find function ODM mongoose
         */
        mockingoose(RateProductModel).toReturn([rateProductMock], 'find');
        /**
         * Mock param RateProduct to create
         */
        const RateProductRepository = require('../../src/db/RateProductRepository');
        const response = await RateProductRepository(RateProductModel).findRatesByProduct(productMock._id);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(1);
    });

    it("should not retrieve rate Product, error find", async () => {

        /**
         * Mock response retrieve rate producto with find function ODM mongoose
         * true isn't monogo document return find function
         */
        mockingoose(RateProductModel).toReturn(true, 'find');
        const RateProductRepository = require('../../src/db/RateProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        await RateProductRepository(RateProductModel).findRatesByProduct(productMock._id).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should average all Rates By Product", async () => {

        /**
         * Mock response retrieve average rate product with aggregate function ODM mongoose
         */
        mockingoose(RateProductModel).toReturn([averageMock], 'aggregate');
        /**
         * Mock param RateProduct to filter
         */
        const productBuilderMock = new RateProduct.Builder()
            .withProduct(productMock._id).build();
        const RateProductRepository = require('../../src/db/RateProductRepository');
        const response = await RateProductRepository(RateProductModel).averageRateProduct(productBuilderMock);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(1);
        expect(response[0]).toHaveProperty('average', 3);
    });

    it("should not average all Rates By Product, error aggregate", async () => {

        /**
         * Mock response retrieve average rate product with aggregate function ODM mongoose
         * true isn't monogo document return find function
         */
        mockingoose(RateProductModel).toReturn(true, 'aggregate');
        const errorMock = new DefaultException('');

        const RateProductRepository = require('../../src/db/RateProductRepository');
        expect.assertions(2);
        await RateProductRepository(null).averageRateProduct(null).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

});