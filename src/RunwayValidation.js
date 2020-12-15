import React, {useState} from 'react';
import Autosuggest from 'react-autosuggest';

import {default as airportName} from './data/airport-icao-name.json';
import {default as runway} from './data/airport-icao-longest-runway-ft.json';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from 'reactstrap';

// Font-awesome embed
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faHeart, faStar, faChevronCircleDown} from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faStar as regularStar} from '@fortawesome/free-regular-svg-icons'

library.add(faHeart, faStar, faChevronCircleDown, regularHeart, regularStar);


// This component will load airport name and runway data to present (to user) whether a plane input can take off and run on this airport

const METER_TO_FEET = 3.28; // 1 meter ≈ 3.28 feet

export default function RunwayValidation(props) {
    /* props:
        icao: the icao of airplane
        airplaneData: an array of objects: 1 object represent 1 airplane whose
            Note: this airplane's takeoff and distance are in meter per original source
     */


    // Fetch this airplane's takeoff and landing distance
    let takeoff = 0;
    let landing = 0;
    let fullName = '';

    for (let onePlane of props.airplaneData) {
        if (onePlane['icao-pic'].toLowerCase() === props.icao) {
            takeoff = onePlane['takeoff_dis']; // unit is in metric meter
            landing = onePlane['land_dis']; // unit is in metric meter
            fullName = onePlane['make'] + ' ' + onePlane['model'];
        }
    }

    return (
        <ContentContainer fullName={fullName} takeoff={takeoff} landing={landing}/>
    );
}

function ContentContainer(props) {
    /* props:
        fullName: the airplane's full name
        takeoff: the plane's takeoff distance in meter
        landing: the plane's landing distance in meter
     */
    const [airportICAO, setAirportICAO] = useState('');


    // Note the icao is the airport's icao code (case-sensitive)
    const buttonCallBack = function (icao) {
        setAirportICAO(icao);
    }

    let returnElem = [];
    returnElem.push(<h1 key='title'>{"Airports"}</h1>);
    returnElem.push(<p
        key='introduction'>{"Find whether " + props.fullName + " can take off and land at your favorite airport"}</p>);
    returnElem.push(<SearchAirport buttonCallBackFn={buttonCallBack} key='search airport'/>);
    // Only render the comparison result when there's something selected
    if (airportICAO.length > 0) {
        returnElem.push(<DisplayResult icao={airportICAO} fullName={props.fullName} takeoff={props.takeoff}
                                       landing={props.landing} key='comparison result'/>);
    }

    return (
        <div className='runway-validation-parent-container'>
            {returnElem}
        </div>
    );
}


