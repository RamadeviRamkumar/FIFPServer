const HousePlan = require('../../Models/Goal-Tracker/houseBuyingModel');
const User = require('../../Models/Login/emailModel');

exports.findUserById = async (id) => {
    return await User.findById(id);
  };

exports.createHousePlan = async(houseData) =>{
    const houseplan = new HousePlan(houseData)
    return await houseplan.save();
}

exports.existingData = async(userId) => {
  return await HousePlan.findOne({userId});
}

exports.findPlanByUserId = async(userId) => {
  return await HousePlan.findOne({userId});
}

exports.findPlanById = async(houseId)=>{
  return await HousePlan.findById(houseId);
}

exports.updatePlan = async (houseId, updatedData) => {
  return await HousePlan.findOneAndUpdate(
    { _id: houseId },
     updatedData, { new: true });
};

exports.getPlanById = async(userId) => {
    return await HousePlan.find({userId})
}

exports.deletePlanById = async (houseId) => {
  return await HousePlan.deleteOne({ _id: houseId });
};