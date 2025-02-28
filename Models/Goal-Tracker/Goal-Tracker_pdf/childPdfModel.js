const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    base64Data: {
        type: String
    }
})
const result = new mongoose.model('childPdf', childSchema)
module.exports = result
