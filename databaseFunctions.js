const {con} = require("./database");
const {dataLibrarian} = require("./controllers/dataLibrarian");
let rp = require("request-promise");

function getHistoricalData(res, date, google, bing, origin, destination, tolls) {
    let {
        startDay, startMonth, startYear,
        endDay, endMonth, endYear
    } = date;

    let startDate = {startDay, startMonth, startYear};
    let endDate = {endDay, endMonth, endYear};

    let {source, key} = handleAPI(google, bing);
    let feature = "2";
    
    retrieveFromAPI({key, source, origin, destination, feature, res, startDate, endDate, tolls});
}

function getRoutingData(res, para) {
    let {origin, destination, tolls, google, bing} = para;
    let {source, key} = handleAPI(google, bing);
    let feature = "1";
    retrieveFromAPI({key, source, origin, destination, feature, res, tolls});
}


function getTable(google, bing) {
    if (google!==undefined) {
        return "routes_googles";
    } else if (bing!==undefined) {
        return "routes_bings";
    } else {
        console.log(`use both`);
    }
}

function handleAPI(google, bing) {
    let source = [];
    let key = [];

    if (google !== undefined && bing !== undefined) {
        source.push("GOOGLE");
        source.push("BING");
        key.push(google);
        key.push(bing);
    } else if (google!==undefined) {
        source.push("GOOGLE");
        key.push(google);
    } else if (bing !== undefined) {
        source.push("BING");
        key.push(bing);
    }

    return {source, key};
}



function retrieveFromAPI(para) {
    let {key, source, origin, destination, feature, res, startDate, endDate, tolls} = para;
    for (let i=0; i<source.length; i++) {
        let para2 = {key: key[i], origin, destination, feature, res, startDate, endDate, tolls};
        if(source[i] ==="GOOGLE") {
            retrieveFromGoogle(para2);
        } else if (source[i] === "BING") {
            // retrieveFromBing(para2);
            retrieveFromBing(para2);
        }
    }

    return 0;
}

function retrieveFromGoogle(para) {
    let {key, origin, destination, feature, res, startDate, endDate, tolls} = para;
    
    console.log(`tolls: ${para.tolls}`);
    let source = "google";

    const dev_url = "http://127.0.0.1:5000";
    const prod_url = "https://maps.googleapis.com"
    let url = (process.env.NODE_ENV === "development") ? dev_url : prod_url;
    url += `/maps/api/directions/json?`;
    url += `origin=${origin}&destination=${destination}&key=${key}`;
    // if (feature.code == 2) // need to perform historical data feature
    if (feature === "2") {
        let query = historicalQuery(origin, destination, startDate, endDate, "routes_googles");
        let origin2 = {};
        let destination2 = {};
        console.log(query);
        con.query(query, 
            function(err, dataset, fields){
                if (err) console.error(err);
                else {
                    let result = [];
                    for (let e of dataset) {
                        origin2.address = e.origin;
                        origin2.lat = e.olat;
                        origin2.lng = e.olng;
                        destination2.address = e.destination;
                        destination2.lat = e.dlat;
                        destination2.lng = e.dlng;

                        result.push({
                            duration: e.duration,
                            distance: e.distance,
                            time: e.time,
                            dow: e.dow,
                            day: e.day,
                            month: e.month,
                            year: e.year,
                        });
                    }
                    dataLibrarian(res, 
                        {
                            data: result, 
                            feature, 
                            source,
                            origin: origin2,
                            destination: destination2
                        });
                }
        });
    } else if (feature === "1") {
        console.log(feature);
        rp(url)
        .then(htmlString => {
            console.log(htmlString)
            const {distance, duration, end_address, end_location, 
                start_address, start_location, status} = JSON.parse(htmlString).routes[0].legs[0];
            let origin = {
                address: start_address,
                lat: start_location.lat,
                lng: start_location.lng
            };
            let destination = {
                address: end_address,
                lat: end_location.lat,
                lng: end_location.lng
            }
            insertRecord(origin, destination, distance.value, duration.value, "routes_googles");
            dataLibrarian(res, 
                {
                    data: {
                        distance: distance.value, 
                        duration: duration.value
                    }, 
                    feature, 
                    source,
                    origin,
                    destination
                });

        }).catch(err => {
            console.error(err);
        });
    } else {
        console.log("ERROR WHILE RETRIEVE DATA FROM GOOGLE");
    }
}

