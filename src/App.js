import React, {useState} from 'react';
import ListGridView from './ListGridView.js';

export default function App(props) {
    /*  airplaneDisplayMetaName: An object that maps the shorthand metadata key to display-friendly full name
        airplaneData: An array of objects: 1 object represent 1 airplane whose metadata key has the metadata value
     */
    return (
        // Continue passing data down to child components
        <ListGridView airplaneDisplayMetaName={props.airplaneDisplayMetaName}
                      airplaneData={props.airplaneData}/>
    )
}