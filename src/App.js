import * as d3 from 'd3-fetch';

import React, { useEffect, useState } from 'react';
import {Alert, Progress} from 'reactstrap';
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


const FIREBASE_CONFIG = {
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
    const [isLoggedIn, setIsLoggedIn] =  useState(false);

    useEffect(() => {
        // Load airplane data, will be in an array of objects, whereas 1 object means 1 airplane
        // The first object describe how shorthand key correspond to full metadata name, such as {cruise_range: "Cruise Range (N miles)"}
        d3.csv('/data/airplanes.csv')
            .then(text => {
                setProgress(50);
                setAirplaneDisplayMetaName(text[0]); //{make: "Make", model: "Model", series: "Production Series",...s}
                setAirplaneData(text.slice(1, text.length)); // 0: {make: "Airbus", model: "A220-300", …} 1: {make: "Airbus", model: "A320neo", …}
            });

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            firebase.app();
        }

        // This 20% will be immediately called after d3 begins processing the csv
        setProgress(20);

        const authUnregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setIsLoggedIn(true);
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        })
        setProgress(30);

        return function cleanup() {
            authUnregisterFunction();
        }
    }, []);


    // Show 50% for 0.5 second before proceeding for user-friendliness
    if (progress === 50) {
        setTimeout(() => {setProgress(51);}, 500);
    }

    if (progress !== 51) {
        return <LoadingPage progress={progress} />;
    }

    return (
        <LoadUserData airplaneDisplayMetaName={airplaneDisplayMetaName}
                      airplaneData={airplaneData}
                      isLoggedIn={isLoggedIn}
                      user={user} />
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

function LoadUserData(props) {
    const [progress, setProgress] =  useState(50);
    const [starRating, setStarRating] = useState({});
    const [favoriteHeart, setFavoriteHeart] = useState([]);
    const [noteContent, setNoteContent] = useState({});
    const [errorMsg, setErrorMsg] = useState(false);
    useEffect(()=> {
        if(!props.isLoggedIn) {
            setProgress(100);
        } else if (props.user === null && props.isLoggedIn) {
            setErrorMsg(true);
        } else {
            // Load Star Rating data
            const starRef = firebase.database().ref('users/' + props.user.uid + '/starRatings/');
            starRef.once('value', (snapshot) => {
                const result = snapshot.val();
                // When no rating data present
                if (result === undefined || result === null) {
                    // Set the initial rating of all plane to 0 (if the value changes, the star-rendering will change)
                    let initialRating = {};
                    for (let onePlane of props.airplaneData) {
                        initialRating[onePlane["icao-pic"].toLowerCase()] = 0;
                    }
                    setStarRating(initialRating);
                } else {
                    setStarRating(result);
                }
            }).then(()=> {
                setProgress(progress=> progress + 16);
            });

            // Load Favorite Plane Heart data
            const favoriteHeartRef = firebase.database().ref("users/" + props.user.uid + '/favoritePlanes/');
            favoriteHeartRef.once('value', (snapshot) => {
                const result = snapshot.val();
                // When no rating data present
                if (!(result === undefined || result === null)) {
                    let hearts = [];
                    for (let oneKey of Object.keys(result)) {
                        hearts.push(result[oneKey]);
                    }
                    setFavoriteHeart(hearts);
                }
            }).then(()=> {
                setProgress(progress=> progress + 16);
            });

            // Load Note data
            const noteRef = firebase.database().ref('users/' + props.user.uid + '/privateNotes/');
            noteRef.once('value', (snapshot) => {
                const result = snapshot.val();
                if (result !== undefined) {
                    setNoteContent(result);
                }
            }).then(()=> {
                setProgress(progress=> progress + 18);
            });
        }
    }, [props.airplaneData, props.isLoggedIn, props.user]);

    if (errorMsg) {
        return <AccountErrorMsgBanner />;
    }

    // Show 100% for 0.8 second before proceeding for user-friendliness
    if (progress === 100) {
        setTimeout(() => {setProgress(-1);}, 800);
    }

    if (progress !== -1) {
        return <LoadingPage progress={progress} />;
    }

    return (
        <AppLoaded airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                   airplaneData={props.airplaneData}
                   user={props.user}
                   isLoggedIn={props.isLoggedIn}
                   favoriteHeart={favoriteHeart}
                   starRating={starRating}
                   noteContent={noteContent}/>
    );
}

function AccountErrorMsgBanner(props){
    return (
        <>
            <SiteHeader appName="AeroView" logo="/img/branding-logo.svg" navLinks={[]} />
            <PageJumbotron title='Account Error' />
            <main>
                <Alert color="danger">
                    <div className="alert-heading">Failed to retrieve userdata</div>
                    <p>You're logged in, but we could not fetch your user data.</p>
                </Alert>
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
 * - isLoggedIn: a boolean value that determines whether the user logs in to the site
 * - favoriteHeart: an array that represents favorite
 * - starRating: object of the user's star rating of all airplane
 * - noteContent: the user's note content object
 */
function AppLoaded(props) {
    // To preserve dashboard view, it must be an app-level state defined here
    const [dashboardView, setDashboardView] = useState(DASHBOARD_VIEWS.LIST);

    // Handle change of 1 airplane's favorite toggle (all favorite airplanes' all-lowercase icao code is stored in this array)
    const [favoritePlanes, setFavoritePlanes] = useState(props.favoriteHeart);
    const updateFavoritePlane = icao => {
        const newFavoritePlane = toggleElementInArray(icao, favoritePlanes);

        if (props.isLoggedIn) {
            const usersRef = firebase.database().ref("users/" + props.user.uid + '/favoritePlanes/');
            usersRef.set(newFavoritePlane);
        }
        setFavoritePlanes(newFavoritePlane);
    }

    // Handle change of 1 airplane's star rating
    const [planeRating, setRating] = useState(props.starRating);
    const updatePlaneRating = (icao, rating) => {
        let updatedPlaneRating = { ...planeRating } // object copy
        // User can remove rating (0 star) by clicking on the same rating star again
        if (rating === updatedPlaneRating[icao]) {
            updatedPlaneRating[icao] = 0;
        } else {
            updatedPlaneRating[icao] = rating;
        }
        setRating(updatedPlaneRating);
        if (props.isLoggedIn) {
            const usersRef = firebase.database().ref('users/' + props.user.uid + '/starRatings/');
            usersRef.set(updatedPlaneRating);
        }
    }

    // Functions that handle note-taking textbox content change
    const [noteContent, setNoteContent] = useState(props.noteContent);
    const handleContentChange = (icao, newContent) => {
        let updatedContent = { ...noteContent } // object copy
        updatedContent[icao] = newContent;

        if (props.isLoggedIn) {
            const usersRef = firebase.database().ref('users/' + props.user.uid + '/privateNotes/');
            usersRef.set(updatedContent);
        }
        setNoteContent(updatedContent);
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
                            content={noteContent} handleContentChangeFn={handleContentChange}
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
