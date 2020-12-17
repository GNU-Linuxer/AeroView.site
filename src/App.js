import * as d3 from 'd3-fetch';

import React, { useEffect, useState } from 'react';
import { Progress } from 'reactstrap';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Dashboard, { DASHBOARD_VIEWS } from './Dashboard.js';
import { PlaneInfo } from './PlaneInfo.js';
import { SiteHeader, PageJumbotron, SiteFooter } from './SiteElements.js';
import { ComparisonPage } from './ComparisonPage.js';
import { AccountPage } from './AccountPage.js';

import { toggleElementInArray } from './util/array.js';
import ScrollToTop from './util/ScrollToTop.js';

// The stylesheet for loading screen shown before airplane data is available
import './css/loading-screen.css';

// Firebase imports
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


export default function App() {
    // State variables for updating data after loading completes
    const [airplaneDisplayMetaName, setAirplaneDisplayMetaName] = useState({});
    const [airplaneData, setAirplaneData] = useState([]);
    // The percentage of loading progress; -1 indicates loading completes
    const [progress, setProgress] =  useState(10);

    // Firebase specific
    const [user, setUser] = useState(undefined);
    // const [errorMessage, setErrorMessage] = useState(undefined);
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load airplane data, will be in an array of objects, whereas 1 object means 1 airplane
        // The first object describe how shorthand key correspond to full metadata name, such as {cruise_range: "Cruise Range (N miles)"}
        d3.csv('/data/airplanes.csv')
            .then(text => {
                setProgress(75);
                setAirplaneDisplayMetaName(text[0]); //{make: "Make", model: "Model", series: "Production Series",...s}
                setAirplaneData(text.slice(1, text.length)); // 0: {make: "Airbus", model: "A220-300", …} 1: {make: "Airbus", model: "A320neo", …}
            }).then(() => {
            // Show 75% for 0.2 second before proceeding for user-friendliness
            // Reason: loading page can't stay too short for a very fast device (users are curious what's the loading page look like)
            setTimeout(() => {
                setProgress(100);
            }, 200);
            // Show 100% for 1 second before proceeding for user-friendliness
            setTimeout(() => {
                setProgress(-1);
            }, 1000);
        });

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app();
        }
        setProgress(20);

        // This 50% will be immediately called after d3 begins processing the csv
        setProgress(30);

        const authUnregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                console.log("logged in as " + firebaseUser.displayName);
                setUser(firebaseUser);
                //setIsLoading(false);
            } else {
                console.log("logged out!");
                setUser(null);
                //setIsLoading(false);
            }
        })
        setProgress(50);

        return function cleanup() {
            authUnregisterFunction();
        }
    }, []);


    // Return loading screen if not finished processing airplane data
    if (progress !== -1) {
        return (
            <LoadingPage progress={progress} />
        );
    }

    return (
        <AppLoaded airplaneDisplayMetaName={airplaneDisplayMetaName}
                   airplaneData={airplaneData}
                    user={user}/>
    );
}

/*
 * Returns HTML elements for the loading page while the data is being loaded.
 *
 * Props:
 * - progress: the percentage of loading progress to be shown
 */
function LoadingPage(props) {
    return (
        <>
            <SiteHeader appName="AeroView" logo="/img/branding-logo.svg" navLinks={[]} />
            <PageJumbotron title='Loading airplanes data...' />
            <main>
                <Progress className="progress-bar-landing" value={props.progress} />
            </main>
            <SiteFooter />
        </>
    );
}


/*
 * Returns an HTML element for the app after the data is loaded.
 *
 * Props:
 * - airplaneDisplayMetaName: an object that maps the shorthand metadata keys
 *   to display-friendly full names
 * - airplaneData: an array of objects where each object represents an
 *   airplane's data
 * - user: the Firebase object for a user account
 */
