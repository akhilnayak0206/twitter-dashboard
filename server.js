const express = require('express'),
  passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  session = require('express-session'),
  cors = require('cors'),
  config = require('config'),
  Twit = require('twit');

const app = express(),
  server = require('http').Server(app);

var io = require('socket.io')(server),
  fs = require('fs');

const consumerKey = config.get('consumerKey'),
  consumerSecret = config.get('consumerSecret'),
  secretWord = config.get('secretWord'),
  callbackURL = config.get('callbackURL');

// const socketFunctions = require('./routes/socketFunctions')
var interval;

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
app.use('/fetch-conversation', require('./routes/api/fetchConversation'));
app.use('/reply-tweet', require('./routes/api/ReplyTweet'));

io.on('connection', function (socket) {
  console.log('A user connected');
  socket.on('allTweet', (msg) => {
    if (msg.token && msg.secretToken && msg.search) {
      const T = new Twit({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token: msg.token,
        access_token_secret: msg.secretToken,
      });
      T.get('search/tweets', { q: msg.search, count: 10 }, function (
        err,
        data,
        response
      ) {
        var tweetArray = [];
        if (err) {
          return io.emit('allTweet', {
            message: 'Error in T',
            error: true,
            err,
          });
        }
        if (data) {
          for (let index = 0; index < data.statuses.length; index++) {
            const tweet = data.statuses[index];
            var tweetbody = {
              id: tweet.id,
              id_str: tweet.id_str,
              text: tweet.text,
              userScreenName: '@' + tweet.user.screen_name,
              userImage: tweet.user.profile_image_url_https,
              userDescription: tweet.user.description,
            };
            try {
              if (tweet.entities.media[0].media_url_https) {
                tweetbody['image'] = tweet.entities.media[0].media_url_https;
              }
            } catch (err) {}
            tweetArray.push(tweetbody);
          }
          io.emit('allTweet', {
            tweetArray,
            error: false,
          });
        }
      });

      var stream = T.stream('statuses/filter', {
        track: msg.search,
        language: 'en',
      });

      stream.on('tweet', function (tweet) {
        let sendData = {
          id: tweet.id,
          id_str: tweet.id_str,
          text: tweet.text,
          userScreenName: '@' + tweet.user.screen_name,
          userImage: tweet.user.profile_image_url_https,
          userDescription: tweet.user.description,
        };
        io.emit('tweet', sendData);
      });

      stream.on('disconnect', function (disconnectMessage) {
        return io.emit('allTweet', {
          disconnectMessage,
          message: 'Fetching live tweets limit exceeded. ',
          error: true,
        });
      });
    } else {
      return io.emit('allTweet', {
        message: 'Please add valid parameters',
        error: true,
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
