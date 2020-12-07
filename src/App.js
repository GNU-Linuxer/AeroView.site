import React, { useState } from 'react';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Dashboard from "./Dashboard";
import { SiteHeader, PageJumbotron, SiteFooter } from './SiteElements.js';
import { ComparisonPage } from './comparisonPage.js';
import PlaneInfo from './PlaneInfo';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */

    let routesForNav = [
        {
            name: "Dashboard", title: "Airplane Dashboard", url: "/",
            exact: true,
            view: <Dashboard
                // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData} />
        },
        {
            name: "Comparison", title: "Comparison Chart", url: "/comparison",
            view: <ComparisonPage />
        },
    ];
    return (
        <BrowserRouter>
            <div className="react-container">
                <SiteHeader appName="AeroView"
                    logo="/img/branding-logo.svg"
                    navLinks={routesForNav} />
                <Switch>
                    {/* Routes that are target of a navigation link */}
                    {routesForNav.map(route =>
                        <Route key={route.name}
                               exact={route.exact || false}
                               path={route.url}>
                            <div>
                                <PageJumbotron title={route.title}/>
                                <main className="page-content">
                                    {route.view}
                                </main>
                            </div>
                        </Route>)}
                    {/* Other routes */}
                    <Route path="/plane/:icao">
                        <PlaneInfo airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                                   airplaneData={props.airplaneData} />
                    </Route>
                    <Redirect to="/" />
                </Switch>
                <SiteFooter />
            </div>
        </BrowserRouter>
    )
}
