import React, {useEffect, useState} from 'react';
//import ReactDOM from 'react-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faHeart, faStar, faChevronCircleDown} from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faStar as regularStar} from '@fortawesome/free-regular-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Dropdown, DropdownToggle, DropdownMenu} from 'reactstrap';
// Load other project JavaScript files
import {ALWAYS_SHOWN_METADATA, DASHBOARD_VIEWS} from './Dashboard.js';
import { FavoriteButton, StarRating } from './PlaneWidgets.js';
import {debounce} from "./util/delay-refresh";
import {Link} from "react-router-dom";

// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faStar, faChevronCircleDown, regularHeart, regularStar);


export default function ListGridView(props) {
    /*  props:
        activeView: The view selected by the user to display
        airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value

        planeRating: An object that represent the rating of each plane (icao code) has
        updateRatingFn: a callback function that feeds props.onePlane rating

        favoritePlanes: An array of boolean value that describe whether prop.onePlane is a favorite
        updateFavoriteFn: a callback function that feeds whether props.onePlane has become (or no longer is) a favorite

        brandsToDisplay: An array of strings for brands selected by the user
        typesToDisplay: An array of strings for airplane types selected by the user
        filteredMeta: An array of metadata keys the user chooses to display
        searchTerm: The term entered by the user in the search bar
    */

    let filteredFullDisplayMeta = {};
    // The metadata's order will follow the same order in airplanes.csv file, regardless the order in filteredMeta
    for (let oneMeta of Object.keys(props.airplaneDisplayMetaName)) {
        if (props.filteredMeta.includes(oneMeta)) {
            filteredFullDisplayMeta[oneMeta] = props.airplaneDisplayMetaName[oneMeta];
        }
        //console.log(filteredFullDisplayMeta);
    }

    // DashboardTable will call this function that determines whether to render TooManyMetaAlert component
    const [alertVisible, setAlertVisible] = useState(false);
    const updateAlertVisibility = (value) => {
        setAlertVisible(value);
    }

    let content;
    if (props.activeView === DASHBOARD_VIEWS.LIST) {
        content = (<DashboardTable filteredFullDisplayMeta={filteredFullDisplayMeta}
                                   airplaneData={props.airplaneData}

                                   updateAlertVisibility={updateAlertVisibility}

                                   brandsToDisplay={props.brandsToDisplay}
                                   typesToDisplay={props.typesToDisplay}
                                   filteredMeta={props.filteredMeta}

                                   planeRating={props.planeRating}
                                   updateRatingFn={props.updateRatingFn}

                                   favoritePlanes={props.favoritePlanes}
                                   updateFavoriteFn={props.updateFavoriteFn}
                                   searchTerm={props.searchTerm}/>);
    } else if (props.activeView === DASHBOARD_VIEWS.GRID) {
        content = (<DashboardGrid filteredFullDisplayMeta={filteredFullDisplayMeta}
                                  airplaneData={props.airplaneData}

                                  brandsToDisplay={props.brandsToDisplay}
                                  typesToDisplay={props.typesToDisplay}
                                  filteredMeta={props.filteredMeta}

                                  planeRating={props.planeRating}
                                  updateRatingFn={props.updateRatingFn}

                                  favoritePlanes={props.favoritePlanes}
                                  updateFavoriteFn={props.updateFavoriteFn}
                                  searchTerm={props.searchTerm}/>);
    }
    return (
        <div className="dashboard-content">
            {alertVisible && props.activeView === DASHBOARD_VIEWS.LIST ? <TooManyMetaAlert/> : ''}
            {content}
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

function DashboardGrid(props) {
    /*  props:
        filteredFullDisplayMeta: An object maps between simplified metadata and the full description metadata (before taking the number of display column to account)
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
        updateAlertVisibility: NOT USED for Grid View

        brandsToDisplay: An array of strings: brands of airplane showing in table body
        typesToDisplay: An array of strings: type of airplane showing in the table body
        filteredMeta: An array of strings: metadata that are selected to display

        planeRating: An object that represent the rating of each plane (icao code) has
        updateRatingFn: a callback function that feeds props.onePlane rating

        favoritePlanes: An array of boolean value that describe whether prop.onePlane is a favorite
        updateFavoriteFn: a callback function that feeds whether props.onePlane has become (or no longer is) a

        searchTerm: The term entered by the user in the search bar
    */


    let selectedAirplanesElems = [];
    for (let onePlane of props.airplaneData) {
        let planeName = onePlane["make"] + ' ' + onePlane["model"];
        if (props.brandsToDisplay.includes(onePlane['make']) &&
            props.typesToDisplay.includes(onePlane['type']) &&
            planeName.toLowerCase().indexOf(props.searchTerm.toLowerCase()) !== -1) {
            selectedAirplanesElems.push(<OneGridCard key={onePlane["icao-pic"]}
                                                     filteredFullDisplayMeta={props.filteredFullDisplayMeta}
                                                     onePlane={onePlane}

                                                     currRating={props.planeRating[onePlane['icao-pic'].toLowerCase()]}
                                                     updateRatingFn={props.updateRatingFn}

                                                     currFavorite={props.favoritePlanes.includes(onePlane['icao-pic'].toLowerCase())}
                                                     updateFavoriteFn={props.updateFavoriteFn}/>);
        }
    }

    return (
        <div className="plane-container">
            {selectedAirplanesElems}
        </div>
    )
}

function OneGridCard(props) {
    /*props:
            filteredFullDisplayMeta: An object maps between simplified metadata and the full description metadata (before taking the number of display column to account)
            onePlane: 1 object represent 1 airplane with filtered metadata selection

            currRating: an integer that describe prop.onePlane's current rating (initial value)
            updateRatingFn: a callback function that feeds props.onePlane rating
                The function takes 2 parameters (all_lowercase-icao, rating-integer)

            currFavorite: a boolean value that describe whether prop.onePlane is a favorite
            updateFavoriteFn: a callback function that feeds whether props.onePlane has become (or no longer is) a favorite
                The function takes 2 parameters (all_lowercase-icao, is-favorite-boolean)
         */

    let icao = props.onePlane["icao-pic"].toLowerCase();
    const toggleFavorite = () => props.updateFavoriteFn(icao);
    const updateRating = newRating => props.updateRatingFn(icao, newRating);

    return (
        <div className='one-plane'>
            <div className='star-button-wrapper-grid'>
                <Link to={'/plane/' + props.onePlane['icao-pic'].toLowerCase()}>
                    <img className="tile-image"
                         src={"./plane-thumbnail/" + props.onePlane["icao-pic"].toLowerCase() + ".jpg"}
                         alt={"Picture of " + props.onePlane["make"] + " " + props["model"] + " in " + props.onePlane["make"] + " livery"}/>
                </Link>
                <FavoriteButton className="favorite-heart-grid"
                                favor={props.currFavorite}
                                updateFavorCallback={toggleFavorite} />
                <span className="star-rating-button star-grid">
                    <StarRating maxStars={5}
                                rating={props.currRating}
                                updateRatingCallback={updateRating} />
                </span>
            </div>
            <OneGridPlaneDropdown filteredFullDisplayMeta={props.filteredFullDisplayMeta}
                                  onePlane={props.onePlane}/>
        </div>
    )
}

function OneGridPlaneDropdown(props) {
    /*props:
            filteredFullDisplayMeta: An object maps between simplified metadata and the full description metadata (before taking the number of display column to account)
            onePlane: 1 object represent 1 airplane with filtered metadata selection
    */
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    //console.log(props.onePlane);
    let tableRowsElem = [];
    for (let oneMeta of Object.keys(props.filteredFullDisplayMeta)) {
        tableRowsElem.push(<GridDropdownItem key={oneMeta}
                                             Metadata={props.filteredFullDisplayMeta[oneMeta]}
                                             Value={props.onePlane[oneMeta]}/>)
    }
    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
            <DropdownToggle tag="div" className="plane-title" data-toggle="dropdown" aria-expanded={dropdownOpen}>
                <span className="plane-title-text">{props.onePlane["make"] + ' ' + props.onePlane["model"]}</span>
                <button
                    aria-label={"expand plane detail for " + props.onePlane["make"] + ' ' + props.onePlane["model"]}>
                    <span><FontAwesomeIcon icon={['fas', 'chevron-circle-down']}/></span>
                </button>
            </DropdownToggle>
            {/*Prevent dropdown from overflowing beyond browser's right boundary, see */}
            {/*https://github.com/reactstrap/reactstrap/issues/1169#issuecomment-438132591*/}
            <DropdownMenu className='plane-grid-dropdown' modifiers={{preventOverflow: {boundariesElement: 'window'}}}
                          positionFixed={true} flip={false}>
                <table>
                    <tbody>
                    {tableRowsElem}
                    </tbody>
                </table>
            </DropdownMenu>
        </Dropdown>
    );
}

function GridDropdownItem(props) {
    /*props:
            Metadata: A string represent the full display metadata
            Value: A string that represent the value of props.Metadata
    */
    return (
        <tr>
            <td className="plane-grid-dropdown-meta">{props.Metadata}</td>
            <td>{props.Value}</td>
        </tr>
    )
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

        searchTerm: The term entered by the user in the search bar
    */

    // When window's width change, number of displaying columns need to change
    // Code is adapted from https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
    const [numCol, setNumCol] = React.useState(calculateNumMeta(window.innerWidth));

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setNumCol(calculateNumMeta(window.innerWidth));
        }, 100) // 100 in mili-second unit means re-render components with a maximum frequency of once per 5ms
        // Recommend to set to 100 or 1000 for production release

        window.addEventListener('resize', debouncedHandleResize);

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize);

        }
    });
    //console.log(numCol);

    let counter = 1;
    let filteredDisplayMetaElem = [];
    let shouldShowAlert = false;
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
                                updateFavoriteFn={props.updateFavoriteFn}
                                searchTerm={props.searchTerm}/>
        </table>
    )
}

