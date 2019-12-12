import React from 'react';
import stl from './card.module.css';

export function Card(props) {
    let cardRank = props.rank;
    let cardSuits = props.suits;
    return (
        <div id={props.id} style={/*stl.card*/props.customClass} onClick={props.onClick}>
            <p className={stl.abovewRank}>{cardRank}</p>
            <p className={stl.aboveSuite}>{cardSuits}</p>

            <p  className={stl.belowSuite}>{cardSuits}</p>
            <p className={stl.belowRank}>{cardRank}</p>
        </div>
    );
}