/*
 * This file provides components for the airplane dashboard.
 */

import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { faList, faTh, faFilter, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons'

import { useMobileView } from './util/media-query.js';
import { toggleElementInArray } from './util/array.js';
import ListGridView from './ListGridView.js';

/*
 * A read-only object containing constants that represent views supported by
 * the dashboard
 */
export const DASHBOARD_VIEWS = Object.freeze({
    LIST: 0,
    GRID: 1,
});

/*
 * An array of metadata keys that are always shown in the presentation
 */
export const ALWAYS_SHOWN_METADATA = ['make', 'model', 'icao-pic'];

/*
 * Returns an HTML element for the dashboard.
 *
 * Props:
 * - activeView: the view to be shown selected by the user, which is one of the
 *     constants in global variable 'DASHBOARD_VIEWS'
 * - switchViewCallback: the callback function on view change event, which
 *     takes a single argument for the new view
 * - airplaneDisplayMetaName: an object that maps the shorthand metadata key to
 *     display-friendly full name
 * - airplaneData: an array of objects: 1 object represent 1 airplane whose
 *     metadata key has the metadata value
 * - planeRating: an object that represents each plane's rating
 * - updateRatingFn: the callback function on plane rating change
 * - favoritePlanes: an array of boolean values indicating favorite planes
 * - updateFavoriteFn: the callback function on favorite planes change event,
 *     which takes a single argument for the new favorite planes array
 */
export default function Dashboard(props) {
    const [filteredBrands, setFilteredBrands] = useState([
        'Airbus', 'Boeing'
    ]);
    const [filteredTypes, setFilteredTypes] = useState([
        'Narrow-Body Jet', 'Wide-Body Jet', 'Double-Decker'
    ]);
    const [selectedMetadata, setSelectedMetadata] = useState([
        'cruise_speed', 'mtow', 'psng_cap', 'series', 'psng_cap', 'serv_cell',
        'aisle_wid', 'takeoff_dis', 'wing_span', 'cab_alt'
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    // Listen for keyboard shortcut for switching view
    window.addEventListener('keydown',
            event => switchViewIfRequested(event, props.switchViewCallback));

    return (
        <div className="dashboard">
            <Widgets
                activeView={props.activeView}
                switchViewCallback={props.switchViewCallback}
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}
                brandsToDisplay={filteredBrands}
                typesToDisplay={filteredTypes}
                filteredMeta={selectedMetadata}
                searchTerm={searchTerm}
                changeBrandsCallback={setFilteredBrands}
                changeTypesCallback={setFilteredTypes}
                changeFilteredMetaCallback={setSelectedMetadata}
                searchCallback={setSearchTerm}
            />
            <ListGridView
                activeView={props.activeView}
                // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}
                brandsToDisplay={filteredBrands}
                typesToDisplay={filteredTypes}
                filteredMeta={selectedMetadata}
                planeRating={props.planeRating}
                updateRatingFn={props.updateRatingFn}
                favoritePlanes={props.favoritePlanes}
                updateFavoriteFn={props.updateFavoriteFn}
                searchTerm={searchTerm}
            />
        </div>
    );
};

/*
 * Returns an HTML element for the dashboard toolbar containing widgets that
 * control what are shown.
 *
 * Props:
 * - activeView: the view to be shown selected by the user, which is one of the
 *     constants in global variable 'DASHBOARD_VIEWS'
 * - switchViewCallback: the callback function on view change event, which
 *     takes a single argument for the new view
 * - airplaneDisplayMetaName: an object that maps the shorthand metadata key to
 *     display-friendly full name
 * - airplaneData: an array of objects: 1 object represent 1 airplane whose
 *     metadata key has the metadata value
 * - brandsToDisplay: an array of brand names for filtering airplanes displayed
 * - typesToDisplay: an array of plane types for filtering airplanes displayed
 * - filteredMeta: an array of shorthand metadata keys the user wants to see
 * - searchTerm: the term entered by the user in the search bar
 * - changeBrandsCallback: the callback function on brand filter change, which
 *     takes a single argument for the new array of brands
 * - changeTypesCallback: the callback function on type filter change, which
 *     takes a single argument for the new array of types
 * - changeFilteredMetaCallback: the callback function on change of activated
 *     metadata keys, which takes a single argument for the new array of keys
 * - searchCallback: the callback function on change of the search term, which
 *     takes a single argument for the new search term
 */
function Widgets(props) {
    const mobileView = useMobileView();

    return (
        <div className="dashboard-widgets">
            {mobileView && <SearchBar
                searchTerm={props.searchTerm}
                searchCallback={props.searchCallback}
            />}

            <div className="options">
                <ViewSelector
                    activeView={props.activeView}
                    switchViewCallback={props.switchViewCallback}
                />

                {!mobileView && <SearchBar
                    searchTerm={props.searchTerm}
                    searchCallback={props.searchCallback}
                />}

                <div className="selector-group content-selector-group">
                    <FilterSelector
                        airplaneData={props.airplaneData}
                        brandsToDisplay={props.brandsToDisplay}
                        typesToDisplay={props.typesToDisplay}
                        changeBrandsCallback={props.changeBrandsCallback}
                        changeTypesCallback={props.changeTypesCallback}
                    />
                    <MetadataSelector
                        airplaneData={props.airplaneData}
                        airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                        filteredMeta={props.filteredMeta}
                        changeFilteredMetaCallback={props.changeFilteredMetaCallback}
                    />
                </div>
            </div>
        </div>
    );
}

/*
 * Returns an HTML element for the view selector widget.  It needs the
 * following props passed to 'Widget':
 * - activeView
 * - switchViewCallback
 */
function ViewSelector(props) {
    return (
        <div className="selector-group view-selector-group">
            <button className={props.activeView === DASHBOARD_VIEWS.LIST ? "selected-view" : ""}
                    onClick={() => props.switchViewCallback(DASHBOARD_VIEWS.LIST)}
                    id="list-view-btn" aria-label="switch to list view">
                <FontAwesomeIcon icon={faList} />
                <span className="button-description"><u>L</u>ist</span>
            </button>
            <span aria-hidden="true" className="separator">/</span>
            <button className={props.activeView === DASHBOARD_VIEWS.GRID ? "selected-view" : ""}
                    onClick={() => props.switchViewCallback(DASHBOARD_VIEWS.GRID)}
                    id="grid-view-btn" aria-label="switch to grid view">
                <FontAwesomeIcon icon={faTh} />
                <span className="button-description"><u>G</u>rid</span>
            </button>
        </div>
    );
}

/*
 * Returns an HTML element for the filter selector widget.  It needs the
 * following props passed to 'Widget':
 * - airplaneData
 * - brandsToDisplay
 * - typesToDisplay
 * - changeBrandsCallback
 * - changeTypesCallback
 */
function FilterSelector(props) {
    const [buttonActivated, setButtonActivated] = useState(false);

    let makes = [...new Set(props.airplaneData.map(plane => plane.make))];
    let types = [...new Set(props.airplaneData.map(plane => plane.type))];

    return (
        <ButtonDropdown isOpen={buttonActivated}
                        toggle={() => setButtonActivated(!buttonActivated)}>
            <DropdownToggle tag="button">
                <FontAwesomeIcon icon={faFilter} />
            </DropdownToggle>
            <DropdownMenu right tag="ul" className="checkbox-menu filter-dropdown-menu">
                <DropdownItem header>Type</DropdownItem>
                {types.map(type => <MenuEntry
                    key={type} entryKey={type} entryName={type}
                    selectedKeys={props.typesToDisplay}
                    onSelectionChangeCallback={props.changeTypesCallback} />)}
                <DropdownItem divider />
                <DropdownItem header>Brand</DropdownItem>
                {makes.map(make => <MenuEntry
                    key={make} entryKey={make} entryName={make}
                    selectedKeys={props.brandsToDisplay}
                    onSelectionChangeCallback={props.changeBrandsCallback} />)}
            </DropdownMenu>
        </ButtonDropdown>
    );
}

/*
 * Returns an HTML element for the metadata selector widget.  It needs the
 * following props passed to 'Widget':
 * - airplaneData
 * - airplaneDisplayMetaName
 * - filteredMeta
 * - changeFilteredMetaCallback
 */
function MetadataSelector(props) {
    const [buttonActivated, setButtonActivated] = useState(false);

    let metaKeys = Object.keys(props.airplaneData[0]);

    return (
        <ButtonDropdown isOpen={buttonActivated}
                        toggle={() => setButtonActivated(!buttonActivated)}>
            <DropdownToggle tag="button">
                <FontAwesomeIcon icon={faEllipsisV} />
            </DropdownToggle>
            <DropdownMenu right tag="ul" className="checkbox-menu option-dropdown-menu">
                <DropdownItem header>Metadata to display</DropdownItem>
                {metaKeys
                    .filter(metaKey => ALWAYS_SHOWN_METADATA.indexOf(metaKey) === -1)
                    .map(metaKey => <MenuEntry
                        key={metaKey}
                        entryKey={metaKey}
                        entryName={props.airplaneDisplayMetaName[metaKey]}
                        selectedKeys={props.filteredMeta}
                        onSelectionChangeCallback={props.changeFilteredMetaCallback} />)
                }
            </DropdownMenu>
        </ButtonDropdown>
    );
}

/*
 * Returns an HTML element for a single entry in a dropdown menu.  The entry
 * contains a checkbox for users to activate or deactivate the option
 * associated with it.
 *
 * Props:
 * - entryKey: the internal key for the entry's option
 * - entryName: the option's name displayed for the entry
 * - selectedKeys: an array of selected entry keys in the menu
 * - onSelectionChangeCallback: the callback function on menu selection change,
 *     which takes a single argument for the new array of selections
 */
function MenuEntry(props) {
    const toggleSelection = () => props.onSelectionChangeCallback(
        toggleElementInArray(props.entryKey, props.selectedKeys));

    return (
        <li onClick={toggleSelection}>
            <input type="checkbox"
                   checked={props.selectedKeys.indexOf(props.entryKey) !== -1}
                   onChange={toggleSelection} />
            <label>{props.entryName}</label>
        </li>
    );
}

/*
 * Returns an HTML element for the search bar.  It needs the
 * following props passed to 'Widget':
 * - searchTerm
 * - searchCallback
 */
function SearchBar(props) {
    return (
        <form role="search"
              onSubmit={event => event.preventDefault()}>
            <div className="search-bar-container">
                <div className="search-textbox-container">
                    <input className="search-textbox" id="search-textbox"
                           required type="text"
                           value={props.searchTerm}
                           onChange={event => props.searchCallback(event.target.value)} />
                    <label aria-hidden="true" htmlFor="search-textbox">
                        <FontAwesomeIcon icon={faSearch} /> Type to search</label>
                </div>
            </div>
        </form>
    );
}

/*
 * If any keyboard shortcut for switching view is pressed, and no textbox input
 * is focused, changes the dashboard view accordingly.
 *
 * Parameters:
 * - event: the event fired when a key is pressed
 * - switchViewCallback: the callback function on view change event, which
 *     takes a single argument for the new view
 */
function switchViewIfRequested(event, switchViewCallback) {
    // The hot key will only activate if the search textbox is not currently active (user inputting text in the <input>)
    let searchInput = document.querySelector('#search-textbox');
    if (searchInput !== document.activeElement) {
        if (event.key === "l" || event.key === "L") {
            switchViewCallback(DASHBOARD_VIEWS.LIST);
        } else if (event.key === "g" || event.key === "G") {
            switchViewCallback(DASHBOARD_VIEWS.GRID);
        }
    }
}
