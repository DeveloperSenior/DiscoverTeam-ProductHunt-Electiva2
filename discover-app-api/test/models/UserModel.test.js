
const { UserModel } = require('../../src/models/UserModel');
const mockingoose = require('mockingoose');
const { User } = require('../../src/models/dto/User');
const bcrypt = require('bcrypt');
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

describe("User Model ", () => {
    beforeEach(() => {

        mockingoose(UserModel).toReturn(userMock, 'findOne');
        mockingoose(UserModel).toReturn([userMock, userMock], 'find');

    });

    it("should Retrieve one User", async () => {
        const user = await UserModel.findOne();
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('password');
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
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const signinMock = new User.Builder()
            .withEmail('testUser@gmail.com').withPassword(hashedToken)
            .withCreatedAt(currentDate)
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        /**
        * Mock response created user with save function ODM mongoose
        */
        mockingoose(UserModel).toReturn(userMock, 'save');

        const userCreate = await new UserModel(signinMock).save();
        const response = userCreate.toObject();
        expect(response).toHaveProperty('_id');
        expect(response._id.toString()).toEqual(userMock._id);

    });

});