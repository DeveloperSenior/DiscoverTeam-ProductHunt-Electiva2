
const UserService = userRepository => {

    const createUser = async (user) => {
        return await userRepository.createUser(user);
    }

    const getUsers = async () =>{
        return await userRepository.getUsers();
    }

    return { createUser, getUsers }

}

module.exports = UserService