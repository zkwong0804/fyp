let services = require("./FrameworkServices");
let dl = require("../dataLibrarian");
function dayTable(day) {
    if (day === "mon") {
        return 1;
    } else if (day === "tue") {
        return 2;
    } else if (day === "wed") {
        return 3;
    } else if (day === "thu") {
        return 4;
    } else if (day === "fri") {
        return 5;
    } else if (day === "sat") {
        return 6;
    } else if (day === "sun") {
        return 7;
    }
}

function requestAnalyser(res, para) {
    let {features, origin, destination, historical_start, historical_end, google, bing, reqTolls} = para;
    dl.resetResult();
    let tolls = true;
    if (reqTolls !== undefined) {
        tolls = (reqTolls !== "false") ? true : false;
    }
    if (para.features !== undefined) {
        para.features = features.split("|");
    }
    let result = validateRequest({features: para.features, origin, destination, historical_start, historical_end, google, bing});
    let status = "";
    let r = {};
    let name = "";
    if (!result.isValid) {
        res.json(services.responseGenerator("fail", result.error));
    } else {
        para.tolls = tolls;
        requestManager(res, para);
    }
}

function requestManager(res, para) {
    let {features, origin, destination, historical_start, historical_end, google, bing, tolls} = para;
    for (let e of features) {
        switch(e) {
            case "1":
                services.routingData(res, {origin, destination, tolls, google, bing});
                break;
            case "2":
                services.historicalData(res, {historical_start, historical_end, origin, destination, tolls, google, bing});
                break;
            default:
                break;
        }
        if (google!==undefined) dl.setPendingTask(e, "google");
        if (bing!==undefined) dl.setPendingTask(e, "bing");
    }
}

function validateRequest(req) {
    let isValid = true;
    let error = "";

    let checkOriDest = function () {
        if (req.destination == undefined || req.origin == undefined) {
            isValid = false;
            error = "Destination and origin must be specified";
            console.log(error)
        }
    }

    let checkFeatures = function () {
         // check features
         if (req.features !== undefined) {
            for (let e of req.features) {
                let tmp = parseInt(e)
                if (tmp <= 0 || tmp >= 3) {
                    isValid = false;
                    error = "Unsupported features found: "+tmp;
                    console.log(error)
                    break;
                }
            }
         } else {
             isValid = false;
             error = "Features not found."
             console.log(error)
         }
    }

    let checkHistorical = function() {
       if (req.features.includes("2")) {
           if (req.historical_start !== undefined && req.historical_end !== undefined) {
               if (req.historical_start.length == 8 && req.historical_end.length == 8) {
                   for (let i=0; i<8; i++) {
                       let tmp = parseInt(req.historical_start[i]);
                       let tmp2 = parseInt(req.historical_end[i]);
                       if (tmp < 0 || tmp > 9) {
                           isValid = false;
                           error = "Invalid historical_start";
                           console.log(error)
                       }

                       if (isValid) {
                           if (tmp2 < 0 || tmp2 > 9) {
                               isValid = false;
                               error = "Invalid historical_end";
                               console.log(error)
                           }
                       } else {
                           break;
                       }
                   }
               } else {
                   isValid = false;
                   error = "Invalid historical_start or historical_end";
                   console.log(error)
               }
           } else {
            isValid = false;
            error = "Historical data feature are specified without prerequisite parameter: historical_start and historical_end";
            console.log(error)
        }
       }
    }

    let checkSources = function() {
        if (req.google == undefined && req.bing == undefined) {
            isValid = false;
            error = "You have to specify at least one API source in order to use this API framework";
            console.log(error)
        }
    }

    let checklist = [checkOriDest, checkFeatures, checkHistorical, checkSources];
    let counter = 0;
    while (isValid && counter < checklist.length) {
        checklist[counter]();
        counter++;
    }
    
    return {isValid, error};
}

function getRandomColor() {
    const colorPlate = ["#f9ff21", "#ff1f5a", "#0b8457", "#dee1ec", "#fef4a9", "#00e0ff", "#3d5af1", "#ba53de", "#b31e6f", "#ff69af"];
    return colorPlate[Math.floor(Math.random()*colorPlate.length)];
}

module.exports = {
    getRoutes: (req, res) => {
        const {origin_id, destination_id, day,toll, source} = req.body;
        let where = {origin_id, destination_id, day: dayTable(day)};
        if (toll === "true") where.total_tolls = {[Op.gt]: 0};
        else where.toll = 0;
        
        db.RoutesGoogles.findAll({where, include: [
            {
                model: db.Places,
                as: "origin"
            },
            {
                model: db.Places,
                as: "destination"
            },
            {
                model: db.Polylines,
            }
        ]})
          .then(routes => {
              let labels = [];
              let datasets = [];
              for (let i=0; i<24; i++) {
                  labels.push(`${i}:00`);
              }
  
              let historyColor = [];
              let data = [];
  
              for (let i=0; i<(routes.length/24); i++) {
                  let data = [];
                  let label = `Routes ${routes[i].polyline}`;
                  let randColor = "";
                  do {
                      randColor = getRandomColor();
                  } while (historyColor.indexOf(randColor) !== -1)
                  historyColor.push(randColor);
  
                  // let backgroundColor = [randColor];
                  let hoverBorderColor = [randColor];
                  let borderColor = [randColor];
                  for (let j=0; j<24; j++) {
                      data.push(routes[i*24+j].duration);
                  }
  
                  datasets.push({
                      label, data, borderColor, hoverBorderColor,
                      fill: false
                  });
              }
  
              let result = {
                  labels, datasets
              };
  
              res.json(result);
          })
          .catch(err => {
              console.error(err);
              res.send(err);
          });
  
    },
    getPlaces: (req, res) => {
        db.Places.findAll()
          .then(places => {
              res.json(places);
          })
          .catch(err => {
              console.error(err);
              res.send(err);
          })
    },
    requestAnalyser_GET: (req, res) => {
      let {features, origin, destination, historical_start, historical_end, google, bing} = req.query;
      let reqTolls = req.query.tolls;
      requestAnalyser(res, {features, origin, destination, historical_start, historical_end, google, bing, reqTolls});
    },
    requestAnalyser_POST: (req, res) => {
        let {features, origin, destination, historical_start, historical_end, google, bing} = req.body;
        let reqTolls = req.body.tolls;
        requestAnalyser(res, {features, origin, destination, historical_start, historical_end, google, bing, reqTolls});
    }
  };