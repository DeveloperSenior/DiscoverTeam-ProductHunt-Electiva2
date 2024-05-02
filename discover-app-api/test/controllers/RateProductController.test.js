const { ProductModel } = require('../../src/models/ProductModel');
const { RateProductModel } = require('../../src/models/RateProductModel');
const mockingoose = require('mockingoose');
const { Product } = require('../../src/models/dto/Product');
const { RateProduct } = require('../../src/models/dto/RateProduct');
const jwt = require('jsonwebtoken');
const httpMock = require('node-mocks-http');
const { HTTP_CODE, ERROR_MESSAGE } = require('../../src/utilities/Constants');
const DefaultException = require('../../src/models/exception/DefaultException');

const userSessionMock = { email: 'test@test.com', userId: '123123' };
const userMock = { name: 'TestUser', email: userSessionMock.email, _id: userSessionMock.userId };
const productMock = new Product.Builder()
    .withId('123123')
    .withUser(userMock)
    .withName('TestProduct')
    .withDescription('Test product mock')
    .withUrl('http://test-product-mock/url')
    .withTags(['mock', 'test']).build();
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

const commentsProductMock = [
    rateMock,
    rateMock,
    rateMock
]

describe("Rate Product Controller", () => {

    beforeEach(() => {

        mockingoose(ProductModel);
        mockingoose(RateProductModel);

        jest.mock('../../src/services/ProductService');
        const service = require('../../src/services/ProductService');
        service.mockImplementation(() => {
            return {
                createProduct: jest.fn(async (product, userSession) => productMock),
                launchProduct: jest.fn(async (product, userSession) => productMock),
                findProductsByOwner: jest.fn(async (userSession) => [productMock]),
                findLaunchedProductsPager: jest.fn(async (pageSize, pageNumber, body) => productsPagerMock),
                editProduct: jest.fn(async (_id, product, userSession) => productMock),
                removeProduct: jest.fn(async (_id, userSession) => { })
            }
        });

        jest.mock('../../src/services/RateProductService');
        const rateService = require('../../src/services/RateProductService');
        rateService.mockImplementation(() => {
            return {
                rateProduct: jest.fn(async (productId, rateProduct, userSession) => rateProductMock),
                averageRateProduct: jest.fn(async (productId) => rateProductMock),
                detailedProductDelivery: jest.fn(async (productId) => rateProductDetailedMock),
                commentsProductDelivery: jest.fn(async (productId) => commentsProductMock)
            }
        });

    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it("should method been call function rateProduct", async () => {

        const rateProductMock = new RateProduct.Builder()
            .withRate(3).build();


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: rateProductMock,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'rateProduct');
        await controller.rateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("Should method rate the product", async () => {

        const rateProductReqMock = new RateProduct.Builder()
            .withRate(3)
            .withComment('many bugs')
            .build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: rateProductReqMock,
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'rateProduct');
        await controller.rateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.CREATED);
        expect(mockResponse._getJSONData()).toEqual(rateProductMock);

    });

    it("Should method error rate the product without '_id' params", async () => {

        const rateProductReqMock = new RateProduct.Builder()
        .withRate(3)
        .withComment('many bugs')
        .build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: rateProductReqMock,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const error = {
            message: ["must have required property path '_id'"]
        }

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'rateProduct');
        await controller.rateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

    it("Should method error rate the product without body", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const error = {
            message: ["must have required property 'rate'"]
        }

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'rateProduct');
        await controller.rateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

    it("Should method error rate the product jwt expired", async () => {

        const rateProductReqMock = new RateProduct.Builder()
        .withRate(3)
        .withComment('many bugs')
        .build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: rateProductReqMock,
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = new DefaultException('jwt expired');

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'rateProduct');
        await controller.rateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

    it("should method been call function averageRateProduct", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'averageRateProduct');
        await controller.averageRateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should average Rate Product", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'averageRateProduct');
        await controller.averageRateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.CREATED);
        expect(mockResponse._getJSONData()).toEqual(rateProductMock);


    });

    it("should not average Rate Product, error params without '_id'", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = {
            message: ["must have required property path '_id'"]
        }

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'averageRateProduct');
        await controller.averageRateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should not average Rate Product with error", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const rateService = require('../../src/services/RateProductService');
        rateService.mockImplementation(() => {
            return {
                averageRateProduct: jest.fn(async (productId) => {  throw new DefaultException(ERROR_MESSAGE.DEFAULT)})
            }
        });

        const error = new DefaultException(ERROR_MESSAGE.DEFAULT);

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'averageRateProduct');
        await controller.averageRateProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method been call function detailedProductDelivery", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'detailedProductDelivery');
        await controller.detailedProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should detailed Product Delivery", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'detailedProductDelivery');
        await controller.detailedProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.OK);
        expect(mockResponse._getJSONData()).toEqual(rateProductDetailedMock);


    });

    it("should not detailed Product Delivery, error params without '_id'", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = {
            message: ["must have required property path '_id'"]
        }

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'detailedProductDelivery');
        await controller.detailedProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should not detailed Product Delivery with error", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const rateService = require('../../src/services/RateProductService');
        rateService.mockImplementation(() => {
            return {
                detailedProductDelivery: jest.fn(async (productId) => {  throw new DefaultException(ERROR_MESSAGE.DEFAULT)})
            }
        });

        const error = new DefaultException(ERROR_MESSAGE.DEFAULT);

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'detailedProductDelivery');
        await controller.detailedProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method been call function commentsProductDelivery", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'commentsProductDelivery');
        await controller.commentsProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should retrieve all Product comments", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'commentsProductDelivery');
        await controller.commentsProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.OK);
        expect(mockResponse._getJSONData()).toBeInstanceOf(Array);
        expect(mockResponse._getJSONData()).toHaveLength(3);
        expect(mockResponse._getJSONData()).toEqual(commentsProductMock);


    });

    it("should not retrieve Product comments, error params without '_id'", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = {
            message: ["must have required property path '_id'"]
        }

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'commentsProductDelivery');
        await controller.commentsProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should not retrieve Product comments with error", async () => {


        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: {_id:'123123'},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const rateService = require('../../src/services/RateProductService');
        rateService.mockImplementation(() => {
            return {
                commentsProductDelivery: jest.fn(async (productId) => {  throw new DefaultException(ERROR_MESSAGE.DEFAULT)})
            }
        });

        const error = new DefaultException(ERROR_MESSAGE.DEFAULT);

        const controller = require('../../src/controllers/RateProductController');
        const spyController = jest.spyOn(controller, 'commentsProductDelivery');
        await controller.commentsProductDelivery(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

});