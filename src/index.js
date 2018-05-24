import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();

console.log(
  '%c CALL NOW: 313-986-4606\nPhotos: Max Schiano, Clare Gatto, Jeremy Deputat, Conor Anderson, Erika, Camera Jesus, Corine Vermuelen, Yasaku Aoki, Nakshot, Anders Neuman, Trevor Dernai, Red Bull Content Pool',
  'font-size: 12px; background-color: rgb(20,200,20);padding: 10px;font-family: cursive;'
);
