import React from 'react';
import AllTweets from './AllTweets';
import Conversation from './Conversation';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className='displayFlex'>
      <div className='allTweets'>
        <AllTweets />
      </div>
      <div className='conversationTweet'>
        <Conversation />
      </div>
    </div>
  );
};

export default Dashboard;
