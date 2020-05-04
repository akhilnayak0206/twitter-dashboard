import { HashRouter } from 'react-router-dom';
import './App.css';
import React from 'react';
import Routes from './routing';

function App() {
  return (
    <HashRouter>
      <Routes />
    </HashRouter>
  );
}

export default App;
