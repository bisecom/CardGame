import React from 'react';
import stl from './card.module.css';

export function Card(props) {
    let cardRank = props.rank;
    let cardSuits = props.suits;

    return (
        <div id={props.id} style={/*stl.card*/props.customClass} onClick={props.onClick}>
            <p className={stl.aboveRank}>{cardRank}</p>
            <img className={stl.aboveCardSuits} src={cardSuits} alt={"Suits"} />
            <img className={stl.mainCardSuits} src={cardSuits} alt={"Suits"}/><br/>
            <img className={stl.belowCardSuits} src={cardSuits} alt={"Suits"}/>
            <p className={stl.belowRank}>{cardRank}</p>
        </div>
    );
}