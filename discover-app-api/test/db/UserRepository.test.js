const { UserModel } = require('../../src/models/UserModel');
const mockingoose = require('mockingoose');
const { User } = require('../../src/models/dto/User');
const DefaultException = require('../../src/models/exception/DefaultException');


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
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin123')
            .withName('testUser').withNickName('testUser').build();
        const UserRepository = require('../../src/db/UserRepository');

        try {
            await UserRepository(UserModel).createUser(createUserMock);
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
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken('admin123')
            .withName('testUser').withNickName('testUser').build();
        const UserRepository = require('../../src/db/UserRepository');
        const isCreate = await UserRepository(UserModel).createUser(createUserMock);
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
