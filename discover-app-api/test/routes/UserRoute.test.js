
const mockingoose = require('mockingoose');
const request = require("supertest");
const app = require("../../app");
const { UserModel, User } = require('../../src/models/UserModel');
const DefaultException = require('../../src/models/exception/DefaultException');
const { HTTP_CODE } = require('../../src/utilities/Constants');
const { encodeBase64 } = require('../../src/utilities/Base64Util');

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
    _id: '507f191e810c19729de860ea',
    __v: 0,
    name: 'testUser',
    nickName: "testUser",
    email: 'testUser@gmail.com',
    accessToken: 'YWRtaW4xMjM0NTY3'
};

/**
 * Define test suite GET /api/v1/user
 */
describe("GET /api/v1/user", () => {

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
    it("should return estatus code HTTP 201 CREATED", async () => {
        /**
         * Mock request paylod body User to create
         */
        createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('YWRtaW4xMjM0NTY3')
            .withName('testUser').withNickName('testUser').build();

        /**
        * Mock response created user with save function ODM mongoose
        */
        mockingoose(UserModel).toReturn(userMock, 'save');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .send(createUserMock)
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
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64('admin123'))
            .withName('testUser').withNickName('testUser').build();
        /**
        * Mock response created user with save function ODM mongoose
        * true isn't monogo document return save function
        */
        mockingoose(UserModel).toReturn(true, 'save');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .send(createUserMock)
            .set("Accept", "application/json")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.ERROR)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.ERROR);
            });
    });

    it("should create a user", async () => {

        /**
         * Mock request paylod body User to create
         */
        createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64('admin123'))
            .withName('testUser').withNickName('testUser').build();
        /**
        * Mock response created user with save function ODM mongoose
        * true isn't monogo document return save function
        */
        mockingoose(UserModel).toReturn(createUserMock, 'save');
        /** Mock express app request*/
        return request(app)
            .post("/api/v1/user")
            .send(createUserMock)
            .set("Accept", "application/json")
            .expect('Content-Type', /json/)
            .expect(HTTP_CODE.CREATED)
            .then((res) => {
                expect(res.statusCode).toBe(HTTP_CODE.CREATED);
                expect(res.body).toEqual(createUserMock);
            });
    });


});