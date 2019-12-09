import React from 'react';
import stl from './card.module.css';

export function Card(props) {
    return (
        <div id={props.id} style={/*stl.card*/props.customClass} onClick={props.onClick}>
            <p className="aboveData">{props.rank}</p>
            <p className="belowData">{props.suits}</p>
        </div>
    );
}