const { validateUser } = require('../../src/validators/UserValidator');
const { User } = require('../../src/models/dto/User');
const bcrypt = require('bcrypt');

describe("User Validator Schema", () => {

    it("should validate True User Schema", async () => {
        /**
         * Mock request paylod body User validate
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const bodyMock = new User.Builder()
            .withEmail('testUser@gmail.com').withAccessToken(hashedToken)
            .withName('testUser').withNickName('testUser').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(true);
    });

    it("should validate False User Schema, email & accessToken without schema object and return Error List", async () => {
        /**
         * Mock request paylod body User validate
         */
        const bodyMock = new User.Builder()
            .withName('testUser').withNickName('testUser').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate email & accessToken without schema object
         */
        expect(validate.errors).toHaveLength(2);
        expect(validate.errors).toEqual(expect.arrayContaining(
            ["must have required property 'accessToken'",
                "must have required property 'email'"]));

    });

    it("should validate False User Schema, email without schema object and return Error List", async () => {
        /**
         * Mock request paylod body User validate
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const bodyMock = new User.Builder().withAccessToken(hashedToken)
            .withName('testUser').withNickName('testUser').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate email without schema object
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual(expect.arrayContaining(["must have required property 'email'"]));
    });

    it("should validate False User Schema, accessToken without schema object and return Error List", async () => {
        /**
         * Mock request paylod body User validate
         */
        const bodyMock = new User.Builder().withEmail('testUser@gmail.com')
            .withName('testUser').withNickName('testUser').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate accessToken without schema object
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual(expect.arrayContaining(["must have required property 'accessToken'"]));
    });


});