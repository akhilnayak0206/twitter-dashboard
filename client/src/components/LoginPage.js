import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardText, CardTitle, Button, CardImg } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = ({ match }) => {
  const [loginHTML, setLoginHTML] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let token = await getUrlParameter('oauth_token');
      let secretToken = await getUrlParameter('oauth_verifier');
      if (token && secretToken) {
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
    let denied = await getUrlParameter('denied');
    if (denied) {
      return alert('Please sign in to proceed');
    }
    let token = await getUrlParameter('oauth_token');
    let secretToken = await getUrlParameter('oauth_verifier');
    console.log(token, secretToken);
    if (token && secretToken) {
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
    } else {
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
            <Link to='http://localhost:5000/auth/twitter'>
              <Button className='loginButton'>Log-In OR Sign-Up</Button>
            </Link>
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
