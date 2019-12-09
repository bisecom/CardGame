import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import MainCont from "./containers/mainContainer";
import ReactAnimations from "./components/anime";
import {Card} from "./components/card/card";
import {cardsArray} from "./constants/initialData";

ReactDOM.render(<MainCont cards={cardsArray}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
