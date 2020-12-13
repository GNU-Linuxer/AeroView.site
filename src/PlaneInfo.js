/*
 * This file provides a component for presenting a single plane model's
 * information.
 */

import React, {useState, useRef, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useMobileView } from './util/media-query.js';

import './css/site-elements.css';
import './css/plane-info.css';
import { StarRating, FavoriteButton } from "./PlaneWidgets";
import {Alert} from "reactstrap";

//SunEditor
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import {debounce} from "./util/delay-refresh";

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
 * - ratings: an object that maps plane ICAO codes to ratings
 * - updateRatingsCallback: the callback function on rating change event, which
 *     takes one argument for the ICAO code of plane whose rating is changed,
 *     and one argument for the new rating
 * - favorites: an array storing ICAO codes of favorite planes
 * - updateFavoritesCallback: the callback function on favorite change event,
 *     which takes a single argument for the ICAO code of the plane whose
 *     favorite status is changed
 */
export default function PlaneInfo(props) {


    // Need to implement window-resize useEffect(), as the note-taking textbox position depend on window size
    const [numCol, setNumCol] = React.useState(0);
    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setNumCol(window.innerWidth);
        }, 5) // 5 in mili-second unit means re-render components with a maximum frequency of once per 5ms
        // Recommend to set to 100 or 1000 for production release

        window.addEventListener('resize', debouncedHandleResize);

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize);

        }
    });


    let planeICAOCode = useParams()["icao"];
    let planeInfo = props.airplaneData.filter(
        plane => plane["icao"] === planeICAOCode.toUpperCase())[0];
    if (planeInfo === undefined) {
        return (
            <div>
                <Jumbotron title="Plane Information"
                           backgroundImage="/img/main-photo.jpg" />
                <main className="page-content">
                    {/*I'm not sure whether status={404} will let React Router respond 404 on non-existent ICAO code*/}
                    <PlaneNotFoundMessage icao={planeICAOCode} status={404}/>
                </main>
            </div>
        );
    }
    let planeName = planeInfo["make"] + ' ' + planeInfo["model"];
    let lowerCaseICAO = planeICAOCode.toLowerCase();
    const updateRating = newRating =>
        props.updateRatingsCallback(lowerCaseICAO, newRating);
    const toggleFavorite = () =>
        props.updateFavoritesCallback(lowerCaseICAO);

    return (
        <div>
            <Jumbotron title={planeName}
                       backgroundImage={getPlaneImagePath(planeInfo)} />
            <main className="plane-info-content">
                <div className="plane-info-left-column">
                    <PlaneImage planeInfo={planeInfo} planeName={planeName} />
                    {window.innerWidth >=768 ? <NoteEditor/> : null}
                </div>
                <div className="plane-info-data-container">
                    <Widgets rating={props.ratings[lowerCaseICAO]}
                             updateRatingCallback={updateRating}
                             favor={props.favorites.includes(lowerCaseICAO)}
                             updateFavorCallback={toggleFavorite} />
                    <Specification airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                                   planeInfo={planeInfo} />
                </div>
                {window.innerWidth <768 ? <NoteEditor/> : null}
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
 * Returns an HTML element containing widgets that allow the user to rate the
 * plane and toggle its favorite status.
 *
 * Props:
 * - rating: the current rating to be shown in the widget
 * - updateRatingCallback: the callback function on rating change event, which
 *     takes a single argument for the new rating
 * - favor: a boolean value representing whether the plane is in favorite
 * - updateFavorCallback: the callback function on favor change event, which
 *     takes no arguments
 */
function Widgets(props) {
    return (
        <div className="plane-info-widgets">
            <StarRating maxStars={5}
                        rating={props.rating}
                        updateRatingCallback={props.updateRatingCallback} />
            <FavoriteButton favor={props.favor}
                            updateFavorCallback={props.updateFavorCallback} />
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
        <table className="plane-info-spec"><tbody>
            {tableRows}
        </tbody></table>
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
        <Alert color="danger">
            <div>Could not find plane with ICAO Code: <strong>{props.icao}</strong></div>
        </Alert>
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

function NoteEditor(props){
    const editorRef = useRef();
    const [content, setContent] = useState('Initial content!');

    const options ={
        height: 200,
        //Available parameter can be found at https://github.com/JiHong88/SunEditor/blob/master/README.md#2-load-all-plugins
        buttonList: [['undo', 'redo'], ['formatBlock', 'font', 'fontSize'], ['bold', 'underline', 'italic', 'strike', 'link', 'removeFormat'], ['align', 'list'],['outdent', 'indent'], ['print']],
        stickyToolbar: false
    }

    useEffect(() => {
        // Get underlining core object here
        // Notice that useEffect is been used because you have to make sure the editor is rendered.
        //console.log(editorRef.current.editor.core);
    }, []);

    // Functions that handle textbox content change
    // Note: the SunEditor will call onChange 1 seconds after user stops typing
    const handleContentChange = function(newContent) {
        console.log(newContent);
        setContent(newContent);
    };

    return (
        <div>
            <SunEditor ref={editorRef}
                       setContents={content}
                       setOptions={options}
                       placeholder="Take a note on Boeing 737-800..."
                       setDefaultStyle="font-family: sans-serif; font-size: 16px;"
                       onChange={handleContentChange}/>
        </div>
    );
}