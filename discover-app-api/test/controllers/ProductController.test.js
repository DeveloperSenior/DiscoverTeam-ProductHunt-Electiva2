const { ProductModel } = require('../../src/models/ProductModel');
const mockingoose = require('mockingoose');
const { Product } = require('../../src/models/dto/Product');
const jwt = require('jsonwebtoken');
const httpMock = require('node-mocks-http');
const { HTTP_CODE, ERROR_MESSAGE } = require('../../src/utilities/Constants');
const DefaultException = require('../../src/models/exception/DefaultException');



const userSessionMock = { email: 'test@test.com', userId: '123123' };
const productMock = new Product.Builder()
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

describe("Product Controller", () => {

    beforeEach(() => {

        mockingoose(ProductModel);

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

    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it("should method been call function createProduct", async () => {

        const productMock = new Product.Builder()
            .withName('TestProduct')
            .withDescription('Test product mock')
            .withUrl('http://test-product-mock/url')
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productMock,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'createProduct');
        await controller.createProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should method been create Product", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productMock,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'createProduct');
        await controller.createProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.CREATED);
        expect(mockResponse._getJSONData()).toEqual(productMock);


    });

    it("should method not been create Product with error", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productMock,
            headers: { 'Authorization': 'Bearer' }

        });
        const error = new DefaultException('jwt must be provided');

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'createProduct');
        await controller.createProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method not been create Product with error payload", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: {},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const error = {
            message: [
                "must have required property 'name'",
                "must have required property 'description'",
                "must have required property 'url'",
                "must have required property 'tags'",
            ]
        }

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'createProduct');
        await controller.createProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method been call launchProduct", async () => {

        const productMock = new Product.Builder()
            .withId('123123').build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productMock,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'launchProduct');
        await controller.launchProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should method been launch Product", async () => {

        const productLaunchMock = new Product.Builder()
            .withId('123123').build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productLaunchMock,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'launchProduct');
        await controller.launchProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.CREATED);
        expect(mockResponse._getJSONData()).toEqual(productMock);


    });

    it("should method not been launch Product error", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: {},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const error = { message: ["must have required property '_id'"] };

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'launchProduct');
        await controller.launchProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method not been launch Product error payload", async () => {

        const productLaunchMock = new Product.Builder().build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productLaunchMock,
            headers: { 'Authorization': 'Bearer' }

        });

        const error = new DefaultException('jwt must be provided');

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'launchProduct');
        await controller.launchProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method been call findProductsByOwner", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findProductsByOwner');
        await controller.findProductsByOwner(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should method been find Products By Owner", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findProductsByOwner');
        await controller.findProductsByOwner(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.OK);
        expect(mockResponse._getJSONData()).toEqual([productMock]);


    });

    it("should method not been find Products By Owner with error jwt expired", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });
        const error = new DefaultException('jwt expired');
        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findProductsByOwner');
        await controller.findProductsByOwner(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method been call findLaunchedProductsPager", async () => {

        const productFilterMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productFilterMock,
            params: { pageSize: 1, pageNumber: 1 },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findLaunchedProductsPager');
        await controller.findLaunchedProductsPager(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should method been find Launched Products Pager data", async () => {

        const productFilterMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productFilterMock,
            params: { pageSize: 1, pageNumber: 1 },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findLaunchedProductsPager');
        await controller.findLaunchedProductsPager(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.OK);
        expect(mockResponse._getJSONData()).toBeInstanceOf(Array);
        expect(mockResponse._getJSONData()).toHaveLength(1);
        expect(mockResponse._getJSONData()[0]).toHaveProperty('totalPage', 1);
        expect(mockResponse._getJSONData()[0]).toHaveProperty('data');

    });

    it("should method been find Launched Products Pager params error", async () => {

        const productFilterMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productFilterMock,
            params: {},
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = {
            message: ["must have required property path 'pageSize'",
                "must have required property path 'pageNumber'"]
        };

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findLaunchedProductsPager');
        await controller.findLaunchedProductsPager(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

    it("should method been find Launched Products Pager error", async () => {

        const productFilterMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productFilterMock,
            params: { pageSize: 1, pageNumber: 1 },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const service = require('../../src/services/ProductService');
        service.mockImplementation(() => {
            return {
                findLaunchedProductsPager: jest.fn(async (pageSize, pageNumber, body) => {
                    throw new DefaultException(ERROR_MESSAGE.DEFAULT)
                }),
            }
        });

        const error = new DefaultException(ERROR_MESSAGE.DEFAULT);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'findLaunchedProductsPager');
        await controller.findLaunchedProductsPager(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

    it("should method been call editProduct", async () => {

        const productEditrMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productEditrMock,
            params: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'editProduct');
        await controller.editProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should method been edit Product", async () => {

        const productEditrMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: productEditrMock,
            params: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });


        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'editProduct');
        await controller.editProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.CREATED);
        expect(mockResponse._getJSONData()).toEqual(productMock);


    });

    it("should method not been edit Product without '_id' & 'body' param error", async () => {

        const productEditrMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: null,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });


        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const error = { message: ["must have required property path '_id'"] };

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'editProduct');
        await controller.editProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method not been edit Product without error jwt expired", async () => {

        const productEditrMock = new Product.Builder()
            .withTags(['mock', 'test']).build();

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            body: null,
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = new DefaultException('jwt expired');

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'editProduct');
        await controller.editProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);


    });

    it("should method been call removeProduct", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'removeProduct');
        await controller.removeProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();


    });

    it("should method been remove Product", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            params: { _id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'removeProduct');
        await controller.removeProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.CREATED);


    });

    it("should method not been remove Product without '_id' param error", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => userSessionMock);

        const error = { message: ["must have required property path '_id'"] };

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'removeProduct');
        await controller.removeProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.BAD_REQUEST);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

    it("should method not been remove Product error jwt expired", async () => {

        const mockResponse = httpMock.createResponse();

        const mockRequest = httpMock.createRequest({
            headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }
        });

        const error = new DefaultException('jwt expired');

        const controller = require('../../src/controllers/ProductController');
        const spyController = jest.spyOn(controller, 'removeProduct');
        await controller.removeProduct(mockRequest, mockResponse);
        expect(spyController).toHaveBeenCalled();
        expect(mockResponse.statusCode).toEqual(HTTP_CODE.ERROR);
        expect(mockResponse._getJSONData()).toEqual(error);

    });

});