import React, { useEffect } from 'react';
import './App.css';
import Routes from './routing';

function App() {
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

  const other = () => {
    let data = {
      token: '708548682510049281-hyhxY6b0RwJbmLJYPluFaxy5uYR5tpF',
      secretToken: 'AwY4X6bHgItd2kF0M5Ghl00LgytIcqt6ZIJsfquwWlAQE',
      status: 'This tweet is sent by a bot',
      replyID: '1257224851779022848',
    };
    fetch('http://localhost:5000/fetch-tweets', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const fetchConversation = () => {
    let data = {
      token: '708548682510049281-hyhxY6b0RwJbmLJYPluFaxy5uYR5tpF',
      secretToken: 'AwY4X6bHgItd2kF0M5Ghl00LgytIcqt6ZIJsfquwWlAQE',
      statusID: '1257224851779022848', // 1257205682769506300
    };
    fetch('http://localhost:5000/fetch-conversation', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success COno:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='main'>
      <Routes />
    </div>
    // <div className='App'>
    //   <header className='App-header'>
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className='App-link'
    //       href='http://localhost:5000/auth/twitter/'
    //       rel='noopener noreferrer'
    //     >
    //       Learn
    //     </a>
    //     <button onClick={() => signIn()}>Hello</button>
    //     <button onClick={() => other()}>itg</button>
    //     <button onClick={() => fetchConversation()}>itg</button>
    //   </header>
    // </div>
  );
}

export default App;
