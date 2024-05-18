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

   const getUsers = async (email) =>{
      try {
         const filter ={};
         if(email) filter.email = email;
         return await DbModel.find(filter).select("-__v -password")
                     .populate('followers', '-password -__v -followers -followings')
                     .populate('followings', '-password -__v -followers -followings'); // Retrieve without __v
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

  const followUser = async(userId, userIdFollowed) => {

   const options = { _id: userId};
   const set = {
       $push: {
         followings: userIdFollowed
       }
   }
   try {
       await DbModel.findOneAndUpdate(options, set);
       return await DbModel.findOne(options).select("-__v")// Retrieve without __v
           .populate('followers', '-password -__v -followers -followings')
           .populate('followings', '-password -__v -followers -followings'); // Retrieve without password and __v
   } catch (e) {
       const excepcion = new DefaultException(e.message);
       throw excepcion;
   }
      
  }

  const unfollowUser = async(userId, userIdUnfollowed) => {

   const options = { _id: userId};
   const set = {
       $pullAll: {
         followings: [userIdUnfollowed]
       }
   }
   try {
       await DbModel.findOneAndUpdate(options, set);
       return await DbModel.findOne(options).select("-__v")// Retrieve without __v
         .populate('followers', '-password -__v -followers -followings')
         .populate('followings', '-password -__v -followers -followings');  // Retrieve without password and __v
   } catch (e) {
       const excepcion = new DefaultException(e.message);
       throw excepcion;
   }
      
  }

  const updateFollowersUser = async(userId) => {

   try {
       
      const followers = await DbModel.find({followings: userId})
      .populate({
         path: 'followings',
         select: '_id'
       }).exec();
      
      const options = { _id: userId};
      const set = {
            $set: {
               followers: followers
            }
      }
      await DbModel.findOneAndUpdate(options, set);
      return await DbModel.findOne(options).select("-__v")// Retrieve without __v
      .populate('followers', '-password -__v -followers -followings')
      .populate('followings', '-password -__v -followers -followings');// Retrieve without password and __v
   } catch (e) {
       const excepcion = new DefaultException(e.message);
       throw excepcion;
   }
      
  }

   return { signin, getUsers, login, followUser, unfollowUser, updateFollowersUser }

}

module.exports = UserRepository;