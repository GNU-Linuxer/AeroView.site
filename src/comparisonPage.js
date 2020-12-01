import React from 'react';

// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';

export function ComparisonPage() {
  return (
    // <!-- Second heading, I don't think that this should apply the style in main content -->
    <div>
      <div className="page-title">Comparison Chart</div>

      <main className="page-content">

        <div className="dropdown">
          {/* <!-- Content will be filled by comparison.js file --> */}
          <p>Test</p>
        </div>

        <div className="chart-content">
          {/* <!-- Content will be filled by comparison.js file --> */}
          <p>Test 2</p>
        </div>
      </main>
    </div>
  )
}