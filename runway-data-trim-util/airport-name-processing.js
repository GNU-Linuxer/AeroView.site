let airplaneFile = './airports.csv'
let reducedAirportData=[];
let exportAirportName={}; // ICAO-code: runway-length-ft


d3.csv(airplaneFile)
    .then(function (text) {
        for (let oneRunway of text) {
            reducedAirportData.push(pick(oneRunway, ['ident', 'type', 'name', 'iso_country']));
        }
    }).then(function() {
    keepAirports();
}).then(function () {
    console.log(exportAirportName);
    download(JSON.stringify(exportAirportName), 'airport-icao-name.json', 'text/plain');
    console.log("program end");
});

// Only keep type: medium_airport, and large_airport (All possible values: helioport, small_airport, closed, seaplane_base, balloonport, medium_airport, large_airport)
let keptAirportType=["small_airport", "medium_airport", "large_airport"];
//let keptCountries=["US"];
let keepAirports = function() {
    for (let oneAirport of reducedAirportData) {
        if (keptAirportType.includes(oneAirport['type'])) {
            exportAirportName[oneAirport['ident']] = oneAirport['ident'] + " — " + oneAirport['name'];
        }
    }
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