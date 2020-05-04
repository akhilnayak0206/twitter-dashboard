import React, { useState, useEffect } from 'react';
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import '../styles/Conversation.css';

function Conversation({ selected, history }) {
  const [token, setToken] = useState('');
  const [secretToken, setSecretToken] = useState('');
  const [userData, setUserData] = useState({});
  const [replyData, setReplyData] = useState([]);
  const [replyTweet, setReplyTweet] = useState('');

  useEffect(() => {
    let tokenData = sessionStorage.getItem('token');
    let secretTokenData = sessionStorage.getItem('secretToken');
    if (tokenData === null || secretTokenData === null) {
      return history.push(`/login`);
    }
    setToken(tokenData);
    setSecretToken(secretTokenData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUserData({});
    setReplyData([]);
    setReplyTweet('');
    if (selected.id_str) {
      let data = {
        token,
        secretToken,
        statusID: selected.id_str,
      };
      fetch('http://localhost:5000/fetch-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert('Error getting data. Try again');
          } else {
            setUserData(data.tweetData);
            setReplyData(data.replyData);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const repliedSuccess = () => {
    setUserData({});
    setReplyData([]);
    setReplyTweet('');
    let data = {
      token,
      secretToken,
      statusID: selected.id_str,
    };
    fetch('http://localhost:5000/fetch-conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert('Error getting data. Try again');
        } else {
          setUserData(data.tweetData);
          setReplyData(data.replyData);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const replySend = () => {
    if (replyTweet === '') {
      return alert('Please enter some input');
    }
    let data = {
      token,
      secretToken,
      replyID: selected.id_str,
      status: replyTweet,
    };
    fetch('http://localhost:5000/reply-tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert('Error replying to tweet');
        } else {
          repliedSuccess();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      {selected.id_str ? (
        <>
          <div className='whiteCard'>
            <h1 className='textFamily'>Conversations: </h1>
            <div className='container overflow-scroll height100'>
              <div className='card cardShadow'>
                <div className='card-body'>
                  <img
                    src={`${selected.userImage}`}
                    className='float-left rounded-circle margin5'
                    alt='profile'
                  />
                  <div className='message'>
                    <h5 className='card-title'>{selected.userName}</h5>
                    <h6 className='card-subtitle mb-2 text-muted'>
                      {selected.userScreenName}
                    </h6>
                    {userData.full_text && (
                      <p className='card-text'>{userData.full_text}</p>
                    )}
                  </div>
                </div>
              </div>
              {replyData && (
                <div className='container padding10'>
                  <h3>Replies:</h3>
                  {replyData.map((data) => (
                    <div className='card cardShadow margin5' key={data.id}>
                      <div className='card-body'>
                        <img
                          src={`${data.userImage}`}
                          className='float-left rounded-circle margin5'
                          alt='profile'
                        />
                        <div className='message'>
                          <h5 className='card-title'>{data.userName}</h5>
                          <h6 className='card-subtitle mb-2 text-muted'>
                            {data.userScreenName}
                          </h6>
                          <p className='card-text'>{data.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <InputGroup className='belowInputBox'>
            <Input
              onChange={(e) => setReplyTweet(e.target.value)}
              placeholder='Reply to tweet'
              value={replyTweet}
            />
            <InputGroupAddon addonType='append'>
              <Button className='searchButton' onClick={() => replySend()}>
                send
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </>
      ) : (
        <div className='whiteCard'>
          <h1>Please select a tweet</h1>
        </div>
      )}
    </>
  );
}

export default Conversation;
