/*
 * This file provides a component for presenting a single plane model's
 * information.
 */

import React from 'react';
import { useParams } from 'react-router-dom';

import './css/site-elements.css';
import './css/plane-info.css';
import { useMobileView } from "./media-query";

/*
 * An array of metadata keys that are hidden from the page
 */
const HIDDEN_METADATA = ["make", "model", "icao-pic"];

/*
 * Returns an HTML element for the plane information page.
 *
 * Props:
 * - airplaneDisplayMetaName: an object that maps the shorthand metadata key to
 *     display-friendly full name
 * - airplaneData: an array of objects: 1 object represent 1 airplane whose
 *     metadata key has the metadata value
 */
export default function PlaneInfo(props) {
    let planeICAOCode = useParams()["icao"];
    let planeInfo = props.airplaneData.filter(
        plane => plane["icao"] === planeICAOCode.toUpperCase())[0];
    if (planeInfo === undefined) {
        return (
            <div>
                <Jumbotron title="Plane Information"
                           backgroundImage="/img/main-photo.jpg" />
                <main className="page-content">
                    <PlaneNotFoundMessage icao={planeICAOCode} />
                </main>
            </div>
        );
    }
    let planeName = planeInfo["make"] + ' ' + planeInfo["model"];
    return (
        <div>
            <Jumbotron title={planeName}
                       backgroundImage={getPlaneImagePath(planeInfo)} />
            <main className="plane-info-content">
                <PlaneImage planeInfo={planeInfo} planeName={planeName} />
                <Specification airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                               planeInfo={planeInfo} />
            </main>
        </div>
    );
};

/*
 * Returns an HTML element for customized jumbotron of the plane information
 * page.
 *
 * Props:
 * - title: the title shown on top of the jumbotron
 * - backgroundImage: the jumbotron's background image on desktop views
 */
function Jumbotron(props) {
    const mobileView = useMobileView();
    let style = mobileView ? {} : {
        backgroundImage: `linear-gradient(
            hsla(205, 100%, 25%, 0.8), hsla(205, 100%, 25%, 0.8)),
            url(${props.backgroundImage})`
    };
    return (
        <div className="plane-info-jumbotron" style={style}>
            {props.title}
        </div>
    );
}

/*
 * Returns the image element for the plane information page.
 *
 * Props:
 * - planeInfo: an object containing information for the plane being presented
 * - planeName: the plane's displayed name
 */
function PlaneImage(props) {
    return (
        <div className="plane-info-plane-img-container">
            <img className="plane-info-plane-img"
                 src={getPlaneImagePath(props.planeInfo)}
                 alt={props.planeName} />
        </div>
    );
}

/*
 * Returns the HTML element for the plane's technical specification.
 *
 * Props:
 * - airplaneDisplayMetaName: an object that maps the shorthand metadata key to
 *     display-friendly full name
 * - planeInfo: an object containing information for the plane being presented
 */
function Specification(props) {
    let tableRows = [];
    for (let key of Object.keys(props.planeInfo)) {
        if (!HIDDEN_METADATA.includes(key)) {
            tableRows.push(
                <tr key={key}>
                    <th>{props.airplaneDisplayMetaName[key]}</th>
                    <td>{props.planeInfo[key]}</td>
                </tr>
            );
        }
    }
    return (
        <div className="plane-info-spec-container">
            <table className="plane-info-spec"><tbody>
                {tableRows}
            </tbody></table>
        </div>
    );
}

/*
 * Returns an HTML element for an error message saying the requested plane
 * could not be found.
 *
 * Props:
 * - icao: the ICAO code requested
 */
function PlaneNotFoundMessage(props) {
    return (
        <p className="plane-info-err-msg">
            Could not find plane with ICAO Code: {props.icao}
        </p>
    );
}

/*
 * Returns the image path for a plane represented by a plane information
 * object.
 *
 * Parameters:
 * - planeInfo: an object containing information for the plane
 */
function getPlaneImagePath(planeInfo) {
    return `/plane-thumbnail/${planeInfo["icao-pic"].toLowerCase()}.jpg`;
}
