import React, {useState} from 'react';

// Load custom style sheet
import './css/site-elements.css';
import './css/comparison.css';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faHeart, faStar, faChevronCircleDown} from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faStar as regularStar} from '@fortawesome/free-regular-svg-icons'

import {StarRating} from './ListGridView.js';

library.add(faHeart, faStar, faChevronCircleDown, regularHeart, regularStar);

let excludedMeta = ['make', 'model', 'icao-pic'];

export function ComparisonPage(props) {
    // displayPlane is an array of icao strings that controls which airplane (and the order) displaying in comparison
    // Load favorite planes (checked the heart button) to populate comparison
    //const [displayPlane, setDisplayPlane] = useState(props.favoritePlanes);
    const [displayPlane, setDisplayPlane] = useState(['bcs3', 'a20n', 'mc23', 'a20n']);
    // position (start from 0) determines which column would show this icao airplane
    const updateDisplayPlane = function (icao, position) {
        let updatedFavoritePlanes = [...displayPlane] // Array copy
        //console.log(icao + ' ' + operation);
        updatedFavoritePlanes[position] = icao;
        //console.log(updatedFavoritePlanes);
        setDisplayPlane(updatedFavoritePlanes);
    }

    return (
        <main className="page-content">

            <RenderDropDowns airplaneData={props.airplaneData}
                             displayPlane={displayPlane}
                             updateDisplayPlaneFn={updateDisplayPlane}

                             favoritePlanes={props.favoritePlanes}
                             updateFavoriteFn={props.updateFavoriteFn}/>

            <RenderGrid // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}
                displayPlane={displayPlane}

                planeRating={props.planeRating}
                updateRatingFn={props.updateRatingFn}

                favoritePlanes={props.favoritePlanes}/>
        </main>
    )
}

function RenderDropDowns(props) {
    let ComparisonDropdownElems = [];
    let limit = 5;
    // Restrict how many columns to display based on available browser width
    for (let i = 0; i < limit; i = i + 1) {
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
                                   selectedAirplane={currSelection === undefined ? ' ' : currSelection}
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
                <FontAwesomeIcon className="favorite-heart-button favorite-heart-list" icon={['far', 'heart']}/> : null}
        </DropdownItem>
    );
}

function RenderGrid(props) {
    let planeContentElems = [];
    let limit = 5;
    // Restrict how many columns to display based on available browser width
    for (let i = 0; i < limit; i = i + 1) {
        //console.log(props.displayPlane[i]);
        let oneICAO = props.displayPlane[i];
        if (oneICAO === undefined) {
            // Populate 18 empty cells if no plane is present.
            for (let i = 1; i <= 18; i = i + 1) {
                planeContentElems.push(<p className="chart-cell column">&nbsp;</p>);
            }
        } else {
            // Find the plane object that matches oneICAO
            for (let onePlane of props.airplaneData) {
                if (onePlane['icao-pic'].toLowerCase() === oneICAO) {
                    //console.log('checkpoint');
                    planeContentElems.push(<div className="chart-cell column">
                                                <span>{onePlane['make'] + ' ' + onePlane['model']}</span>
                                                <div><StarRating initial={props.planeRating[onePlane['icao-pic'].toLowerCase()]} totalStars={5}
                                                                 callBack={(newRating) => props.updateRatingFn(onePlane['icao-pic'].toLowerCase(), newRating)}/>
                                                </div>
                                            </div>);
                    planeContentElems.push(<img className="chart-cell column comparison-tile-image"
                                                src={"./plane-thumbnail/" + onePlane['icao-pic'].toLowerCase() + ".jpg"}
                                                alt={"Picture of " + onePlane['make'] + " " + onePlane['model'] + " in " + onePlane['make'] + " livery"}/>);
                    // Conditionally populate the planeContentElems
                    for (let oneMeta of Object.keys(onePlane)) {
                        if (!excludedMeta.includes(oneMeta)) {
                            planeContentElems.push(<p className="chart-cell column">{onePlane[oneMeta]}</p>);
                        }
                    }
                }
            }
        }
    }
    let headerColumnElems = [];
    headerColumnElems.push(<p className="chart-cell header-column">Name</p>);
    headerColumnElems.push(<p className="chart-cell header-column">Picture</p>);
    for (let oneMeta of Object.keys(props.airplaneDisplayMetaName)) {
        if (!excludedMeta.includes(oneMeta)) {
            headerColumnElems.push(<p className="chart-cell header-column"
                                      key={oneMeta}>{props.airplaneDisplayMetaName[oneMeta]}</p>);
        }
    }
    return (
        <div className="chart-content">

            {headerColumnElems}

            {planeContentElems}

        </div>
    )
}