import React, {useState} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faListUl, faThLarge, faSearch, faFilter, faEllipsisV} from '@fortawesome/free-solid-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faListUl, faThLarge, faSearch, faFilter, faEllipsisV);

let state = {
    // Loading airplane data
    airplaneFile: './data/airplanes.csv',
    airplaneDisplayMetaName: {}, //{make: "Make", model: "Model", series: "Production Series",...s}
    filteredAirplaneDisplayMeta: [], //the only data that will displayed in index.html: [series,...] (exclude make and model, which are always displayed)
    airplaneData: [], // 0: {make: "Airbus", model: "A220-300", …} 1: {make: "Airbus", model: "A320neo", …}
    filteredAirplaneData: [], // the data that will displayed in index.html 0: {make: "Airbus", model: "A220-300", …} 1: {make: "Airbus", model: "A320neo", …}

    display: 'list', // display's value shall be list (default) OR grid
    search: '', // search text (currently not used)

    // Populate all possible values (from the loaded .csv file), will used to generate filter dropdown content
    allBrands: [],
    allTypes: [],

    // Initial values to display, customize 3 arrays below to customize index.html's initial view; checkbox toggle will overwrite the content
    brandsToDisplay: ['Airbus', 'Boeing'],
    typesToDisplay: ['Narrow-Body Jet', 'Wide-Body Jet', 'Double-Decker'],
    // use state.filteredAirplaneDisplayMeta; the option variable value's order is not consistent
    options: ['cruise_speed', 'mtow', 'psng_cap'],

    // These metadata will not be available to toggle out, and will not be displayed in the option dropdown.
    excludedMeta: ['make', 'model', 'icao-pic'],
};

export default function ListGridView() {
    return(

    )
}