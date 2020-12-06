import React from 'react';

import ComparisonPage from './comparisonPage.js';

// This file is used solely for reference: Remove at production build of webpage

// Track website's states
let state = {
    // Loading airplane data
    airplaneFile: './data/airplanes.csv',
    airplaneDisplayMetaName: {}, //{make: "Make", model: "Model", series: "Production Series",...s}
    airplaneData: [], // 0: {make: "Airbus", model: "A220-300", …} 1: {make: "Airbus", model: "A320neo", …}

    // This variable defines how many planes show in the compairson page.
    numOfPlanes: 0,
    // This variable defines selected plane, containing arrays of plane objects show at (index + 1)-st position
    selectedPlanes: [],
    // These metadata will not be available to toggle out, and will not be displayed in the option dropdown.
    excludedMeta: ['make', 'model', 'icao-pic'],

    // Initial planes (please use icao code) to display in the comparison view (preserve order)
    initialPlanes: ['bcs3', 'a20n', 'b738', 'mc23', 'a359', 'b788', 'b748']
};


// Load airplane data, will be in an array of objects, whereas 1 object means 1 airplane
// The first object describe how shorthand key correspond to full metadata name, such as {cruise_range: "Cruise Range (N miles)"}
// eslint-disable-next-line no-undef
d3.csv(state.airplaneFile)
    .then(function (text) {
        // console.log(text);
        state.airplaneDisplayMetaName = text[0];
        state.airplaneData = text.slice(1, text.length);
    }).then(function () {
        main();
    });


// Load initial planes defined in the state.initialPlanes
function loadInitialPlanes() {
    // Populate filtered airplane objects
    for (let oneSortedPlane of state.initialPlanes) {
        for (let onePlane of state.airplaneData) {
            // Filter planes to display
            if (oneSortedPlane === onePlane['icao-pic'].toLowerCase()) {
                state.selectedPlanes.push(onePlane);
            }
        }
    }
}

/*
* Creates drop-down menu elements with an added 'click' event listener to append to the drop-down menu container
*/
function renderDropdnBtnMenu() {
    let parentDom = document.querySelector('.dropdown');
    parentDom.innerHTML = ''; // clear existing html first
    for (let i = 0; i <= state.numOfPlanes; i = i + 1) {
        // console.log(state.numOfPlanes);
        // Define a button dropdown group
        let spanElem = document.createElement('span');
        // Define a button
        let buttonElem = document.createElement('button');
        buttonElem.id = 'dropdownMenuButton' + i; //dropdownMenuButton0, dropdownMenuButton1, dropdownMenuButton2...
        buttonElem.classList.add('btn');
        buttonElem.classList.add('btn-secondary');
        buttonElem.classList.add('dropdown-toggle');
        buttonElem.setAttribute('type', 'button');
        buttonElem.setAttribute('data-toggle', 'dropdown');
        buttonElem.setAttribute('data-flip', 'false');
        buttonElem.setAttribute('aria-haspopup', 'true');
        buttonElem.setAttribute('aria-expanded', 'false');

        if (state.selectedPlanes[i] !== undefined) {
            let make = state.selectedPlanes[i]['make'];
            let model = state.selectedPlanes[i]['model'];
            if (window.innerWidth >= 768) {
                buttonElem.textContent = make + ' ' + model;
            } else {
                buttonElem.textContent = model;
            }
        } else {
            // Display default button placeholder text
            buttonElem.textContent = "Plane " + (i + 1); // Plane 1, Plane 2, Plane 3...
        }
        spanElem.appendChild(buttonElem);

        // Define a dropdown
        let dropdownElem = document.createElement('div');
        dropdownElem.classList.add('dropdown-menu');
        dropdownElem.setAttribute('aria-labelledby', buttonElem.textContent + " dropdown button");
        // There's an outer for-loop that use i as iterator
        for (let j = 0; j < state.airplaneData.length; j++) {
            // item list
            let dropDownMenuItem = document.createElement('a');
            dropDownMenuItem.classList.add('dropdown-item');
            dropDownMenuItem.href = '#';
            dropDownMenuItem.textContent = state.airplaneData[j].make + " " + state.airplaneData[j].model;

            // Event Listener
            dropDownMenuItem.addEventListener('click', function (event) {
                event.preventDefault();
                state.selectedPlanes[i] = state.airplaneData[j];
                // Reload the dropdown after user select 1 plane
                renderDropdnBtnMenu();
                renderGrid();
            });

            dropdownElem.appendChild(dropDownMenuItem);
        }
        spanElem.appendChild(dropdownElem);

        parentDom.appendChild(spanElem);
    }
}

