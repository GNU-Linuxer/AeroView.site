import React, {useEffect, useState} from 'react';
import './css/runway-validation.css';

// Load custom style sheet
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/comparison.css';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faHeart, faStar, faChevronCircleDown} from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faStar as regularStar} from '@fortawesome/free-regular-svg-icons'

import {StarRating} from './PlaneWidgets.js';
import {Link} from "react-router-dom";
import {debounce} from "./util/delay-refresh";

library.add(faHeart, faStar, faChevronCircleDown, regularHeart, regularStar);

let excludedMeta = ['make', 'model', 'icao-pic'];

export function ComparisonPage(props) {
    // displayPlane is an array of icao strings that controls which airplane (and the order) displaying in comparison
    // Load favorite planes (checked the heart button) to populate comparison
    let defaultSelection;
    if (props.favoritePlanes.length === 0) {
        defaultSelection = ['b738', 'a20n', 'a359', 'b788', 'mc23', 'a388'];
    } else {
        defaultSelection = props.favoritePlanes;
    }
    const [displayPlane, setDisplayPlane] = useState(defaultSelection);
    // position (start from 0) determines which column would show this icao airplane
    const updateDisplayPlane = function (icao, position) {
        let updatedFavoritePlanes = [...displayPlane] // Array copy
        //console.log(icao + ' ' + operation);
        updatedFavoritePlanes[position] = icao;
        //console.log(updatedFavoritePlanes);
        setDisplayPlane(updatedFavoritePlanes);
    }

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

    return (
        <main className="page-content">

            <RenderDropDowns airplaneData={props.airplaneData}
                             displayPlane={displayPlane}
                             updateDisplayPlaneFn={updateDisplayPlane}
                             numCol={numCol}

                             favoritePlanes={props.favoritePlanes}
                             updateFavoriteFn={props.updateFavoriteFn}/>

            <RenderGrid // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}
                displayPlane={displayPlane}
                numCol={numCol}

                planeRating={props.planeRating}
                updateRatingFn={props.updateRatingFn}

                favoritePlanes={props.favoritePlanes}/>
        </main>
    )
}


// This helper function will return an integer representing number of displaying metadata column
// using the widthInput parameter that denotes the width of screen
function calculateNumMeta(widthInput) {
    //console.log(widthInput);
    // large desktop screen
    if (widthInput >= 768) {
        let availableSpace = widthInput - 200;
        // ECMAScript 6 feature; use Math.floor(decimal); for old browser
        // 120 means reserving up to 120px width for all metadata column (except make, model, and picture)
        return (Math.trunc(availableSpace / 260));
    }
    // mobile and small desktop screen (the everything else)
    else {
        let availableSpace = widthInput - 190;
        return (Math.trunc(availableSpace / 210));
    }
}

function RenderDropDowns(props) {
    let ComparisonDropdownElems = [];
    let limit = 5;
    // Restrict how many columns to display based on available browser width
    for (let i = 0; i < props.numCol; i = i + 1) {
        let currSelection = props.displayPlane[i];
        // Replace with real airplane name
        if (currSelection !== undefined) {
            for (let onePlane of props.airplaneData) {
                if (onePlane['icao-pic'].toLowerCase() === currSelection) {
                    currSelection = onePlane['make'] + ' ' + onePlane['model'];
                }
            }
        }
        ComparisonDropdownElems.push(
            <OneComparisonDropdown key={"Dropdown number: " + i}
                                   airplaneData={props.airplaneData}
                                   updateDisplayPlaneFn={props.updateDisplayPlaneFn}
                                   selectedAirplane={currSelection === undefined ? 'Select airplane' : currSelection}
                                   index={i}

                                   favoritePlanes={props.favoritePlanes}
                                   updateFavoriteFn={props.updateFavoriteFn}/>
        )
    }
    return (
        <div className="comparison-dropdown">
            {ComparisonDropdownElems}
        </div>
    )
}

// The component that defines dropdown button and element;
function OneComparisonDropdown(props) {
    /* Extra props:
        index: an integer representing the position of airplane row
    */

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    let ComparisonDropdownElems = [];
    //console.log(props.airplaneData);
    for (let onePlane of props.airplaneData) {
        ComparisonDropdownElems.push(<OneComparisonDropdownItem key={onePlane['make'] + ' ' + onePlane['model']}
                                                                name={onePlane['make'] + ' ' + onePlane['model']}
                                                                icao={onePlane['icao-pic'].toLowerCase()}
                                                                updateDisplayPlaneFn={props.updateDisplayPlaneFn}
                                                                currFavorite={props.favoritePlanes.includes(onePlane['icao-pic'].toLowerCase())}
                                                                index={props.index}/>);
    }
    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
            <DropdownToggle caret> {props.selectedAirplane}</DropdownToggle>
            <DropdownMenu positionFixed={true} flip={false}>
                {ComparisonDropdownElems}
            </DropdownMenu>
        </Dropdown>
    );
}

