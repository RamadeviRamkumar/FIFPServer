const mongoose = require('mongoose');

const linkedInSchema = new mongoose.Schema({
  linkedId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  refreshToken: { type: String, required: false },
});

module.exports = mongoose.model('LinkedIn', linkedInSchema);