import React, {useEffect, useState} from 'react';
import Autosuggest from 'react-autosuggest';

// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Spinner} from 'reactstrap';

// This component will load airport name and runway data to present (to user) whether a plane input can take off and run on this airport

const METER_TO_FEET = 3.28; // 1 meter ≈ 3.28 feet

export default function RunwayValidation(props) {
    /* props:
        icao: the icao of airplane
        airplaneData: an array of objects: 1 object represent 1 airplane whose
            Note: this airplane's takeoff and distance are in meter per original source
     */

    const [runway, setRunway] = useState({});
    const [airportName, setAirportName] = useState({});
    const [takeoff, setTakeoff] = useState(0);
    const [landing, setLanding] = useState(0);
    const [fullName, setFullName] = useState('');
    // On developer console, each fetch call is called twice, lengthen the time for device on slow 3G network
    const [isRunwayDataLoaded, setIsRunwayDataLoaded] = useState(false);
    const [isAirportDataLoaded, setIsAirportDataLoaded] = useState(false);
    const [isAirplaneDataLoaded, setIsAirplaneDataLoaded] = useState(false);

    useEffect(() => {
        // Fetch the longest airport runway data
        fetch("/data/airport-icao-longest-runway-ft.json")
            .then(res => {
                return res.json();
            })
            .then((data) => {
                setRunway(data);
            }).then(() => setIsRunwayDataLoaded(true));
        // Immediately set this value to true to prevent calling this fetch again


        // Fetch the airport name data
        fetch("/data/airport-icao-name.json")
            .then(res => {
                return res.json();
            })
            .then((data) => {
                setAirportName(data);
            }).then(() => setIsAirportDataLoaded(true));
        // Immediately set this value to true to prevent calling this fetch again

        // Fetch this airplane's takeoff and landing distance
        for (let onePlane of props.airplaneData) {
            if (onePlane['icao-pic'].toLowerCase() === props.icao) {
                setTakeoff(onePlane['takeoff_dis']); // unit is in metric meter
                setLanding(onePlane['land_dis']); // unit is in metric meter
                setFullName(onePlane['make'] + ' ' + onePlane['model']);
            }
        }
        setIsAirplaneDataLoaded(true);
    }, [props.airplaneData, props.icao]);

    // Render a spinner when any of the data is still loading
    if (!(isRunwayDataLoaded && isAirportDataLoaded && isAirplaneDataLoaded)) {
        return (
            <div className="runway-validation-spinner">
                <h1> Loading Runway Data...</h1>
                <Spinner color="primary" className="splash-spinner"/>
            </div>
        );
    }

    // Once data is loaded, return the actual component
    return (
        <ContentContainer fullName={fullName} takeoff={takeoff} landing={landing} runway={runway}
                          airportName={airportName}/>
    );
}

function ContentContainer(props) {
    /* props:
        fullName: the airplane's full name
        takeoff: the plane's takeoff distance in meter
        landing: the plane's landing distance in meter
        runway: an Object representing airport's icao code and its longest runway data
        airportName: an Object representing airport's icao code and their names
     */
    const [airportICAO, setAirportICAO] = useState('');

    // Clear out the airport icao selection when called
    const clearAirport = () => setAirportICAO('');

    // Note the icao is the airport's icao code (case-sensitive)
    const selectAirport = function (icao) {
        setAirportICAO(icao);
    }

    let returnElem = [];
    returnElem.push(<h1 key='title'>{"Airports"}</h1>);
    returnElem.push(<p
        key='introduction'>{"Find whether " + props.fullName + " can take off and land at your favorite airport"}</p>);
    returnElem.push(<SearchAirport selectAirportFn={selectAirport} clearAirportFn={clearAirport} key='search airport'
                                   airportName={props.airportName}/>);
    // Only render the comparison result when there's something selected
    if (airportICAO.length > 0) {
        returnElem.push(<DisplayResult icao={airportICAO}
                                       fullName={props.fullName}
                                       takeoff={props.takeoff}
                                       landing={props.landing}
                                       airportName={props.airportName}
                                       runway={props.runway}
                                       key='comparison result'/>);
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
        selectAirportFn: a callback function reference when a suggestion item is clicked
        clearAirportFn: a callback function reference when x button is clicked
        airportName: an Object representing airport's icao code and their names
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
        props.clearAirportFn();
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
        let numSuggestion;
        if (window.innerWidth >= 576) {
            numSuggestion = 10;
        } else {
            // Limit the suggestion number on mobile phones
            numSuggestion = 5;
        }
        let counter = 0;
        if (inputLength !== 0) {
            // first, check whether user is typing an ICAO code (this shall be first result)
            for (let oneKey of Object.keys(props.airportName)) {
                //console.log(oneKey);
                //console.log(airportName[oneKey]);
                //console.log(typeof(airportName[oneKey]));
                if (counter >= numSuggestion) {
                    break; // Terminate for-loop early if we reach maximum number of suggestion
                } else if (props.airportName[oneKey].toLowerCase().startsWith(value.toLowerCase())) {
                    suggestionArr.push({icao: oneKey, name: props.airportName[oneKey]});
                    counter = counter + 1;
                }
            }
            // then, check whether user's input contains airport name
            for (let oneKey of Object.keys(props.airportName)) {
                if (counter >= numSuggestion) {
                    break;
                    // Compare only to the airport name after — (long dash), such as "Seattle Tacoma International Airport" in "KSEA — Seattle Tacoma International Airport"
                    // Ignore case when comparing user input to value
                } else if (props.airportName[oneKey].substring(props.airportName[oneKey].indexOf('—') + 1).toLowerCase().includes(value.toLowerCase())) {
                    suggestionArr.push({icao: oneKey, name: props.airportName[oneKey]});
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
        props.selectAirportFn(suggestion['icao']); // this function's argument is the case-sensitive airport icao code
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
        runway: an Object representing airport's icao code and its longest runway data
        airportName: an Object representing airport's icao code and their names
     */

    let returnElem = [];
    const airport = props.airportName[props.icao].substring(props.airportName[props.icao].indexOf('—') + 1)
    // Sometimes we have airport data but no runway data
    if (props.runway[props.icao] === undefined) {
        returnElem.push(<Alert color='info' key='airport not found'>
            <div>Sorry, we <strong>don't have runway data</strong>{" for " + airport}</div>
        </Alert>);
    } else {
        const airportRunwayFt = parseInt(props.runway[props.icao]);
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