// This component defines 1 dropdown menu item
function OneComparisonDropdownItem(props) {
    const handleSelection = (event) => {
        event.preventDefault();
        props.updateDisplayPlaneFn(props.icao, props.index);
    }
    return (
        <DropdownItem onClick={handleSelection}>
            <span>{props.name}</span>

            {props.currFavorite ?
                <FontAwesomeIcon className="favorite-heart-button favorite-heart-list" icon={['fas', 'heart']}/> : null}
        </DropdownItem>
    );
}

function RenderGrid(props) {
    let planeContentElems = [];
    let limit = 9;
    // Restrict how many columns to display based on available browser width
    for (let i = 0; i < props.numCol; i = i + 1) {
        //console.log(props.displayPlane[i]);
        let oneICAO = props.displayPlane[i];
        if (oneICAO === undefined) {
            planeContentElems.push(<EmptyPlaneCol count={16} key={"placeholder column at index " + i}/>);
        } else {
            // Find the plane object that matches oneICAO
            for (let onePlane of props.airplaneData) {
                if (onePlane['icao-pic'].toLowerCase() === oneICAO) {
                    planeContentElems.push(<OnePlaneCol key={"Column" + i}
                                                        onePlane={onePlane}
                                                        planeRating={props.planeRating}
                                                        updateRatingFn={props.updateRatingFn}/>);
                }
            }
        }
    }

    return (
        <div className="chart-content">
            <HeaderColumn airplaneDisplayMetaName={props.airplaneDisplayMetaName}/>
            <>
            {planeContentElems}
            </>
        </div>
    )
}

function HeaderColumn(props) {
    let headerColumnElems = [];
    headerColumnElems.push(<div key='name' className="chart-cell name-row">Name</div>);
    headerColumnElems.push(<div key='picture' className="chart-cell picture-row">Picture</div>);
    for (let oneMeta of Object.keys(props.airplaneDisplayMetaName)) {
        if (!excludedMeta.includes(oneMeta)) {
            headerColumnElems.push(<div className="chart-cell"
                                      key={oneMeta}>{props.airplaneDisplayMetaName[oneMeta]}</div>);
        }
    }

    return (
        <span className='header-column'>
            {headerColumnElems}
        </span>
    )
}

function EmptyPlaneCol(props) {
    /*props:
        count: number of empty cells (except plane name and picture cell)
    */
    let placeholderContentElems = [];
    placeholderContentElems.push(<p className="chart-cell name-row"
                                    aria-hidden={true}
                                    key="placeholder row 1">&nbsp;</p>);
    placeholderContentElems.push(<img className="chart-cell comparison-tile-image picture-row"
                                src={"./plane-thumbnail/placeholder.png"}
                                alt="No airplane is selected, choose an airplane to compare"
                                      key="placeholder row 2"/>);

    // Populate 16 empty cells if no plane is present.
    for (let i = 1; i <= props.count; i = i + 1) {
        const keyNum = i + 2;
        placeholderContentElems.push(<p className="chart-cell" aria-hidden={true} key={"placeholder row " + keyNum}>&nbsp;</p>);
    }
    return (
        <span className="column">
            {placeholderContentElems}
        </span>
    )
}

function OnePlaneCol(props) {
    /*props:
        onePlane: an object that represent 1 airplane
    */

    let planeInfoElems = [];

    // Airplane name and star rating
    planeInfoElems.push(<div key='name' className="chart-cell name-row">
                            <span>{props.onePlane['make'] + ' ' + props.onePlane['model']}</span>
                            <div>
                                <StarRating maxStars={5}
                                            rating={props.planeRating[props.onePlane['icao-pic'].toLowerCase()]}
                                            updateRatingCallback={newRating =>
                                                props.updateRatingFn(props.onePlane['icao-pic'].toLowerCase(), newRating)}
                                />
                            </div>
                        </div>);

    // Airplane's picture with a React Router link to detail placeholder page
    planeInfoElems.push(<Link to={'/plane/' + props.onePlane['icao-pic'].toLowerCase()} key='picture'>
                            <img className="chart-cell comparison-tile-image picture-row"
                                 src={"./plane-thumbnail/" + props.onePlane['icao-pic'].toLowerCase() + ".jpg"}
                                 alt={"Picture of " + props.onePlane['make'] + " " + props.onePlane['model'] + " in " + props.onePlane['make'] + " livery"}/>
                        </Link>);

    // Rest of Airplane Metadata
    for (let oneMeta of Object.keys(props.onePlane)) {
        if (!excludedMeta.includes(oneMeta)) {
            planeInfoElems.push(<p className="chart-cell" key={oneMeta}>{props.onePlane[oneMeta]}</p>);
        }
    }

    return (
        <span className="column">
            {planeInfoElems}
        </span>
    )
}