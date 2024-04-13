"use strict";

/**
 * User Model builder object
 */
class User {
    constructor(_id, username, bio, avatar, email, password, createdAt, updatedAt) {
        this._id = _id;
        this.username = username;
        this.bio = bio;
        this.avatar = avatar;
        this.email = email;
        this.password = password ;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static Builder = class {
        constructor() {

            this.user = new User();

        }
        withId(_id) {

            this.user._id = _id;

            return this;

        }
        withUserName(userName) {

            this.user.userName = userName;

            return this;

        }
        withBio(bio) {

            this.user.bio = bio;

            return this;

        }
        withAvatar(avatar){

            this.user.avatar = avatar;

            return this;

        }
        withEmail(email) {

            this.user.email = email;
            
            return this;

        }
        withPassword(password) {

            this.user.password = password;

            return this;

        }
        withCreatedAt(createdAt) {

            this.user.createdAt = createdAt;
            return this;

        }
        withUpdatedAt(updatedAt) {

            this.user.updatedAt = updatedAt;
            return this;

        }
        build() {

            return this.user;

        }
    };
}

module.exports = { User }