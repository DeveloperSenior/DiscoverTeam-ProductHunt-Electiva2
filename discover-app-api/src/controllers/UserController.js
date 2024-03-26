const { Response } = require('express');
const { HTTP_CODE } = require('../utilities/Constants');
const { pipe } = require('../utilities/Utilities');

const userRepository = require('../db/UserRepository');
const userService = require('../services/UserService');
const { UserModel, User } = require('../models/UserModel');
const { validateUser } = require('../validators/UserValidator');

const userServicesInject = pipe(userRepository, userService)(UserModel);

const createUser = async (request, response = Response) => {

    try {

        const { body } = request;

        // Validate user Model
        const validate = validateUser(body);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const userBuilder = new User.Builder();

        const { name, nickName, email, accessToken } = body;

        const userCreate = userBuilder.withName(name)
            .withNickName(nickName)
            .withEmail(email)
            .withAccessToken(accessToken).build();

        await userServicesInject.createUser(userCreate);

        return response.status(HTTP_CODE.CREATED).json(body);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

const getUsers = async (request, response = Response) => {

    try {

        const users = await userServicesInject.getUsers();

        return response.status(HTTP_CODE.OK).json(users);

    }catch(error){

        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

module.exports = { createUser, getUsers }