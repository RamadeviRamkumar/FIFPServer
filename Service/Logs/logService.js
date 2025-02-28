const Log = require('../../Models/Logs/logModel');

const fetchLatestLog = async () => {
    return await Log.findOne().sort({ date: -1 });
};

const fetchLogByDate = async (date) => {
    return await Log.find({ date: { $gte: new Date(date + 'T00:00:00.000Z'), $lt: new Date(date + 'T23:59:59.999Z') } });
};

module.exports = { fetchLatestLog, fetchLogByDate };
