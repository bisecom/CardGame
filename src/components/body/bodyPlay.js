import  React from 'react';
import stl from './body.module.css';
import {Card} from "../card/card";
import {openedCardPlayerTable} from "../../constants/varyStyles";

export const BodyPlay = (props) => {
    let allCardsInPlay = props.cardsInPlay;
    let stepperCards =[]; let answererCards = [];
    if(allCardsInPlay.length > 0 || allCardsInPlay !== undefined || allCardsInPlay !== null){
    for(let i=0; i<allCardsInPlay.length; i++){
    if(allCardsInPlay[i].belongToPlayer){
        stepperCards.push(<Card key={allCardsInPlay[i].id.toString()} rank={allCardsInPlay[i].rank} suits={allCardsInPlay[i].suits} customClass={openedCardPlayerTable} />);
    }else{
        answererCards.push(<Card key={allCardsInPlay[i].id.toString()} rank={allCardsInPlay[i].rank} suits={allCardsInPlay[i].suits} customClass={openedCardPlayerTable} />);
    }
    }
    }else{stepperCards = null; answererCards = null;}
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