const { HTTP_CODE } = require('../utilities/Constants');
const { pipe } = require('../utilities/Utilities');
const userRepository = require('../db/UserRepository');
const userService = require('../services/UserService');
const { UserModel } = require('../models/UserModel');
const { validateUser, validateFollowUser, validateUnfollowUser } = require('../validators/UserValidator');
const { getSession } = require('../utilities/Utilities');

const signin = async (request, response) => {

    try {
        const userServicesInject = pipe(userRepository, userService)(UserModel);
        const { body } = request;

        // Validate user Model
        const validate = validateUser(body);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const userCreated = await userServicesInject.signin(body);

        return response.status(HTTP_CODE.CREATED).json(userCreated);

    } catch (error) {
        return response.status(HTTP_CODE.ERROR).json(error);

    }

}

const getUsers = async (request, response) => {

    const { params } = request;
    const { email } = params;

    try {
        const userServicesInject = pipe(userRepository, userService)(UserModel);
        const users = await userServicesInject.getUsers(email);

        return response.status(HTTP_CODE.OK).json(users);

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

const login = async (request, response) => {

    try {
        const userServicesInject = pipe(userRepository, userService)(UserModel);
        const { body } = request;
        // Validate user Model
        const validate = validateUser(body);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }
        try {
            const login = await userServicesInject.login(body);

            const { tokenId } = login;

            if (tokenId) {
                return response.status(HTTP_CODE.OK).json(login);
            }

        } catch (error) {
            return response.status(HTTP_CODE.UNAUTHORIZED).json(error);
        }

    } catch (error) {

        return response.status(HTTP_CODE.ERROR).json({ message: error.message });

    }
}

/**
 * follow User
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const followUser = async (request, response) => {
    try {
        const { params } = request;
        const { _idFollowUser } = params;
        const {userId} = getSession(request);

        // Validate user Model to follow
        const validate = validateFollowUser(userId, _idFollowUser);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const userServicesInject = pipe(userRepository, userService)(UserModel);

        const resp = await userServicesInject.followUser(userId, _idFollowUser);

        return response.status(HTTP_CODE.CREATED).send(resp);

    } catch (error) {
        console.log(error);
        return response.status(HTTP_CODE.ERROR).json(error);

    }
}

/**
 * follow User
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const unfollowUser = async (request, response) => {
    try {
        const { params } = request;
        const { _idUnfollowUser } = params;
        const {userId} = getSession(request);

        // Validate user Model to follow
        const validate = validateUnfollowUser(userId, _idUnfollowUser);

        if (!validate.isValid) {

            // if validation failure, send error response
            return response.status(HTTP_CODE.BAD_REQUEST).json({ message: validate.errors });

        }

        const userServicesInject = pipe(userRepository, userService)(UserModel);

        const resp = await userServicesInject.unfollowUser(userId, _idUnfollowUser);

        return response.status(HTTP_CODE.CREATED).send(resp);

    } catch (error) {
        console.log(error);
        return response.status(HTTP_CODE.ERROR).json(error);

    }
}


module.exports = { signin, getUsers, login, followUser, unfollowUser }