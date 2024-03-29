const { Auth } = require('../../src/models/dto/Auth');
const { User } = require('../../src/models/dto/User');
const { encodeBase64 } = require('../../src/utilities/Base64Util');
const bcrypt = require('bcrypt');

describe("User Service", () => {
    beforeEach(() => {

        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                createUser: jest.fn(() => false),
                getUsers: jest.fn(() => []),
                userAuth: jest.fn()
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
        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken))
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
        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken))
            .withName('testUser').withNickName('testUser').build();
        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        repository.mockImplementation(() => {
            return {
                createUser: jest.fn(() => true)
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
            .withEmail('testUser@gmail.com')
            .withName('testUser').withNickName('testUser').build(), new User.Builder()
                .withEmail('testUser2@gmail.com')
                .withName('testUser2').withNickName('testUser2').build()];

        jest.mock('../../src/db/UserRepository');

        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        repository.mockImplementation(() => {
            return {
                getUsers: jest.fn(() => listUsersMock)
            }
        });
        const usersResponse = await UserService(repository()).getUsers();
        expect(usersResponse).toEqual(listUsersMock);
    });

    it("should not exist the user email and unauthorized", async () => {

        /**
         * Mock param User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken)).build();

        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');

        const userFind = await UserService(repository()).login(filterUserMock);
        expect(userFind).not.toHaveProperty('tokenId');

    });

    it("should exist the user email and authorized", async () => {

        /**
         * Mock param User to validate
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken))
            .withName('testUser').withNickName('testUser').build();
        jest.mock('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                userAuth: jest.fn(() => filterUserMock)
            }
        });
        const userAuthenticate = await UserService(repository()).login(filterUserMock);
        expect(userAuthenticate).toHaveProperty('email');
        expect(userAuthenticate).toHaveProperty('tokenId');

    });

    it("should exist the user email and unauthorized password", async () => {

        /**
         * Mock param User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const hashedTokenDifferent = await bcrypt.hash('admin12345', 10);
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken))
            .withName('testUser').withNickName('testUser').build();
        const findUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedTokenDifferent))
            .withName('testUser').withNickName('testUser').build();
        jest.mock('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                userAuth: jest.fn(() => findUserMock)
            }
        });
        const userUnauthorized = await UserService(repository()).login(filterUserMock);
        expect(userUnauthorized).not.toHaveProperty('email');
        expect(userUnauthorized).not.toHaveProperty('tokenId');

    });

});