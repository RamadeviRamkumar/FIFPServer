const childEducationExpense = require("../../Models/Goal-Tracker/childEducationModel");
const User = require("../../Models/Login/emailModel");
const childPdf = require('../../Models/Goal-Tracker/Goal-Tracker_pdf/childPdfModel')
const profile = require('../../Models/Login/userModel');


exports.findUserById = (userId) => {
  return User.findById(userId).exec();
};

exports.findChild = async (userId) => {
  return childEducationExpense.findOne({ userId })
}
exports.createExpense = async (data) => {
  const newExpense = new childEducationExpense(data);
  return await newExpense.save();
};

exports.findAllByUserId = (userId) => {
  return childEducationExpense.find({ userId }).exec();
};

exports.findExpenseById = (expenseId) => {
  return childEducationExpense.findById(expenseId).exec();
};

exports.updateExpense = (expenseId, updates) => {
  return childEducationExpense.findByIdAndUpdate(expenseId, updates, {
    new: true,
  }).exec();
};

exports.createChild = async (data) => {
  const create = new childEducationExpense(data)
  return await create.save();
}

exports.updateChild = async (childId, data) => {
  return childEducationExpense.findByIdAndUpdate({ _id: childId },
    data,
    { new: true }
  )
}

// child pdf
exports.createPdf = async(userId,data)=>{
  const create = new childPdf({userId,base64Data:data})
  return await create.save()
}

exports.updatePdf = async(pdfId, data)=>{
  return await childPdf.findByIdAndUpdate(
    {_id:pdfId},
    data,
    { new: true }
  )
}

exports.findPdf = async (userId) => {
  return await childPdf.findOne({userId})
}

exports.getPdf = async (userId) => {
  return await childPdf.find(userId)
}

exports.getName = async(userId) =>{
  return await profile.findOne({userId})
}

exports.getData =async(userId)=>{
  return await childEducationExpense.findOne({userId})
}

exports.findPdfById = async (userId) => {
  return await childPdf.findById(userId)
}
