import React, { useState } from 'react';

import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';

import ListGridView from './ListGridView.js';
import { SiteHeader, PageJumbotron, SiteFooter } from './SiteElements.js';
import { ComparisonPage } from './comparisonPage.js';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */

    // The page title shown on the jumbotron
    const [pageTitle, setPageTitle] = useState("Airplane Dashboard");

    let navLinks = [
        { name: "Dashboard", url: "/" },
        { name: "Comparison", url: "comparison" }
    ];
    return (
        // Continue passing data down to child components
        <BrowserRouter>
            <div className="react-container">
                <SiteHeader appName="AeroView"
                    logo="img/branding-logo.svg"
                    navLinks={navLinks} />
                {/* <PageJumbotron title={pageTitle} /> */}

                <Switch>
                    <Route exact path="/" render={() => <div><PageJumbotron title={pageTitle} /> <ListGridView airplaneDisplayMetaName={props.airplaneDisplayMetaName} airplaneData={props.airplaneData} /> </div>} />
                    <Route path="/comparison" render={() => <div><PageJumbotron title={"Comparison Chart"} /> <ComparisonPage /></div>} />
                    {/* Ideally setPageTitle on the comparison Route path above */}
                </Switch>
                <main className="page-content">
                </main>
                <SiteFooter />
            </div>
        </BrowserRouter>
    )
}
