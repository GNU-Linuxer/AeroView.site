import React, {useState} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {faListUl, faThLarge, faSearch, faFilter, faEllipsisV} from '@fortawesome/free-solid-svg-icons'
// Load custom style sheet
import './css/dashboard-filter.css';
import './css/site-elements.css';
import './css/site-grid.css';
import './css/site-list.css';
import './css/style.css';
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
                {window.outerWidth>=768 ? <SearchBoxAndBtn/> : ''}
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
            <FontAwesomeIcon icon={['fas', 'list-ul']} />
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
            <FontAwesomeIcon icon={['fas', 'th-large']} />
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
    return(
        <div className="search-form-container" id="search-form-stub-desktop">
            <form role="search" onSubmit={handleSubmit}>
                <div className="search-bar-container">
                    <input type="text" placeholder="Type to search" onChange={handleChange} value={inputValue} className="search-textbox" id="search-textbox" required=""/>
                    <button type="submit" aria-label="search" id="search-button"><FontAwesomeIcon icon={['fas', 'search']} /></button>
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
                <FontAwesomeIcon icon={['fas', 'filter']} />
            </button>
        </div>

        <div>
            <button id="edit-button" aria-label="edit" data-toggle="dropdown" data-flip="false" aria-expanded="false"
                    aria-haspopup="true">
                <FontAwesomeIcon icon={['fas', 'ellipsis-v']} />
            </button>
        </div>
        </div>
    )
}

// A filter button and its dropdown content
 function FilterButton() {
     const [dropdownOpen, setDropdownOpen] = useState(false);

     const toggle = () => setDropdownOpen(prevState => !prevState);

     return (
         <Dropdown isOpen={dropdownOpen} toggle={toggle}>
             <DropdownToggle id="filter-button" aria-label="filter" aria-expanded={false} aria-haspopup={true}>
                 <FontAwesomeIcon icon={['fas', 'filter']} />
             </DropdownToggle>
             <DropdownMenu flip={false}>
                 <DropdownItem header>Header</DropdownItem>
                 <DropdownItem>Some Action</DropdownItem>
                 <DropdownItem text>Dropdown Item Text</DropdownItem>
                 <DropdownItem disabled>Action (disabled)</DropdownItem>
                 <DropdownItem divider />
                 <DropdownItem>Foo Action</DropdownItem>
                 <DropdownItem>Bar Action</DropdownItem>
                 <DropdownItem>Quo Action</DropdownItem>
             </DropdownMenu>
         </Dropdown>
     );
 }

export function Example() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                Dropdown
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>Header</DropdownItem>
                <DropdownItem>Some Action</DropdownItem>
                <DropdownItem text>Dropdown Item Text</DropdownItem>
                <DropdownItem disabled>Action (disabled)</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Foo Action</DropdownItem>
                <DropdownItem>Bar Action</DropdownItem>
                <DropdownItem>Quo Action</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}