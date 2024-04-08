const { validateProduct } = require('../../src/validators/ProductValidator');
const {
    Product,
    CategoryProduct,
    ExtrasProduct,
    ImageMediaProduct,
    InfoProduct,
    LinkProduct,
    PromoCodeProduct
} = require('../../src/models/dto/Product');
const { DATE_FORMAT } = require('../../src/utilities/Constants');


/**
 * Mock request paylod body Product validate
 */

const infoProductMock = new InfoProduct('TestProduct', ['dev', 'software'],
    [new LinkProduct('https://github/testProducto', [{ key: 'twitter', value: '@developersenior' }])],
    'Dev productos to test', [new CategoryProduct('Software', 'NodeJS')], true);
const imagesMediaMock = new ImageMediaProduct(['https://images/1', 'https://images/2'], null, null);
const makersMock = ['@developersenior'];
const shoutoutsMock = null;
const extrasMock = new ExtrasProduct('Free', [new PromoCodeProduct('DEVPROMO', 'DEVPROMO', '2024-07-01')],
    ['I plan to seek VC funding in the near future.', 'I have raised venture-backed funding for this product.'],
    'MY FIRST COMMENT PRODUCT LAUNCH.');

describe("Product Validator Schema", () => {

    it("should validate True Product Schema", async () => {
        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = new Product.Builder()
            .withOwner('test@test.com')
            .withInfo(infoProductMock).withImagesMedia(imagesMediaMock)
            .withMakers(makersMock)
            .withShoutouts(shoutoutsMock)
            .withExtras(extrasMock).build();
        const validate = validateProduct(bodyMock);
        console.log(validate)
        expect(validate.isValid).toBe(true);

    });

    it("should validate False Product Schema, info without schema object and return Error List", async () => {

        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = new Product.Builder()
            .withOwner('test@test.com')
            .withImagesMedia(imagesMediaMock)
            .withMakers(makersMock)
            .withShoutouts(shoutoutsMock)
            .withExtras(extrasMock).build();
        const validate = validateProduct(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate email & accessToken without schema object
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual( ["must have required property 'info'"]);

    });

    it("should validate False Product Schema, invalid format date promo code object and return Error List", async () => {

        const extsMock = new ExtrasProduct('Free', [new PromoCodeProduct('DEVPROMO', 'DEVPROMO', '2024-07')],
    ['I plan to seek VC funding in the near future.', 'I have raised venture-backed funding for this product.'],
    'MY FIRST COMMENT PRODUCT LAUNCH.');
        /**
         * Mock request paylod body Product validate
         */
        const bodyMock = new Product.Builder()
            .withOwner('test@test.com')
            .withInfo(infoProductMock).withImagesMedia(imagesMediaMock)
            .withMakers(makersMock)
            .withShoutouts(shoutoutsMock)
            .withExtras(extsMock).build();
        const validate = validateProduct(bodyMock);
        expect(validate.isValid).toBe(false);
        /**
         * Validate format expirationDate schema object promoCode
         */
        expect(validate.errors).toHaveLength(1);
        expect(validate.errors).toEqual([`/extras/promoCode/0/expirationDate \"2024-07\" must match format '${DATE_FORMAT.DEFAULT}'`]);
    });


});