import React, { useState, useEffect } from 'react';

function Conversation() {
  const [token, setToken] = useState('');
  const [secretToken, setSecretToken] = useState('');

  useEffect(() => {
    let tokenData = sessionStorage.getItem('token');
    let secretTokenData = sessionStorage.getItem('secretToken');
    setToken(tokenData);
    setSecretToken(secretTokenData);
  }, []);

  console.log(token, secretToken);

  return (
    <div>
      Details<p>hello</p> tweets cards dashboard
    </div>
  );
}

export default Conversation;
