const { validateProduct, validateEditProduct, validateErrors } = require('../../src/validators/ProductValidator');
const {  Product } = require('../../src/models/dto/Product');


describe("Product Validator Schema", () => {

    afterEach(() => {
        jest.clearAllMocks();

    });

    it("should validate True Product Schema", async () => {
        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = new Product.Builder()
            .withName('test')
            .withDescription('test')
            .withUrl('http://test')
            .withTags(['dev','test']).build();
        const validate = validateProduct(bodyMock);
        expect(validate.isValid).toBe(true);

    });

    it("should validate False Product Schema, name without schema object and return Error List", async () => {

        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = new Product.Builder()
        .withDescription('test')
        .withUrl('http://test')
        .withTags(['dev','test']).build();
        const validate = validateProduct(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate email & password without schema object
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual( ["must have required property 'name'"]);

    });

    it("should validate False Product Schema, invalid url and return Error List", async () => {

        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = new Product.Builder()
        .withName('test')
        .withDescription('test')
        .withTags(['dev','test']).build();
        const validate = validateProduct(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate format expirationDate schema object promoCode
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual( ["must have required property 'url'"]);
    });

    it("should validate False Product Schema, invalid all paths schema return Error List", async () => {

        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = {}
        const validate = validateProduct(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate format expirationDate schema object promoCode
         */
        expect(validate.errors).toHaveLength(4);
        expect(validate.errors).toEqual( ["must have required property 'name'", "must have required property 'description'", "must have required property 'url'", "must have required property 'tags'"]);
    });

    it("should validate edit Product Schema, invalid body return Error List", async () => {

        /**
         * Mock request paylod body Product validate
         */
        const validate = validateEditProduct('123123',null);
        expect(validate.isValid).toBe(false);
        /**
         * Validate format expirationDate schema object promoCode
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual( ["must have required body request"]);
    });

    it("should validate false Product Schema, invalid instance path schema return Error List", async () => {

        const validate = validateErrors([{instancePath:'error/name', message: 'error path message'}]);
        expect(validate).toHaveLength(1);
        expect(validate[0]).toBe("error/name error path message");
    });


});