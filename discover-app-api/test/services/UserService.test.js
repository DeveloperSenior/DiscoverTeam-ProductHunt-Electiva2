const { User } = require('../../src/models/UserModel');
const { encodeBase64 } = require('../../src/utilities/Base64Util');

describe("User Service", () => {
    beforeEach(() => {

        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                createUser: jest.fn(() => false),
                getUsers: jest.fn(() => [])
            }
        });

    });

    afterEach(() => {

        jest.clearAllMocks();

    });

    it("should not create the user", async () => {

        /**
         * Mock param User to create
         */
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64('admin123'))
            .withName('testUser').withNickName('testUser').build();
        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const isCreate = await UserService(repository()).createUser(createUserMock);
        expect(isCreate).toBe(false);

    });

    it("should create the user", async () => {

        /**
         * Mock param User to create
         */
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64('admin123'))
            .withName('testUser').withNickName('testUser').build();
        jest.mock('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        UserService.mockImplementation(() => {
            return {
                createUser: jest.fn(() => true),
                getUsers: jest.fn(() => [])
            }
        });
        const isCreate = await UserService(repository()).createUser(createUserMock);
        expect(isCreate).toBe(true);

    });

    it("should get user empty list", async () => {
        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const users = await UserService(repository()).getUsers();
        expect(users).toEqual([]);

    });

    it("should get all users ", async () => {
        /**
         * Mock param User to retrieve list
         */
        const listUsersMock = [new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64('admin123'))
            .withName('testUser').withNickName('testUser').build(), new User.Builder()
                .withEmail('testUser2@gmail.com').withAccessToken(encodeBase64('admin123341'))
                .withName('testUser2').withNickName('testUser2').build()];
        jest.mock('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        UserService.mockImplementation(() => {
            return {
                createUser: jest.fn(() => true),
                getUsers: jest.fn(() => listUsersMock)
            }
        });
        const usersResponse = UserService(repository()).getUsers();
        expect(usersResponse).toEqual(listUsersMock);
    });

});