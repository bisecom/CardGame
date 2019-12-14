import React from 'react';
import stl from './card.module.css';

export function CardClosed(props) {
    let cardRank = props.rank;

    return (
        <div id={props.id} style={/*stl.card*/props.customClass} onClick={props.onClick}>
            <p className={stl.aboveRank}>{cardRank}</p>

            <p className={stl.belowRank}>{cardRank}</p>
        </div>
    );
}