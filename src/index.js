import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.js';
import * as d3 from 'd3-fetch';

let airplanes = {
    airplaneDisplayMetaName: {}, //{make: "Make", model: "Model", series: "Production Series",...s}
    airplaneData: [], // 0: {make: "Airbus", model: "A220-300", …} 1: {make: "Airbus", model: "A320neo", …}
}

// Load airplane data, will be in an array of objects, whereas 1 object means 1 airplane
// The first object describe how shorthand key correspond to full metadata name, such as {cruise_range: "Cruise Range (N miles)"}
// eslint-disable-next-line no-undef
d3.csv('/data/airplanes.csv')
    .then(function (text) {
        airplanes.airplaneDisplayMetaName = text[0];
        airplanes.airplaneData = text.slice(1, text.length);
    }).then(function () {
        //console.log(airplanes);
        ReactDOM.render(<App airplaneDisplayMetaName={airplanes.airplaneDisplayMetaName} airplaneData={airplanes.airplaneData} />, document.getElementById('root'));
    });



