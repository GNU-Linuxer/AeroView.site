import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
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
import {Alert} from "reactstrap";
// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faStar, regularHeart, regularStar);


export default function ListGridView(props) {
    /*  props:
        airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
    */

    // Initial values to display, customize 3 arrays below to customize index.html's initial view; checkbox toggle will overwrite the content
    let brandsToDisplay = ['Airbus', 'Boeing', 'Irkut'];
    let typesToDisplay = ['Narrow-Body Jet', 'Wide-Body Jet', 'Double-Decker'];
    let filteredMeta = ['cruise_speed', 'mtow', 'psng_cap', 'series', 'psng_cap', 'serv_cell', 'aisle_wid', 'takeoff_dis', 'wing_span', 'cab_alt'];

    // Temporary: set the initial rating of all plane to 0 (if the value changes, the star-rendering will change)
    // This should read from user data to re-load previously saved rating
    let initialRating = {};
    for (let onePlane of props.airplaneData) {
        initialRating[onePlane["icao-pic"].toLowerCase()]=0;
    }

    // Handle change of 1 airplane's star rating
    const [planeRating, setRating] = useState(initialRating);
    //console.log(initialRating);
    const updatePlaneRating=(icao, rating)=>{
        let updatedPlaneRating = {...planeRating} // object copy
        //console.log(icao + ' ' + rating);
        // User can remove rating (0 star) by clicking on the same rating star again
        if (rating === updatedPlaneRating[icao]) {
            updatedPlaneRating[icao]=0;
        } else {
            updatedPlaneRating[icao]=rating;
        }
        console.log(updatedPlaneRating);
        setRating(updatedPlaneRating);
    }


    // Handle change of 1 airplane's favorite toggle (all favorite airplanes' all-lowercase icao code is stored in this array)
    // Temporary: all planes are not favorite
    // This should read from user data to re-load previously saved rating
    const [favoritePlanes, setFavoritePlanes] = useState([]);
    // Value is a boolean value that denote whether a plane (with this icao code) is a favorite (true when is favorite)
    const updateFavoritePlane=(icao, value)=>{
        let updatedFavoritePlanes = [...favoritePlanes] // Array copy
        //console.log(icao + ' ' + value);
        if (value && !(updatedFavoritePlanes.includes(icao))) {
            updatedFavoritePlanes.push(icao);
            console.log(updatedFavoritePlanes);
            setFavoritePlanes(updatedFavoritePlanes);
        } else if (!value && updatedFavoritePlanes.includes(icao)) {
            let index = updatedFavoritePlanes.indexOf(icao);
            updatedFavoritePlanes.splice(index, 1);
            console.log(updatedFavoritePlanes);
            setFavoritePlanes(updatedFavoritePlanes);
        } else {
            console.warn("updateFavoritePlane: Attempting to" + (value ? ' add duplicate ' : ' remove non-existent') + icao + " from favorite state array");
        }

    }

    let filteredFullDisplayMeta = {};
    // The metadata's order will follow the same order in airplanes.csv file, regardless the order in filteredMeta
    for (let oneMeta of Object.keys(props.airplaneDisplayMetaName)) {
        if (filteredMeta.includes(oneMeta)) {
            filteredFullDisplayMeta[oneMeta] = props.airplaneDisplayMetaName[oneMeta];
        }
        //console.log(filteredFullDisplayMeta);
    }

    // DashboardTable will call this function that determines whether to render TooManyMetaAlert component
    const [alertVisible, setAlertVisible] = useState(false);
    const updateAlertVisibility = (value) => setAlertVisible(value);

    return (
        <div className="dashboard-content">
            {alertVisible ? <TooManyMetaAlert/> : ''}
            <DashboardTable filteredFullDisplayMeta={filteredFullDisplayMeta}
                            airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                            airplaneData={props.airplaneData}

                            updateAlertVisibility={updateAlertVisibility}

                            brandsToDisplay={brandsToDisplay}
                            typesToDisplay={typesToDisplay}
                            filteredMeta={filteredMeta}

                            planeRating={planeRating}
                            updateRatingFn={updatePlaneRating}

                            favoritePlanes={favoritePlanes}
                            updateFavoriteFn={updateFavoritePlane}/>
        </div>
    )
}

