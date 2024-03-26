const request = require("supertest");
const app = require("../../../app");
const { HTTP_CODE } = require('../../../src/utilities/Constants');

beforeAll(() => {
    /** Mock spec swagger-ui-express */
    jest.mock('swagger-ui-express', () => ({
        setup: jest.fn(),
        serveFiles: jest.fn(),
      }));
    /** Mock express server */
    const app = {
        use: jest.fn(),
        listen: jest.fn(),
        address: jest.fn()
    }
    jest.doMock('express', () => {
        return () => {
            return app
        }
    });
});

describe("GET /api/v1/api-docs", () => {

    it("should retrieve something on api-docs endpoint", async () => {

      const resp = await request(app).get('/api/v1/api-docs')
      expect(resp.statusCode).toEqual(HTTP_CODE.MOVED_PERMANENTLY);
    });

    it("should return JSON swagger spec", async () => {

        const resp = await request(app).get('/api/v1/json');
        expect(resp.statusCode).toEqual(HTTP_CODE.OK);
      });

});