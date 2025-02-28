const PersonalRisk = require("../../Models/personalRiskTolerance/riskModel");
const User = require("../../Models/Login/emailModel");

exports.findUserById = async (id) => {
  return await User.findById(id);
};

exports.createRisk = async (data) => {
  const risk = new PersonalRisk(data);
  return await risk.save();
};

exports.findUserRiskById = async (userId) => {
  return await PersonalRisk.findOne(userId );
};

exports.findLatestRiskProfile = async (userId) => {
  return await PersonalRisk.findOne({ userId }).sort({ createdAt: -1 });
};

exports.updateRisk = async (riskId, riskData) => {
  return await PersonalRisk.findByIdAndUpdate(riskId,riskData,
    { new: true, upsert: true }
  );
};

exports.findRiskById = async(riskId) => {
  return await PersonalRisk.findById(riskId);
};

exports.getUserById = async(userId) => {
  return await PersonalRisk.find({userId});
};

exports.getRisk = async (userId) => {
  return await PersonalRisk.findOne({ userId }).select('preReturn');
};
