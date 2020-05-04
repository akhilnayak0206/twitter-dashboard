const express = require('express');
var rp = require('request-promise');

const router = express.Router();

//@route   GET /access-token
//@desc    Get access token
//@access  Public
router.get('/', async (req, res) => {
  // options consists of uri and parameters for request-promise to get access-token
  var options = {
    uri: 'https://api.twitter.com/oauth/access_token',
    qs: {
      oauth_token: req.query.token,
      oauth_verifier: req.query.secretToken,
    },
  };

  // make request to twitter API
  rp(options)
    .then(function (parsedBody) {
      // parsedBody is a string
      let params = parsedBody.split('&'),
        pair = null,
        data = {};

      // Below is done so that it can send an object containing token, secret, userName
      params.forEach(function (d) {
        pair = d.split('=');
        // add values into object
        data[pair[0]] = pair[1];
      });
      res.json({ data });
    })
    .catch(function (err) {
      res.status(500).json({ err, message: 'Error while getting token' });
    });
});

module.exports = router;
