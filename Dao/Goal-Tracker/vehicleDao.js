const Vehicle = require('../../Models/Goal-Tracker/vehicleModel');
const User = require('../../Models/Login/emailModel');

exports.findUserById = async (id) => {
    return await User.findById(id);
  };

exports.createVehicle = async(vehicleData) =>{
    const vehicle = new Vehicle(vehicleData)
    return await vehicle.save();
}

exports.existingData = async(userId) => {
  return await Vehicle.findOne({userId});
}

exports.findVehicleByUserId = async(userId) => {
  return await Vehicle.findOne({userId});
}

exports.findVehicleById = async(vehicleId)=>{
  return await Vehicle.findById(vehicleId);
}

exports.updateVehicle = async (vehicleId, vehicleDataToUpdate) => {
  return await Vehicle.findOneAndUpdate(
    { _id: vehicleId },
    vehicleDataToUpdate, { new: true });
};

exports.getVehicleById = async(userId) => {
    return await Vehicle.find({userId})
}

exports.deleteVehicleById = async (vehicleId) => {
  return await Vehicle.deleteOne({ _id: vehicleId });
};