const netWorthModel = require('../../Models/Net_worth/net_worthModel')

exports.findUserById = async (netWorthId) => {
    return await netWorthModel.findById(netWorthId)
}

exports.createNetWorth = async(data)=>{
    const networth = new netWorthModel(data);
      return await networth.save();
}

exports.findNetworthById = async(netWorthId)=>{
    return await netWorthModel.findById(netWorthId);
}

exports.getByUserId = async (userId) => {
    return await netWorthModel.findOne({ userId })
}

exports.findNetworth = async (userId) => {
    const findNetworth = await netWorthModel.findOne({ userId })
    return findNetworth;
}

exports.update = async (filter, updateData) => {
    const updateNetWorth = await netWorthModel.findOneAndUpdate(filter, updateData, { new: true });
    return updateNetWorth;
};

exports.deleteByUserId = async (userId) => {
    return await netWorthModel.deleteOne({userId})
}