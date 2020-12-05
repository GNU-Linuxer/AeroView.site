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
  //console.log(props.favoritePlanes);

  return (
    // <!-- Second heading, I don't think that this should apply the style in main content -->
    <div>
      <main className="page-content">

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