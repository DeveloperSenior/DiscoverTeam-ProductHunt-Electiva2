const {  validateErrors } = require('../../src/validators/RateProductValidator');


describe("Rate Product Validator Schema", () => {

    afterEach(() => {
        jest.clearAllMocks();

    });

   
    it("should validate false Rate Product Schema, invalid instance path schema return Error List", async () => {

        const validate = validateErrors([{instancePath:'error/name', message: 'error path message'}]);
        expect(validate).toHaveLength(1);
        expect(validate[0]).toBe("error/name error path message");
    });


});