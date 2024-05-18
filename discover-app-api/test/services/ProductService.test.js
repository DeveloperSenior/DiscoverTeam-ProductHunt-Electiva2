const { Product } = require('../../src/models/dto/Product');
const DefaultException = require('../../src/models/exception/DefaultException');
const { ERROR_MESSAGE, ERROR_CODE, ERROR_TYPE } = require('../../src/utilities/Constants');


const userSessionMock = { email: 'test@test.com', userId: '123123' };
const productMock = new Product.Builder()
    .withId('123123')
    .withName('TestProduct')
    .withDescription('Test product mock')
    .withUrl('http://test-product-mock/url')
    .withTags(['mock', 'test'])
    .withLaunchdAt('2024-03-03')
    .withUpdatedAt('2024-04-03').build();
const productsPagerMock = [
    {
        "actualPage": 1,
        "totalPage": 1,
        "prevPage": null,
        "nextPage": 1,
        "data": [
            productMock
        ]
    }
];
describe("Product Service", () => {

    beforeEach(() => {
        jest.mock('../../src/db/ProductRepository');
        const repository = require('../../src/db/ProductRepository');
        repository.mockImplementation(() => {
            return {
                createProduct: jest.fn(async (product) => productMock),
                launchProduct: jest.fn(async (product) => productMock),
                findProductsByOwner: jest.fn(async (product) => [productMock]),
                findProductsById: jest.fn(async (_id) => { }),
                findProductsByIdOwner: jest.fn(async (_id, owner) => productMock),
                findLaunchedProductsPager: jest.fn(async (pageSize, pageNumber, filter) => productsPagerMock),
                editProduct: jest.fn(async (_id, owner, product) => productMock),
                removeProduct: jest.fn(async (_id, userId) => { })
            }
        });
    });
    afterEach(() => {

        jest.restoreAllMocks();
        jest.clearAllMocks();

    });

    it('should create product', async () => {
        const repository = require('../../src/db/ProductRepository');
        const ProductService = require('../../src/services/ProductService');
        const response = await ProductService(repository()).createProduct(productMock, userSessionMock);
        expect(response).toEqual(productMock);

    });

    it('should launch product', async () => {
        const repository = require('../../src/db/ProductRepository');
        const ProductService = require('../../src/services/ProductService');
        const response = await ProductService(repository()).launchProduct(productMock, userSessionMock);
        expect(response).toEqual(productMock);
        expect(response.launchAt).toEqual('2024-03-03');

    });

    it('should find Products By Owner', async () => {
        const repository = require('../../src/db/ProductRepository');
        const ProductService = require('../../src/services/ProductService');
        const response = await ProductService(repository()).findProductsByOwner(userSessionMock);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(1);
        expect(response).toEqual([productMock]);

    });

    it('should find Launched Products Pager', async () => {

        const pageSize = 1;
        const pageNumber = 1;
        const filters = new Product.Builder().withName().build();
        const repository = require('../../src/db/ProductRepository');
        const ProductService = require('../../src/services/ProductService');
        const response = await ProductService(repository()).findLaunchedProductsPager(pageSize, pageNumber, filters);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(1);
        expect(response[0]).toHaveProperty('totalPage', 1);
        expect(response[0]).toHaveProperty('data');

    });

    it('should edit Product', async () => {

        const repository = require('../../src/db/ProductRepository');
        const ProductService = require('../../src/services/ProductService');
        const response = await ProductService(repository()).editProduct(productMock._id, productMock, userSessionMock)
        expect(response).toEqual(productMock);
        expect(response._id).toEqual(productMock._id);
        expect(response.updatedAt).toEqual('2024-04-03');

    });

    it("should not edit Product, '_id' Product no exists by owner", async () => {

        const repository = require('../../src/db/ProductRepository');
        repository.mockImplementation(() => {
            return {
                findProductsByIdOwner: jest.fn(async (_id, owner) => {})
            }
        });

        const ProductService = require('../../src/services/ProductService');
        const errorMock = new DefaultException(ERROR_MESSAGE.PRODUCT_ISNT_SESSION);
        errorMock.code = ERROR_CODE.VALIDATE;
        errorMock.type = ERROR_TYPE.VALIDATE;
        expect.assertions(2);
        await ProductService(repository()).editProduct(productMock._id, productMock, userSessionMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });

    });

    it('should remove Product', async () => {

        const repository = require('../../src/db/ProductRepository');
        const ProductService = require('../../src/services/ProductService');
        const response = await ProductService(repository()).removeProduct(productMock._id, userSessionMock)
        expect(response).toBeUndefined();

    });

    it("should not remove Product, '_id' Product no exists by owner", async () => {

        const repository = require('../../src/db/ProductRepository');
        repository.mockImplementation(() => {
            return {
                findProductsByIdOwner: jest.fn(async (_id, owner) => {})
            }
        });

        const ProductService = require('../../src/services/ProductService');
        const errorMock = new DefaultException(ERROR_MESSAGE.PRODUCT_ISNT_SESSION);
        errorMock.code = ERROR_CODE.VALIDATE;
        errorMock.type = ERROR_TYPE.VALIDATE;
        expect.assertions(2);
        await ProductService(repository()).removeProduct(productMock._id, productMock, userSessionMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });

    });


});