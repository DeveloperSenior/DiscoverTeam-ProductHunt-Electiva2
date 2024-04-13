const {Auth } = require('../../../src/models/dto/Auth');
const bcrypt = require('bcrypt');

const authMock = {
    email: 'testUser@gmail.com',
    tokenId: 'JDJiJDEwJDNUOHJBVnEuR2Zxa05FRE16TG5wWE9JOFJ4NUNWaWZBd0VkbExaWnouSEY5Sy9ZNkNEeUx5'
};

describe("Auth DTO ", () => {

    it('should create auth dto with builder method', async () => {


        const createAuthMock = new Auth.Builder()
        .withEmail('testUser@gmail.com').withTokenId('JDJiJDEwJDNUOHJBVnEuR2Zxa05FRE16TG5wWE9JOFJ4NUNWaWZBd0VkbExaWnouSEY5Sy9ZNkNEeUx5').build();
        const isEquals = await bcrypt.compare(createAuthMock.tokenId, authMock.tokenId);
        expect(isEquals).toBe(false);

    });

    it('should create auth dto with constructor method', async () => {

        const createAuthMock = new Auth('testUser@gmail.com','JDJiJDEwJDNUOHJBVnEuR2Zxa05FRE16TG5wWE9JOFJ4NUNWaWZBd0VkbExaWnouSEY5Sy9ZNkNEeUx5')
        const isEquals = await bcrypt.compare(createAuthMock.tokenId, authMock.tokenId);
        expect(isEquals).toBe(false);

    });

});