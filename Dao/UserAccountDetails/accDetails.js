const user = require('../../Models/Login/emailModel')

exports.getAllUser = async () =>{
    return await user.find();
}