/*
 * This file provides components for the airplane dashboard.
 */

import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faTh, faFilter, faEllipsisV } from '@fortawesome/free-solid-svg-icons'

import ListGridView from './ListGridView';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
 * - airplaneDisplayMetaName: an object that maps the shorthand metadata key to
 *     display-friendly full name
 * - airplaneData: an array of objects: 1 object represent 1 airplane whose
 *     metadata key has the metadata value
 */
export default function Dashboard(props) {
    const [view, setView] = useState(DASHBOARD_VIEWS.LIST);
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

    return (
        <div className="dashboard">
            <Widgets
                activeView={view}
                switchViewCallback={view => setView(view)}
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
                activeView={view}
                // Continue passing data down to child components
                airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                airplaneData={props.airplaneData}
                brandsToDisplay={filteredBrands}
                typesToDisplay={filteredTypes}
                filteredMeta={selectedMetadata}
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
    return (
        <div className="dashboard-widgets">
            <div className="search-form-container" id="search-form-stub-mobile">
                <SearchBar
                    searchTerm={props.searchTerm}
                    searchCallback={props.searchCallback}
                />
            </div>

            <div className="options">
                <ViewSelector
                    activeView={props.activeView}
                    switchViewCallback={props.switchViewCallback}
                />

                <div className="search-form-container" id="search-form-stub-desktop">
                </div>

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
                <DropdownItem header>Brand</DropdownItem>
                {makes.map(make => <MenuEntry
                    key={make} entryKey={make} entryName={make}
                    selectedKeys={props.brandsToDisplay}
                    onSelectionChangeCallback={props.changeBrandsCallback} />)}
                <DropdownItem divider />
                <DropdownItem header>Type</DropdownItem>
                {types.map(type => <MenuEntry
                    key={type} entryKey={type} entryName={type}
                    selectedKeys={props.typesToDisplay}
                    onSelectionChangeCallback={props.changeTypesCallback} />)}
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
    function toggleKeySelection(key) {
        let newKeyArray;
        if (props.selectedKeys.indexOf(key) === -1) {
            // The key is unselected; select it
            newKeyArray = [...props.selectedKeys, key];
        } else {
            // The key is selected; unselect it
            newKeyArray = props.selectedKeys
                .filter(selectedKey => selectedKey !== key);
        }
        props.onSelectionChangeCallback(newKeyArray);
    }

    return (
        <li>
            <input type="checkbox"
                   checked={props.selectedKeys.indexOf(props.entryKey) !== -1}
                   onChange={() => toggleKeySelection(props.entryKey)} />
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
                        Type to search</label>
                </div>
            </div>
        </form>
    );
}
