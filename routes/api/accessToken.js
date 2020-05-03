const express = require('express');
var rp = require('request-promise');

const router = express.Router();

//@route   GET api/users
//@desc    Register user
//@access  Public
router.get('/', async (req, res) => {
  var options = {
    uri: 'https://api.twitter.com/oauth/access_token',
    qs: {
      oauth_token: req.query.token,
      oauth_verifier: req.query.secretToken,
    },
    // json: true, // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function (parsedBody) {
      let params = parsedBody.split('&'),
        pair = null,
        data = {};

      params.forEach(function (d) {
        pair = d.split('=');
        data[pair[0]] = pair[1];
      });
      res.json({ data });
    })
    .catch(function (err) {
      res.status(500).json({ err, message: 'Error while getting token' });
    });
});

module.exports = router;
