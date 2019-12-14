import  React from 'react';
import stl from './body.module.css';
import {Card} from "../card/card";
import {openedCardPlayerTbl} from "../../constants/varyStyles";

export const BodyPlay = (props) => {
    let allCardsInPlay = props.cardsInPlay;
    //console.log("allCardsInPlay from BodyPlay: "+allCardsInPlay);
    let stepperCards =[]; let answererCards = [];
    if(allCardsInPlay.length > 0 && Object.prototype.toString.call(allCardsInPlay) === '[object Array]' && allCardsInPlay !== undefined /*|| allCardsInPlay !== null*/){
    //console.log("BodyPlay allCardsInPlay[0].id " + allCardsInPlay[0].id + " allCardsInPlay length " + allCardsInPlay.length + " allCardsInPlay typeof " + allCardsInPlay.typeof);
        for(let i=0; i<allCardsInPlay.length; i++){
    if(allCardsInPlay[i].belongToPlayer){
        stepperCards.push(<Card key={allCardsInPlay[i].id.toString()} id={allCardsInPlay[i].id.toString()} rank={allCardsInPlay[i].rank} suits={determineSuit(allCardsInPlay[i].suits)} customClass={openedCardPlayerTbl} />);
    }else{
        answererCards.push(<Card key={allCardsInPlay[i].id.toString()} id={allCardsInPlay[i].id.toString()} rank={allCardsInPlay[i].rank} suits={determineSuit(allCardsInPlay[i].suits)} customClass={openedCardPlayerTbl} />);
    }
    }
    }else{stepperCards = null; answererCards = null;}

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
            <div className={`col-sm-8 ${stl.mainTable}`}>
                <div className={stl.stepperField}>
                    {stepperCards}
                </div>
                <div className={stl.answererField}>
                    {answererCards}
                </div>
            </div>
    );
}