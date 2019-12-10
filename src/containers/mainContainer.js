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
            displayData: 'Hello Guys!',
            playerTable: [],
            pcTable: [],
            isThrumpAvailable: false,
            thrumpCard: ''
        };
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleOpenCardClick = this.handleOpenCardClick.bind(this);
        this.handlePlayerMove = this.handlePlayerMove.bind(this);
        this.handleDisplayClick = this.handleDisplayClick.bind(this);
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

    handleOpenCardClick(){
        let completeCardsDeck = this.state.сardDeck;
        let thrumpCard;
        if(this.state.isThrumpAvailable) return;
        let randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
        //console.log("before "+this.state.thrumpCard);
        //thrumpCard = this.thrumpObjIntoCard(completeCardsDeck[randomCardIndex]);
        thrumpCard = completeCardsDeck[randomCardIndex];
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

    handleDisplayClick(){
        console.log("hello from display");
    }


    giveCardsToPlayers(initialCardsQty){
        let completeCardsDeck = this.state.сardDeck;
        let plrTblCards = this.state.playerTable;
        let pcTblCards = this.state.pcTable;

        while(initialCardsQty > 0) {
            let randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
            plrTblCards.push(completeCardsDeck[randomCardIndex]);
            plrTblCards[plrTblCards.length-1].belongToPlayer = true;
            //console.log("this.state.playerTable.lengthh "+ this.state.playerTable.length);
            completeCardsDeck.splice(randomCardIndex, 1);

            randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
            pcTblCards.push(completeCardsDeck[randomCardIndex]);
            pcTblCards[pcTblCards.length-1].belongToPlayer = false;
            completeCardsDeck.splice(randomCardIndex, 1);
            initialCardsQty--;
            this.setState(state => ({
                playerTable: plrTblCards,
                pcTable: pcTblCards,
                сardDeck: completeCardsDeck,
                playerNextStep: true
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
        let pcAnswered = false;

        let notCoveredCardIndex = workingTable.map(e => e.isCoveredCard.toString()).indexOf('false');
        let rankIndex = this.getCardIndex(workingTable[notCoveredCardIndex]);
        //    check to answer among usual cards
            for(let i = 0; i < pcSortedCards.length; i++){
            let pcCardRankIndex = this.getCardIndex(pcSortedCards[i]);
            console.log("rankIndex " + rankIndex + "pcCardRankIndex" +pcCardRankIndex);
            if(pcCardRankIndex > rankIndex && workingTable[notCoveredCardIndex].suits === pcSortedCards[i].suits){
                workingTable[notCoveredCardIndex].isCoveredCard = true;
                pcSortedCards[i].isCoveredCard = true;
                workingTable.push(pcSortedCards[i]);
                let cardIndex = pcTblCards.map(e => e.id).indexOf(pcSortedCards[i].id);
                pcTblCards.splice(cardIndex, 1);
                pcAnswered = true;
                break;
            }
        }
        //    check to answer among thrump cards
        if(!pcAnswered) {
            for (let i = 0; i < pcSortedCards.length; i++) {
                if (pcSortedCards[i].suits === this.state.thrumpCard.suits) {
                    workingTable[notCoveredCardIndex].isCoveredCard = true;
                    pcSortedCards[i].isCoveredCard = true;
                    workingTable.push(pcSortedCards[i]);
                    let cardIndex = pcTblCards.map(e => e.id).indexOf(pcSortedCards[i].id);
                    pcTblCards.splice(cardIndex, 1);
                    pcAnswered = true;
                    break;
                }
            }
        }
        //if pc could not beat the players card, we pass all common table cards to PC table
        if(!pcAnswered) {
            /*
            let lengths = ["Bilbo", "Gandalf", "Nazgul"].map(item => item.length);
            let arr = [1, 2];
            // создать массив из: arr и [3,4]
            alert( arr.concat([3, 4]) ); // 1,2,3,4
            */
            let updatedCommonTable = workingTable.map(card => card.isCoveredCard = false);
            pcTblCards.concat(updatedCommonTable);
            workingTable = null;
        }


        this.setState(state => ({
            commonTable: workingTable,
            pcTable: pcTblCards,
            playerNextStep: true
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

    pcStep(){
        let workingTable = this.state.commonTable;
        let pcTblCards = this.state.pcTable;
        let pcSortedCards = this.sortedCards(pcTblCards);

        workingTable.push(pcSortedCards[0]);
        pcSortedCards.splice(0, 1);
        this.setState(state => ({
            commonTable: workingTable,
            pcTable: pcSortedCards,
            playerNextStep: true
        }));
    }
addingCardsToPartiesTables(playerCardsArray_, cardsDeck_, thrumpCard_, isPlayerAdding){
    let playerCardsArray = playerCardsArray_; let cardsDeck = cardsDeck_; let thrumpCard = thrumpCard_;
        while(playerCardsArray.length < 7 && cardsDeck.length > 0) {
        let randomCardIndex = Math.floor(Math.random() * cardsDeck.length);
            playerCardsArray.push(cardsDeck[randomCardIndex]);
            if(isPlayerAdding){
                playerCardsArray[playerCardsArray.length - 1].belongToPlayer = true;}else{
                playerCardsArray[playerCardsArray.length - 1].belongToPlayer = false;
            }
            cardsDeck.splice(randomCardIndex, 1);
    }
    if(playerCardsArray.length < 7 && cardsDeck.length === 0){
        playerCardsArray.push(thrumpCard);
        if(isPlayerAdding){
            playerCardsArray[playerCardsArray.length - 1].belongToPlayer = true;}else{
            playerCardsArray[playerCardsArray.length - 1].belongToPlayer = false;
        }
        thrumpCard = null;
    }
    return{deck: cardsDeck, playercards: playerCardsArray, thrump: thrumpCard};
}

tossingCardByPlayer(clickedCard, commonTableCards){
        let cardRank = clickedCard.rank; let cardSuits = clickedCard.suits;
        for(let i = 0; i < commonTableCards.length; i++){
            if(commonTableCards[i].rank === cardRank){
                return true;
            }
        }
        return false;
}

    tossingCardByPc(pcTableCards_, commonTableCards_){
        let workingTable = commonTableCards_;
        let pcSortedCards = this.sortedCards(pcTableCards_);
        for(let i = 0; i < pcSortedCards.length; i++){
            for(let j = 0; j < workingTable.length; j++){
                if(pcSortedCards[i].rank === workingTable[j].rank){
                    return pcSortedCards[i];
                }
            }
        }
        return null;
    }

// -----------------------------------------------------

    render() {


        return (
            <div className={`container-fluid ${stl.mainDiv}`}>
            <Header />
            <BodyComp startDeck={this.state.сardDeck} thrumpCard={this.state.thrumpCard} cardsInPlay={this.state.commonTable} deckOnClick={this.handleOpenCardClick} onClick={this.handleDisplayClick}/>
            <FooterComp playerCards={this.state.playerTable} pcCards={this.state.pcTable} playerClick={this.handlePlayerMove}/>
            </div>
        );

    }
}

export default MainCont;