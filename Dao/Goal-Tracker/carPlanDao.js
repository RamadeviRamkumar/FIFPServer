const User = require('../../Models/Login/emailModel');
const CarPlanner = require('../../Models/Goal-Tracker/carPlanModel');


exports.findUserById = (userId) => {
   
    return User.findById(userId).exec();
};


exports.createCarBuyingPlan =async (data)=>{
    const carBuyPlan = new CarPlanner(data);
    return await carBuyPlan.save();
}

exports.findUserCarById = async (userId) => {
  return await CarPlanner.find({userId})
}

exports.findAllByUserId = (userId) => {
    
  return CarPlanner.find({ userId }).exec();
};