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
  const { token, secretToken, statusID } = req.body;
  if (token && secretToken && statusID) {
    const T = new Twit({
      consumer_key,
      consumer_secret,
      access_token: token,
      access_token_secret: secretToken,
      //   tweet_mode: 'extended',
    });

    let tweetData = {},
      replyData = [];

    try {
      console.log('went');
      T.get(
        `/statuses/lookup`,
        {
          id: statusID,
          tweet_mode: 'extended',
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
              if (data[0].entities.media[0].media_url_https) {
                tweetData['image'] = data[0].entities.media[0].media_url_https;
              }
            } catch (err) {}
            // return res.json({
            //   tweetData,
            //   replyData,
            //   response,
            //   error: false,
            // });

            T.get(
              'search/tweets',
              {
                q: tweetData.userScreenName,
                sinceId: tweetData.id_str,
                count: 10,
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
    // var options = {
    //   uri: 'https://api.twitter.com/1.1/statuses/show.json',
    //   qs: {
    //     consumer_key,
    //     consumer_secret,
    //     access_token_key: token,
    //     access_token_secret: secretToken,
    //     id: statusID
    //   },
    //   headers: {
    //     'User-Agent': 'Request-Promise',
    //   },
    //   json: true, // Automatically parses the JSON string in the response
    // };

    // rp(options)
    //   .then(function (repos) {
    //     return res.json({ error: false, repos });
    //   })
    //   .catch(function (err) {
    //     return res.json({
    //       error: true,
    //       message: 'Please add all credential',
    //       err,
    //     });
    //     // API call failed...
    //   });
  } else {
    return res.json({ error: true, message: 'Please add all credential' });
  }
});

module.exports = router;