// Please call this function everytime you want to refresh the grid; this will properly erase old grid
function renderGrid() {
    renderHeaderCol();
    renderPlaneContent();
}

function renderHeaderCol() {
    document.querySelector('.chart-content').innerHTML = ''; // Clear out the old HTML first.
    renderOneTextCell('Name', 'header-column');
    renderOneTextCell('Picture', 'header-column');
    for (let oneMeta of Object.keys(state.airplaneDisplayMetaName)) {
        if (!state.excludedMeta.includes(oneMeta)) {
            renderOneTextCell(state.airplaneDisplayMetaName[oneMeta], 'header-column');
        }
    }
}

function renderPlaneContent() {
    // Only render airplanes that can fit in browser width (use state.numOfPlanes variable)
    for (let i = 0; i <= state.numOfPlanes; i = i + 1) {
        let onePlane = state.selectedPlanes[i];
        // Render empty columns when plane is not selected
        if (onePlane === undefined) {
            let numCell = Object.keys(state.airplaneDisplayMetaName).length - 1;
            for (let i = 1; i <= numCell; i = i + 1) {
                renderOneTextCell(' ');
            }
        } else {
            // console.log('checkpoint');
            renderOneTextCell(onePlane['make'] + ' ' + onePlane['model']);
            renderPlaneImage(onePlane);
            for (let oneMeta of Object.keys(onePlane)) {
                if (!state.excludedMeta.includes(oneMeta)) {
                    renderOneTextCell(onePlane[oneMeta]);
                }
            }
        }
    }
}

// This function will render a grid cell (one <p>...</p> element) for comparison
// The type variable (string) defines extra class that toggles between column (default value) and header-column
function renderOneTextCell(textContent, classType = 'column') {
    let pElem = document.createElement('p');
    pElem.classList.add('chart-cell');
    pElem.classList.add(classType);
    pElem.textContent = textContent;
    document.querySelector('.chart-content').appendChild(pElem);
}

// This function will render an image (<img>...</img> element) in a grid cell (for an airplane's image)
// This function will take 1 plane object
function renderPlaneImage(onePlaneObj) {
    let imgElem = document.createElement('img');
    imgElem.classList.add('chart-cell');
    imgElem.classList.add('column');
    imgElem.classList.add('comparison-tile-image');
    imgElem.src = "./img/plane-thumbnail/" + onePlaneObj['icao-pic'].toLowerCase() + ".jpg";
    imgElem.alt = "Picture of " + onePlaneObj.make + " " + onePlaneObj.model + " in " + onePlaneObj.make + " livery";
    document.querySelector('.chart-content').appendChild(imgElem);
}

// Executes after HTML DOM is loaded, after D3 has finished parsing the dataset
function main() {
    calculateNumOfPlanes();
    loadInitialPlanes();
    renderDropdnBtnMenu();
    renderGrid();
}


window.addEventListener('resize', function () {
    calculateNumOfPlanes();
    renderDropdnBtnMenu();
    renderGrid();
})

// This function will update the state.numOfPlanes value that determines number of airplanes to display based on available window width
function calculateNumOfPlanes() {
    let numCol = 0;
    let availableSpace = window.innerWidth;
    if (window.innerWidth >= 768) {
        availableSpace = availableSpace - 200;
        // ECMAScript 6 feature; use Math.floor(decimal); for old browser
        // 120 means reserving up to 120px width for all metadata column (except make, model, and picture)
        numCol = Math.trunc(availableSpace / 260);
    }
    // mobile and small desktop screen (the everything else)
    else {
        availableSpace = availableSpace - 140;
        numCol = Math.trunc(availableSpace / 180);
    }
    state.numOfPlanes = numCol;
    // console.log(numCol);
}