import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardText, Button, CardImg } from 'reactstrap';
import '../styles/LoginPage.css';

const LoginPage = ({ history }) => {
  const [loginHTML, setLoginHTML] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
    async function fetchData() {
      let token = await getUrlParameter('oauth_token');
      let secretToken = await getUrlParameter('oauth_verifier');
      let denied = await getUrlParameter('denied');
      if (denied) {
        return alert('Please sign in to proceed');
      } else if (token && secretToken) {
        return setLoginHTML(false);
      } else {
        return setLoginHTML(true);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const getUrlParameter = (name) => {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const onAcceptPermission = async () => {
    setClicked(true);
    let denied = await getUrlParameter('denied');
    if (denied) {
      setLoginHTML(true);
      setClicked(false);
      history.push(`/login`);
      return alert('Please sign in to proceed');
    }
    let token = await getUrlParameter('oauth_token');
    let secretToken = await getUrlParameter('oauth_verifier');
    if (token && secretToken) {
      try {
        let response = await fetch(
          `http://localhost:5000/access-token?token=${token}&secretToken=${secretToken}`
        );
        let data = await response.json();
        if (data.err) {
          setLoginHTML(true);
          setClicked(false);
          history.push(`/login`);
          return alert('Please Sign In');
        } else {
          sessionStorage.setItem('token', data.data.oauth_token);
          sessionStorage.setItem('secretToken', data.data.oauth_token_secret);
          history.push(`/dashboard`);
        }
      } catch (error) {
        setClicked(false);
        setLoginHTML(true);
        history.push(`/login`);
        return alert('Please Sign In');
      }
    } else {
      setClicked(false);
      setLoginHTML(true);
      history.push(`/login`);
      return alert('Please Sign In');
    }
  };

  const onDeclinePermission = () => {
    return alert('You need to accept to proceed');
  };

  return (
    <div className='main displayFlex justifyAlignCenter'>
      <Card body className='cardBody text-center'>
        <CardImg
          className='cardImage'
          src='http://pngimg.com/uploads/twitter/twitter_PNG19.png'
          alt='twitter'
        />
        {loginHTML ? (
          <Fragment>
            <CardText className='textFamily margin5'>
              Log In or Register your twitter account
            </CardText>
            <a href='http://localhost:5000/auth/twitter'>
              <Button className='loginButton'>Log-In / Register</Button>
            </a>
          </Fragment>
        ) : (
          <Fragment>
            <CardText className='textFamily margin5'>
              Do you allow to tweet from this website?
            </CardText>
            <div className='bothButton'>
              <Button
                className='declineButton'
                onClick={() => onDeclinePermission()}
              >
                Decline
              </Button>
              <Button
                className='acceptButton'
                onClick={() => onAcceptPermission()}
                disabled={clicked}
              >
                Accept
              </Button>
            </div>
          </Fragment>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
