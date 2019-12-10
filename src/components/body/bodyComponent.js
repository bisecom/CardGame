import  React from 'react';
import stl from './body.module.css';
import {BodyPlay} from "./bodyPlay";
import {BodyStart} from "./bodyStart";

export const BodyComp = (props) => {
    return (
        <div className={`row ${stl.mainRaw}`}>
            <BodyPlay cardsInPlay={props.cardsInPlay}/>
            <BodyStart cardsDeck={props.startDeck} thrumpCard={props.thrumpCard} onClick={props.onClick} deckOnClick={props.deckOnClick}/>
        </div>
    );
}