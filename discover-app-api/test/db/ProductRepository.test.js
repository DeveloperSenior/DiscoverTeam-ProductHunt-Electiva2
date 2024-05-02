const { ProductModel } = require('../../src/models/ProductModel');
const mockingoose = require('mockingoose');
const { Product } = require('../../src/models/dto/Product');
const DefaultException = require('../../src/models/exception/DefaultException');
const moment = require('moment');
const { DATE_FORMAT, STATES } = require('../../src/utilities/Constants');


const userSessionMock = { email: 'test@test.com', userId: '6615b9d07547e0fc5387077c' };
const userMock = { name: 'TestUser', email: userSessionMock.email, _id: userSessionMock.userId };
const productMock = new Product.Builder()
    .withId('6619738195230033669607f9')
    .withUser(userMock)
    .withState(STATES.INITIAL)
    .withCreatedAt(moment().format(DATE_FORMAT.DEFAULT))
    .withName('TestProduct')
    .withDescription('Test product mock')
    .withUrl('http://test-product-mock/url')
    .withTags(['mock', 'test']).build();

const productsPagerMock =
    {
        "actualPage": 1,
        "totalPage": 1,
        "prevPage": null,
        "nextPage": 1,
        "data": [
            productMock
        ]
    }
;

describe("Product Repository DB", () => {

    afterEach(() => {
        productMock.state = STATES.INITIAL;
        productMock.launchAt = null;
        jest.clearAllMocks();

    });

    it("should create Product", async () => {

        /**
         * Mock response created product with save function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productMock, 'save');
        mockingoose(ProductModel).toReturn(productMock, 'findOne');

        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).createProduct(productMock)
        expect(response).toBeInstanceOf(Object);
        expect(response.rating).toEqual(0);
        expect(response.state).toEqual(STATES.INITIAL);
    });

    it("should not create Product, error save function", async () => {

        /**
         * Mock response created product with save function ODM mongoose
         * true isn't monogo document return save function
         */
        mockingoose(ProductModel).toReturn(true, 'save');

        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        await ProductRepository(ProductModel).createProduct(productMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should launch Product", async () => {

        /**
         * Mock response update product with updateOne function ODM mongoose
         */
        productMock.state = STATES.LAUNCHED;
        productMock.launchAt = productMock.createdAt;
        mockingoose(ProductModel).toReturn(productMock, 'updateOne');
        mockingoose(ProductModel).toReturn(productMock, 'findOne');
        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).launchProduct(productMock);
        expect(response).toBeInstanceOf(Object);
        expect(response.rating).toEqual(0);
        expect(response.state).toEqual(STATES.LAUNCHED);
    });

    it("should not launch Product, error updateOne", async () => {

        /**
         * Mock response update product with updateOne function ODM mongoose
         */

        mockingoose(ProductModel).toReturn(true, 'updateOne');
        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        /**
         * Null model param to exception ODM
         */
        await ProductRepository(null).launchProduct(productMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should find Products By Owner", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn([productMock], 'find');
        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).findProductsByOwner(productMock);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(1)
        expect(response[0]).toHaveProperty('state', STATES.INITIAL);
    });

    it("should not find Products By Owner, error find", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */

        mockingoose(ProductModel).toReturn(true, 'find');
        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        /**
         * Null model param to exception ODM
         */
        await ProductRepository(null).findProductsByOwner(productMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should find Products By Id", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productMock, 'findOne');
        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).findProductsById(productMock._id);
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty('state', STATES.INITIAL);
    });

    it("should not find Products By Id, error findOne", async () => {

        /**
         * Mock response retrieve product with findOne function ODM mongoose
         */

        mockingoose(ProductModel).toReturn(true, 'findOne');
        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        /**
         * Null model param to exception ODM
         */
        await ProductRepository(null).findProductsById(productMock._id).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should find Products By Id & Owner", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productMock, 'findOne');
        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).findProductsByIdOwner(productMock._id, productMock.user);
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty('state', STATES.INITIAL);
    });

    it("should find Products By Id & Owner, error findOne", async () => {

        /**
         * Mock response retrieve product with findOne function ODM mongoose
         */

        mockingoose(ProductModel).toReturn(true, 'findOne');
        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        /**
         * Null model param to exception ODM
         */
        await ProductRepository(null).findProductsByIdOwner(productMock._id, productMock.user).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should find Launched Products by Pager", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productsPagerMock, 'paginate');

        const paginate = jest.spyOn(ProductModel, 'paginate');
        paginate.mockImplementation(() => {
            return {
                "docs":[productMock],
                "actualPage": 1,
                "totalPages": 1,
                "prevPage": null,
                "nextPage": 1,
            }
        });

        const pageSize = 1;
        const pageNumber = 1;
        const filter = {
            tags: ['dev'], name: 'Test', rate: 3
        };

        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).findLaunchedProductsPager(pageSize, pageNumber, filter);
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty('actualPage', 1);
        expect(response).toHaveProperty('nextPage', 1);
        expect(response).toHaveProperty('totalPage', 1);
    });

    it("should find Launched Products by Pager without filter", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productsPagerMock, 'paginate');

        const paginate = jest.spyOn(ProductModel, 'paginate');
        paginate.mockImplementation(() => {
            return {
                "docs":[productMock],
                "actualPage": 1,
                "totalPages": 1,
                "prevPage": null,
                "nextPage": 1,
            }
        });

        const pageSize = 1;
        const pageNumber = 1;

        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).findLaunchedProductsPager(pageSize, pageNumber, null);
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty('actualPage', 1);
        expect(response).toHaveProperty('nextPage', 1);
        expect(response).toHaveProperty('totalPage', 1);
    });

    it("should find Launched Products by Pager without params filter", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productsPagerMock, 'paginate');

        const paginate = jest.spyOn(ProductModel, 'paginate');
        paginate.mockImplementation(() => {
            return {
                "docs":[productMock],
                "actualPage": 1,
                "totalPages": 1,
                "prevPage": null,
                "nextPage": 1,
            }
        });

        const pageSize = 1;
        const pageNumber = 1;
        const filter = {};

        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).findLaunchedProductsPager(pageSize, pageNumber, filter);
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty('actualPage', 1);
        expect(response).toHaveProperty('nextPage', 1);
        expect(response).toHaveProperty('totalPage', 1);
    });

    it("should find Launched Products by Pager, error pagination", async () => {

        /**
         * Mock response retrieve product with find function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productsPagerMock, 'paginate');

        const paginate = jest.spyOn(ProductModel, 'paginate');
        paginate.mockImplementation(() => {
            return {
                "docs":[productMock],
                "actualPage": 1,
                "totalPages": 1,
                "prevPage": null,
                "nextPage": 1,
            }
        });

        const pageSize = 1;
        const pageNumber = 1;
        const filter = {
            tags: ['dev'], name: 'Test', rate: 3
        };

        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        /**
         * Null model param to exception ODM
         */
        await ProductRepository(null).findLaunchedProductsPager(pageSize, pageNumber, filter).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should edit Product", async () => {

        /**
         * Mock response update product with findOneAndUpdate function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(productMock, 'findOneAndUpdate');
        mockingoose(ProductModel).toReturn(productMock, 'findOne');

        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).editProduct(productMock._id,productMock.user,productMock)
        expect(response).toBeInstanceOf(Object);
        expect(response.rating).toEqual(0);
        expect(response.state).toEqual(STATES.INITIAL);
    });

    it("should not edit Product, error findOneAndUpdate function", async () => {

        /**
         * Mock response created product with save function ODM mongoose
         * true isn't monogo document return save function
         */
        mockingoose(ProductModel).toReturn(true, 'findOneAndUpdate');

        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        await ProductRepository(ProductModel).editProduct(productMock._id,productMock.user,productMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should remove Product", async () => {

        /**
         * Mock response remove product with deleteOne function ODM mongoose
         */
        mockingoose(ProductModel).toReturn(null, 'deleteOne');

        const ProductRepository = require('../../src/db/ProductRepository');
        const response = await ProductRepository(ProductModel).removeProduct(productMock._id,productMock.user)
        expect(response).toBeNull();
    });

    it("should not remove Product, error deleteOne function", async () => {

        /**
         * Mock response created product with save function ODM mongoose
         * true isn't monogo document return save function
         */
        mockingoose(ProductModel).toReturn(true, 'deleteOne');

        const ProductRepository = require('../../src/db/ProductRepository');
        const errorMock = new DefaultException('');
        expect.assertions(2);
        await ProductRepository(null).removeProduct(productMock._id,productMock.user).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

});