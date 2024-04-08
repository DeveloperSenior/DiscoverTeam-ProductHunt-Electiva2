const { HTTP_CODE } = require('../utilities/Constants');
const { pipe } = require('../utilities/Utilities');
const userRepository = require('../db/UserRepository');
const userService = require('../services/UserService');
const { UserModel } = require('../models/UserModel');
const { validateUser } = require('../validators/UserValidator');

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

    try {
        const userServicesInject = pipe(userRepository, userService)(UserModel);
        const users = await userServicesInject.getUsers();

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

module.exports = { signin, getUsers, login }