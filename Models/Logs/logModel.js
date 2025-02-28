const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    level: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Object, default: {} },
});

module.exports = mongoose.model('Log', logSchema);
