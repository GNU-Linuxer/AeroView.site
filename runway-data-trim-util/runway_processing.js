// This JavaScript File will take airports.csv and runways.csv files to make a new .csv files
// that contains airport ICAO code, airport's full name, and its longest runway's length (in ft)

let airplaneFile = './runways.csv'
let reducedRunwayData=[];
let longestRunway={}; // ICAO-code: runway-length-ft
d3.csv(airplaneFile)
    .then(function (text) {
        for (let oneRunway of text) {
            reducedRunwayData.push(pick(oneRunway, ['airport_ident', 'length_ft']));
        }
    }).then(function() {
        keepLongestRunway();
}).then(function () {
    download(JSON.stringify(longestRunway), 'airport-icao-longest-runway-ft.json', 'text/plain');
    console.log("program end");
});

let keepLongestRunway = function() {
    console.log("begin keepLongestRunway");
    for (let oneRunway of reducedRunwayData) {
        // When we encounter a new airport
        if (!Object.keys(longestRunway).includes(oneRunway['airport_ident'])) {
            // DO NOT include data when there's airport runway entry but no length data
            if (parseInt(oneRunway['length_ft']) > 0) {
                longestRunway[oneRunway['airport_ident']] = oneRunway['length_ft'];
            }
        } else {
            // The airport is already stored, keep only the longest runway
            // Overwrite when existing runway length is smaller than next runway data; otherwise don't change
            // console.log("For " + oneRunway['airport_ident'] + " old: " + longestRunway[oneRunway['airport_ident']] + " new: " + oneRunway['length_ft']);
            let comparison = parseInt(longestRunway[oneRunway['airport_ident']]) < parseInt(oneRunway['length_ft']);
            // console.log(comparison);
            if (comparison) {
                // console.log("overwrite with a longer data");
                longestRunway[oneRunway['airport_ident']] = oneRunway['length_ft'];
            }
        }
    }
    console.log("finished keepLongestRunway");
    console.log(longestRunway);
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


// https://www.jstips.co/en/javascript/picking-and-rejecting-object-properties/
let pick = function(obj, keys) {
    return keys.map(k => k in obj ? {[k]: obj[k]} : {})
        .reduce((res, o) => Object.assign(res, o), {});
}