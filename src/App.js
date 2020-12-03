import React, {useState} from 'react';
import ListGridView from './ListGridView.js';
import {SiteHeader, PageJumbotron, SiteFooter} from './SiteElements.js';

import './css/site-elements.css';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */

    // The page title shown on the jumbotron
    const [pageTitle, setPageTitle] = useState("Airplane Dashboard");

    let navLinks = [
        { name: "Dashboard", url: "." }
    ];
    return (
        <div className="react-container">
            <SiteHeader appName="AeroView"
                    logo="img/branding-logo.svg"
                    navLinks={navLinks} />
            <PageJumbotron title={pageTitle} />
            <main className="page-content">
                {/* Continue passing data down to child components */}
                <ListGridView airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                        airplaneData={props.airplaneData}/>
            </main>
            <SiteFooter />
        </div>
    )
}