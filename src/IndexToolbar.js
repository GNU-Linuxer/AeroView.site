import React, {useState} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faListUl, faThLarge, faSearch, faFilter, faEllipsisV} from '@fortawesome/free-solid-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
// Reactstrap depends on bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Load font awesome icon, MUST add everything if defined in import {***, ***} from '@fortawesome/free-solid-svg-icons'
library.add(faListUl, faThLarge, faSearch, faFilter, faEllipsisV);

export default function IndexToolbar(props) {
    /* props:
        viewSelection: accept "List" and "Grid" string that denote current view selection
     */
    //props.selection = "List";
    return (
        <div className="dashboard-widgets">
            {/* Mobile search goes here*/}
            <div className="options">
                <div className="selector-group view-selector-group">
                    <ListButton selected={props.viewSelection === "List"}/>
                    <span aria-hidden="true" className="separator">/</span>
                    <GridButton selected={props.viewSelection === "Grid"}/>
                </div>
                {/*Desktop search bar that will display when width >= 768*/}
                {window.outerWidth >= 768 ? <SearchBoxAndBtn/> : ''}
                <div className="selector-group content-selector-group">
                    <FilterButton/>
                </div>
            </div>
        </div>
    );
}

// This element defines a list button and the List text
function ListButton(props) {
    /* Props:
        selected: Boolean value that denote whether List view is selected
        selectListCallback: the callback function when user clicks on List view button
     */
    let selectedClass = "";
    if (props.selected) {
        selectedClass = "selected-view";
    } else {
        selectedClass = "";
    }

    const handleListClick = (event) => {
        event.preventDefault();
        console.log('checkpoint!');
        //props.selectListCallback();
    }

    return (
        <button onClick={handleListClick} id="list-view-btn" aria-label="switch to list view" className={selectedClass}>
            <FontAwesomeIcon icon={['fas', 'list-ul']}/>
            <span className="button-description">&nbsp;<u>L</u>ist</span>
        </button>
    )
}

// This element defines a grid button and the Grid text
function GridButton(props) {
    /* Props:
        selected: Boolean value that denote whether List view is selected
        selectGridCallback: the callback function when user clicks on Grid view button
     */
    let selectedClass = "";
    if (props.selected) {
        selectedClass = "selected-view";
    } else {
        selectedClass = "";
    }

    const handleGridClick = (event) => {
        event.preventDefault();
        // console.log('checkpoint!');
        //props.selectGridCallback();
    }

    return (
        <button onClick={handleGridClick} id="grid-view-btn" aria-label="switch to grid view" className={selectedClass}>
            <FontAwesomeIcon icon={['fas', 'th-large']}/>
            <span className="button-description">&nbsp;<u>G</u>rid</span>
        </button>
    )
}

function SearchBoxAndBtn(props) {
    /* Props:
        searchCallBack: the callback function when user submit search input content
            This function takes the search input string as the only argument
     */

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
        console.log(inputValue);
        //props.searchCallBack(inputValue);
    }
    return (
        <div className="search-form-container" id="search-form-stub-desktop">
            <form role="search" onSubmit={handleSubmit}>
                <div className="search-bar-container">
                    <input type="text" placeholder="Type to search" onChange={handleChange} value={inputValue}
                           className="search-textbox" id="search-textbox" required=""/>
                    <button type="submit" aria-label="search" id="search-button"><FontAwesomeIcon
                        icon={['fas', 'search']}/></button>
                </div>
            </form>
        </div>
    )
}

// this element will render the filter and option button
function ContentViewSelectors(props) {
    /*
        allPlane: an array of objects, where 1 object describe 1 airplane
     */
    return (
        <div className="selector-group content-selector-group">
            <div>
                {/*Prevent the dropdown menu from flipping up when no enough space below remains*/}
                {/*see https://getbootstrap.com/docs/4.1/components/dropdowns/#options*/}
                <button id="filter-button" aria-label="filter" data-toggle="dropdown" data-flip="false"
                        aria-expanded="false" aria-haspopup="true">
                    <FontAwesomeIcon icon={['fas', 'filter']}/>
                </button>
            </div>

            <div>
                <button id="edit-button" aria-label="edit" data-toggle="dropdown" data-flip="false"
                        aria-expanded="false"
                        aria-haspopup="true">
                    <FontAwesomeIcon icon={['fas', 'ellipsis-v']}/>
                </button>
            </div>
        </div>
    )
}

// A filter button and its dropdown content
// Code regarding multi-select checkbox handling is adapted from https://medium.com/@tariqul.islam.rony/multiple-checkbox-handling-by-react-js-84b1d49a46c6
// With modification to suit the new React coding style
function FilterButton() {
    // States for ReactStrap dropdown management
    const [dropdownOpen, setDropdownOpen] = useState(false); // whether the dropdown intially open when page loades
    const toggle = () => setDropdownOpen(prevState => !prevState);

    //States for Type selection (when checkbox changes, isChecked in type variable will also change appropriately
    const [type, setType] = useState([
            {id: 1, value: "Narrow-body Jet", isChecked: true},
            {id: 2, value: "Wide-body Jet", isChecked: true},
            {id: 3, value: "Double-Decker", isChecked: true},
            ])
    const handleTypeSelection = (event) => {
        let updatedType = [...type];
        for (let oneType of updatedType) {
            if (oneType.value === event.target.value) {
                oneType.isChecked = event.target.checked;
            }
        }
        //console.log(updatedType);
        setType(updatedType);
    }
    let TypeCheckBoxElem = type.map((oneObj) => oneCheckboxElem(oneObj, handleTypeSelection));

    //States for Manufacture selection
    const [make, setMake] = useState([
        {id: 1, value: "Boeing", isChecked: true},
        {id: 2, value: "Airbus", isChecked: true},
        {id: 3, value: "Irkut", isChecked: false}
    ])
    const handleMakeSelection = (event) => {
        let updatedType = [...make];
        for (let oneType of updatedType) {
            if (oneType.value === event.target.value) {
                oneType.isChecked = event.target.checked;
            }
        }
        //console.log(updatedType);
        setMake(updatedType);
    }
    let MakeCheckBoxElem = make.map((oneObj) => oneCheckboxElem(oneObj, handleMakeSelection));

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
            <DropdownToggle id="filter-button" aria-label="filter" aria-expanded={false} aria-haspopup={true}>
                <FontAwesomeIcon icon={['fas', 'filter']}/>
            </DropdownToggle>
            <DropdownMenu right={true} flip={false}>
                <ul className="filter-dropdown-menu checkbox-menu">
                    {TypeCheckBoxElem}
                    <DropdownItem divider />
                    {MakeCheckBoxElem}
                </ul>
            </DropdownMenu>
        </Dropdown>
    );
}

// This function will return an element, taking an object with id, value, and isChecked properties
// This function is useful for the Array.map operation
// Code adapted from https://medium.com/@tariqul.islam.rony/multiple-checkbox-handling-by-react-js-84b1d49a46c6
function oneCheckboxElem(oneObj, changeCallBack) {
    return (
        <li key={oneObj.id}>
            <input type="checkbox" checked={oneObj.isChecked} value={oneObj.value} onChange={changeCallBack} /> {oneObj.value}
        </li>);
}