function retrieveFromBing(para) {
    console.log("BING IS NOT SUPPORTED TEMPORARILY");
    console.log(para.key);
    console.log(para.origin)
    console.log(para.destination);

    let {key, origin, destination, feature, res, startDate, endDate} = para;
    let source = "bing";

    const dev_url = "http://10.0.24.170:3000";
    const prod_url = "https://maps.googleapis.com"
    let url = (process.env.NODE_ENV === "development") ? dev_url : prod_url;
    url += `/maps/api/directions/json?`;
    url += `origin=${origin}&destination=${destination}&key=AIzaSyA8v-SEuu8nnoPaU9dkT8VjySVPPIu6m6w`;
    // if (feature.code == 2) // need to perform historical data feature
    if (feature === "2") {
        let query = historicalQuery(origin, destination, startDate, endDate, "routes_bings");
        let origin2 = {};
        let destination2 = {};
        console.log(query);
        con.query(query, 
            function(err, dataset, fields){
                if (err) console.error(err);
                else {
                    let result = [];
                    for (let e of dataset) {
                        origin2.address = e.origin;
                        origin2.lat = e.olat;
                        origin2.lng = e.olng;
                        destination2.address = e.destination;
                        destination2.lat = e.dlat;
                        destination2.lng = e.dlng;

                        result.push({
                            duration: e.duration,
                            distance: e.distance,
                            time: e.time,
                            dow: e.dow,
                            day: e.day,
                            month: e.month,
                            year: e.year,
                        });
                    }
                    dataLibrarian(res, 
                        {
                            data: result, 
                            feature, 
                            source,
                            origin: origin2,
                            destination: destination2
                        });
                }
        });
    } else if (feature === "1") {
        console.log(feature);
        rp(url)
        .then(htmlString => {
            const {distance, duration, end_address, end_location, 
                start_address, start_location} = JSON.parse(htmlString).routes[0].legs[0];
            let origin = {
                address: start_address,
                lat: start_location.lat,
                lng: start_location.lng
            };
            let destination = {
                address: end_address,
                lat: end_location.lat,
                lng: end_location.lng
            }
            insertRecord(origin, destination, distance.value, duration.value, "routes_bings");
            dataLibrarian(res, 
                {
                    data: {
                        distance: distance.value, 
                        duration: duration.value
                    }, 
                    feature, 
                    source,
                    origin,
                    destination
                });

        }).catch(err => {
            console.error(err);
        });
    } else {
        console.log("ERROR WHILE RETRIEVE DATA FROM GOOGLE");
    }
}

function insertRecord(origin, destination, distance, duration, table) {
    let d = new Date();
    let origin_id = 0;
    let destination_id = 0;

    con.query(insertPlaceQuery(origin.address, origin.lat, origin.lng), 
        function(err, dataset, fields){
            if (err) console.error(err);
            else {
                console.log(`completed insert origin`)
                origin_id = dataset.insertId;
                con.query(insertPlaceQuery(destination.address, destination.lat, destination.lng),
                    function(err, dataset, fields) {
                        destination_id = dataset.insertId;
                        console.log(`origin id: ${origin_id}`);
                        console.log(`destination id: ${destination_id}`);
                        q = 
                        `INSERT INTO ${table} 
                        (duration, distance, total_tolls, time,
                        dow, day, month, year, d, origin, destination) 
                        VALUES 
                        (${duration}, ${distance}, 0, 
                        ${d.getHours()}, ${d.getDay()}, ${d.getDate()},
                        ${d.getMonth()+1}, ${d.getFullYear()}, CURDATE(), ${origin_id}, 
                        ${destination_id});`;

                        con.query(q, function(err, dataset, fields) {
                            if (err) console.error(err);
                            else {
                                console.log(dataset.insertId);
                            }
                        });
                    }
                );
            }
        });
}

function insertPlaceQuery(address, lat, lng) {
    return `INSERT INTO Places (name, lat, lng) VALUES ('${address}',
        ${lat}, ${lng});`;
}

function historicalQuery(origin, destination, startDate, endDate, table) {
    let {startYear, startMonth, startDay} = startDate;
    let {endYear, endMonth, endDay} = endDate;
    return `SELECT g.duration, g.distance, g.total_tolls, 
    g.time, g.dow, g.day, g.month, g.year, 
    po.name AS "origin", po.lat as "olat", po.lng as "olng",
    pd.name AS "destination", pd.lat as "dlat", pd.lng as "dlng"
    FROM ${table} g
    INNER JOIN Places po ON g.origin=po.id
    INNER JOIN Places pd ON g.destination=pd.id
    WHERE (g.d BETWEEN STR_TO_DATE('${startYear}-${startMonth-1}-${startDay}', '%Y-%c-%d') AND STR_TO_DATE('${endYear}-${endMonth}-${endDay}', '%Y-%c-%d'))
    AND (po.name LIKE '%${origin}%')
    AND (pd.name LIKE '%${destination}%');`;
}

module.exports = {getHistoricalData, getRoutingData};