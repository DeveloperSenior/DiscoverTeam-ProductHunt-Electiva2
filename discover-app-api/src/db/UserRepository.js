const DefaultException = require('../models/exception/DefaultException')

const UserRepository = UserModel => {

   const signin = async (user) => {
      try {
         const newUser = new UserModel(user);
         await newUser.save();
         return true;
      } catch (e) {
         const excepcion = new DefaultException(e.message);
         throw excepcion;
      }
   }

   const getUsers = async () =>{
      try {
         return await UserModel.find().select("-_id -__v -accessToken"); // Retrieve without __id and __v
      } catch (e) {
         const excepcion = new DefaultException(e.message);
         throw excepcion;
      }
  }

  const login = async (email) =>{
   try {
      return await UserModel.findOne({email}).select("-_id -__v"); // Retrieve without __id and __v
   } catch (e) {
      const excepcion = new DefaultException(e.message);
      throw excepcion;
   }
}

   return { signin, getUsers, login }

}

module.exports = UserRepository;