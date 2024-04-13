const jwt = require('jsonwebtoken');
const verifyTokenSession = require('../../src/middleware/AuthMiddleware');
const DefaultException = require('../../src/models/exception/DefaultException');

const tokenJWTMock = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldkBnbWFpbC5jb20iLCJpYXQiOjE3MTIwMjY3MTQsImV4cCI6MTcxMjAzMDMxNH0.u8CJrrrVI5MnW7IKOrTWi9Yk7gqYul2tIlTFd9_5iSA'

/**
 * Define test suite POST /api/v1/user
 */
describe("AuthMiddleware", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Authorized JWT token',() => {
        const mockResponse = () => {
            const res = {};
            // replace the following () => res
            // with your function stub/mock of choice
            // making sure they still return `res`
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            
            req.header = jest.fn((header)=> tokenJWTMock)
            req.status = () => req;
            req.json = () => req;
            req.body = { email: 'testUser@gmail.com', password: 'admin123' };
            return req;
        };
        expect.assertions(2);
        const mockNext = jest.fn();
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => () => ({ verified: 'true' }));
        verifyTokenSession(mockRequest(),mockResponse(),mockNext);
        expect(verify).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled(); //if next function is call, token valid

    });

    it('Unauthorized JWT token',() => {
        const mockResponse = () => {
            const res = {};
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            req.header = jest.fn((header)=> tokenJWTMock)
            req.status = () => req;
            req.json = () => req;
            req.body = { email: 'testUser@gmail.com', password: 'admin123' };
            return req;
        };
        expect.assertions(2);
        const mockNext = jest.fn();
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => { throw new DefaultException('Invalid token')});
        verifyTokenSession(mockRequest(),mockResponse(),mockNext);
        expect(verify).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled(); //if next function is call, token is valid
    });

    it('Without header Bearer JWT token',() => {
        const mockResponse = () => {
            const res = {};
            res.status = () => res;
            res.json = () => res;
            return res;
        };
        const mockRequest = () => {
            const req = {};
            req.header = jest.fn()
            req.status = () => req;
            req.json = () => req;
            req.body = { email: 'testUser@gmail.com', password: 'admin123' };
            return req;
        };
        expect.assertions(2);
        const mockNext = jest.fn();
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => { throw new DefaultException('Invalid token')});
        verifyTokenSession(mockRequest(),mockResponse(),mockNext);
        expect(verify).not.toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled(); //if next function is call, token is valid
    });


});