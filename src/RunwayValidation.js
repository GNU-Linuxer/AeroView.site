import React, {useState} from 'react';
import Autosuggest from 'react-autosuggest';
// TODO: load external .json files using AJAX request
import {default as airportName} from './data/airport-icao-name.json';
import {default as runway} from './data/airport-icao-longest-runway-ft.json';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from 'reactstrap';

// This component will load airport name and runway data to present (to user) whether a plane input can take off and run on this airport

const METER_TO_FEET= 3.28; // 1 meter ≈ 3.28 feet

export default function RunwayValidation(props) {
    /* props:
        icao: the icao of airplane
        airplaneData: an array of objects: 1 object represent 1 airplane whose
            Note: this airplane's takeoff and distance are in meter per original source
     */


    // Fetch this airplane's takeoff and landing distance
    let takeoff=0;
    let landing=0;
    let fullName = '';

    for(let onePlane of props.airplaneData) {
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
    const[airportICAO, setAirportICAO] = useState('');


    // Note the icao is the airport's icao code (case-sensitive)
    const buttonCallBack = function(icao) {
        setAirportICAO(icao);
    }

    let returnElem = [];
    returnElem.push(<p key='introduction'>Type an ICAO code or airport name (partial name is OK)</p>);
    returnElem.push(<SearchAirport buttonCallBackFn={buttonCallBack} key='search airport'/>);
    // Only render the comparison result when there's something selected
    if (airportICAO.length > 0) {
        returnElem.push(<DisplayResult icao={airportICAO} fullName={props.fullName} takeoff={props.takeoff} landing={props.landing} key='comparison result'/>);
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

    const[value, setValue] = useState('');
    const[suggestions, setSuggestions] = useState([]);

    let onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    let onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    let onSuggestionsClearRequested = () => {
        setSuggestions([]);
    }

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
            placeholder: 'Type anything...',
            value,
            onChange: onChange
        };


    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = function(value) {
        const inputValue = value.trim();
        const inputLength = inputValue.length;

        let suggestionArr = []; // Arrays of objects
        const MAX_SUGGESTION = 8;
        let counter = 0;
        if (inputLength !== 0) {
            // first, check whether user is typing an ICAO code (this shall be first result)
            for (let oneKey of Object.keys(airportName)) {
                //console.log(oneKey);
                //console.log(airportName[oneKey]);
                //console.log(typeof(airportName[oneKey]));
                if (counter > MAX_SUGGESTION) {
                    break; // Terminate for-loop early if we reach maximum number of suggestion
                } else if (airportName[oneKey].startsWith(value)){
                    suggestionArr.push({icao: oneKey, name: airportName[oneKey]});
                    counter = counter + 1;
                }
            }
            // then, check whether user's input contains airport name
            for (let oneKey of Object.keys(airportName)) {
                if (counter > MAX_SUGGESTION) {
                    break;
                    // Compare only to the airport name after — (long dash), such as "Seattle Tacoma International Airport" in "KSEA — Seattle Tacoma International Airport"
                    // Ignore case when comparing user input to value
                } else if (airportName[oneKey].substring(airportName[oneKey].indexOf('—') + 1).toLowerCase().includes(value.toLowerCase())){
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
    const getSuggestionValue = function(suggestion) {
        // Example value: KSEA  Seattle Tacoma International Airport
        return suggestion.name.substring(0, suggestion.name.indexOf('—') - 1) + " " + suggestion.name.substring(suggestion.name.indexOf('—') + 1);
    }

    // Use your imagination to render suggestions.
    const renderSuggestion = function(suggestion){
        // Note that suggestion is ONE suggestion object only (NOT an array of candidate objects)
        return(
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
    const onSuggestionSelected = function(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
        event.preventDefault();
        //console.log(suggestion);
        props.buttonCallBackFn(suggestion['icao']); // this function's argument is the case-sensitive airport icao code
    }


    // Finally, render it!
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
}

function DisplayResult(props) {
    /* props:
        icao: the airport's icao
        fullName: the airplane's full name
        takeoff: the plane's takeoff distance in meter
        landing: the plane's landing distance in meter
     */


    const AIRPORT_RUNWAY_FT = parseInt(runway[props.icao]);
    console.log(AIRPORT_RUNWAY_FT);
    console.log(props.takeoff);

    const TAKEOFF_FT = props.takeoff * METER_TO_FEET;
    const LANDING_FT = props.landing * METER_TO_FEET;

    let returnElem = [];
    if (TAKEOFF_FT < AIRPORT_RUNWAY_FT) {
        returnElem.push(<Alert color='success' key='can takeoff'><div>{props.fullName + " can takeoff in this airport."}</div></Alert>);
    } else {
        returnElem.push(<Alert color='danger' key='can not takeoff'><div>{props.fullName + " can not takeoff in this airport."}</div></Alert>);
    }

    if (LANDING_FT < AIRPORT_RUNWAY_FT) {
        returnElem.push(<Alert color='success' key='can land'><div>{props.fullName + " can land in this airport."}</div></Alert>);
    } else {
        returnElem.push(<Alert color='danger' key='can not land'><div>{props.fullName + " can not land in this airport."}</div></Alert>);
    }

    return(
        <>
            {returnElem}
        </>
    );
}