const User = require('../../Models/Login/emailModel');
const amcNamelistModel = require('../../Models/MutualFunds/amcListModel')

exports.findUserById = (userId) => {
   
    return User.findById(userId).exec();
};


exports.findAllByUserId = (userId) => {
    
    return amcNamelistModel.find({ userId }).exec();
};