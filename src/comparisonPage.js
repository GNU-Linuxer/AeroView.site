import React from 'react';

// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';
//console.log(RenderComparisonContent);

export function ComparisonPage(props) {
  let favPlaneItems = props.favPlanes.map((planeElement) => {
    let elem = <p key={planeElement}>{planeElement}</p>
    return elem;
  })

  //let fav = <RenderComparisonContent />
  console.log(favPlaneItems);
  return (
    // <!-- Second heading, I don't think that this should apply the style in main content -->
    <div>
      <div className="page-title">Comparison Chart</div>
      <main className="page-content">
        {favPlaneItems}
        {/* <RenderComparisonContent /> */}
        <div className="dropdown">
          {/* <!-- Content will be filled by comparison.js file --> */}
          {/* <DropDownContent favoritePlanes={ } /> */}
        </div>

        <div className="chart-content">
          {/* <!-- Content will be filled by comparison.js file --> */}
          {/* <ComparisonChartContent favoritePlanes={ } /> */}
        </div>
      </main>
    </div>
  )
}