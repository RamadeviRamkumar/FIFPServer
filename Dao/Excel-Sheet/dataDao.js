const ExcelData = require("../../Models/Excel-Sheet/dataModel");

exports.saveData = async (data) => {
  return await ExcelData.insertMany(data);
};

exports.fetchAllData = async () => {
  return await ExcelData.find();
};
