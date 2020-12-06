import React from 'react';

// Load custom style sheet
import './css/site-elements.css';
import './css/comparison.css';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { faTruckPickup } from '@fortawesome/free-solid-svg-icons';

// import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';
//console.log(RenderComparisonContent);

let excludedMeta = ['make', 'model', 'icao-pic'];

export function ComparisonPage(props) {

  return (
    // <!-- Second heading, I don't think that this should apply the style in main content -->
    <div>
      <main className="page-content">

        <div className="dropdown">
          <DropDownMenus favPlanes={props.favoritePlanes} airplaneData={props.airplaneData} />
        </div>

        <div className="chart-content">
          <RenderGrid airplaneDisplayMetaName={props.airplaneDisplayMetaName} airplaneData={props.airplaneData} favoritePlanes={props.favoritePlanes} />
        </div>
      </main>
    </div>
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
      dropDownComponent = <span><button className="btn btn-secondary dropdown-toggle" key={planeName}>{planeName}</button></span>
    })
    return dropDownComponent;
  })

  let dropDownMenuItems = Object.keys(props.airplaneData).map((planeItem) => { // Not sure how to append these items to the `dropDowns` elements
    let drops = <a className='dropdown-item' href='#' onClick={dropDownClick} key={planeItem}>{props.airplaneData[planeItem].make + ' ' + props.airplaneData[planeItem].model}</a>
    return drops;
  })

  return (
    <div>
      {dropDowns}
    </div>
  )
}

function RenderGrid(props) {
  return (
    <div>
      <RenderHeaderColumn airplaneDisplayMetaName={props.airplaneDisplayMetaName} />
      <RenderPlaneContent airplaneData={props.airplaneData} airplaneDisplayMetaName={props.airplaneDisplayMetaName} favoritePlanes={props.favoritePlanes} />
    </div>
  )
}

function RenderHeaderColumn(props) {
  let headerColumn = Object.keys(props.airplaneDisplayMetaName).map((metaItem) => {
    if (!excludedMeta.includes(metaItem)) {
      let headers = <p className="chart-cell header-column" key={metaItem}>{props.airplaneDisplayMetaName[metaItem]}</p>
      return headers;
    }
  })

  return (
    <div>
      <p className="chart-cell header-column">Name</p>
      <p className="chart-cell header-column">Picture</p>
      {headerColumn}
    </div>
  )
}

// let planeMetaData = Object.keys(props.airplaneDisplayMetaName).map((metaItem => {
//   if (!excludedMeta.includes(metaItem)) {
//     //console.log(metaItem);
//   }

function RenderPlaneContent(props) {

  //let metadataItems = <p className="chart-cell column" key={favPlane}>{props.airplaneData[i].metaItem}</p>

  // for (let favPlane of props.favoritePlanes) {
  //   for (let meta of Object.keys(props.airplaneData[i])) {
  //     if (!excludedMeta.includes(meta)) {
  //       if (props.airplaneData[i].icao.toLowerCase() === favPlane) {
  //         console.log(meta);
  //         let metadataItems = <p className="chart-cell column" key={favPlane}>{props.airplaneData[i].meta}</p>
  //         return metadataItems;
  //       }
  //     }
  //   }
  // })

  let metaData = Object.keys(props.airplaneDisplayMetaName).map((metaItem) => {
    if (!excludedMeta.includes(metaItem)) {
      return metaItem;
    }
  })
  //console.log(planeMetaData);

  return (
    <div>
      <RenderPlaneName airplaneDisplayMetaName={props.airplaneDisplayMetaName} airplaneData={props.airplaneData} favoritePlanes={props.favoritePlanes} />
      <RenderPlaneImage airplaneDisplayMetaName={props.airplaneDisplayMetaName} airplaneData={props.airplaneData} favoritePlanes={props.favoritePlanes} />
      <RenderPlaneDetails airplaneDisplayMetaName={props.airplaneDisplayMetaName} metaData={metaData} airplaneData={props.airplaneData} favoritePlanes={props.favoritePlanes} />
    </div>
  )
}

function RenderPlaneDetails(props) {

  let filteredMetaData = props.metaData.filter((item) => {
    return item !== undefined
  })

  console.log(props.airplaneData);
  console.log(filteredMetaData);

  console.log(props.favoritePlanes);

  let metaDetails = [];

  let planeDetails = props.favoritePlanes.map((favPlanes) => {
    metaDetails = [];
    for (let planes of props.airplaneData) {
      if (planes.icao.toLowerCase() === favPlanes) {
        for (let meta of filteredMetaData) {
          metaDetails.push(planes[meta]);
        }
        console.log(metaDetails);

        return metaDetails;
      }
    }
  })

  console.log(planeDetails);

  let data = planeDetails.map((arrayItem) => {
    return arrayItem.map((planeItem) => {
      console.log(planeItem);
      let planeData = <p key={planeItem} className="chart-cell column">{planeItem}</p>
      return planeData;
    })
  })

  console.log(data);



  // let data = for (let i = 0; i < planeDetails.length; i++) {
  //   for (let j = 0; j < planeDetails[i].length; j++) {
  //     console.log(planeData);
  //     planeData = <p className="chart-cell column">{planeDetails[i][j]}</p>
  //     return planeData;
  //   }
  // }

  return (
    <div>
      {data}
    </div>
  )
}


function RenderPlaneName(props) {
  let name;
  let planeName = props.favoritePlanes.map((favPlane) => {
    for (let i = 0; i < props.airplaneData.length; i++) {
      if (props.airplaneData[i].icao.toLowerCase() === favPlane) {
        name = <p className="chart-cell column" key={favPlane}>{props.airplaneData[i].make + " " + props.airplaneData[i].model}</p>
        return name;
      }
    }
  })

  return (
    <div>
      {planeName}
    </div>
  )
}

function RenderPlaneImage(props) {
  let image = props.favoritePlanes.map((favPlane) => {
    for (let i = 0; i < props.airplaneData.length; i++) {
      if (props.airplaneData[i].icao.toLowerCase() === favPlane) {
        let imageSrc = "./plane-thumbnail/" + props.airplaneData[i].icao + ".jpg";
        let imageAlt = "Picture of " + props.airplaneData[i].make + " " + props.airplaneData[i].model + " in " + props.airplaneData[i].make + " livery";

        let image = <img key={favPlane} className="chart-cell column comparison-tile-image" src={imageSrc} alt={imageAlt} />
        return image;
      }
    }
  })

  return (
    <div>
      {image}
    </div>
  )
}