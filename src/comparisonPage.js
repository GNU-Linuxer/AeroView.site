import React, {useState} from 'react';

// Load custom style sheet
import './css/site-elements.css';
import './css/comparison.css';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';
//console.log(RenderComparisonContent);

let excludedMeta = ['make', 'model', 'icao-pic'];

export function ComparisonPage(props) {
    // displayPlane is an array of icao strings that controls which airplane (and the order) displaying in comparison
    // Load favorite planes (checked the heart button) to populate comparison
    //const [displayPlane, setDisplayPlane] = useState(props.favoritePlanes);
    const [displayPlane, setDisplayPlane] = useState(['bcs3', 'a20n', 'mc23']);
    // position (start from 0) determines which column would show this icao airplane
    const updateFavoritePlane = function (icao, position) {
        let updatedFavoritePlanes = [...displayPlane] // Array copy
        //console.log(icao + ' ' + operation);
        updatedFavoritePlanes[position] = icao;
        console.log(updatedFavoritePlanes);
        setDisplayPlane(updatedFavoritePlanes);
    }

    return (
        <main className="page-content">

            <div className="dropdown">
                <DropDownMenus favPlanes={props.favoritePlanes} airplaneData={props.airplaneData}/>
            </div>

            <RenderGrid // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}
                displayPlane={displayPlane}

                planeRating={props.planeRating}
                updateRatingFn={props.updateRatingFn}

                favoritePlanes={props.favoritePlanes}
                updateFavoriteFn={props.updateFavoriteFn}/>
        </main>
    )
}

function DropDownMenus(props) {
    let dropDownComponent
    let planeName;

    const dropDownClick = () => {
        // Execute behavior when clicking on dropdown menu items
        console.log('test');
    }

    let dropDowns = props.favPlanes.map((favPlaneItem) => {
        props.airplaneData.map((planeItem) => {
            if (favPlaneItem === planeItem.icao.toLowerCase()) {
                planeName = planeItem.make + ' ' + planeItem.model;
            }
            dropDownComponent = <span><button className="btn btn-secondary dropdown-toggle"
                                              key={planeName}>{planeName}</button></span>
        })
        return dropDownComponent;
    })

    let dropDownMenuItems = Object.keys(props.airplaneData).map((planeItem) => { // Not sure how to append these items to the `dropDowns` elements
        let drops = <a className='dropdown-item' href='#' onClick={dropDownClick}
                       key={planeItem}>{props.airplaneData[planeItem].make + ' ' + props.airplaneData[planeItem].model}</a>
        return drops;
    })

    return (
        <div>
            {dropDowns}
        </div>
    )
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
                    planeContentElems.push(<p className="chart-cell column">{onePlane['make'] + ' ' + onePlane['model']}</p>);
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

// function RenderHeaderColumn(props) {
//     let headerColumn = Object.keys(props.airplaneDisplayMetaName).map((metaItem) => {
//         if (!excludedMeta.includes(metaItem)) {
//             let headers = <p className="chart-cell header-column"
//                              key={metaItem}>{props.airplaneDisplayMetaName[metaItem]}</p>
//             return headers;
//         }
//     })
//
//     return (
//         <div>
//             <p className="chart-cell header-column">Name</p>
//             <p className="chart-cell header-column">Picture</p>
//             {headerColumn}
//         </div>
//     )
// }

// let planeMetaData = Object.keys(props.airplaneDisplayMetaName).map((metaItem => {
//   if (!excludedMeta.includes(metaItem)) {
//     //console.log(metaItem);
//   }