import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faHeart, faStar} from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faStar as regularStar} from '@fortawesome/free-regular-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faStar, regularHeart, regularStar);


export default function ListGridView(props) {
    /*  props:
        airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
    */

    return (
        <div className="dashboard-content">
            <DashboardTable airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                            airplaneData={props.airplaneData}/>
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
    let filteredMeta = ['cruise_speed', 'mtow', 'psng_cap', 'series', 'psng_cap', 'serv_cell', 'aisle_wid', 'takeoff_dis', 'wing_span', 'cab_alt'];


    // When window's width change, number of displaying columns need to change
    // Code is adapted from https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
    const [numCol, setNumCol] = React.useState(calculateNumMeta(window.innerWidth))
    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setNumCol(calculateNumMeta(window.innerWidth))
        }, 5) // 10 in mili-second unit means re-render components with a maximum frequency of once per 10ms
        // Recommend to set to 100 or 1000 for production release

        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize)

        }
    })
    //console.log(numCol);
    let numOfMeta = 4;
    return (
        <table className="plane-list">
            <DashboardTableHead airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                                airplaneData={props.airplaneData}
                                filteredMeta={filteredMeta}
                                numOfMeta={numCol}/>
            <DashboardTableBody airplaneData={props.airplaneData}
                                brandsToDisplay={brandsToDisplay}
                                filteredMeta={filteredMeta}
                                numOfMeta={numCol}
                                typesToDisplay={typesToDisplay}/>
        </table>
    )
}

// The helper function that limits number of window resizing event frequency
// Code is adapted from https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    };
}

// This helper function will return an integer representing number of displaying metadata column
// using the widthInput parameter that denotes the width of screen
function calculateNumMeta(widthInput) {
    //console.log(widthInput);
    // large desktop screen
    if (widthInput >=768) {
        let availableSpace = widthInput - 56 - 65 - 96 - 300;
        // ECMAScript 6 feature; use Math.floor(decimal); for old browser
        // 120 means reserving up to 120px width for all metadata column (except make, model, and picture)
        return(Math.trunc(availableSpace / 130));
    }
    // mobile and small desktop screen (the everything else)
    else {
        let availableSpace = widthInput - 55 - 63 - 83 - 116;
        return(Math.trunc(availableSpace / 110));
    }
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
            <th>Name</th>
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
    // Handle change favorite heart button change
    const [favorite, setFavorite] = useState(false); // whether the favorite heart is initially selected
    const toggleFavIcon = () => setFavorite(prevState => !prevState);



    let tdElems = [];
    for (let oneMeta of Object.keys(props.onePlane)) {
        if (!props.excludedMeta.includes(oneMeta)) {
            tdElems.push(<td key={oneMeta}>{props.onePlane[oneMeta]}</td>)
        }
    }
    return (
        <tr>
            <td key='favoriteBtn'>
                <button className="favorite-heart-button favorite-heart-list" onClick={toggleFavIcon}>
                    {/* Switch between 'far' and 'fas' to select outlined star or solid star*/}
                    <FontAwesomeIcon icon={favorite ? ['fas', 'heart'] : ['far', 'heart']}/>
                </button>
            </td>
            <td key='name' className="airplane-name">
                <div>{props.onePlane["make"] + ' ' + props.onePlane["model"]}</div>
                <div><StarRating initial={0} totalStars={5} /></div>
            </td>
            <td key='picture'><img className="tile-image"
                     src={"./plane-thumbnail/" + props.onePlane["icao-pic"].toLowerCase() + ".jpg"}
                     alt={"Picture of" + props.onePlane["make"] + props["model"] + "in" + props.onePlane["make"] + "livery"}/>
            </td>
            {tdElems}
        </tr>
    )
}

// This function will return a <span> element that contains a set of star rating
function StarRating(props) {
    /*
        initial: An integer describe the initial rating once this component is loaded
        (NOT USED) callBack: An callback function that takes the updated rating as the parameter
        totalStars: Number of possible ratings (recommend 5 star rating)
     */
    // Handle change of star rating (rating is an integer from 0-totalStars, inclusive)
    const [rating, setRating] = useState(props.initial);
    const updateRating = (id) => {
        // User can remove rating (0 star) by clicking on the same rating star again
        if (id === rating) {
            setRating(0);
        } else {
            setRating(id);
        }
    }

    let StarElems = [];
    for (let i=1; i <= props.totalStars; i = i + 1) {
        StarElems.push(<Star key={i} starId={i} isSelected={rating >= i} callBack={updateRating}/>);
    }

    return(
        <span>
            {StarElems}
        </span>
    )
}

function Star(props) {
    /*
        starId: an integer representing the *-st number of star (such as 1, 2, 3)
        isSelected: a boolean value that denote whether the star is selected
        callBack: a callback function that takes the star's id as parameter when star is updated
     */
    return (
        <button onClick={() => props.callBack(props.starId)} className='star-rating-button'>
            <FontAwesomeIcon icon={props.isSelected ? ['fas', 'star'] : ['far', 'star']}/>
        </button>

    )
}