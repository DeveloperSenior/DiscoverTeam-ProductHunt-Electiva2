const { UserModel, User } = require('../../src/models/UserModel');
const { encodeBase64 } = require('../../src/utilities/Base64Util');
const mockingoose = require('mockingoose');

describe("User Controller", () => {
    beforeEach(() => {

        mockingoose(UserModel);

        jest.mock('../../src/services/UserService');
        const service = require('../../src/services/UserService');
        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');

        service.mockImplementation(() => {
            return {
                createUser: jest.fn(),
                getUsers: jest.fn()
            }
        });

        repository.mockImplementation(() => {
            return {
                createUser: jest.fn(),
                getUsers: jest.fn()
            }
        });

    });

    it("should method been call createUser", async () => {

        /**
         * Mock request paylod body User to create
         */
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64('admin123'))
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
            // replace the following () => req
            // with your function stub/mock of choice
            // making sure they still return `req`
            req.status = () => req;
            req.json = () => req;
            req.body = createUserMock;
            return req;
            };
            const controller = require('../../src/controllers/UserController');
            const spyController = jest.spyOn(controller, 'createUser');
            await controller.createUser(mockRequest(), mockResponse());
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
                // replace the following () => req
                // with your function stub/mock of choice
                // making sure they still return `req`
                req.status = () => req;
                req.json = () => req;
                req.body = {};
                return req;
                };
                const controller = require('../../src/controllers/UserController');
                const spyController = jest.spyOn(controller, 'getUsers');
                await controller.getUsers(mockRequest(), mockResponse());
                expect(spyController).toHaveBeenCalled();
    
            });

});