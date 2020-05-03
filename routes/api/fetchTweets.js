const express = require('express'),
  rp = require('request-promise'),
  config = require('config'),
  Twit = require('twit');

const consumer_key = config.get('consumerKey'),
  consumer_secret = config.get('consumerSecret');

const router = express.Router();

//@route   GET api/users
//@desc    Register user
//@access  Public
router.get('/', async (req, res) => {
  const T = new Twit({
    consumer_key,
    consumer_secret,
    access_token: req.query.oauth_token,
    access_token_secret: req.query.oauth_token_secret,
  });

  try {
    // T.post(
    //   'statuses/update',
    //   { status: 'Technically the 5th tweet and 4th tweet for testing' },
    //   function (err, data, response) {
    //     if (err) {
    //       return res.send(err);
    //     }
    //     return res.json({ data, response });
    //   }
    // );

    const stream = T.stream('statuses/filter', {
      track: ['bananas', 'oranges', 'strawberries'],
    });

    stream.on('tweet', function (tweet) {
      //...
      console.log(tweet);
      res.send(tweet);
      // res.json({ tweet });
    });
  } catch (err) {
    return res.json({ err, message: 'Some error' });
  }
});

module.exports = router;
