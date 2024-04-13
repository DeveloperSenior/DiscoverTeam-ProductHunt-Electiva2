const { User } = require('../../../src/models/dto/User');
const bcrypt = require('bcrypt');

const userMock =     {
    _id: "6615b9d07547e0fc5387077c",
    userName: "testUser",
    bio: "Developer",
    avatar: "http://avatar/andres.png",
    email: "testUser@gmail.com",
    password: "JDJiJDEwJDVFTWVnQ0NvR0NKRGd0d2QvamVUc2UwUVkvak13VVEwRE9Wa1U4MXdzQ203Z0ZYZmhkMW11",
    createdAt: "2024-04-09T00:00:00.000Z"
};

describe("User DTO ", () => {

    it('should create user dto with builder method', async () => {

        const hashedToken = await bcrypt.hash('admin123', 10);
        const signinMock = new User.Builder()
        .withEmail('testUser@gmail.com').withPassword(hashedToken)
        .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();
        const isEquals = await bcrypt.compare(signinMock.password, userMock.password);
        expect(isEquals).toBe(false);

    });

    it('should create user dto with constructor method', async () => {

        const hashedToken = await bcrypt.hash('admin123', 10);
        const signinMock = new User('6615b9d07547e0fc5387077c','testUser','Developer','http://avatar/andres.png','testUser@gmail.com',hashedToken)
        const isEquals = await bcrypt.compare(signinMock.password, userMock.password);
        expect(isEquals).toBe(false);

    });

});