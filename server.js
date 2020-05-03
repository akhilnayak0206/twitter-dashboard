const express = require('express');
var passport = require('passport');
var session = require('express-session');
var config = require('config');

const consumerKey = config.get('consumerKey'),
  consumerSecret = config.get('consumerSecret'),
  secretWord = config.get('secretWord'),
  callbackURL = config.get('callbackURL');

const app = express();

app.use(session({ secret: secretWord }));

//Init Middleware
app.use(express.json({ extended: false }));
//Below two lines are required to initialize passport
app.use(passport.initialize());
app.use(passport.session());

var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      callbackURL: callbackURL,
    },
    function (token, tokenSecret, profile, done) {
      console.log({ token, tokenSecret, profile });
      //   console.log('went');
    }
  )
);

//Define Routes
app.get('/auth/twitter', passport.authenticate('twitter'));

app.use('/fetch-twitter', require('./routes/api/fetchTweets'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
