// const mongoose = require('mongoose');

// const googleSchema = new mongoose.Schema({
//     googleId: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String, unique: true },
// }, {
//     timestamps: true 
// });


// module.exports = mongoose.model('Google', googleSchema);


const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  refreshToken: { type: String, required: false },
});

module.exports = mongoose.model('Google', googleSchema);
