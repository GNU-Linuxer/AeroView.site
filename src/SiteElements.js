/*
 * This file provides components for site-wide elements.
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useMobileView } from './util/media-query.js';

/*
 * Returns an HTML element for the site header.
 *
 * Props:
 * - appName: the name of the app
 * - logo: path to the app's logo file
 * - navLinks: an array of navigation links, where each link has 'name' and
 *     'url' properties for the link's display name and target URL
 */
export function SiteHeader(props) {
    const mobileView = useMobileView();
    const [buttonActivated, setButtonActivated] = useState(false);

    const toggleButton = () => setButtonActivated(!buttonActivated);

    let navButton = <NavButton expanded={buttonActivated}
                               clickCallback={toggleButton} />;
    let navLinks = <NavLinks links={props.navLinks}
                             clickCallback={toggleButton} />;
    let navWidget = (
        <div className="site-nav-widget">
            {mobileView && navButton}
            {(buttonActivated || !mobileView) && navLinks}
        </div>
    );
    return (
        <header className="site-header">
            <SiteBranding logo={props.logo} name={props.appName} />
            {props.navLinks.length > 0 && navWidget}
        </header>
    );
}

/*
 * Returns an HTML element for the jumbotron shown on top of the page.
 *
 * Props:
 * - title: the title of page shown on the jumbotron
 * - image: a String of relative path to image file (if specified, otherwise default to /img/main-photo.jpg)
 * - showImage: a boolean value that defines whether we show the jumbotron image (default to true if not specified)
 */
export function PageJumbotron(props) {
    const mobileView = useMobileView();
    let backgroundImage = "url(/img/main-photo.jpg)";
    if (props.image !== undefined) {
        backgroundImage = "url("+ props.image + ")";
    }
    let style
    if (props.showImage === false) {
        style = mobileView ? {} : {
            backgroundImage: "linear-gradient(hsla(205, 100%, 25%, 0.8)," +
                "hsla(205, 100%, 25%, 0.8)),"
        };
    } else {
        style = mobileView ? {} : {
            backgroundImage: "linear-gradient(hsla(205, 100%, 25%, 0.8)," +
                "hsla(205, 100%, 25%, 0.8))," +
                backgroundImage
        };
    }
    return (
        <div className="page-title" style={style}>{props.title}</div>
    );
}

/*
 * Returns an HTML element for the site footer.
 */
export function SiteFooter() {
    return (
        <footer className="site-footer">
            <p>&copy; 2020 David Xie, Jason Xu, Leo Liao</p>
            <p>The website title image is by <a href="https://commons.wikimedia.org/wiki/File:LAX_International_Line-up_2.jpg">Alan Wilson</a>, used under CC BY-SA license.
            </p>
        </footer>
    );
}

/*
 * Returns an HTML element for site branding suitable to be displayed in site
 * header.
 *
 * Props:
 * - name: the name of app shown in branding
 * - logo: path to the app's logo file
 */
function SiteBranding(props) {
    return (
        <div className="site-branding">
            <img alt="Site logo" className="site-logo" src={props.logo} />
            <span className="site-title">{props.name}</span>
        </div>
    );
}

/*
 * Returns an HTML element for the navigation menu toggle button, which is
 * exclusive to mobile view.
 *
 * Props:
 * - expanded: whether the navigation menu is expanded
 * - clickCallback: the function called when the button is clicked
 */
function NavButton(props) {
    return (
        <button className="site-nav-menu-toggle-btn"
            aria-label="Toggle navigation menu" aria-haspopup="true"
            aria-expanded={props.expanded}
            onClick={() => props.clickCallback()}>
            <svg viewBox="0 0 18 18">
                <path
                    d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.032C17.335,0,18,0.665,18,1.484L18,1.484z M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.032C17.335,6.031,18,6.696,18,7.516L18,7.516z M18,13.516C18,14.335,17.335,15,16.516,15H1.484 C0.665,15,0,14.335,0,13.516l0,0c0-0.82,0.665-1.483,1.484-1.483h15.032C17.335,12.031,18,12.695,18,13.516L18,13.516z" />
            </svg>
        </button>
    );
}

/*
 * Returns a '<nav>' element with navigation links.
 *
 * Props:
 * - navLinks: an array of navigation links, where each link has 'name' and
 *     'url' properties for the link's display name and target URL
 * - clickCallback: the function called when a navigation link is clicked
 */
function NavLinks(props) {
    return (
        <nav className="site-nav">
            {props.links.map(link =>
                <NavLink key={link.name}
                         exact={link.exact || false}
                         to={link.url}
                         className="site-nav-link"
                         activeClassName="site-nav-link-selected"
                         onClick={props.clickCallback}>
                    {link.name}
                </NavLink>)}
        </nav>
    );
}
