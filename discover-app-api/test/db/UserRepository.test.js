const { UserModel } = require('../../src/models/UserModel');
const mockingoose = require('mockingoose');
const { User } = require('../../src/models/dto/User');
const DefaultException = require('../../src/models/exception/DefaultException');
const moment = require('moment');
const { DATE_FORMAT } = require('../../src/utilities/Constants');

/**
 * Mock user mongo document 
 */
const userMock =     {
    _id: "6615b9d07547e0fc5387077c",
    userName: "testUser",
    bio: "Developer",
    avatar: "http://avatar/andres.png",
    email: "testUser@gmail.com",
    password: "JDJiJDEwJDVFTWVnQ0NvR0NKRGd0d2QvamVUc2UwUVkvak13VVEwRE9Wa1U4MXdzQ203Z0ZYZmhkMW11",
    createdAt: "2024-04-09T00:00:00.000Z"
};

describe("User Repository DB", () => {

    afterEach(() => {

        jest.clearAllMocks();

    });

    it("should not create the user", async () => {

        /**
         * Mock response created user with save function ODM mongoose
         * true isn't monogo document return save function
         */
        mockingoose(UserModel).toReturn(true, 'save');
        /**
         * Mock param User to create
         */
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword('admin123')
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();
        const UserRepository = require('../../src/db/UserRepository');

        try {
            await UserRepository(UserModel).signin(signinMock);
          } catch (error) {
            expect(error.code).toEqual('API-01-001');
          }
    });

    it("should create the user", async () => {

        /**
         * Mock response created user with save function ODM mongoose
         * true isn't monogo document return save function
         */
        mockingoose(UserModel).toReturn(userMock, 'save');
        /**
         * Mock param User to create
         */
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword('admin123')
            .withUserName('testUser').withCreatedAt(currentDate).withBio('Developer').withAvatar('http://avatar/andres.png').build();
        const UserRepository = require('../../src/db/UserRepository');
        const isCreate = await UserRepository(UserModel).signin(signinMock);
        expect(isCreate).toBe(true);

    });

    it("should empty user list", async () => {
        /**
         * Mock response empty user list with find function ODM mongoose
         */
        mockingoose(UserModel).toReturn([], 'find');
        const UserRepository = require('../../src/db/UserRepository');
        const emptyList = await UserRepository(UserModel).getUsers();
        expect(emptyList).toEqual([]);

    });

    it("should all user list", async () => {
        /**
         * Mock response all user list with find function ODM mongoose
         */
        mockingoose(UserModel).toReturn([userMock], 'find');
        const UserRepository = require('../../src/db/UserRepository');
        const userList = await UserRepository(UserModel).getUsers();
        expect(userList).toHaveLength(1);

    });

    it("should not exist email and throw login exception", async () => {
        /**
         * Mock response all user list with find function ODM mongoose
         */
        const errorMessage = 'Error Retrieve user email';
        mockingoose(UserModel).toReturn(new Error(errorMessage), 'findOne');
        const UserRepository = require('../../src/db/UserRepository');
        const emailMock = 'mock@mock.com';
        expect.assertions(2);
        await UserRepository(UserModel).login(emailMock).catch(error => {
            expect(error).toBeInstanceOf(DefaultException);
            expect(error.exception).toMatch(errorMessage);
        });

    });

});
