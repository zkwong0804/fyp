let pendingTask = {"google": [], "bing": []};
let result = {};

let dataLibrarian = function(res, dataset) {
    console.log('google pending task')
    console.log(pendingTask.google);
    console.log('bing pending task')
    console.log(pendingTask.bing);
    let {data, feature, source, origin, destination} = dataset;
    // not only feature but feature for particular source
    pendingTask[source] = pendingTask[source]
        .filter(function(e) {return e!==feature});
    if (result[source] == undefined) result[source] = {};
    result[source][feature] = data;
    if(pendingTask["google"].length== 0 && pendingTask["bing"].length == 0) {
        console.log('all task are completed');
        const status = "success";
        const statusMsg = "All process finished without any errors";
        setResult(status, statusMsg, origin, destination);
        res.json(result);
    }
}

let setPendingTask = function(task, source) {
    pendingTask[source].push(task);
}

let responseGenerator = function(status, origin, destination, google, bing) {
    return {status, origin, destination, google, bing}
}

let setResult = function(status, statusMsg, origin, destination) {
    result["status"] = status;
    result["statusMsg"] = statusMsg;
    result["origin"] = origin;
    result["destination"] = destination;
}

let resetResult = function() {
    result = {};
}

module.exports = {dataLibrarian, setPendingTask, resetResult}