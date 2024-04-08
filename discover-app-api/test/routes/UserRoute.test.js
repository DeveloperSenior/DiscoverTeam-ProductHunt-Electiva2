
const mockingoose = require('mockingoose');
const request = require("supertest");
const app = require("../../app");
const { UserModel } = require('../../src/models/UserModel');
const DefaultException = require('../../src/models/exception/DefaultException');
const { HTTP_CODE } = require('../../src/utilities/Constants');
const bcrypt = require('bcrypt');
const { User } = require('../../src/models/dto/User');
const jwt = require('jsonwebtoken');

/** Mock middleware by default next true */
jest.mock('../../src/middleware/AuthMiddleware', () => jest.fn((_, __, next) => next()));

beforeAll(() => {

    /** Mock express server */
    const app = {
        use: jest.fn(),
        listen: jest.fn(),
        address: jest.fn()
    }
    jest.doMock('express', () => {
        return () => {
            return app
        }
    });

});
/**
 * Mock user mongo document 
 */
const userMock = {
    _id: 'testUser@gmail.com',
    __v: 0,
    name: 'testUser',
    nickName: "testUser",
    email: 'testUser@gmail.com',
    accessToken: 'JDJiJDEwJG1yYWxsNld1bHJwWHNZVWRZSDZhQWVGdFBkNGNYUm1lcnJmaHNXakFxL3I1UHVydlZqdm5h'
};

/**
 * Define test suite GET /api/v1/user
 */
describe("GET /api/v1/user", () => {
    beforeEach(() => jest.clearAllMocks());
    it("should return estatus code HTTP 200 OK", async () => {
        /**
         * Mock response Retrieve user with find function ODM mongoose
         */
        mockingoose(UserModel).toReturn(userMock, 'find');
        /** Mock express app request*/
        return request(app)
            .get("/api/v1/user")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.OK)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.OK);
            });
    });

    it("should return estatus code HTTP 500 ERROR", async () => {
        /**
         * Mock response Retrieve user with find function ODM mongoose as DefaultException
         */
        const errorMessage = 'Error Retrieve users';
        mockingoose(UserModel).toReturn(new Error(errorMessage), 'find');
        const excepcion = new DefaultException(errorMessage);
        /** Mock express app request*/
        return request(app)
            .get("/api/v1/user")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.ERROR)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.ERROR);
                expect(res.body).toEqual(excepcion);
            });
    });

    it("should return all Users", async () => {
        /**
         * Mock response Retrieve collection all user with find function ODM mongoose
         */
        mockingoose(UserModel).toReturn([userMock], 'find');
        /** Mock express app request*/
        return request(app)
            .get("/api/v1/user")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.OK)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.OK);
                expect(res.body).toStrictEqual([userMock]);
            });
    });

});

/**
 * Define test suite POST /api/v1/user
 */
describe("POST /api/v1/user", () => {
    beforeEach(() => jest.clearAllMocks());
    it("should return estatus code HTTP 201 CREATED", async () => {
        /**
         * Mock request paylod body User to create
         */
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin123')
            .withName('testUser').withNickName('testUser').build();

        /**
        * Mock response created user with save function ODM mongoose
        */
        mockingoose(UserModel).toReturn(userMock, 'save');
        /**
        * Mock response user with findOne to login function ODM mongoose
        */
        mockingoose(UserModel).toReturn(userMock, 'findOne');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .send(signinMock)
            .set("Accept", "application/json")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.CREATED)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.CREATED);
            });
    });

    it("should return estatus code HTTP 400 BAD REQUEST", async () => {

        /**
        * Mock response created user with save function ODM mongoose
        */
        mockingoose(UserModel).toReturn(userMock, 'save');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.BAD_REQUEST)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.BAD_REQUEST);
            });
    });

    it("should return estatus code HTTP 500 ERROR", async () => {

        /**
         * Mock request paylod body User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
            .withName('testUser').withNickName('testUser').build();
        /**
        * Mock response created user with save function ODM mongoose
        * true isn't monogo document return save function
        */
        mockingoose(UserModel).toReturn(true, 'save');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .send(signinMock)
            .set("Accept", "application/json")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.ERROR)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.ERROR);
            });
    });

    it("should signin user", async () => {

        /**
         * Mock request paylod body User to create
         */
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin123')
            .withName('testUser').withNickName('testUser').build();

        /**
        * Mock response created user with save function ODM mongoose
        * true isn't monogo document return save function
        */
        mockingoose(UserModel).toReturn(userMock, 'save');
        /**
         * Mock response user with findOne to login function ODM mongoose
         */
        mockingoose(UserModel).toReturn(userMock, 'findOne');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .send(signinMock)
            .set("Accept", "application/json")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.CREATED)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.CREATED);
                expect(res.body.email).toEqual(signinMock.email);
                expect(res.body).toHaveProperty('tokenId');
            });
    });

    it("should Unauthorized user error code HTTP 401", async () => {

        /**
         * Mock request paylod body User to create
         */
        const loginUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin12345')
            .withName('testUser').withNickName('testUser').build();
        /**
         * Mock response Retrieve collection all user with find function ODM mongoose
         */
        mockingoose(UserModel).toReturn(userMock, 'findOne');
        const tokenId = '';
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/login")
            .send(loginUserMock)
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.UNAUTHORIZED);
            });
    });

    it("should Authorized user code HTTP 200", async () => {

        /**
         * Mock request paylod body User to create
         */
        const loginUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin123')
            .withName('testUser').withNickName('testUser').build();
        /**
         * Mock response Retrieve collection all user with find function ODM mongoose
         */
        mockingoose(UserModel).toReturn(userMock, 'findOne');

        /** Mock JWT token */
        const tokenIdMock = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldkBnbWFpbC5jb20iLCJpYXQiOjE3MTIwMjY3MTQsImV4cCI6MTcxMjAzMDMxNH0.u8CJrrrVI5MnW7IKOrTWi9Yk7gqYul2tIlTFd9_5iSA';
        const sign = jest.spyOn(jwt, 'sign');
        sign.mockImplementation(() => tokenIdMock);
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/login")
            .send(loginUserMock)
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.OK)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.OK);
                expect(res.body.tokenId).toBe(tokenIdMock);
            });
    });

});