// Too Many Metadata Alert
function TooManyMetaAlert(props) {
    const [visible, setVisible] = useState(true);

    const onDismiss = () => setVisible(false);

    return (
        <Alert color="info" isOpen={visible} toggle={onDismiss}>
            <div className="alert-heading">Too many selected metadata</div>
            <p>You want to see a lot of planes' metadata. Try to widen your browser window or use a larger screen.</p>
        </Alert>
    );
}


function DashboardTable(props) {
    /*  props:
        filteredFullDisplayMeta: An object maps between simplified metadata and the full description metadata (before taking the number of display column to account)
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
        updateAlertVisibility: A callback function (takes 1 boolean parameter) that determines whether show TooManyMetaAlert element in ListGridView element

        brandsToDisplay: An array of strings: brands of airplane showing in table body
        typesToDisplay: An array of strings: type of airplane showing in the table body
        filteredMeta: An array of strings: metadata that are selected to display

        planeRating: An object that represent the rating of each plane (icao code) has
        updateRatingFn: a callback function that feeds props.onePlane rating

        favoritePlanes: An array of boolean value that describe whether prop.onePlane is a favorite
        updateFavoriteFn: a callback function that feeds whether props.onePlane has become (or no longer is) a favorite
    */

    // When window's width change, number of displaying columns need to change
    // Code is adapted from https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
    const [numCol, setNumCol] = React.useState(calculateNumMeta(window.innerWidth));

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setNumCol(calculateNumMeta(window.innerWidth));
        }, 5) // 5 in mili-second unit means re-render components with a maximum frequency of once per 5ms
        // Recommend to set to 100 or 1000 for production release

        window.addEventListener('resize', debouncedHandleResize);

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize);

        }
    });
    //console.log(numCol);

    let counter = 1;
    let filteredDisplayMetaElem = [];
    let shouldShowAlert =false;
    //props.updateAlertVisibility(false);
    for (let oneMeta of Object.keys(props.filteredFullDisplayMeta)) {
        if ((props.filteredMeta.includes(oneMeta)) && counter <= numCol) {
            filteredDisplayMetaElem.push(<th key={oneMeta}>{props.filteredFullDisplayMeta[oneMeta]}</th>);
            counter = counter + 1;
            shouldShowAlert = false;
        } // No metadata is able to show in a window with a width <=425 (mobile screen), will not render TooManyMetaAlert in this situation
        else if (Object.keys(props.filteredFullDisplayMeta).length >= numCol && window.outerWidth > 425) {
            // The Too many selected metadata warning will only display in list view (The first child under <div className="dashboard-content">)
            //console.log('about to render TooManyMetaAlert');
            shouldShowAlert = true;
        }
    }

    // props.updateAlertVisibility should enter to React's lifecycle by placing this call within useEffect()
    useEffect(() => {
        props.updateAlertVisibility(shouldShowAlert);
    });


    return (
        <table className="plane-list">
            <DashboardTableHead filteredDisplayMetaElem={filteredDisplayMetaElem}/>
            <DashboardTableBody airplaneData={props.airplaneData}
                                brandsToDisplay={props.brandsToDisplay}
                                typesToDisplay={props.typesToDisplay}
                                filteredMeta={props.filteredMeta}

                                numOfMeta={numCol}

                                planeRating={props.planeRating}
                                updateRatingFn={props.updateRatingFn}

                                favoritePlanes={props.favoritePlanes}
                                updateFavoriteFn={props.updateFavoriteFn}/>
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
        filteredDisplayMetaElem: all elements for table head metadata description
            Note: this variable need to stay in ListGridView's Component, as its creation will determine whether to display too many metadata alert
    */

    return (
        <thead>
        <tr>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>Picture</th>
            {props.filteredDisplayMetaElem}
        </tr>
        </thead>
    )
}

