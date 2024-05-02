const {getSession} = require('../../src/utilities/Utilities');
const httpMock = require('node-mocks-http');


describe("Utilities", () => {

    it("should return null get Session", async () => {
        const mockRequest = httpMock.createRequest({
            headers: {}
        });
        const response = getSession(mockRequest);
        expect(response).toBeNull()
    });

});