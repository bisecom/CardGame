import  React from 'react';

import {Header} from "../components/header/headerComponent";
import {BodyComp} from "../components/body/bodyComponent";
import {FooterComp} from "../components/footer/footerComponent";
import stl from "./main.module.css";
import {ranksArray, displayData} from "../constants/initialData";

class MainCont extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerNextStep: true,
            cardDeck: this.props.cards,
            workedOutCards: [],
            commonTable: [],
            displayData: this.props.displayData.greatings,
            playerTable: [],
            pcTable: [],
            isThrumpAvailable: false,
            thrumpCard: '',
            thrumpCardSuit: ''
        };
        this.handleOpenCardClick = this.handleOpenCardClick.bind(this);
        this.handlePlayerMove = this.handlePlayerMove.bind(this);
        this.handleDisplayClick = this.handleDisplayClick.bind(this);
    }

    handleOpenCardClick(){
        let completeCardsDeck = this.state.cardDeck;
        let thrumpCard;
        if(this.state.isThrumpAvailable || this.state.displayData === displayData.greatings) return;
        let randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
        thrumpCard = completeCardsDeck[randomCardIndex];
        completeCardsDeck.splice(randomCardIndex, 1);
        this.setState(state => ({
            cardDeck: completeCardsDeck,
            thrumpCard: thrumpCard,
            isThrumpAvailable: true,
            displayData: this.props.displayData.playerStep,
            thrumpCardSuit: thrumpCard.suits
        }));
        this.giveCardsToPlayers(6, true);
    }

    handlePlayerMove(event){
        if(!this.state.playerNextStep) return;
        let cardId = event.target.getAttribute('id');
        if(cardId === null){
            cardId = event.target.parentNode.id;
        }
        let playerCards = this.state.playerTable;
        let workingTable = this.state.commonTable;
        let cardIndex = Number(playerCards.findIndex(card => card.id === Number(cardId)));
        if(this.state.playerNextStep && this.state.displayData !== this.props.displayData.playerAnswer && this.state.displayData !== this.props.displayData.playerTossing) {
            workingTable.push(playerCards[cardIndex]);
            playerCards.splice(cardIndex, 1);
            this.setState(state => ({
                commonTable: workingTable,
                playerTable: playerCards,
                playerNextStep: false,
                displayData: this.props.displayData.pcAnswer
            }));
        }
        if(this.state.playerNextStep && this.state.displayData === this.props.displayData.playerAnswer) {
            let playerAnswerRes = this.playerAnswerStep(playerCards[cardIndex], playerCards, workingTable);
            if(playerAnswerRes === undefined){
                return;
            }else {
                this.setState(state => ({
                    commonTable: playerAnswerRes.commonTable,
                    playerTable: playerAnswerRes.playerTable,
                    playerNextStep: false,
                    displayData: this.props.displayData.pcTossing
                }));
            }
        }

        if(this.state.playerNextStep && this.state.displayData === this.props.displayData.playerTossing) {
            let playerTossingRslt = this.tossingCardByPlayer(playerCards[cardIndex], workingTable);
            if(!playerTossingRslt){
                return;
            }else{
                workingTable.push(playerCards[cardIndex]);
                playerCards.splice(cardIndex, 1);
                this.setState(state => ({
                    commonTable: workingTable,
                    playerTable: playerCards,
                    playerNextStep: false,
                    displayData: this.props.displayData.pcAnswer
                }));
            }
        }

    }

    handleDisplayClick(event){
        let displayId = event.target.getAttribute('id');
        switch(displayId){
            case this.props.displayData.greatings://before start
            {
                this.setState(state => ({
                    displayData: this.props.displayData.playStart
                }));
                break;
            }
            case this.props.displayData.pcAnswer://pc answer
            {
                this.pcAnswerStep();
                this.gameOverCheck();
                break;
            }
            case this.props.displayData.playerTossing:// complete round
            {
                let dataAfterAdding = this.addingCardsToPartiesTables(this.state.playerTable, this.state.pcTable, this.state.cardDeck, this.state.thrumpCard);
                this.setState(state => ({
                    cardDeck: dataAfterAdding.deck,
                    commonTable: [],
                    playerTable: dataAfterAdding.playerCards,
                    pcTable: dataAfterAdding.pcCards,
                    thrumpCard: dataAfterAdding.thrump,
                    displayData: this.props.displayData.pcStep,
                    playerNextStep: false
                }));
                this.gameOverCheck();
                break;
            }
            case this.props.displayData.pcStep:// robot step
            {
                this.pcStep();
                this.gameOverCheck();
                break;
            }
            case this.props.displayData.playerAnswer:// player answer or cards getting
            {
                this.playerCouldNotAnswer();
                let dataAfterAdding = this.addingCardsToPartiesTables(this.state.playerTable, this.state.pcTable, this.state.cardDeck, this.state.thrumpCard);
                this.setState(state => ({
                    cardDeck: dataAfterAdding.deck,
                    commonTable: [],
                    playerTable: dataAfterAdding.playerCards,
                    pcTable: dataAfterAdding.pcCards,
                    thrumpCard: dataAfterAdding.thrump
                }));
                this.gameOverCheck();
                break;
            }
            case this.props.displayData.pcTossing:// pc tossing cards
            {
                let tossingResult = this.tossingCardByPc(this.state.pcTable, this.state.commonTable);
                if(tossingResult === null){//pc could not toss a card
                    let dataAfterAdding = this.addingCardsToPartiesTables(this.state.playerTable, this.state.pcTable, this.state.cardDeck, this.state.thrumpCard);
                    this.setState(state => ({
                        cardDeck: dataAfterAdding.deck,
                        commonTable: [],
                        playerTable: dataAfterAdding.playerCards,
                        pcTable: dataAfterAdding.pcCards,
                        thrumpCard: dataAfterAdding.thrump,
                        displayData: this.props.displayData.playerStep,
                        playerNextStep: true
                    }));
                }else {//pc tossed a card to common table
                    let pcTableCards = this.state.pcTable;
                    let commonTable = this.state.commonTable;
                    let pcTossedCardIndex = Number(pcTableCards.findIndex(card => card.id === Number(tossingResult.id)));
                    tossingResult.belongToPlayer = false;
                    tossingResult.isCoveredCard = false;
                    commonTable.push(tossingResult);
                    pcTableCards.splice(pcTossedCardIndex, 1);

                    this.setState(state => ({
                        commonTable: commonTable,
                        pcTable: pcTableCards,
                        displayData: this.props.displayData.playerAnswer,
                        playerNextStep: true
                    }));
                }
                this.gameOverCheck();
                break;
            }
            case this.props.displayData.pcWinner:// pc winner
            {
                this.setState(state => ({
                    playerNextStep: true,
                    cardDeck: this.props.cards,
                    workedOutCards: [],
                    commonTable: [],
                    displayData: this.props.displayData.greatings,
                    playerTable: [],
                    pcTable: [],
                    isThrumpAvailable: false,
                    thrumpCard: '',
                    thrumpCardSuit: ''
                }));
                break;
            }
            case this.props.displayData.playerWinner:// player winner
            {
                this.setState(state => ({
                    playerNextStep: true,
                    cardDeck: this.props.cards,
                    workedOutCards: [],
                    commonTable: [],
                    displayData: this.props.displayData.greatings,
                    playerTable: [],
                    pcTable: [],
                    isThrumpAvailable: false,
                    thrumpCard: '',
                    thrumpCardSuit: ''
                }));
                break;
            }
            default: console.log('default case');
        }
    }

    giveCardsToPlayers(initialCardsQty){
        let completeCardsDeck = this.state.cardDeck;
        let plrTblCards = this.state.playerTable;
        let pcTblCards = this.state.pcTable;

        while(initialCardsQty > 0) {
            let randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
            plrTblCards.push(completeCardsDeck[randomCardIndex]);
            plrTblCards[plrTblCards.length-1].belongToPlayer = true;
            completeCardsDeck.splice(randomCardIndex, 1);

            randomCardIndex = Math.floor(Math.random() * completeCardsDeck.length);
            pcTblCards.push(completeCardsDeck[randomCardIndex]);
            pcTblCards[pcTblCards.length-1].belongToPlayer = false;
            completeCardsDeck.splice(randomCardIndex, 1);
            initialCardsQty--;
            this.setState(state => ({
                playerTable: plrTblCards,
                pcTable: pcTblCards,
                cardDeck: completeCardsDeck,
                playerNextStep: true
            }));

        }

    }
