const DefaultException = require('../models/exception/DefaultException');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const UserRepository = DbModel => {

   const signin = async (user) => {
      try {
         user._id = new ObjectId;
         const newUser = new DbModel(user);
         await newUser.save();
         return true;
      } catch (e) {
         const excepcion = new DefaultException(e.message);
         throw excepcion;
      }
   }

   const getUsers = async () =>{
      try {
         return await DbModel.find().select("-__v"); // Retrieve without __v
      } catch (e) {
         const excepcion = new DefaultException(e.message);
         throw excepcion;
      }
  }

  const login = async (email) =>{
   try {
      return await DbModel.findOne({email}).select("-__v"); // Retrieve without __id and __v
   } catch (e) {
      const excepcion = new DefaultException(e.message);
      throw excepcion;
   }
}

   return { signin, getUsers, login }

}

module.exports = UserRepository;