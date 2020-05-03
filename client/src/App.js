import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect(() => {}, []);

  const getUrlParameter = (name) => {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const signIn = async () => {
    let denied = await getUrlParameter('denied');
    if (denied) {
      return alert('Please sign in');
    }
    let token = await getUrlParameter('oauth_token');
    let secretToken = await getUrlParameter('oauth_verifier');
    console.log(token, secretToken);
    fetch(
      `http://localhost:5000/access-token?token=${token}&secretToken=${secretToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

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
          rel='noopener noreferrer'
        >
          Learn
        </a>
        <button onClick={() => signIn()}>Hello</button>
      </header>
    </div>
  );
}

export default App;
