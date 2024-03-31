const { User } = require('../../../src/models/dto/User');
const bcrypt = require('bcrypt');

const userMock = {
    _id: 'testUser@gmail.com',
    name: 'testUser',
    nickName: "testUser",
    email: 'testUser@gmail.com',
    accessToken: 'JDJiJDEwJDNUOHJBVnEuR2Zxa05FRE16TG5wWE9JOFJ4NUNWaWZBd0VkbExaWnouSEY5Sy9ZNkNEeUx5'
};

describe("User DTO ", () => {

    it('should create user dto with builder method', async () => {

        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User.Builder()
        .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
        .withName('testUser').withNickName('testUser').build();
        const isEquals = await bcrypt.compare(createUserMock.accessToken, userMock.accessToken);
        expect(isEquals).toBe(false);

    });

    it('should create user dto with constructor method', async () => {

        const hashedToken = await bcrypt.hash('admin123', 10);
        const createUserMock = new User('testUser','testUser','testUser@gmail.com',hashedToken)
        const isEquals = await bcrypt.compare(createUserMock.accessToken, userMock.accessToken);
        expect(isEquals).toBe(false);

    });

});