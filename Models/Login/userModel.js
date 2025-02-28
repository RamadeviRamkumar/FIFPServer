
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true, 
        ref: 'User' 
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName:{
        type: String,
        required: false,
    },
    email : {
        type : String,
        required : false,
    },
    annualIncome : {
        type : String,
        required : false,
    },
    dob: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false,
    },
    address1:{
        type:String,
        required:false,
    },
    address2 : {
        type : String,
        required : false
    },
    state : {
        type : String,
        required : false,
    },
    district : {
        type : String,
        required : false,
    },
    country : {
        type : String,
        required : false,
    },
    panCard : {
        type : String,
        required : false,
    },
    aadharCard : {
        type : Number,
        required : false,
    },
    pincode : {
        type : Number,
        required: false,
    },
    city:{
        type:String,
        required:false,
    },
    occupation:{
        type:String,
        required:false,
    },
    contactNumber: {
        type: String,
        required: false,
    },
    
}, {
    timestamps: true 
});

module.exports = mongoose.model('Profile', ProfileSchema);
