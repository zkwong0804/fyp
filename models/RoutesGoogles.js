const {con} = require("../database");

async function getHistoricalData(date) {
    let {
        startDay, startMonth, startYear,
        endDay, endMonth, endYear
    } = date;

    let q = `SELECT g.duration, g.distance, g.total_tolls, 
    g.time, g.dow, g.day, g.month, g.year, po.name as "ORIGIN", 
    pd.name as "DESTINATION" FROM routes_googles g 
    INNER JOIN Places po ON g.origin=po.id
    INNER JOIN Places pd ON g.destination=pd.id
    WHERE (year BETWEEN ${startYear} AND ${endYear})
    AND (month BETWEEN ${startMonth} AND ${endMonth})
    AND (day BETWEEN ${startDay} AND ${endDay})`;

    con.query(q, function(err, dataset, fields){
        if (err) {
            console.error(err);
        }
        else {
            return dataset;
        }
    });
}

module.exports = {getHistoricalData};