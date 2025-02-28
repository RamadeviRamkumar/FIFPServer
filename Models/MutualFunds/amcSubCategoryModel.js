const mongoose = require('mongoose');

const AMCDataSchema = new mongoose.Schema({
    code: String,
    name: String,
  });
  const result = new mongoose.model('mfsubCategory',AMCDataSchema)

  module.exports = result