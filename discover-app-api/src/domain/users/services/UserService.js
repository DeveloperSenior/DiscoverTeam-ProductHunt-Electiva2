const { Auth } = require('../dto/Auth');
const bcrypt = require('bcrypt');
const { User } = require('../dto/User');
const { encodeBase64, decodeBase64 } = require('../../../infrastructure/utilities/Base64Util');
const jwt = require('jsonwebtoken');
const DefaultException = require('../../../infrastructure/exception/DefaultException');
const moment = require('moment');
const { DATE_FORMAT } = require('../../../infrastructure/utilities/Constants');

const UserService = userRepository => {

    const signin = async (user) => {

        const userBuilder = new User.Builder();
        const currentDate = moment().format(DATE_FORMAT.DEFAULT);
        const { userName, bio, avatar, email, password } = user;
        const hashedToken = await bcrypt.hash(password, 10);
        const userCreate = userBuilder.withUserName(userName)
                .withBio(bio)
                .withAvatar(avatar)
                .withEmail(email)
                .withPassword(encodeBase64(hashedToken))
                .withCreatedAt(currentDate).build();
        const resp =await userRepository.signin(userCreate);
        return await login(user);
    }

    const getUsers = async () => {
        return await userRepository.getUsers();
    }

    const login = async (user) => {

        try {

            const { email, password } = user;
            const userResponse = await userRepository.login(email);

            if (!userResponse) {

                throw new DefaultException('Authentication failed: Email not exist.');

            }

            const accessTokenMatch = await bcrypt.compare(password, decodeBase64(userResponse.password));
            const jwtSecret = decodeBase64(process.env.JWT_SECRET_KEY);
            const jwtExpires = process.env.JWT_EXPIRES;


            if (!accessTokenMatch) {

                throw new DefaultException('Authentication failed: Incorrect password.');

            }

            const token = jwt.sign({ userId: userResponse._id, email: userResponse.email  }, jwtSecret, {
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

    return { signin, getUsers, login }

}

module.exports = UserService;