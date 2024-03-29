
const { UserModel } = require('../../src/models/UserModel');
const mockingoose = require('mockingoose');
const { User } = require('../../src/models/dto/User');
const { encodeBase64 } = require('../../src/utilities/Base64Util');
const bcrypt = require('bcrypt');
/**
 * Mock user mongo document 
 */
const userMock = {
    _id: '507f191e810c19729de860ea',
    __v: 0,
    name: 'testUser',
    nickName: "testUser",
    email: 'testUser@gmail.com',
    accessToken: 'SkRKaUpERXdKRE5VT0hKQlZuRXVSMlp4YTA1RlJFMTZURzV3V0U5Sk9GSjROVU5XYVdaQmQwVmtiRXhhV25vdVNFWTVTeTlaTmtORWVVeDU='
};

describe("User Model ", () => {
    beforeEach(() => {

        mockingoose(UserModel).toReturn(userMock, 'findOne');
        mockingoose(UserModel).toReturn([userMock, userMock], 'find');

    });

    it("should Retrieve one User", async () => {
        const user = await UserModel.findOne();
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('accessToken');
    });

    it("should Retrieve all User", async () => {
        const user = await UserModel.find();
        expect(user.length).toBe(2)
    });

    it("should save User", async () => {

        /**
         * Mock request paylod body User to create
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken))
            .withName('testUser').withNickName('testUser').build();

        /**
        * Mock response created user with save function ODM mongoose
        */
        mockingoose(UserModel).toReturn(userMock, 'save');

        const userCreate = await new UserModel(createUserMock).save();
        const response = userCreate.toObject();
        expect(response).toHaveProperty('_id');
        expect(response).toStrictEqual(userMock);

    });

});