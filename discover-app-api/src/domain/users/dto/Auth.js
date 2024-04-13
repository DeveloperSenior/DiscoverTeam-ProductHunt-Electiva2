"use strict";

/**
 * AuthModel Model builder object
 */
class Auth {

    constructor(email, tokenId) {

        this.email = email;
        this.tokenId = tokenId;
        
    }

    static Builder = class {

        constructor() {

            this.auth = new Auth();

        }

        withEmail(email) {
            this.auth.email = email;
            return this;

        }

        withTokenId(tokenId) {

            this.auth.tokenId = tokenId;

            return this;

        }

        build() {

            return this.auth;

        }
    }
}

module.exports = { Auth }