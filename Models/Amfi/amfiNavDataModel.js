const mongoose = require('mongoose');

const navDataSchema = new mongoose.Schema({
    scheme_code: { type: Number, required: true },
    date: { type: Date, required: true }, 
    nav: { type: String, required: true },
},
// {
//   timestamps: true, 
// }
)

navDataSchema.index({ scheme_code: 1, date: 1 })

const result = new mongoose.model('navData',navDataSchema)

module.exports = result