function DashboardTableBody(props) {
    /*  props:
    airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
    brandsToDisplay: An array of strings: brands of airplane showing in table body
    typesToDisplay: An array of strings: type of airplane showing in the table body
    filteredMeta: An array of strings: metadata that are selected to display

    numOfMeta: An integer that represents maximum number of filteredMeta that will display (determined by window width)

    planeRating: An object that represent the rating of each plane (icao code) has
    updateRatingFn: a callback function that feeds props.onePlane rating

    favoritePlanes: An array of boolean value that describe whether prop.onePlane is a favorite
    updateFavoriteFn: a callback function that feeds whether props.onePlane has become (or no longer is) a favorite
    */

    let excludedMeta = ['make', 'model', 'icao-pic'];
    let selectedAirplanesFilteredMeta = [];

    // Populate filtered airplane objects
    for (let onePlane of props.airplaneData) {
        // Filter planes to display
        if (props.brandsToDisplay.includes(onePlane['make']) && props.typesToDisplay.includes(onePlane['type'])) {
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
        selectedAirplanesElems.push(<OnePlaneTableRow key={onePlane["icao-pic"]}
                                                      excludedMeta={excludedMeta}
                                                      onePlane={onePlane}

                                                      currRating={props.planeRating[onePlane['icao-pic'].toLowerCase()]}
                                                      updateRatingFn={props.updateRatingFn}

                                                      currFavorite={props.favoritePlanes.includes(onePlane['icao-pic'].toLowerCase())}
                                                      updateFavoriteFn={props.updateFavoriteFn}/>)
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

        currRating: an integer that describe prop.onePlane's current rating (initial value)
        updateRatingFn: a callback function that feeds props.onePlane rating
            The function takes 2 parameters (all_lowercase-icao, rating-integer)

        currFavorite: a boolean value that describe whether prop.onePlane is a favorite
        updateFavoriteFn: a callback function that feeds whether props.onePlane has become (or no longer is) a favorite
            The function takes 2 parameters (all_lowercase-icao, is-favorite-boolean)
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
                <button className="favorite-heart-button favorite-heart-list" onClick={props.currFavorite ? () => props.updateFavoriteFn(props.onePlane["icao-pic"].toLowerCase(), false) : () => props.updateFavoriteFn(props.onePlane["icao-pic"].toLowerCase(), true)}>
                    {/* Switch between 'far' and 'fas' to select outlined star or solid star*/}
                    <FontAwesomeIcon icon={props.currFavorite ? ['fas', 'heart'] : ['far', 'heart']}/>
                </button>
            </td>
            <td key='name' className="airplane-name">
                <div>{props.onePlane["make"] + ' ' + props.onePlane["model"]}</div>
                <div><StarRating initial={props.currRating} totalStars={5} callBack={(newRating) => props.updateRatingFn(props.onePlane['icao-pic'].toLowerCase(), newRating)}/></div>
            </td>
            <td key='picture'><img className="tile-image"
                     src={"./plane-thumbnail/" + props.onePlane["icao-pic"].toLowerCase() + ".jpg"}
                     alt={"Picture of " + props.onePlane["make"] + " " + props["model"] + " in " + props.onePlane["make"] + " livery"}/>
            </td>
            {tdElems}
        </tr>
    )
}

// This function will return a <span> element that contains a set of star rating
function StarRating(props) {
    /*
        initial: An integer describe the initial rating once this component is loaded
        callBack: An callback function that takes the plane's icao and updated rating as the parameter, passing the rating upwards
        totalStars: Number of possible ratings (recommend 5 star rating)
     */

    let StarElems = [];
    for (let i=1; i <= props.totalStars; i = i + 1) {
        StarElems.push(<Star key={i} starId={i} isSelected={props.initial >= i} callBack={(i) => props.callBack(i)}/>);
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