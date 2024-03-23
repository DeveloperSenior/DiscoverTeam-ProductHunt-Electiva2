"use strict";

const { Schema, model } = require('mongoose');
const { encodeBase64 } = require('../utilities/Base64Util');

/**
 * User Model builder object
 */
class User {
    constructor(name, nickName, email, accessToken) {
        this.name = name;
        this.nickName = nickName;
        this.email = email;
        this._id = email;
        this.accessToken = accessToken ? encodeBase64(accessToken) : accessToken;
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

            this.user.accessToken = encodeBase64(accessToken);

            return this;

        }

        build() {

            return this.user;

        }
    };
}

/** 
 * User Model ODM builder Schema
 */
const userSchema = new Schema(
    {
        _id: String,
        name: String,
        nickName: String,
        email: String,
        accessToken: String
    }
);

userSchema.loadClass(User);

const UserModel = model('User', userSchema);

module.exports = { UserModel, User }