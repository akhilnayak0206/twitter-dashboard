const express = require('express');
const router = express.Router();
var config = require('config');

const consumer_key = config.get('consumerKey'),
  consumer_secret = config.get('consumerSecret');

var Twit = require('twit');

//@route   POST api/users
//@desc    Register user
//@access  Public
router.get('/', async (req, res) => {
  var T = new Twit({
    consumer_key,
    consumer_secret,
    access_token: req.query.token,
    access_token_secret: req.query.secretToken,
  });
  T.post('statuses/update', { status: 'hello world!' }, function (
    err,
    data,
    response
  ) {
    if (err) {
      return res.send(err);
    }
    res.send(data);
  });
  // console.log(req.query);
  // res.send('ok');
});

module.exports = router;
