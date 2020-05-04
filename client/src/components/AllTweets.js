import React, { useState, useEffect } from 'react';
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import socketIOClient from 'socket.io-client';
import '../styles/AllTweets.css';

const ENDPOINT = 'http://localhost:5000';
let socket;

const AllTweets = ({ history, selected }) => {
  const [token, setToken] = useState('');
  const [secretToken, setSecretToken] = useState('');
  const [search, setSearch] = useState('');
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    let tokenData = sessionStorage.getItem('token');
    let secretTokenData = sessionStorage.getItem('secretToken');
    if (tokenData === null || secretTokenData === null) {
      return history.push(`/login`);
    }
    setToken(tokenData);
    setSecretToken(secretTokenData);
    socket = socketIOClient(ENDPOINT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchBtn = () => {
    if (search === '') {
      return alert('Please enter a query');
    } else if (token && secretToken && search) {
      socket.emit('allTweet', {
        token,
        secretToken,
        search,
      });
      socket.on('allTweet', function (data) {
        if (data.error) {
          history.push(`/login`);
          return alert('Please Sign In again');
        } else if (data.tweetArray) {
          setTweets(data.tweetArray);
        }
      });

      //below code actually shows the live update.
      //the frequency of update is around 5 tweets per second

      //   socket.on('tweet', (data) => {
      //     let allTweets = tweets;
      //     setTweets([...allTweets, data]);
      //   });
    } else {
      history.push(`/login`);
      return alert('Please Sign In again');
    }
  };

  return (
    <>
      <InputGroup className='inputBox'>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search any query'
          value={search}
        />
        <InputGroupAddon addonType='append'>
          <Button className='searchButton' onClick={() => searchBtn()}>
            search
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {search ? (
        <div className='container'>
          {tweets ? (
            tweets.map((data) => (
              <div
                className='card margin10 cursorPointer cardShadow'
                key={data.id}
                onClick={() => selected(data)}
              >
                <div className='card-body'>
                  <img
                    src={`${data.userImage}`}
                    className='float-left rounded-circle marginRight5'
                    alt='profile'
                  />
                  <div className='message'>
                    <h5 className='card-title'>{data.userName}e</h5>
                    <h6 className='card-subtitle mb-2 text-muted'>
                      {data.userScreenName}
                    </h6>
                    <p className='card-text'>{data.text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1>No tweets found</h1>
          )}
        </div>
      ) : null}
    </>
  );
};

export default AllTweets;
