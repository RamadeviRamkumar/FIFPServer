const Financial = require('../../Models/FinancialHealth/financialModel');
const User = require('../../Models/Login/emailModel');

exports.findUserFinancialById = async (userId) => {

  return await Financial.findOne(userId);
};

exports.findUserFinancial = async (userId) => {
  return await Financial.findOne({userId});
};


exports.existingData = async(userId) => {
  return await Financial.findOne({userId});
};

exports.findfinancialById = async (financialId) => {
  return await Financial.findById(financialId)
}


exports.findUserById = async (id) => {
  return await User.findById(id);
};

exports.createFinancialData = async (data) => {
  const financial = new Financial(data);
  return await financial.save();
};

exports.getUserFinancial = async (userId) => {
  return await Financial.findOne({ userId });
}


  exports.findById = async (financeId) => {
    return await Financial.findById(financeId);
  };

  exports.create = async (data) => {
    const financial = new Financial(data);
    return await financial.save();
  };

  exports.update = async (financeId, financialRecord) => {
    return await Financial.findByIdAndUpdate(
      { _id: financeId },
      { $set: financialRecord },
      { new: true, upsert: true }
    );
  };

  exports.getUserFinancial = async(userId)=>{
    return await Financial.findOne({ userId });
  }

exports.getUserFH = async (userId) => {
  return await Financial.find({ userId });
}

exports.updateFinancial = async (filterId, updateData) => {
return await Financial.findByIdAndUpdate(filterId, updateData, {new : true})
}

