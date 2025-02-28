const mongoose = require('mongoose');

const daywiseNavDataSchema = new mongoose.Schema({
    scheme_code: { type: Number, required: true },
    date: { type: Date, required: true }, 
    nav: { type: String, required: true },
},
// {
//   timestamps: true, 
// }
)

// daywiseNavDataSchema.index({ scheme_code: 1, date: 1 })

const result = new mongoose.model('dayWiseNavData',daywiseNavDataSchema)

module.exports = result