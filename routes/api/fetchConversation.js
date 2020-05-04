const express = require('express'),
  config = require('config'),
  Twit = require('twit');

const consumer_key = config.get('consumerKey'),
  consumer_secret = config.get('consumerSecret');

const router = express.Router();

//@route   POST /fetch-conversation
//@desc    fetch conversations and replies of a tweet
//@access  Private
router.post('/', async (req, res) => {
  const { token, secretToken, statusID } = req.body;
  if (token && secretToken && statusID) {
    // Initialize with all necessary tokens to make request
    const T = new Twit({
      consumer_key,
      consumer_secret,
      access_token: token,
      access_token_secret: secretToken,
    });

    let tweetData = {},
      replyData = [];

    try {
      // make a get request to get data of a tweet
      T.get(
        `/statuses/lookup`,
        {
          id: statusID,
          tweet_mode: 'extended', // to get full tweet text instead of truncated
        },
        function (err, data, response) {
          if (err) {
            return res.send(err);
          }
          if (data) {
            tweetData = {
              id_str: data[0].id_str,
              full_text: data[0].full_text,
              userScreenName: '@' + data[0].user.screen_name,
              userImage: data[0].user.profile_image_url_https,
              userDescription: data[0].user.description,
              userName: data[0].user.name,
            };
            try {
              // add media attached with the tweet.
              // Sometimes the media doesn't exist so try catch block used
              if (data[0].entities.media[0].media_url_https) {
                tweetData['image'] = data[0].entities.media[0].media_url_https;
              }
            } catch (err) {}

            // get replies of a particular tweet
            T.get(
              'search/tweets',
              {
                q: tweetData.userScreenName,
                sinceId: tweetData.id_str,
                count: 10, //count of replies to get
              },
              function (err, data, response) {
                if (err) {
                  return res.json({ err, error: true });
                }

                if (data.statuses) {
                  for (let index = 0; index < data.statuses.length; index++) {
                    const tweet = data.statuses[index];
                    let replyBody = {
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
                        replyBody['image'] =
                          tweet.entities.media[0].media_url_https;
                      }
                    } catch (err) {}
                    replyData.push(replyBody);
                  }
                  return res.json({
                    tweetData,
                    replyData,
                    response,
                    error: false,
                  });
                }
              }
            );
          }
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
