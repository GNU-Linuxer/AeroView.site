import React, {useState} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faStar} from '@fortawesome/free-solid-svg-icons'
import {faStar as regularStar} from '@fortawesome/free-regular-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faStar, regularStar);


export default function ListGridView(props) {
    /*  props:
        airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
    */
    // Will not automatically generate elements to show information in these metadata
    let excludedMeta = ['make', 'model', 'icao-pic'];

    return (
        <div className="dashboard-content">
            <DashboardTable airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                            airplaneData={props.airplaneData}
                            excludedMeta={excludedMeta}/>
        </div>
    )
}

function DashboardTable(props) {
    /*  props:
        airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
    */

    // Initial values to display, customize 3 arrays below to customize index.html's initial view; checkbox toggle will overwrite the content
    let brandsToDisplay = ['Airbus', 'Irkut'];
    let typesToDisplay = ['Narrow-Body Jet', 'Wide-Body Jet', 'Double-Decker'];
    let filteredMeta = ['cruise_speed', 'mtow', 'psng_cap', 'series', 'psng_cap', 'serv_cell'];

    let numOfMeta = 20;
    return (
        <table className="plane-list">
            <DashboardTableHead airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                                airplaneData={props.airplaneData}
                                filteredMeta={filteredMeta}
                                numOfMeta={numOfMeta}/>
            <DashboardTableBody airplaneData={props.airplaneData}
                                brandsToDisplay={brandsToDisplay}
                                filteredMeta={filteredMeta}
                                numOfMeta={numOfMeta}
                                typesToDisplay={typesToDisplay}/>
        </table>
    )
}

function DashboardTableHead(props) {
    /*  props:
        airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
        filteredMeta: An array of strings: metadata that are selected to display
        numOfMeta: An integer that represents maximum number of filteredMeta that will display (determined by window width)
    */

    let counter = 0;
    let filteredFullMetaElem = [];
    // The metadata's order will follow the same order in airplanes.csv file, regardless the order in filteredMeta
    for (let oneMeta of Object.keys(props.airplaneDisplayMetaName)) {
        if ((props.filteredMeta.includes(oneMeta)) && counter < props.numOfMeta) {
            filteredFullMetaElem.push(<th key={oneMeta}>{props.airplaneDisplayMetaName[oneMeta]}</th>);
            counter = counter + 1;
        } else if (counter === props.numOfMeta) {
            // Placeholder to render too many metadata alert
        }
    }

    return (
        <thead>
        <tr>
            <th>&nbsp;</th>
            <th>Make</th>
            <th>Model</th>
            <th>Picture</th>
            {filteredFullMetaElem}
        </tr>
        </thead>
    )
}

function DashboardTableBody(props) {
    /*  props:
    airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
    brandsToDisplay: An array of strings: brands of airplane showing in table body
    filteredMeta: An array of strings: metadata that are selected to display
    numOfMeta: An integer that represents maximum number of filteredMeta that will display (determined by window width)
    typesToDisplay: An array of strings: type of airplane showing in the table body
    */
    let excludedMeta = ['make', 'model', 'icao-pic'];
    let selectedAirplanesFilteredMeta = [];

    // Populate filtered airplane objects
    for (let onePlane of props.airplaneData) {
        // Filter planes to display
        if (props.brandsToDisplay.includes(onePlane.make) && props.typesToDisplay.includes(onePlane.type)) {
            let filteredMetaPlane = {};
            // Filter metadata to display (take counter into consideration)
            let counter = 0;
            for (let oneMeta of Object.keys(onePlane)) {
                if ((excludedMeta.includes(oneMeta))) {
                    filteredMetaPlane[oneMeta] = onePlane[oneMeta];
                } else if (props.filteredMeta.includes(oneMeta) && counter < props.numOfMeta) {
                    filteredMetaPlane[oneMeta] = onePlane[oneMeta];
                    counter = counter + 1;
                }
            }
            selectedAirplanesFilteredMeta.push(filteredMetaPlane);
        }
    }

    // Create All Table Rows for every displaying airplane
    let selectedAirplanesElems = [];
    for (let onePlane of selectedAirplanesFilteredMeta) {
        selectedAirplanesElems.push(<OnePlaneTableRow key={onePlane["icao_pic"]}
                                                      excludedMeta={excludedMeta}
                                                      onePlane={onePlane}/>)
    }

    return (
        <tbody>
        {selectedAirplanesElems}
        </tbody>
    )
}

function OnePlaneTableRow(props) {
    /*
        excludedMeta: an array of strings: describe metadata that will be manually added to the table (will not be automatically generated)
        onePlane: 1 object represent 1 airplane with filtered metadata selection
     */
    let tdElems = [];
    for (let oneMeta of Object.keys(props.onePlane)) {
        if (!props.excludedMeta.includes(oneMeta)) {
            tdElems.push(<td key={oneMeta}>{props.onePlane[oneMeta]}</td>)
        }
    }
    return (
        <tr>
            <td key='favoriteBtn'>
                <button className="star-button">
                    {/* Switch between 'far' and 'fas' to select outlined star or solid star*/}
                    <FontAwesomeIcon icon={['far', 'star']}/>
                </button>
            </td>
            <td key='make'>{props.onePlane["make"]}</td>
            <td key='model'>{props.onePlane["model"]}</td>
            <td key='picture'><img className="tile-image"
                     src={"./plane-thumbnail/" + props.onePlane["icao-pic"].toLowerCase() + ".jpg"}
                     alt={"Picture of" + props.onePlane["make"] + props["model"] + "in" + props.onePlane["make"] + "livery"}/>
            </td>
            {tdElems}
        </tr>
    )
}