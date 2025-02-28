const { fetchLatestLog, fetchLogByDate } = require('../../Service/Logs/logService');

exports.getLatestLog = async (req, res) => {
    //#swagger.tags=['log-Controller']
    try {
        const log = await fetchLatestLog();
        if (!log) {
            return res.status(404).send('No logs found');
        }
        res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching latest log:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getLogByDate = async (req, res) => {
    //#swagger.tags=['log-Controller']
    const { date } = req.params;
    try {
        const logs = await fetchLogByDate(date);
        if (!logs || logs.length === 0) {
            return res.status(404).send('No logs found for the specified date');
        }
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching log by date:', error);
        res.status(500).send('Internal Server Error');
    }
};
