const mongoose = require('mongoose');


const CategoryDataSchema = new mongoose.Schema({
    code: String,
    name: String,
  });

const result = new mongoose.model('mfCategory',CategoryDataSchema)
  
module.exports = result