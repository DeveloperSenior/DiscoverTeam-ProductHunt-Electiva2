const { validateProduct } = require('../../src/validators/ProductValidator');
const {  Product } = require('../../src/models/dto/Product');
const { DATE_FORMAT } = require('../../src/utilities/Constants');


describe("Product Validator Schema", () => {

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

    it("should validate False Product Schema, invalid urland return Error List", async () => {

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


});