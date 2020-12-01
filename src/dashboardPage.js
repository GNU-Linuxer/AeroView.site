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


export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-branding">
        <img alt="Site logo" className="site-logo" src="img/site-title.svg" />
        <span className="site-title">AeroView</span>
      </div>
      <div className="site-nav-widget">
        {/* <!--
    Use of Bootstrap's dropdown was intentionally avoided here.  The
    shape of navigation menu toggle button is a hamburger icon instead
    of a regular Bootstrap button, which would cause the dropdown menu
    to look weird.
     --> */}
        <button className="site-nav-menu-toggle-btn" aria-label="Toggle navigation menu" aria-haspopup="true" aria-expanded="false">
          <svg viewBox="0 0 18 18">
            <path d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.032C17.335,0,18,0.665,18,1.484L18,1.484z M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.032C17.335,6.031,18,6.696,18,7.516L18,7.516z M18,13.516C18,14.335,17.335,15,16.516,15H1.484 C0.665,15,0,14.335,0,13.516l0,0c0-0.82,0.665-1.483,1.484-1.483h15.032C17.335,12.031,18,12.695,18,13.516L18,13.516z" />
          </svg>
        </button>
        <nav className="site-nav">
          <NavLink exact to='/' className="site-nav-link">Dashboard</NavLink>
          <NavLink to='/comparison' className="site-nav-link" >Comparison</NavLink>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>&copy; 2020 David Xie, Jason Xu, Leo Liao</p>
      <p>The website title image is by
        <a href="https://commons.wikimedia.org/wiki/File:LAX_International_Line-up_2.jpg"> Alan Wilson</a>, used under CC BY-SA license.
    </p>
    </footer>
  )
}