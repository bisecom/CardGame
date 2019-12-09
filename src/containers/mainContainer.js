import  React from 'react';

import {Header} from "../components/header/headerComponent";
import {BodyComp} from "../components/body/bodyComponent";
import {FooterComp} from "../components/footer/footerComponent";
import {Card} from "../components/card/card";
import stl from "./main.module.css";
import {cardStartDeckClosed, openedCardStartDeck} from "../constants/varyStyles";
import {ranksArray} from "../constants/initialData";

class MainCont extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerNextStep: true,
            сardDeck: this.props.cards,
            workedOutCards: [],
            commonTable: [],
            thrumpTable: [],
            playerTable: [],
            pcTable: [],
            isThrumpAvailable: false,
            thrumpCard: ''
        };
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleOpenCardClick = this.handleOpenCardClick.bind(this);
        this.handlePlayerMove = this.handlePlayerMove.bind(this);
    }

    handleToggleClick() {
        this.setState(state => ({
            showCards: !state.showCards
        }));
    }

    handleCardClick(e){
        //alert(ranksArray);
        let arr = this.state.myCards;
        this.state.bottomDivCards = arr[arr.length-1];
        arr.splice(-1,1);
        this.state.myCards = arr;
        console.log(this.state.myCards);
    }

    thrumpObjIntoCard(card){
        return <Card key={card.id.toString()} rank={card.rank} suits={card.suits} customClass={openedCardStartDeck}/>
    }

    handleOpenCardClick(){
        let completeCardsDeck = this.state.сardDeck;
        let thrumpCard;
        if(this.state.isThrumpAvailable) return;
        let randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
        //console.log("before "+this.state.thrumpCard);
        thrumpCard = this.thrumpObjIntoCard(completeCardsDeck[randomCardIndex]);
        completeCardsDeck.splice(randomCardIndex, 1);
        this.setState(state => ({
            сardDeck: completeCardsDeck,
            thrumpCard: thrumpCard,
            isThrumpAvailable: true
        }));
        this.giveCardsToPlayers(3, true);
    }

    handlePlayerMove(event){
        if(!this.state.playerNextStep) return;
        let cardId = event.target.getAttribute('id');
        let playerCards = this.state.playerTable;
        let workingTable = this.state.commonTable;
       // let cardIndex = playerCards.findIndex(x => x.id.toString() === cardId);
        let cardIndex = playerCards.map(e => e.id.toString()).indexOf(cardId).toString();
        workingTable.push(playerCards[cardIndex]);
        //console.log("cardId type of "+ typeof cardId + " cardId " + cardId+" playerCards "+ playerCards.length + " cardIndex "+cardIndex + " playerCards[0] id "+ playerCards[0].id+ " playerCards[1] id "+ playerCards[1].id);
        playerCards.splice(cardIndex, 1);
        this.setState(state => ({
            commonTable: workingTable,
            playerTable: playerCards,
            playerNextStep: false
        }));
        this.pcAnswerStep();
    }

    giveCardsToPlayers(cardsQty, isPlayer){
        let completeCardsDeck = this.state.сardDeck;
        let plrTblCards = this.state.playerTable;
        let pcTblCards = this.state.pcTable;

        while(completeCardsDeck.length > cardsQty) {

            let randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
            plrTblCards.push(completeCardsDeck[randomCardIndex]);
            plrTblCards[plrTblCards.length-1].belongToPlayer = true;
            //console.log("this.state.playerTable.lengthh "+ this.state.playerTable.length);
            completeCardsDeck.splice(randomCardIndex, 1);

            randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
            pcTblCards.push(completeCardsDeck[randomCardIndex]);
            pcTblCards[pcTblCards.length-1].belongToPlayer = false;
            completeCardsDeck.splice(randomCardIndex, 1);

            this.setState(state => ({
                playerTable: plrTblCards,
                pcTable: pcTblCards,
                сardDeck: completeCardsDeck
            }));

        }
        //console.log("this.state.playerTable "+ this.state.playerTable + " belongToPlayer " + this.state.playerTable[0].belongToPlayer);

    }
//---------------------------------------------------------
//Game Logic // Not finished yet
    pcAnswerStep(){
        let workingTable = this.state.commonTable;
        let pcTblCards = this.state.pcTable;
        let pcSortedCards = this.sortedCards(pcTblCards);

        let notCoveredCardIndex = workingTable.map(e => e.isCoveredCard.toString()).indexOf('false');
        let rankIndex = this.getCardIndex(workingTable[notCoveredCardIndex]);

            for(let i = 0; i < pcSortedCards.length; i++){
            let pcCardRankIndex = this.getCardIndex(pcSortedCards[i]);
            if(pcCardRankIndex > rankIndex && workingTable[notCoveredCardIndex].suits === pcSortedCards[i].suits){
                workingTable.push(pcSortedCards[i]);
                let cardIndex = pcTblCards.map(e => e.id).indexOf(pcSortedCards[i].id);
                pcTblCards.splice(cardIndex, 1);
                break;
            }
        }

        this.setState(state => ({
            commonTable: workingTable,
            pcTable: pcTblCards,
        }));
    }
    //sort cards to beat by lowest possible
    sortedCards(cardsToSort) {
        return cardsToSort.sort(function (a, b) {
            let cardsOrder = ranksArray;
            function getCardIndex(x) {return cardsOrder.indexOf(x.rank);}
            return (getCardIndex(a) - getCardIndex(b));
        });
    }
    //return deck index of a card for cards comperison
    getCardIndex(card){
        let indexOfCard = ranksArray.indexOf(card.rank);
        return indexOfCard;
    }
// -----------------------------------------------------

    render() {
        let myCards;
        let completeCardsDeck = this.state.сardDeck;
        //console.log('hello '+this.state.сardDeck);

        function cardOfDeck(card, obj){
            let cardsStyle = cardStartDeckClosed;
            return <Card key={card.id.toString()} rank={null} suits={null} onClick={obj.handleOpenCardClick} customClass={cardsStyle}/>
        }
        function completeDeck(cards, obj) {
            return myCards = cards.map(card => cardOfDeck(card, obj));
        }

        myCards = completeDeck(completeCardsDeck, this);
        //myCards = cards_.map((card) => <Card key={card.id.toString()} rank={card.rank} suits={card.suits} customClass={cardStartDeckClosed}/>);
        console.log("this.state.playerTable "+ typeof this.state.playerTable);
        return (
            <div className={`container-fluid ${stl.mainDiv}`}>
            <Header />
            <BodyComp startDeck={myCards} thrumpCard={this.state.thrumpCard} cardsInPlay={this.state.commonTable}/>
            <FooterComp playerCards={this.state.playerTable} pcCards={this.state.pcTable} playerClick={this.handlePlayerMove}/>
            </div>
        );

    }
}

export default MainCont;