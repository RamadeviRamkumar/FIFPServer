const mongoose = require('mongoose')
const pdfSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:false
    },
    base64Data:{
        type: String,
        required:false
      }},
      { timestamps: true }
)
module.exports = mongoose.model("firePdf", pdfSchema);