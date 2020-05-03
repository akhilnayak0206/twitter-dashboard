import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {}, []);

  const signIn = () => {};

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='http://localhost:5000/auth/twitter/'
          // target='_blank'
          rel='noopener noreferrer'
        >
          Learn
        </a>
        <button onClick={() => signIn()}> Hello</button>
      </header>
    </div>
  );
}

export default App;
