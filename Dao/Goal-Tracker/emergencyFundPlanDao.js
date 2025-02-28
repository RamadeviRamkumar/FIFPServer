const User = require('../../Models/Login/emailModel');
const emergencyFundPlanModel = require('../../Models/Goal-Tracker/emergencyFundPlanModel')

exports.findUserById = (userId) => {
   
    return User.findById(userId).exec();
};

exports.createEmergencyFunPlan =async (data)=>{
    const emergencyFundPlan = new emergencyFundPlanModel(data);
    return await emergencyFundPlan.save();
}

exports.findAllByUserId = async (userId) => {
    return await emergencyFundPlanModel.find({ userId });
    // return emergencyFundPlanModel.find({ userId }).sort({ createdAt: -1 }).limit(1).exec();
};