const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true, 
        ref: 'User' 
    },
    profile:{
        type:String,
    },
},
{
    timestamps: true 
});

module.exports = mongoose.model('ProfilePicture', PictureSchema);