import  React from 'react';
import stl from './body.module.css';
import {BodyPlay} from "./bodyPlay";
import {BodyStart} from "./bodyStart";

export const BodyComp = (props) => {
    return (
        <div className={`row ${stl.mainRaw}`}>
            <BodyPlay cardsInPlay={props.cardsInPlay} imgData={props.imgData}/>
            <BodyStart cardsDeck={props.startDeck} thrumpCard={props.thrumpCard} onClick={props.onClick} deckOnClick={props.deckOnClick} displayData={props.displayData} imgData={props.imgData}/>
        </div>
    );
}