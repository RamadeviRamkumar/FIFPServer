const customPlan = require("../../Models/Goal-Tracker/customPlanModel");
const User = require("../../Models/Login/emailModel");

exports.findUserById = (userId) => {
  return User.findById(userId).exec();
};

exports.createCustom = async (customData) => {
  const customPlans = new customPlan(customData);
  return await customPlans.save();
};


exports.getCustomById = async(userId) => {
    return await customPlan.find({userId})
}

exports.findCustomById = (planId) => {
  return customPlan.findById(planId).exec();
};

exports.updateCustom = async (planId, updatedData) => {
  return await customPlan.findOneAndUpdate(
    { _id: planId },
     updatedData, { new: true });
};

exports.deleteCustomById = async (planId) => {
  return await customPlan.deleteOne({ _id: planId });
};
