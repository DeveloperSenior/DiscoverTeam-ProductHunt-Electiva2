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
            .withEmail('testUser@gmail.com').withPassword(hashedToken)
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(true);
    });

    it("should validate False User Schema, email & password without schema object and return Error List", async () => {
        /**
         * Mock request paylod body User validate
         */
        const bodyMock = new User.Builder()
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate email & password without schema object
         */
        expect(validate.errors).toHaveLength(2);
        expect(validate.errors).toEqual(expect.arrayContaining(
            ["must have required property 'password'",
                "must have required property 'email'"]));

    });

    it("should validate False User Schema, email without schema object and return Error List", async () => {
        /**
         * Mock request paylod body User validate
         */
        const hashedToken = await bcrypt.hash('admin123', 10);
        const bodyMock = new User.Builder().withPassword(hashedToken)
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate email without schema object
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual(expect.arrayContaining(["must have required property 'email'"]));
    });

    it("should validate False User Schema, password without schema object and return Error List", async () => {
        /**
         * Mock request paylod body User validate
         */
        const bodyMock = new User.Builder().withEmail('testUser@gmail.com')
            .withUserName('testUser').withBio('Developer').withAvatar('http://avatar/andres.png').build();

        const validate = validateUser(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate password without schema object
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual(expect.arrayContaining(["must have required property 'password'"]));
    });


});