// This component is adapted from https://github.com/moroshko/react-autosuggest#basic-usage
// Use modern function syntax to create component
function SearchAirport(props) {
    /* props:
        buttonCallBackFn: a callback function reference when an item is clicked
     */

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.

    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const onChange = (event, {newValue}) => {
        setValue(newValue);
    };

    // This function will clear the input and suggestion
    const clearInput = function () {
        setValue('');
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ({value}) => {
        setSuggestions(getSuggestions(value));
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    }

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
        placeholder: 'Type anything: airport name, code...',
        value,
        onChange: onChange
    };


    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = function (value) {
        const inputValue = value.trim();
        const inputLength = inputValue.length;

        let suggestionArr = []; // Arrays of objects
        let numSuggestion = 0;
        if (window.innerWidth >= 576) {
            numSuggestion = 10;
        } else {
            // Limit the suggestion number on mobile phones
            numSuggestion = 5;
        }
        let counter = 0;
        if (inputLength !== 0) {
            // first, check whether user is typing an ICAO code (this shall be first result)
            for (let oneKey of Object.keys(airportName)) {
                //console.log(oneKey);
                //console.log(airportName[oneKey]);
                //console.log(typeof(airportName[oneKey]));
                if (counter >= numSuggestion) {
                    break; // Terminate for-loop early if we reach maximum number of suggestion
                } else if (airportName[oneKey].toLowerCase().startsWith(value.toLowerCase())) {
                    suggestionArr.push({icao: oneKey, name: airportName[oneKey]});
                    counter = counter + 1;
                }
            }
            // then, check whether user's input contains airport name
            for (let oneKey of Object.keys(airportName)) {
                if (counter >= numSuggestion) {
                    break;
                    // Compare only to the airport name after — (long dash), such as "Seattle Tacoma International Airport" in "KSEA — Seattle Tacoma International Airport"
                    // Ignore case when comparing user input to value
                } else if (airportName[oneKey].substring(airportName[oneKey].indexOf('—') + 1).toLowerCase().includes(value.toLowerCase())) {
                    suggestionArr.push({icao: oneKey, name: airportName[oneKey]});
                    counter = counter + 1;
                }
            }
        }

        return suggestionArr;
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    const getSuggestionValue = function (suggestion) {
        // Example value: KSEA  Seattle Tacoma International Airport
        return suggestion.name.substring(0, suggestion.name.indexOf('—') - 1) + " " + suggestion.name.substring(suggestion.name.indexOf('—') + 1);
    }

    // Use your imagination to render suggestions.
    const renderSuggestion = function (suggestion) {
        // Note that suggestion is ONE suggestion object only (NOT an array of candidate objects)
        return (
            <span>
                <span className='suggestionICAO'>
                    {suggestion.name.substring(0, suggestion.name.indexOf('—') - 1)}
                </span>
                <span>&nbsp;</span>
                <span>
                    {suggestion.name.substring(suggestion.name.indexOf('—') + 1)}
                </span>
            </span>
        );
    }

    // How to handle when user clicks on a suggestion
    const onSuggestionSelected = function (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) {
        event.preventDefault();
        //console.log(suggestion);
        props.buttonCallBackFn(suggestion['icao']); // this function's argument is the case-sensitive airport icao code
    }

    const renderInputComponent = inputProps => (
        <div>
            <input {...inputProps} />
            <button onClick={clearInput} className='clear-button'>X</button>
        </div>
    );

    // Finally, render it!
    return (
        <span>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    onSuggestionSelected={onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderInputComponent={renderInputComponent}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            {/*<button onClick={clearInput} className='clear-button'>X</button>*/}
            </span>
    );
}

function DisplayResult(props) {
    /* props:
        icao: the airport's icao
        fullName: the airplane's full name
        takeoff: the plane's takeoff distance in meter
        landing: the plane's landing distance in meter
     */

    let returnElem = [];
    const airport = airportName[props.icao].substring(airportName[props.icao].indexOf('—') + 1)
    // Sometimes we have airport data but no runway data
    if (runway[props.icao] === undefined) {
        returnElem.push(<Alert color='info' key='airport not found'>
            <div>Sorry, we <strong>don't have runway data</strong>{" for " + airport}</div>
        </Alert>);
    } else {
        const airportRunwayFt = parseInt(runway[props.icao]);
        //console.log(airportRunwayFt);
        //console.log(props.takeoff);

        const takeoffFt = props.takeoff * METER_TO_FEET;
        const landingFt = props.landing * METER_TO_FEET;

        const canTakeoff = takeoffFt < airportRunwayFt;
        returnElem.push(<Alert color={canTakeoff ? 'success' : 'danger'} key='takeoff'>
            <div>{props.fullName + " "}<strong>{canTakeoff ? 'can takeoff' : 'can not takeoff'}</strong>{" in " + airport}
            </div>
        </Alert>);

        const canLand = landingFt < airportRunwayFt;
        returnElem.push(<Alert color={canLand ? 'success' : 'danger'} key='landing'>
            <div>{props.fullName + " "}<strong>{canLand ? 'can land' : 'can not land'}</strong>{" in " + airport}</div>
        </Alert>);
    }
    return (
        <>
            {returnElem}
        </>
    );
}