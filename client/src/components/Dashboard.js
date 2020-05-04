import React, { useState } from 'react';
import AllTweets from './AllTweets';
import Conversation from './Conversation';
import '../styles/Dashboard.css';

const Dashboard = ({ history }) => {
  const [selected, setSelected] = useState({});
  return (
    <div className='displayFlex'>
      <div className='allTweets'>
        <AllTweets history={history} selected={setSelected} />
      </div>
      <div className='conversationTweet'>
        <Conversation history={history} selected={selected} />
      </div>
    </div>
  );
};

export default Dashboard;
