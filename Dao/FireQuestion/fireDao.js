const FireQuestion = require("../../Models/FireQuestion/fireModel");
const User = require("../../Models/Login/emailModel");
const Profile = require('../../Models/Login/userModel')
const pdfModel = require('../../Models/FireQuestion/pdf')

exports.findUser = async (userId) => {
  return await Profile.findOne({ userId })
}

exports.findFireById = async (userId) => {
  return await FireQuestion.findOne(userId);
};

exports.findRetirementById = async (fireId) => {
  return await FireQuestion.findOneAndUpdate({ fireId });
}

exports.existingData = async (userId) => {
  return await FireQuestion.findOne({ userId });
};

exports.getfireById = async (userId) => {
  return await FireQuestion.find({ userId });
};

exports.create = async (finalData) => {
  const fireQuestion = new FireQuestion(finalData);
  return await fireQuestion.save();
};

exports.update = async (fireId, updatedData) => {
  return await FireQuestion.findByIdAndUpdate(fireId, updatedData,
    { new: true }
  );
};

exports.FireQuestionWithCalculation = async (userId, calculationData) => {
  return await FireQuestion.findOneAndUpdate(
    { userId },
    { RetirementCalculations: [calculationData] },
    { new: true }
  );
};

exports.findUserById = async (id) => {
  return await User.findById(id);
};

exports.updateInvestmentPlan = async (userId, investmentAchievementPlan, withdrawPlan) => {
  return await FireQuestion.findOneAndUpdate(
    { userId },
    { investmentAchievementPlan, withdrawPlan },
    { new: true }
  );
};

exports.updateRetirementCalculation = async (fireId, calculationData) => {
  return await FireQuestion.findByIdAndUpdate(
    { _id: fireId },
    { $set: { RetirementCalculations: [calculationData] } },
    { new: true, upsert: true }
  );
};

exports.updateInvestment = async (fireId, investmentAchievementPlan, withdrawPlan) => {
  return await FireQuestion.findByIdAndUpdate(
    fireId,
    { investmentAchievementPlan, withdrawPlan },
    { new: true, upsert: true }
  );
};

// pdf DAO....
exports.findByData = async (userId) => {
  return await FireQuestion.findOne({ userId })
}

exports.createPdf = async (createData) => {
  const firePdf = new pdfModel(createData);
  return await firePdf.save();
}

exports.findPdf = async (userId) => {
  return await pdfModel.findOne({ userId })
}

exports.updatePdf = async (pdfId, updateData) => {
  const update = await pdfModel.findByIdAndUpdate(
    pdfId,
    { $set: updateData },
    { new: true }
  )
  return update;
}
