let RoutesGoogles = require("../../models/RoutesGoogles");
let df = require("../../databaseFunctions");

let routingData = function(res, para) {
    df.getRoutingData(res, para)
};

let historicalData = function(res, para) {
    let {historical_start, historical_end, origin, destination, tolls, google, bing} = para;
    const startDay = parseInt(historical_start.substring(0,2));
    const startMonth = parseInt(historical_start.substring(2,4));
    const startYear = parseInt(historical_start.substring(4,8));
    const endDay = parseInt(historical_end.substring(0,2));
    const endMonth = parseInt(historical_end.substring(2,4));
    const endYear = parseInt(historical_end.substring(4, 8));

    let invalidReason = [];
    let isInvalid = false;

    // error checking
    if (endYear < startYear) {
        isInvalid = true;
        invalidReason.push("End year should not lower than start year");
    } else {
        if (endMonth < startMonth) {
            isInvalid = true;
            invalidReason.push("End month should not lower than start month");
        } else {
            if (endDay < startDay && endMonth == startMonth) {
                isInvalid = true;
                invalidReason.push("End day should not lower than start day");
            }
        }
    }

    if(isInvalid) res.json(responseGenerator("fail", invalidReason));
    else {
        df.getHistoricalData(res, {
            startDay, startMonth, startYear,
            endDay, endMonth, endYear}, google, bing, origin, destination, tolls);
    }
    
};

let responseGenerator = function (status, result) {
    return {
        status,
        statusMsg: result
    };
}

module.exports = {routingData, historicalData, responseGenerator};