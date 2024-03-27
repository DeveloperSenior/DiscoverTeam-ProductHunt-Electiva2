const {UserModel, User } = require('../../src/models/UserModel');
const { encodeBase64, decodeBase64 } = require('../../src/utilities/Base64Util');
const bcrypt = require('bcrypt');

const userMock = {
    _id: 'testUser@gmail.com',
    name: 'testUser',
    nickName: "testUser",
    email: 'testUser@gmail.com',
    accessToken: 'SkRKaUpERXdKRE5VT0hKQlZuRXVSMlp4YTA1RlJFMTZURzV3V0U5Sk9GSjROVU5XYVdaQmQwVmtiRXhhV25vdVNFWTVTeTlaTmtORWVVeDU='
};

describe("User Model ", () => {

    it('should create user model with builder method', async () => {

        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User.Builder()
        .withEmail('testUser@gmail.com').withAccessToken(encodeBase64(hashedToken))
        .withName('testUser').withNickName('testUser').build();
        const isEquals = await bcrypt.compare(decodeBase64(createUserMock.accessToken), decodeBase64(userMock.accessToken));
        expect(isEquals).toBe(false);

    });

    it('should create user model with constructor method', async () => {

        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User('testUser','testUser','testUser@gmail.com',hashedToken)
        const isEquals = await bcrypt.compare(decodeBase64(createUserMock.accessToken), decodeBase64(userMock.accessToken));
        expect(isEquals).toBe(false);

    });

});