// This helper function will return an integer representing number of displaying metadata column
// using the widthInput parameter that denotes the width of screen
function calculateNumMeta(widthInput) {
    //console.log(widthInput);
    // large desktop screen
    if (widthInput >= 768) {
        let availableSpace = widthInput - 56 - 65 - 96 - 300;
        // ECMAScript 6 feature; use Math.floor(decimal); for old browser
        // 120 means reserving up to 120px width for all metadata column (except make, model, and picture)
        return (Math.trunc(availableSpace / 130));
    }
    // mobile and small desktop screen (the everything else)
    else {
        let availableSpace = widthInput - 55 - 63 - 83 - 116;
        return (Math.trunc(availableSpace / 110));
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

    searchTerm: The term entered by the user in the search bar
    */

    let excludedMeta = ALWAYS_SHOWN_METADATA;
    let selectedAirplanesFilteredMeta = [];

    // Populate filtered airplane objects
    for (let onePlane of props.airplaneData) {
        let planeName = onePlane["make"] + ' ' + onePlane["model"];
        // Filter planes to display
        if (props.brandsToDisplay.includes(onePlane['make']) &&
            props.typesToDisplay.includes(onePlane['type']) &&
            planeName.toLowerCase().indexOf(props.searchTerm.toLowerCase()) !== -1) {
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

    let icao = props.onePlane["icao-pic"].toLowerCase();
    const toggleFavorite = () => props.updateFavoriteFn(icao);
    const updateRating = newRating => props.updateRatingFn(icao, newRating);

    return (
        <tr>
            <td key='favoriteBtn'>
                <FavoriteButton className="favorite-heart-list"
                                favor={props.currFavorite}
                                updateFavorCallback={toggleFavorite} />
            </td>
            <td key='name' className="airplane-name">
                <div>{props.onePlane["make"] + ' ' + props.onePlane["model"]}</div>
                <div>
                    <StarRating maxStars={5}
                                rating={props.currRating}
                                updateRatingCallback={updateRating} />
                </div>
            </td>
            <td key='picture'>
                <Link to={'/plane/' + props.onePlane['icao-pic'].toLowerCase()}><img
                    className="tile-image"
                    src={"./plane-thumbnail/" + props.onePlane["icao-pic"].toLowerCase() + ".jpg"}
                    alt={"Picture of " + props.onePlane["make"] + " " + props["model"] + " in " + props.onePlane["make"] + " livery"}/>
                </Link>
            </td>
            {tdElems}
        </tr>
    )
}
