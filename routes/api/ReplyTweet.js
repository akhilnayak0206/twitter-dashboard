const express = require('express'),
  rp = require('request-promise'),
  config = require('config'),
  Twit = require('twit');

const consumer_key = config.get('consumerKey'),
  consumer_secret = config.get('consumerSecret');

const router = express.Router();

//@route   POST api/users
//@desc    Register user
//@access  Public
router.post('/', async (req, res) => {
  const { token, secretToken, status, replyID } = req.body;
  if (token && secretToken && status && replyID) {
    const T = new Twit({
      consumer_key,
      consumer_secret,
      access_token: token,
      access_token_secret: secretToken,
    });

    try {
      T.post(
        'statuses/update',
        {
          status: status,
          in_reply_to_status_id: replyID,
          auto_populate_reply_metadata: true,
        },
        function (err, data, response) {
          if (err) {
            return res.json({ err, error: true });
          }
          return res.json({ data, response, error: false });
        }
      );
    } catch (err) {
      return res.json({ err, error: true, message: 'Some error' });
    }
  } else {
    return res.json({ error: true, message: 'Please add all credential' });
  }
});

module.exports = router;
