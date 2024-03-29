const {Auth } = require('../../../src/models/dto/Auth');
const bcrypt = require('bcrypt');
const { decodeBase64 } = require('../../../src/utilities/Base64Util');


const authMock = {
    email: 'testUser@gmail.com',
    tokenId: 'SkRKaUpERXdKRE5VT0hKQlZuRXVSMlp4YTA1RlJFMTZURzV3V0U5Sk9GSjROVU5XYVdaQmQwVmtiRXhhV25vdVNFWTVTeTlaTmtORWVVeDU='
};

describe("Auth DTO ", () => {

    it('should create auth dto with builder method', async () => {


        const createAuthMock = new Auth.Builder()
        .withEmail('testUser@gmail.com').withTokenId('SkRKaUpERXdKRE5VT0hKQlZuRXVSMlp4YTA1RlJFMTZURzV3V0U5Sk9GSjROVU5XYVdaQmQwVmtiRXhhV25vdVNFWTVTeTlaTmtORWVVeDU=').build();
        const isEquals = await bcrypt.compare(decodeBase64(createAuthMock.tokenId), decodeBase64(authMock.tokenId));
        expect(isEquals).toBe(false);

    });

    it('should create auth dto with constructor method', async () => {

        const createAuthMock = new Auth('testUser@gmail.com','SkRKaUpERXdKRE5VT0hKQlZuRXVSMlp4YTA1RlJFMTZURzV3V0U5Sk9GSjROVU5XYVdaQmQwVmtiRXhhV25vdVNFWTVTeTlaTmtORWVVeDU=')
        const isEquals = await bcrypt.compare(decodeBase64(createAuthMock.tokenId), decodeBase64(authMock.tokenId));
        expect(isEquals).toBe(false);

    });

});