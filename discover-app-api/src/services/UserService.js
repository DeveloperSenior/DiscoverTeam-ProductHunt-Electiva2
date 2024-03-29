const { Auth } = require('../models/dto/Auth');
const bcrypt = require('bcrypt');
const { User } = require('../models/dto/User');
const { encodeBase64 } = require('../utilities/Base64Util');



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
        
        const userBuilder = new User.Builder();
        const { email, accessToken } = user;
        const hashedToken = await bcrypt.hash(accessToken, 10);
        const loginUser = userBuilder.withEmail(email)
            .withAccessToken(hashedToken).build();
            
        const userResponse = await userRepository.userAuth(email);



        return {};

    }

    return { createUser, getUsers, login }

}

module.exports = UserService