import React, { useState } from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

import ListGridView from './ListGridView.js';
import { SiteHeader, SiteFooter } from './dashboardPage.js';

// import ComparisonPage from './ComparisonPage.js';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */
    console.log("goodbye");
    return (
        // Continue passing data down to child components
        <BrowserRouter>
            <div>
                <SiteHeader />
                <ListGridView airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                    airplaneData={props.airplaneData} />
                <SiteFooter />
            </div>
        </BrowserRouter>
    )
}