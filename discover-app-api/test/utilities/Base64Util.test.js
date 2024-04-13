const {encodeBase64, decodeBase64toAscii, decodeBase64} = require('../../src/utilities/Base64Util');

describe("Base64Util Utilities", () => {

    it("should encode base64 text basic", async () => {
        const text = 'admin123';
        const mockEncode = 'YWRtaW4xMjM=';
        const encodeBasic = encodeBase64(text);
        expect(encodeBasic).toEqual(mockEncode)
    });

    it("should decode text base64 basic ", async () => {
        const textEncode = 'YWRtaW4xMjM=';
        const mockDecode = 'admin123';
        const decodeBasic = decodeBase64(textEncode);
        expect(decodeBasic).toEqual(mockDecode)
    });

    it("should decode text base64 to Ascii ", async () => {
        const textEncode = 'YWRtaW4xMjM=';
        const mockDecode = 'admin123';
        const decodeBasic = decodeBase64toAscii(textEncode);
        expect(decodeBasic).toEqual(mockDecode)
    });

});