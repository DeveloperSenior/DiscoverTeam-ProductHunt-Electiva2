const { Auth } = require('../../src/models/dto/Auth');
const { User } = require('../../src/models/dto/User');
const bcrypt = require('bcrypt');
const DefaultException = require('../../src/models/exception/DefaultException');

describe("User Service", () => {
    beforeEach(() => {

        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                createUser: jest.fn(() => false),
                getUsers: jest.fn(() => []),
                login: jest.fn()
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
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
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
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
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
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken).build();

        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const errorMock = new DefaultException('Authentication failed: Email not exist.');
        expect.assertions(2);
        await UserService(repository()).login(filterUserMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });

    });

    it("should exist the user email and authorized", async () => {

        /**
         * Mock param User to validate
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin123')
            .withName('testUser').withNickName('testUser').build();
        jest.mock('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                login: jest.fn((user) => new User.Builder()
                    .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
                    .withName('testUser').withNickName('testUser').build())
            }
        });
        const loginenticate = await UserService(repository()).login(filterUserMock);
        expect(loginenticate).toHaveProperty('email');
        expect(loginenticate).toHaveProperty('tokenId');

    });

    it("should exist the user email and unauthorized password", async () => {

        /**
         * Mock param User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const hashedTokenDifferent = await bcrypt.hash('admin12345', 10);
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
            .withName('testUser').withNickName('testUser').build();
        const findUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(hashedTokenDifferent)
            .withName('testUser').withNickName('testUser').build();
        jest.mock('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                login: jest.fn((user) => findUserMock)
            }
        });
        const errorMock = new DefaultException('Authentication failed: Incorrect password.');
        expect.assertions(2);
        await UserService(repository()).login(filterUserMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });

    });

    it("should throw an unhandled exception", async () => {

        /**
         * Mock param User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken).build();

        const UserService = require('../../src/services/UserService');
        expect.assertions(1);
        await UserService(null).login(filterUserMock).catch(error => {
            expect(error.message).toMatch('An unexpected exception was found in the application. Review details in the log');
        });

    });

});