import React, {useState} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {faListUl, faThLarge, faSearch} from '@fortawesome/free-solid-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faListUl, faThLarge, faSearch);

export default function IndexToolbar() {
    /* props:
        selection: accept "List" and "Grid" string that denote current view selection
     */
    //props.selection = "List";
    return (
        <div className="dashboard-widgets">
            {/* Mobile search goes here*/}
            <div className="options">
                <IndexViewSelectors selection ="List"/>
                {/*Desktop search bar that will display when width >= 768*/}
                {window.outerWidth>=768 ? <SearchBoxAndBtn/> : ''}
            </div>
        </div>
    );
}

// This element holds list view and grid view toggle switches
function IndexViewSelectors(props) {
    /* props:
        selection: accept "List" and "Grid" string that denote current view selection
     */
    return(
        <div className="selector-group view-selector-group">
            <ListButton selected={props.selection === "List"}/>
            <span aria-hidden="true" className="separator">/</span>
            <GridButton selected={props.selection === "Grid"}/>
        </div>
    )
}

// This element defines a list button and the List text
function ListButton(props) {
    /* Props:
        selected: Boolean value that denote whether List view is selected
     */
    let selectedClass = "";
    if (props.selected) {
        selectedClass = "selected-view";
    } else {
        selectedClass = "";
    }
    return (
        <button id="list-view-btn" aria-label="switch to list view" className={selectedClass}>
            <FontAwesomeIcon icon={['fas', 'list-ul']} />
            <span className="button-description">&nbsp;<u>L</u>ist</span>
        </button>
    )
}

// This element defines a grid button and the Grid text
function GridButton(props) {
    /* Props:
        selected: Boolean value that denote whether List view is selected
     */
    let selectedClass = "";
    if (props.selected) {
        selectedClass = "selected-view";
    } else {
        selectedClass = "";
    }
    return (
        <button id="grid-view-btn" aria-label="switch to grid view" className={selectedClass}>
            <FontAwesomeIcon icon={['fas', 'th-large']} />
            <span className="button-description">&nbsp;<u>G</u>rid</span>
        </button>
    )
}

function SearchBoxAndBtn() {
    // Interactions about handle input text is adapted from course textbook and INFO 340's demo video
    const [inputValue, setInputValue] = useState('')//initialize as empty string

    //respond to input changes
    const handleChange = (event) => {
        //get the value that the <input> now has
        let newValue = event.target.value

        //update the state to use that new value, rendering the component
        setInputValue(newValue);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(inputValue);

    }
    return(
        <div className="search-form-container" id="search-form-stub-desktop">
            <form role="search" onSubmit={handleSubmit}>
                <div className="search-bar-container">
                    <input type="text" placeholder="Type to search" onChange={handleChange} value={inputValue} className="search-textbox" id="search-textbox" required=""/>
                    <button onClick={handleSubmit} aria-label="search" id="search-button"><FontAwesomeIcon icon={['fas', 'search']} /></button>
                </div>
            </form>
        </div>
    )
}