//---------------------------------------------------------
//Game Logic
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
                if (pcSortedCards[i].suits === this.state.thrumpCardSuit) {
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
            workingTable.forEach(function(card, index){card.isCoveredCard = false});
            Array.prototype.push.apply(pcTblCards,workingTable);
            workingTable = [];

            this.setState(state => ({
                commonTable: workingTable,
                pcTable: pcTblCards,
                displayData: this.props.displayData.playerStep,
                playerNextStep: true
            }));
            let dataAfterAdding = this.addingCardsToPartiesTables(this.state.playerTable, this.state.pcTable, this.state.cardDeck, this.state.thrumpCard);
            this.setState(state => ({
                cardDeck: dataAfterAdding.deck,
                playerTable: dataAfterAdding.playerCards,
                pcTable: dataAfterAdding.pcCards,
                thrumpCard: dataAfterAdding.thrump
            }));
        }

        if(pcAnswered){
            this.setState(state => ({
                commonTable: workingTable,
                pcTable: pcTblCards,
                displayData: this.props.displayData.playerTossing,
                playerNextStep: true
            }));
        }
    }

    playerAnswerStep(clickedCard_, playerCards_, commonTableCards_){
        let workingTable = commonTableCards_;
        let playerCards = playerCards_;
        let clickedCard = clickedCard_;
        let notCoveredCardIndex = workingTable.map(e => e.isCoveredCard.toString()).indexOf('false');
        let rankIndexNotCovered = this.getCardIndex(workingTable[notCoveredCardIndex]);
        let rankIndexClicked = this.getCardIndex(clickedCard);
        if(clickedCard.suits === workingTable[notCoveredCardIndex].suits && rankIndexClicked > rankIndexNotCovered ||
            clickedCard.suits === this.state.thrumpCardSuit && rankIndexClicked < rankIndexNotCovered &&
            workingTable[notCoveredCardIndex].suits !== this.state.thrumpCardSuit ||
            clickedCard.suits === this.state.thrumpCardSuit && rankIndexClicked >= rankIndexNotCovered &&
            workingTable[notCoveredCardIndex].suits !== this.state.thrumpCardSuit){
            workingTable[notCoveredCardIndex].isCoveredCard = true; workingTable[notCoveredCardIndex].belongToPlayer = false;
            clickedCard.isCoveredCard = true; clickedCard.belongToPlayer = false;
            workingTable.push(clickedCard);
            let cardIndex = playerCards.map(e => e.id).indexOf(clickedCard.id);
            playerCards.splice(cardIndex, 1);
            return {playerTable: playerCards, commonTable: workingTable};

        }else{return;}

    }

    playerCouldNotAnswer(){
        let workingTable = this.state.commonTable;
        let playerCards = this.state.playerTable;
        workingTable.forEach(function(card, index){card.belongToPlayer = true; card.isCoveredCard = false;});

        Array.prototype.push.apply(playerCards,workingTable);
        workingTable = [];

        this.setState(state => ({
            commonTable: workingTable,
            playerTable: playerCards,
            displayData: this.props.displayData.pcStep,
            playerNextStep: false
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
        if(pcSortedCards.length > 0 && workingTable !== undefined) {
            workingTable.push(pcSortedCards[0]);
            pcSortedCards.splice(0, 1);
            this.setState(state => ({
                commonTable: workingTable,
                pcTable: pcSortedCards,
                displayData: this.props.displayData.playerAnswer,
                playerNextStep: true
            }));
        }
    }
    addingCardsToPartiesTables(playerCardsArray_, pcCardsArray_, cardsDeck_, thrumpCard_){
        let playerCardsArray = playerCardsArray_; let pcCardsArray = pcCardsArray_; let cardsDeck = cardsDeck_; let thrumpCard = thrumpCard_;
        while(playerCardsArray.length < 6 && cardsDeck.length > 0 || pcCardsArray.length < 6 && cardsDeck.length > 0) {
            let randomCardIndex = Math.floor(Math.random() * cardsDeck.length);
            if(cardsDeck[randomCardIndex] !== undefined && playerCardsArray.length < 6) {
                playerCardsArray.push(cardsDeck[randomCardIndex]);
                playerCardsArray[playerCardsArray.length - 1].belongToPlayer = true;
                cardsDeck.splice(randomCardIndex, 1);
            }
            randomCardIndex = Math.floor(Math.random() * cardsDeck.length);
            if(cardsDeck[randomCardIndex] !== undefined && pcCardsArray.length < 6) {
                pcCardsArray.push(cardsDeck[randomCardIndex]);
                pcCardsArray[pcCardsArray.length - 1].belongToPlayer = false;
                cardsDeck.splice(randomCardIndex, 1);
            }
        }
        if(playerCardsArray.length < 6 && cardsDeck.length === 0 && thrumpCard !== ''){
            playerCardsArray.push(thrumpCard);
            playerCardsArray[playerCardsArray.length - 1].belongToPlayer = true;
            thrumpCard = '';
        }
        if(pcCardsArray.length < 6 && cardsDeck.length === 0 && thrumpCard !== ''){
            pcCardsArray.push(thrumpCard);
            pcCardsArray[pcCardsArray.length - 1].belongToPlayer = false;
            thrumpCard = '';
        }

        return{deck: cardsDeck, playerCards: playerCardsArray, pcCards:pcCardsArray, thrump: thrumpCard};
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

    gameOverCheck(){
        let thrumpCard = this.state.thrumpCard;
        let playerCards = this.state.playerTable;
        let pcCards = this.state.pcTable;
        if(thrumpCard === '' || thrumpCard === undefined || thrumpCard === null){
            if(typeof playerCards === "undefined" || playerCards === null || playerCards.length === null || playerCards.length === 0){
                this.setState(state => ({
                    displayData: this.props.displayData.playerWinner,
                    playerNextStep: true
                }));
            }
            if(typeof pcCards === "undefined" || pcCards === null || pcCards.length === null || pcCards.length === 0){
                this.setState(state => ({
                    displayData: this.props.displayData.pcWinner,
                    playerNextStep: true
                }));
            }
        }
    }

// -----------------------------------------------------

    render() {


        return (
            <div className={`container-fluid ${stl.mainDiv}`}>
                <Header />
                <BodyComp startDeck={this.state.cardDeck} thrumpCard={this.state.thrumpCard} cardsInPlay={this.state.commonTable} deckOnClick={this.handleOpenCardClick} onClick={this.handleDisplayClick} displayData={this.state.displayData} imgData={this.props.imgData}/>
                <FooterComp playerCards={this.state.playerTable} pcCards={this.state.pcTable} playerClick={this.handlePlayerMove} imgData={this.props.imgData}/>
            </div>
        );

    }
}

export default MainCont;
