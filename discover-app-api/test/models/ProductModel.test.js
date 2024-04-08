
const mockingoose = require('mockingoose');
const moment = require('moment');
const { DATE_FORMAT } = require('../../src/utilities/Constants');
const { ProductModel } = require('../../src/models/ProductModel');
const { Product, InfoProduct, ImageMediaProduct, ExtrasProduct, PromoCodeProduct, LinkProduct, CategoryProduct } = require('../../src/models/dto/Product');
/**
 * Mock user mongo document 
 */
const productMock = {
    "_id":  '66135f885eddc00e26f31977',
    "owner": 'test@test.com',
    "info": {
        "name": "TestProduct",
        "tags": ["dev", "software"],
        "links": [
            {
                "link": "https://github/testProducto",
                "socialMediaLink": [
                    {
                        "key": "twitter",
                        "value": "@developersenior",
                        "_id": {
                            "$oid": "660c8fbccf95ed0216a2d100"
                        }
                    }
                ],
                "_id": {
                    "$oid": "660c8fbccf95ed0216a2d0ff"
                }
            }
        ],
        "description": "Dev product to test",
        "categories": [
            {
                "category": "Software",
                "subCategory": "NodeJS",
                "_id": {
                    "$oid": "660c8fbccf95ed0216a2d101"
                }
            }
        ],
        "isOpenSource": true
    },
    "imagesMedia": {
        "linksImages": [
            "https://images/1",
            "https://images/2"
        ],
        "linkDemo": null,
        "linkVideo": null
    },
    "makers": ["@developersenior"],
    "shoutouts": null,
    "extras": {
        "pricing": "Free",
        "promoCode": [
            {
                "description": "DEVPROMO",
                "code": "DEVPROMO",
                "expirationDate": {
                    "$date": "2024-07-01T00:00:00.000Z"
                },
                "_id": {
                    "$oid": "660c8fbccf95ed0216a2d102"
                }
            }
        ],
        "fundingInfo": [
            "I plan to seek VC funding in the near future.",
            "I have raised venture-backed funding for this product."
        ],
        "firstComment": [
            "MY FIRST COMMENT PRODUCT LAUNCH."
        ]
    },
    "__v": 0
};

describe("Product Model ", () => {

    it('should save Product', async () => {

        /**
         * Mock request paylod body User to create
         */
        const infoProductMock = new InfoProduct('TestProduct', ['dev', 'software'],
            [new LinkProduct('https://github/testProducto', [{ key: 'twitter', value: '@developersenior' }])],
            'Dev productos to test', [new CategoryProduct('Software','NodeJS')], true);
        const imagesMediaMock = new ImageMediaProduct(['https://images/1', 'https://images/2'], null, null);
        const makersMock = ['@developersenior'];
        const shoutoutsMock = null;
        const extrasMock = new ExtrasProduct('Free', [new PromoCodeProduct('DEVPROMO', 'DEVPROMO', '2024-07-01')],
            ['I plan to seek VC funding in the near future.', 'I have raised venture-backed funding for this product.'],
            'MY FIRST COMMENT PRODUCT LAUNCH.');
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const createProductMock = new Product.Builder()
            .withOwner('test@test.com')
            .withUserCreate('test@test.com')
            .withCreationDate(currentDate)
            .withInfo(infoProductMock).withImagesMedia(imagesMediaMock)
            .withMakers(makersMock)
            .withShoutouts(shoutoutsMock)
            .withExtras(extrasMock).build();

        /**
        * Mock response created product with save function ODM mongoose
        */
        mockingoose(ProductModel).toReturn(productMock, 'save');
        expect.assertions(4);
        const productCreate = await new ProductModel(createProductMock).save();
        const response = productCreate.toObject();
        expect(response).toHaveProperty('_id');
        expect(response.owner).toEqual(createProductMock.owner);
        expect(response.info.name).toEqual(createProductMock.info.name);
        expect(response.info.tags).toEqual(createProductMock.info.tags);

    });

});