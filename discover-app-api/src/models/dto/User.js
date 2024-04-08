"use strict";

const { encodeBase64 } = require('../../utilities/Base64Util');

/**
 * User Model builder object
 */
class User {
    constructor(name, nickName, email, accessToken) {
        this.name = name;
        this.nickName = nickName;
        this.email = email;
        this._id = email;
        this.accessToken = accessToken ;
    }
    static Builder = class {
        constructor() {

            this.user = new User();

        }
        withName(name) {

            this.user.name = name;

            return this;

        }
        withNickName(nickName) {

            this.user.nickName = nickName;

            return this;

        }
        withEmail(email) {
            this.user.email = email;
            this.user._id = email; // _id in Mongodb Document
            return this;

        }
        withAccessToken(accessToken) {

            this.user.accessToken = accessToken;

            return this;

        }

        build() {

            return this.user;

        }
    };
}

module.exports = { User }