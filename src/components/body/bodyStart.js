import  React from 'react';
import stl from './body.module.css';
import {DataDisplay} from "./dataDisplay";
import {cardStartDeckClosed, openedCardStartDeck} from "../../constants/varyStyles";
import {Card} from "../card/card";
import {CardClosed} from "../card/cardClosed";

export const BodyStart = (props) => {
    let thrump = null; let deck = props.cardsDeck;
    let cardSuit = '';
    //imgData={props.imgData}
    if(props.thrumpCard !== '') {
        switch (props.thrumpCard.suits) {
            case 'D':
                cardSuit = props.imgData.diamonds;
                break;
            case 'C':
                cardSuit = props.imgData.clubs;
                break;
            case 'H':
                cardSuit = props.imgData.hearts;
                break;
            case 'S':
                cardSuit = props.imgData.spades;
                break;
        }
        thrump = <Card key={props.thrumpCard.id} id={props.thrumpCard.id} rank={props.thrumpCard.rank} suits={cardSuit}
                       customClass={openedCardStartDeck}/>;
    }
    let myCardsDeck = deck.map(card => <CardClosed key={card.id.toString()} rank={null} suits={null} onClick={props.deckOnClick} customClass={cardStartDeckClosed}/>);

    return (
        <div className={`col-sm-4 ${stl.dock}`}>
            <DataDisplay onClick={props.onClick} displayData={props.displayData}/>
            {myCardsDeck}
            {thrump}
        </div>
    );
}