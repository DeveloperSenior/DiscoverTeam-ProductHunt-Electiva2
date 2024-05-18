const { Product } = require('../../src/models/dto/Product');
const { RateProduct } = require('../../src/models/dto/RateProduct');
const DefaultException = require('../../src/models/exception/DefaultException');
const { ERROR_MESSAGE, ERROR_CODE, ERROR_TYPE } = require('../../src/utilities/Constants');


const userSessionMock = { email: 'test@test.com', userId: '123123' };
const userMock = { name: 'TestUser', email: userSessionMock.email, _id: userSessionMock.userId };
const productMock = new Product.Builder()
    .withId('123123')
    .withUser(userMock)
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

const rateMock = new RateProduct.Builder()
    .withId('321321')
    .withUser(userMock)
    .withComment('many bugs')
    .withRate(3)
    .withCreatedAt('2024-03-14').build();

const rateProductMock = {
    "product": productMock,
    "data": [
        rateMock
    ]
};

const rateProductDetailedMock = {
    "product": productMock,
    "commentsRating": [
        rateMock,
        rateMock,
        rateMock
    ]
}

const averageMock = { average: 3 }

describe("Rate Product Service", () => {
    beforeEach(() => {
        jest.mock('../../src/db/RateProductRepository');
        const repository = require('../../src/db/RateProductRepository');
        repository.mockImplementation(() => {
            return {
                rateProduct: jest.fn(async (productId, rateProduct, userSession) => rateMock),
                averageRateProduct: jest.fn(async (productId) => [averageMock]),
                detailedProductDelivery: jest.fn(async (productId) => { }),
                findRatesByProduct: jest.fn(async (productId) => [rateMock, rateMock, rateMock])
            }
        });
        jest.mock('../../src/db/ProductRepository');
        const productRepository = require('../../src/db/ProductRepository');
        productRepository.mockImplementation(() => {
            return {
                createProduct: jest.fn(async (product) => productMock),
                launchProduct: jest.fn(async (product) => productMock),
                findProductsByOwner: jest.fn(async (product) => [productMock]),
                findProductsById: jest.fn(async (_id) => productMock),
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


    it('should rate product', async () => {
        const productRepository = require('../../src/db/ProductRepository');
        const repository = require('../../src/db/RateProductRepository');

        const RateProductService = require('../../src/services/RateProductService');
        const response = await RateProductService(repository(), productRepository()).rateProduct(productMock._id, rateMock, userSessionMock);
        expect(response).toHaveProperty('data');
        expect(response).toHaveProperty('product');
    });

    it("should not rate product, '_id' Product no exists", async () => {
        const productRepository = require('../../src/db/ProductRepository');
        productRepository.mockImplementation(() => {
            return {
                findProductsById: jest.fn(async (_id) => { })
            }
        });
        const repository = require('../../src/db/RateProductRepository');
        const errorMock = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
        const RateProductService = require('../../src/services/RateProductService');
        expect.assertions(2);
        const response = await RateProductService(repository(), productRepository()).rateProduct(productMock._id, rateMock, userSessionMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it("should not average rate product, '_id' Product no exists", async () => {
        const productRepository = require('../../src/db/ProductRepository');
        productRepository.mockImplementation(() => {
            return {
                findProductsById: jest.fn(async (_id) => { })
            }
        });
        const repository = require('../../src/db/RateProductRepository');
        const errorMock = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
        const RateProductService = require('../../src/services/RateProductService');
        expect.assertions(2);
        await RateProductService(repository(), productRepository()).averageRateProduct(productMock._id).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it('should retrieve detailed Product', async () => {
        const productRepository = require('../../src/db/ProductRepository');
        const repository = require('../../src/db/RateProductRepository');

        const RateProductService = require('../../src/services/RateProductService');
        const response = await RateProductService(repository(), productRepository()).detailedProductDelivery(productMock._id);
        expect(response).toHaveProperty('product');
        expect(response).toHaveProperty('commentsRating');
    });

    it("should not retrieve detailed Product, '_id' Product no exists", async () => {
        const productRepository = require('../../src/db/ProductRepository');
        productRepository.mockImplementation(() => {
            return {
                findProductsById: jest.fn(async (_id) => { })
            }
        });
        const repository = require('../../src/db/RateProductRepository');
        const errorMock = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
        const RateProductService = require('../../src/services/RateProductService');
        expect.assertions(2);
        await RateProductService(repository(), productRepository()).detailedProductDelivery(productMock._id).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });

    it('should retrieve comments Product', async () => {
        const productRepository = require('../../src/db/ProductRepository');
        const repository = require('../../src/db/RateProductRepository');

        const RateProductService = require('../../src/services/RateProductService');
        const response = await RateProductService(repository(), productRepository()).commentsProductDelivery(productMock._id);
        expect(response).toBeInstanceOf(Array);
        expect(response).toHaveLength(3);
    });

    it("should not retrieve comments Product, '_id' Product no exists", async () => {
        const productRepository = require('../../src/db/ProductRepository');
        productRepository.mockImplementation(() => {
            return {
                findProductsById: jest.fn(async (_id) => { })
            }
        });
        const repository = require('../../src/db/RateProductRepository');
        const errorMock = new DefaultException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
        const RateProductService = require('../../src/services/RateProductService');
        expect.assertions(2);
        await RateProductService(repository(), productRepository()).commentsProductDelivery(productMock._id).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });
    });


});