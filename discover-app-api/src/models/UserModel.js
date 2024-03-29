"use strict";

const { Schema, model } = require('mongoose');
const { User } = require('./dto/User');

/** 
 * User Model ODM builder Schema
 */
const userSchema = new Schema(
    {
        _id: String,
        name: String,
        nickName: String,
        email: { type: String, required: true },
        accessToken: { type: String, required: true }
    }
);

userSchema.loadClass(User);

const UserModel = model('User', userSchema);

module.exports = { UserModel }