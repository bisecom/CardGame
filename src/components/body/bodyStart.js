import  React from 'react';
import stl from './body.module.css';
import {DataDisplay} from "./dataDisplay";
import {cardStartDeckClosed, openedCardStartDeck} from "../../constants/varyStyles";
import {Card} from "../card/card";

export const BodyStart = (props) => {
    let thrump = null; let deck = props.cardsDeck;
    if(props.thrumpCard !== '') {
        thrump = <Card key={props.thrumpCard.id} rank={props.thrumpCard.rank} suits={props.thrumpCard.suits}
                       customClass={openedCardStartDeck}/>;
    }
 let myCardsDeck = deck.map(card => <Card key={card.id.toString()} rank={null} suits={null} onClick={props.deckOnClick} customClass={cardStartDeckClosed}/>);

    return (
            <div className={`col-sm-4 ${stl.dock}`}>
                <DataDisplay onClick={props.onClick}/>
                {myCardsDeck}
                {thrump}
            </div>
    );
}