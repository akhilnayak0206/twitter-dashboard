const express = require('express'),
  passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  session = require('express-session'),
  cors = require('cors'),
  config = require('config');

const consumerKey = config.get('consumerKey'),
  consumerSecret = config.get('consumerSecret'),
  secretWord = config.get('secretWord'),
  callbackURL = config.get('callbackURL');

const app = express();

app.use(cors());
app.use(session({ secret: secretWord }));

//Init Middleware
app.use(express.json({ extended: false }));

//Below two lines are required to initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new TwitterStrategy(
    {
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      callbackURL: callbackURL,
    },
    function (token, tokenSecret, profile, done) {
      // console.log({ token, tokenSecret, profile });
    }
  )
);

//Define Routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.use('/access-token', require('./routes/api/accessToken'));

app.use('/fetch-tweets', require('./routes/api/fetchTweets'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
