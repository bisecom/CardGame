import  React from 'react';
import stl from "./footer.module.css";
import {Card} from "../card/card";
import {openedCardPlayerTable} from "../../constants/varyStyles";

export const FooterPlayer = (props) => {
    let cardsInWork = props.playerCards;  let cardsInWorkShow;
    if(cardsInWork.length > 0 || cardsInWork !== undefined || cardsInWork === null || cardsInWork === ""){
    cardsInWorkShow = cardsInWork.map((card) => <Card key={card.id.toString()} id={card.id} rank={card.rank} suits={card.suits} customClass={openedCardPlayerTable} onClick={props.onClick}/>);
        }else{cardsInWorkShow = null;}
    return (
            <div className={`col-sm-6 ${stl.playerTable}`}>
               {cardsInWorkShow}
            </div>
    );
}