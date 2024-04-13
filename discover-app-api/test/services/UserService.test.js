const { User } = require('../../src/models/dto/User');
const bcrypt = require('bcrypt');
const DefaultException = require('../../src/models/exception/DefaultException');
const { encodeBase64 } = require('../../src/utilities/Base64Util');

const tokenJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldkBnbWFpbC5jb20iLCJpYXQiOjE3MTIwMjY3MTQsImV4cCI6MTcxMjAzMDMxNH0.u8CJrrrVI5MnW7IKOrTWi9Yk7gqYul2tIlTFd9_5iSA';
/**
 * Mock user mongo document 
 */
const userMock = {
    _id: "6615b9d07547e0fc5387077c",
    userName: "testUser",
    bio: "Developer",
    avatar: "http://avatar/andres.png",
    email: "testUser@gmail.com",
    password: "JDJiJDEwJDVFTWVnQ0NvR0NKRGd0d2QvamVUc2UwUVkvak13VVEwRE9Wa1U4MXdzQ203Z0ZYZmhkMW11",
    createdAt: "2024-04-09T00:00:00.000Z"
};
describe("User Service", () => {
    beforeEach(() => {

        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                signin: jest.fn(() => false),
                getUsers: jest.fn(() => []),
                login: jest.fn()
            }
        });

    });

    afterEach(() => {

        jest.clearAllMocks();

    });

    it("should not signin user", async () => {

        /**
         * Mock param User to create
         */
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword('admin123')
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                signin: jest.fn(() => { throw new DefaultException('signin Error') }),
                getUsers: jest.fn(() => []),
                login: jest.fn()
            }
        });
        const UserService = require('../../src/services/UserService');
        const errorMock = new DefaultException('signin Error');
        await UserService(repository()).signin(signinMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMock.exception);
        });

    });

    it("should signin user", async () => {

        /**
         * Mock param User to create
         */
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword('admin123')
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        jest.mock('../../src/db/UserRepository');
        const repository = require('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        repository.mockImplementation(() => {
            return {
                signin: jest.fn(() => true),
                login: jest.fn(() => { return userMock })
            }
        });
        const signinResponse = await UserService(repository()).signin(signinMock);
        expect(signinResponse.email).toBe(signinMock.email);
        expect(signinResponse).toHaveProperty('tokenId'); // not signin and not get JWT token session login

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
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build()
            , new User.Builder()
                .withEmail('testUser2@gmail.com')
                .withUserName('testUser2').withBio('Developer2').withAvatar('http://avatar/andres2.png').build()];

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
        const filterUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword('admin123').build();

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
        .withEmail('testUser@gmail.com').withPassword('admin123')
        .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();
;
        jest.mock('../../src/db/UserRepository');
        const UserService = require('../../src/services/UserService');
        const repository = require('../../src/db/UserRepository');
        repository.mockImplementation(() => {
            return {
                login: jest.fn((user) => new User.Builder()
                    .withEmail('testUser@gmail.com').withPassword(encodeBase64(hashedToken))
                    .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build())
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
            .withEmail('testUser@gmail.com').withPassword(hashedToken)
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();
        const findUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword(encodeBase64(hashedTokenDifferent))
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();
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
            .withEmail('testUser@gmail.com').withPassword(hashedToken).build();

        const UserService = require('../../src/services/UserService');
        expect.assertions(1);
        await UserService(null).login(filterUserMock).catch(error => {
            expect(error.message).toMatch('An unexpected exception was found in the application. Review details in the log');
        });

    });

});