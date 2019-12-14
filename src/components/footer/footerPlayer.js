import  React from 'react';
import stl from "./footer.module.css";
import {Card} from "../card/card";
import {openedCardPlayerTbl} from "../../constants/varyStyles";

export const FooterPlayer = (props) => {
    let cardsInWork = props.playerCards;  let cardsInWorkShow;
    if(cardsInWork.length > 0 /*|| cardsInWork !== undefined*/ && Object.prototype.toString.call(cardsInWork) === '[object Array]'){
        cardsInWorkShow = cardsInWork.map((card) => <Card key={card.id.toString()} id={card.id.toString()} rank={card.rank} suits={determineSuit(card.suits)} customClass={openedCardPlayerTbl} onClick={props.onClick}/>);
        }else{cardsInWorkShow = null;};
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
            <div className={`col-sm-6 ${stl.playerTable}`}>
               {cardsInWorkShow}
            </div>
    );
}