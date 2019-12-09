import  React from 'react';
import stl from "./footer.module.css";
import {Card} from "../card/card";
import {openedCardPlayerTable} from "../../constants/varyStyles";

export const FooterPc = (props) => {
    let cardsInWork = props.pcCards;  let cardsInWorkShow;
    if(cardsInWork.length > 0 || cardsInWork !== undefined || cardsInWork !== null || cardsInWork !== ""){
        cardsInWorkShow = cardsInWork.map((card) => <Card key={card.id.toString()} rank={card.rank} suits={card.suits} customClass={openedCardPlayerTable}/>);
    }else{cardsInWorkShow = null;}
    return (
            <div className={`col-sm-6 ${stl.pcTable}`}>
                {cardsInWorkShow}
            </div>
    );
}