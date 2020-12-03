import React, { useState } from 'react';

import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';

import ListGridView from './ListGridView.js';
import { SiteHeader, PageJumbotron, SiteFooter } from './SiteElements.js';
import { ComparisonPage } from './comparisonPage.js';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */

    let routes = [
        {
            name: "Dashboard", title: "Airplane Dashboard", url: "/",
            exact: true,
            view: <ListGridView
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
                    logo="img/branding-logo.svg"
                    navLinks={routes} />
                <Switch>
                    {routes.map(route =>
                        <Route key={route.name}
                               exact={route.exact || false}
                               path={route.url}
                               render={() => <div>
                                   <PageJumbotron title={route.title} />
                                   {route.view}
                               </div>}
                        />)}
                </Switch>
                <main className="page-content">
                </main>
                <SiteFooter />
            </div>
        </BrowserRouter>
    )
}
