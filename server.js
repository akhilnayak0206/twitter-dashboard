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

// app.use(cors()); //use this for localhost
app.use(
  cors({
    credentials: true,
    origin: 'https://pacific-plateau-75702.herokuapp.com',
  })
);
app.use(session({ secret: secretWord, resave: true, saveUninitialized: true }));

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
      // check whether you received the data
    }
  )
);

//Define Routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.use('/access-token', require('./routes/api/accessToken'));
app.use('/fetch-conversation', require('./routes/api/fetchConversation'));
app.use('/reply-tweet', require('./routes/api/ReplyTweet'));

// socket.io connection
io.on('connection', function (socket) {
  // allTweets gets 10 tweet then listens to tweets
  // tweet listens to live tweets
  socket.on('allTweet', (msg) => {
    if (msg.token && msg.secretToken && msg.search) {
      // Initialize twit to make request to twitter API
      const T = new Twit({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token: msg.token,
        access_token_secret: msg.secretToken,
      });
      try {
        // get tweets according to search query with a count
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
                userName: tweet.user.name,
              };
              try {
                // add media attached with the tweet.
                // Sometimes the media doesn't exist so try catch block used
                if (tweet.entities.media[0].media_url_https) {
                  tweetbody['image'] = tweet.entities.media[0].media_url_https;
                }
              } catch (err) {}
              tweetArray.push(tweetbody);
            }

            // send tweetArray to client
            io.emit('allTweet', {
              tweetArray,
              error: false,
            });
          }
        });

        //listen to real-time tweets
        var stream = T.stream('statuses/filter', {
          track: msg.search,
          language: 'en',
        });

        // tweet listens to live tweets
        stream.on('tweet', function (tweet) {
          if (tweet.err) {
            return;
          } else {
            let sendData = {
              id: tweet.id,
              id_str: tweet.id_str,
              text: tweet.text,
              userScreenName: '@' + tweet.user.screen_name,
              userImage: tweet.user.profile_image_url_https,
              userDescription: tweet.user.description,
              userName: tweet.user.name,
            };
            io.emit('tweet', sendData);
          }
        });

        stream.on('disconnect', function (disconnectMessage) {
          return io.emit('allTweet', {
            disconnectMessage,
            message: 'Fetching live tweets limit exceeded. ',
            error: true,
          });
        });
      } catch (err) {
        return io.emit('allTweet', {
          err,
          message: 'Fetching live tweets error.',
          error: true,
        });
      }
    } else {
      return io.emit('allTweet', {
        message: 'Please add valid parameters',
        error: true,
      });
    }
  });
});

// Serve static assets i.e. React(Front End) build folder in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
