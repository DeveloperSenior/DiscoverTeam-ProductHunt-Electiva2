const { Auth } = require('../models/dto/Auth');
const bcrypt = require('bcrypt');
const { User } = require('../models/dto/User');
const { encodeBase64, decodeBase64 } = require('../utilities/Base64Util');
const jwt = require('jsonwebtoken');
const DefaultException = require('../../src/models/exception/DefaultException');

const UserService = userRepository => {

    const createUser = async (user) => {

        const userBuilder = new User.Builder();

        const { name, nickName, email, accessToken } = user;
        const hashedToken = await bcrypt.hash(accessToken, 10);
        const userCreate = userBuilder.withName(name)
            .withNickName(nickName)
            .withEmail(email)
            .withAccessToken(encodeBase64(hashedToken)).build();

        return await userRepository.createUser(userCreate);
    }

    const getUsers = async () => {
        return await userRepository.getUsers();
    }

    const login = async (user) => {

        try {
            const { email, accessToken } = user;
            const userResponse = await userRepository.login(email);

            if (!userResponse) {

                throw new DefaultException('Authentication failed: Email not exist.');

            }

            const accessTokenMatch = await bcrypt.compare(accessToken, userResponse.accessToken);
            const jwtSecret = decodeBase64(process.env.JWT_SECRET_KEY);
            const jwtExpires = process.env.JWT_EXPIRES;


            if (!accessTokenMatch) {

                throw new DefaultException('Authentication failed: Incorrect password.');

            }

            const token = jwt.sign({ userId: userResponse._id }, jwtSecret, {
                expiresIn: jwtExpires
            });

            const auth = new Auth.Builder().withEmail(email).withTokenId(token).build();

            return auth;
        } catch (error) {

            if (error instanceof DefaultException) {

                throw error;

            }

            throw new DefaultException(error.message);
        }
    };

    return { createUser, getUsers, login }

}

module.exports = UserService