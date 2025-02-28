const moment = require('moment')

const equityData = (data)=>{
      let date = null
        if (typeof data[4] === "string") {
            date = moment(data[4], ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true).isValid()
                ? moment(data[4], ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true).format("YYYYMMDD")
                : null;
        } else if (typeof data[4] === "number") {
            date = new Date((data[4] - 25569) * 86400 * 1000);
            date = moment(date).format("YYYYMMDD");
        }
    
    return{
    type: 'Equity',
    SchemeName: data[0],
    BenchMark: data[1] || null,
    Riskometer: {
        Scheme: data[2] || null,
        BenchMark: data[3] || null,
    },
    NAV: {
        Date: date,
        Regular: data[5] || null,
        Direct: data[6] || null,
    },
    Returns: {
        "1Year": {
            Regular: data[7] || null,
            Direct: data[8] || null,
            BenchMark: data[9] || null,
        },
        "3Year": {
            Regular: data[10] || null,
            Direct: data[11] || null,
            BenchMark: data[12] || null,
        },
        "5Year": {
            Regular: data[13] || null,
            Direct: data[14] || null,
            BenchMark: data[15] || null,
        },
        "10Year": {
            Regular: data[16] || null,
            Direct: data[17] || null,
            BenchMark: data[18] || null,
        },
        SinceLaunch: {
            Regular: data[19] || null,
            Direct: data[20] || null,
            BenchMark: data[21] || null,
        },
    },
    DailyAUMCr: data[22] || null,
}};
module.exports = equityData