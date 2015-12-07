// import React from 'react';
// import Hello from './hello.jsx';

// ReactDOM.render(Hello, document.getElementById('react'));

var Math = require('./Math');
var style = require('./test.css');
var oDiv = document.createElement('div');


oDiv.id = 'box';
document.body.appendChild(oDiv);

console.log(Math.sum(1,2));