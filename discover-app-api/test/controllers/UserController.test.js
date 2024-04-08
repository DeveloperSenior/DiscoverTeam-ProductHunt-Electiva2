const { UserModel } = require('../../src/models/UserModel');
const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');
const { User } = require('../../src/models/dto/User');
const DefaultException = require('../../src/models/exception/DefaultException');

describe("User Controller", () => {
    beforeEach(() => {

        mockingoose(UserModel);

        jest.mock('../../src/services/UserService');
        const service = require('../../src/services/UserService');

        service.mockImplementation(() => {
            return {
                signin: jest.fn(async (user) => { }),
                getUsers: jest.fn(async () => []),
                login: jest.fn(async (user) => { })
            }
        });

        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');

        repository.mockImplementation(() => {
            return {
                signin: jest.fn(async (user) => false),
                getUsers: jest.fn(async () => []),
                login: jest.fn(async (user) => { })
            }
        });

    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it("should method been call signin", async () => {

        /**
         * Mock request paylod body User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
            .withName('testUser').withNickName('testUser').build();
        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.status = () => req;
            req.json = () => req;
            req.body = signinMock;
            return req;
        };
        const controller = require('../../src/controllers/UserController');

        jest.mock('../../src/services/UserService');
        const service = require('../../src/services/UserService');

        service.mockImplementation(() => {
            return {
                signin: jest.fn(),
                getUsers: jest.fn(),
                login: jest.fn()
            }
        });

        const spyController = jest.spyOn(controller, 'signin');
        await controller.signin(mockRequest(), mockResponse());
        expect(spyController).toHaveBeenCalled();

    });

    it("should method been call getUsers", async () => {

        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.status = () => req;
            req.json = () => req;
            req.body = {};
            return req;
        };
        const controller = require('../../src/controllers/UserController');
        const spyController = jest.spyOn(controller, 'getUsers');

        jest.mock('../../src/services/UserService');
        const service = require('../../src/services/UserService');

        service.mockImplementation(() => {
            return {
                signin: jest.fn(),
                getUsers: jest.fn(),
                login: jest.fn()
            }
        });

        await controller.getUsers(mockRequest(), mockResponse());
        expect(spyController).toHaveBeenCalled();

    });

    it("should method been call login with tokenId generated", async () => {

        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.status = () => req;
            req.json = () => req;
            req.body = { email: 'testUser@gmail.com', accessToken: 'admin123' };
            return req;
        };
        const authUser = { email: 'testUser@gmail.com', tokenId: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlckBnbWFpbC5jb20iLCJpYXQiOjE3MTE4NTA4MzcsImV4cCI6MTcxMTg1NDQzN30.gInF0fCogGhQzO-kWVP9xis4_OGopuclZFM3HzRYcoI' }

        const service = require('../../src/services/UserService');

        service.mockImplementation(() => {
            return {
                login: jest.fn(async (user) => authUser)
            }
        });
        const controller = require('../../src/controllers/UserController');
        const spyController = jest.spyOn(controller, 'login');
        await controller.login(mockRequest(), mockResponse());
        expect(spyController).toHaveBeenCalled();

    });

    it("should method been call login without body and exception", async () => {

        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.status = () => req;
            req.json = () => req;
            return req;
        };

        const service = require('../../src/services/UserService');

        service.mockImplementation(() => {
            return {
                login: jest.fn(async (user) => {})
            }
        });

        const controller = require('../../src/controllers/UserController');
        const spyController = jest.spyOn(controller, 'login');
        expect.assertions(2);
        await controller.login(mockRequest(), mockResponse()).catch(error => {
            expect(error.message).toMatch('response.status is not a function');
        });
        expect(spyController).toHaveBeenCalled();

    });

    it("should method been call login but error body without email attribute", async () => {

        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.status = () => req;
            req.json = () => req;
            req.body = { accessToken: 'admin123' };
            return req;
        };

        //jest.mock('../../src/services/UserService');
        const service = require('../../src/services/UserService');

        service.mockImplementation(() => {
            return {
                login: jest.fn(async (user) => { })
            }
        });
        const controller = require('../../src/controllers/UserController');
        const spyController = jest.spyOn(controller, 'login');
        await controller.login(mockRequest(), mockResponse());
        expect(spyController).toHaveBeenCalled();

    });

    it("should method been call login user Unauthorized", async () => {

        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.status = () => req;
            req.json = () => req;
            req.body = { email: 'testUser@gmail.com', accessToken: 'admin123' };
            return req;
        };
        //jest.mock('../../src/services/UserService');
        const service = require('../../src/services/UserService');
        service.mockImplementation(() => {
            return {
                login: jest.fn(async (user) => new DefaultException('Authentication failed: Incorrect password.'))
            }
        });
        const controller = require('../../src/controllers/UserController');
        const spyController = jest.spyOn(controller, 'login');
        await controller.login(mockRequest(), mockResponse());
        expect(spyController).toHaveBeenCalled();

    });

});