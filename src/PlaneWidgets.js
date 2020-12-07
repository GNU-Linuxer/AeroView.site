/*
 * This file provides widgets pertinent to a plane that can be use at multiple
 * places in the entire website, e.g. plane rating tool and favorite button.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*
 * Returns a favorite button for a plane.
 *
 * Props:
 * - favor: a boolean value representing whether the plane is in favorite
 * - updateFavorCallback: the callback function on favor change event, which
 *     takes no arguments
 */
export function FavoriteButton(props) {
    return (
        <button className={`favorite-heart-button ${props.className}`}
                onClick={() => props.updateFavorCallback()}>
            {/* Switch between 'far' and 'fas' to select outlined star or solid star */}
            <FontAwesomeIcon icon={props.favor ? ['fas', 'heart'] : ['far', 'heart']}/>
        </button>
    );
}

/*
 * Returns a star rating widget for a plane.
 *
 * Props:
 * - maxStars: the number of stars for maximum rating
 * - rating: the current rating to be shown in the widget
 * - updateRatingCallback: the callback function on rating change event, which
 *     takes a single argument for the new rating
 */
export function StarRating(props) {
    let StarElems = [];
    for (let i = 1; i <= props.maxStars; i = i + 1) {
        StarElems.push(<Star key={i} ordinal={i} selected={props.rating >= i}
                             clickCallback={props.updateRatingCallback}/>);
    }

    return (
        <span>{StarElems}</span>
    );
}

/*
 * Returns a star in the star rating widget.
 *
 * Props:
 * - ordinal: the ordinal of the star in the widget, starting from 1 (i.e. the
 *     new rating that will be set when the user clicks on this star)
 * - selected: a boolean value representing whether the star is selected
 * - clickCallback: the callback function on star click event, which takes a
 *     single argument for the new rating
 */
function Star(props) {
    return (
        <button className="star-rating-button"
                onClick={() => props.clickCallback(props.ordinal)}>
            <FontAwesomeIcon icon={props.selected ? ['fas', 'star'] : ['far', 'star']}/>
        </button>
    );
}
