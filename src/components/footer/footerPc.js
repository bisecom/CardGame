import  React from 'react';
import stl from "./footer.module.css";
import {Card} from "../card/card";
import {cardPCTableClosed, cardStartDeckClosed, openedCardPlayerTbl} from "../../constants/varyStyles";
import {CardClosed} from "../card/cardClosed";

export const FooterPc = (props) => {
    let cardsInWork = props.pcCards;  let cardsInWorkShow;
    if(cardsInWork.length > 0 || cardsInWork !== undefined || cardsInWork !== null || cardsInWork !== ""){
        cardsInWorkShow = cardsInWork.map((card) => <CardClosed key={card.id.toString()} id={card.id.toString()} rank={/*card.rank*/null} suits={/*determineSuit(card.suits)*/null} customClass={cardPCTableClosed}/>);
    }else{cardsInWorkShow = null;}
    function determineSuit(thisCard){
        let cardSuit;
        switch (thisCard) {
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

        return cardSuit;
    }

    return (
            <div className={`col-sm-6 ${stl.pcTable}`}>
                {cardsInWorkShow}
            </div>
    );
}