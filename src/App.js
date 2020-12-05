import React, { useState } from 'react';

import { BrowserRouter, Route, Switch, Link, NavLink, useParams } from 'react-router-dom';

import ListGridView from './ListGridView.js';
import { SiteHeader, PageJumbotron, SiteFooter } from './SiteElements.js';
import { ComparisonPage } from './comparisonPage.js';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */
    console.log(props.airplaneDisplayMetaName);
    // Handle change of 1 airplane's favorite toggle (all favorite airplanes' all-lowercase icao code is stored in this array)
    // Temporary: all planes are not favorite
    // This should read from user data to re-load previously saved rating
    const [favoritePlanes, setFavoritePlanes] = useState([]);
    // Value is a boolean value that denote whether a plane (with this icao code) is a favorite (true when is favorite)
    const updateFavoritePlane = function (icao, value) {
        let updatedFavoritePlanes = [...favoritePlanes] // Array copy
        //console.log(icao + ' ' + value);
        if (value && !(updatedFavoritePlanes.includes(icao))) {
            updatedFavoritePlanes.push(icao);
            console.log(updatedFavoritePlanes);
            setFavoritePlanes(updatedFavoritePlanes);
        } else if (!value && updatedFavoritePlanes.includes(icao)) {
            let index = updatedFavoritePlanes.indexOf(icao);
            updatedFavoritePlanes.splice(index, 1);
            console.log(updatedFavoritePlanes);
            setFavoritePlanes(updatedFavoritePlanes);
        } else {
            console.warn("updateFavoritePlane: Attempting to" + (value ? ' add duplicate ' : ' remove non-existent') + icao + " from favorite state array");
        }
        setFavoritePlanes(updatedFavoritePlanes);
    }

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

    let routes = [
        {
            name: "Dashboard", title: "Airplane Dashboard", url: "/",
            exact: true,
            view: <ListGridView
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
                <SiteFooter />
            </div>
        </BrowserRouter>
    )
}
