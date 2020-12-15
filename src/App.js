import React, { useState } from 'react';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Dashboard, { DASHBOARD_VIEWS } from './Dashboard.js';
import PlaneInfo from './PlaneInfo.js';
import { SiteHeader, PageJumbotron, SiteFooter } from './SiteElements.js';
import { ComparisonPage } from './ComparisonPage.js';
import { AccountPage } from './AccountPage.js';
import { toggleElementInArray } from './util/array.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCufuelOrGrQigpl6vIQsSk7qzzlyCT52E",
    authDomain: "aeroview-info340-au20.firebaseapp.com",
    projectId: "aeroview-info340-au20",
    storageBucket: "aeroview-info340-au20.appspot.com",
    messagingSenderId: "474928151841",
    appId: "1:474928151841:web:8359733a387620c0911260"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */

    // To preserve dashboard view, it must be an app-level state defined here
    const [dashboardView, setDashboardView] = useState(DASHBOARD_VIEWS.LIST);

    // Handle change of 1 airplane's favorite toggle (all favorite airplanes' all-lowercase icao code is stored in this array)
    // Temporary: all planes are not favorite
    // This should read from user data to re-load previously saved rating
    const [favoritePlanes, setFavoritePlanes] = useState([]);
    const updateFavoritePlane = icao => setFavoritePlanes(
        toggleElementInArray(icao, favoritePlanes));

    // Temporary: set the initial rating of all plane to 0 (if the value changes, the star-rendering will change)
    // This should read from user data to re-load previously saved rating
    let initialRating = {};
    for (let onePlane of props.airplaneData) {
        initialRating[onePlane["icao-pic"].toLowerCase()] = 0;
    }

    // Handle change of 1 airplane's star rating
    const [planeRating, setRating] = useState(initialRating);
    //console.log(initialRating);
    const updatePlaneRating = (icao, rating) => {
        let updatedPlaneRating = { ...planeRating } // object copy
        //console.log(icao + ' ' + rating);
        // User can remove rating (0 star) by clicking on the same rating star again
        if (rating === updatedPlaneRating[icao]) {
            updatedPlaneRating[icao] = 0;
        } else {
            updatedPlaneRating[icao] = rating;
        }
        console.log(updatedPlaneRating);
        setRating(updatedPlaneRating);
    }

    let routesForNav = [
        {
            name: "Dashboard", title: "Airplane Dashboard", url: "/",
            exact: true,
            view: <Dashboard
                activeView={dashboardView}
                switchViewCallback={setDashboardView}

                // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}

                planeRating={planeRating}
                updateRatingFn={updatePlaneRating}

                favoritePlanes={favoritePlanes}
                updateFavoriteFn={updateFavoritePlane} />
        },
        {
            name: "Comparison", title: "Comparison Chart", url: "/comparison",
            view: <ComparisonPage
                // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}

                planeRating={planeRating}
                updateRatingFn={updatePlaneRating}

                favoritePlanes={favoritePlanes}
                updateFavoriteFn={updateFavoritePlane} />
        },
        {
            name: "Account", title: "Create an account or log in", url: "/account",
            view: <AccountPage />
        }
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
                                <PageJumbotron title={route.title} />
                                <main className="page-content">
                                    {route.view}
                                </main>
                            </div>
                        </Route>)}
                    {/* Other routes */}
                    <Route path="/plane/:icao">
                        <PlaneInfo airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                            airplaneData={props.airplaneData}
                            ratings={planeRating}
                            updateRatingsCallback={updatePlaneRating}
                            favorites={favoritePlanes}
                            updateFavoritesCallback={updateFavoritePlane} />
                    </Route>
                    <Redirect to="/" />
                </Switch>
                <SiteFooter />
            </div>
        </BrowserRouter>
    );
}
