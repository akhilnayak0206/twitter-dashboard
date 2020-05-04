import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';

const AllTweets = () => {
  const [token, setToken] = useState('');
  const [secretToken, setSecretToken] = useState('');

  useEffect(() => {
    let tokenData = sessionStorage.getItem('token');
    let secretTokenData = sessionStorage.getItem('secretToken');
    setToken(tokenData);
    setSecretToken(secretTokenData);
  }, []);

  useEffect(() => {
    if (token && secretToken) {
      const socket = socketIOClient(ENDPOINT);
      socket.emit('allTweet', {
        token: '708548682510049281-hyhxY6b0RwJbmLJYPluFaxy5uYR5tpF',
        secretToken: 'AwY4X6bHgItd2kF0M5Ghl00LgytIcqt6ZIJsfquwWlAQE',
        search: 'coding',
      });
      let i = 0;
      socket.on('allTweet', (data) => {
        console.log(data, i);
        i++;
      });
      socket.on('tweet', (data) => console.log(data));
    }
    // return () => {
    //     cleanup
    // }
  }, []);

  console.log(token, secretToken);

  return (
    <div>
      Details<p>hello</p> tweets cards dashboard
    </div>
  );
};

export default AllTweets;
