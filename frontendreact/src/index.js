// 1. Import React & ReactDom libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 2. Get a reference to the div with ID root
const el = document.getElementById('root');

// 3. Tell React to control that element
const root = ReactDOM.createRoot(el);

// 4. Show the componet on the screen from App.js
root.render(<App />);
