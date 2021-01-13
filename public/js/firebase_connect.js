const firebase = require('firebase');


const app = firebase.initializeApp ({
  apiKey: "AIzaSyCOB2gt7ZiBTerXE_6RzoBYR2J1AfV6Hlw",
  authDomain: "ucaretemp.firebaseapp.com",
  databaseURL: "https://ucaretemp-default-rtdb.firebaseio.com",
  projectId: "ucaretemp",
  storageBucket: "ucaretemp.appspot.com",
  messagingSenderId: "548335592548",
  appId: "1:548335592548:web:028fba89e8f97a6cb76b71",
  measurementId: "G-Z66YVX5BNM"
});

module.exports = app;