function AppLoaded(props) {
    // To preserve dashboard view, it must be an app-level state defined here
    const [dashboardView, setDashboardView] = useState(DASHBOARD_VIEWS.LIST);
    // useEffect(() => {
    //     const authUnregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
    //
    //         if (firebaseUser) {
    //             console.log("logged in as " + firebaseUser.displayName);
    //             setUser(firebaseUser);
    //             setIsLoading(false);
    //         } else {
    //             console.log("logged out!");
    //             setUser(null);
    //             setIsLoading(false);
    //         }
    //     })
    //
    //     return function cleanup() {
    //         authUnregisterFunction();
    //     }
    //
    // }, []) // only run hook on first load

    // Handle change of 1 airplane's favorite toggle (all favorite airplanes' all-lowercase icao code is stored in this array)
    // Temporary: all planes are not favorite
    // This should read from user data to re-load previously saved rating
    const [favoritePlanes, setFavoritePlanes] = useState([]);
    const updateFavoritePlane = icao => {
        const newFavoritePlane = toggleElementInArray(icao, favoritePlanes);
        console.log(favoritePlanes);

        const usersRef = firebase.database().ref("users/" + props.user.uid + '/favoritePlanes/');
        usersRef.set(newFavoritePlane);
        setFavoritePlanes(newFavoritePlane);
    }

    // Temporary: set the initial rating of all plane to 0 (if the value changes, the star-rendering will change)
    // This should read from user data to re-load previously saved rating
    let initialRating = {};
    for (let onePlane of props.airplaneData) {
        initialRating[onePlane["icao-pic"].toLowerCase()] = 0;
    }

    // Handle change of 1 airplane's star rating
    const [planeRating, setRating] = useState(initialRating);
    const updatePlaneRating = (icao, rating) => {
        let updatedPlaneRating = { ...planeRating } // object copy
        // User can remove rating (0 star) by clicking on the same rating star again
        if (rating === updatedPlaneRating[icao]) {
            updatedPlaneRating[icao] = 0;
        } else {
            updatedPlaneRating[icao] = rating;
        }
        setRating(updatedPlaneRating);
        const usersRef = firebase.database().ref('users/' + props.user.uid + '/starRatings/');
        usersRef.set(updatedPlaneRating);
    }



    const [content, setContent] = useState('');

    useEffect(() => {
        //console.log(props.user);
        const noteRef = firebase.database().ref('users/' + props.user.uid + '/privateNotes/');
        noteRef.once('value', (snapshot) => {
            const result = snapshot.val();
            console.log(result);
            if (result !== undefined) {
                setContent(result);
            }
        });
    }, []);

    // Functions that handle note-taking textbox content change
    // Use the initialState to load user previously-saved data
    const handleContentChange = (icao, newContent) => {
        let updatedContent = { ...content } // object copy
        //console.log(newContent);
        //console.log('change detected ');

        //console.log(icao);

        updatedContent[icao] = newContent;

        const usersRef = firebase.database().ref('users/' + props.user.uid + '/privateNotes/');
        usersRef.set(updatedContent);
        setContent(updatedContent);
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
            view: <AccountPage currentUser={props.user} />
        }
    ];

    return (
        <BrowserRouter>
            <ScrollToTop>
                <SiteHeader appName="AeroView"
                    logo="/img/branding-logo.svg"
                    navLinks={routesForNav} />
                <Switch>
                    {/* Routes that are target of a navigation link */}
                    {routesForNav.map(route =>
                        <Route key={route.name}
                               exact={route.exact || false}
                               path={route.url}>
                            <PageJumbotron title={route.title} />
                            <main className="page-content">{route.view}</main>
                        </Route>)
                    }
                    {/* Other routes */}
                    <Route path="/plane/:icao">
                        <PlaneInfo airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                            airplaneData={props.airplaneData}
                            ratings={planeRating}
                            updateRatingsCallback={updatePlaneRating}
                            favorites={favoritePlanes}
                            updateFavoritesCallback={updateFavoritePlane}
                            content={content} handleContentChangeFn={handleContentChange}
                        />
                    </Route>
                    {/* Redirect to home page for invalid routes */}
                    <Redirect to="/" />
                </Switch>
                <SiteFooter />
            </ScrollToTop>
        </BrowserRouter>
    );
}
