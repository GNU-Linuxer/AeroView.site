import React from 'react';

// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
import './css/comparison.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';
//console.log(RenderComparisonContent);

let excludedMeta = ['make', 'model', 'icao-pic'];

export function ComparisonPage(props) {
  console.log(props.favoritePlanes);

  return (
    // <!-- Second heading, I don't think that this should apply the style in main content -->
    <div>
      <main className="page-content">

        <div className="dropdown">
          <DropDownMenus favPlanes={props.favoritePlanes} airplaneData={props.airplaneData} />
        </div>

        <div className="chart-content">
          <RenderGrid airplaneDisplayMetaName={props.airplaneDisplayMetaName} />
          {/* <DropDownContent favPlanes={props.favoritePlanes} airplaneData={props.airplaneData} /> */}
        </div>
      </main>
    </div>
  )
}

function DropDownMenus(props) {
  let dropDownComponent
  let planeName;

  const dropDownClick = () => {
    console.log('hi');
  }

  let dropDowns = props.favPlanes.map((favPlaneItem) => {
    props.airplaneData.map((planeItem) => {
      if (favPlaneItem === planeItem.icao.toLowerCase()) {
        planeName = planeItem.make + ' ' + planeItem.model;
      }
      dropDownComponent = <span><button className="btn btn-secondary dropdown-toggle" key={planeName}>{planeName}</button></span>
      let dropDownMenuItems = <a className='dropdown-item' href='#' onclick={dropDownClick} key={planeItem}>{planeItem.make + ' ' + planeItem.model}</a>
    })
    return dropDownComponent;
  })

  return (
    <div>
      {dropDowns}
    </div>
  )
}

function DropDownContent(props) {

}

function RenderGrid(props) {
  return (
    <RenderHeaderColumn airplaneDisplayMetaName={props.airplaneDisplayMetaName} />

  )
}

function RenderHeaderColumn(props) {
  let headers;

  console.log(props.airplaneDisplayMetaName);

  let headerColumn = Object.keys(props.airplaneDisplayMetaName).map((metaItem, index) => {
    if (!excludedMeta.includes(metaItem)) {
      headers = <p className="chart-cell header-column" key={index}>{props.airplaneDisplayMetaName[metaItem]}</p> // resolve the duplicate key error here
    }
    return headers;
  })

  return (
    <div>
      <p className="chart-cell header-column">Name</p>
      <p className="chart-cell header-column">Picture</p>
      { headerColumn}
    </div>
  )
}