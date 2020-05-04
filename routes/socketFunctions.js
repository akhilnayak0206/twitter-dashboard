const express = require('express'),
  rp = require('request-promise'),
  config = require('config'),
  Twit = require('twit');

var io = require('socket.io')(server),
  fs = require('fs');

const consumer_key = config.get('consumerKey'),
  consumer_secret = config.get('consumerSecret');

function socketFunction(socket) {
  T.get('search/tweets', { q: '#coding', count: 100 }, function (
    err,
    data,
    response
  ) {
    var tweetArray = [];
    for (let index = 0; index < data.statuses.length; index++) {
      const tweet = data.statuses[index];
      var tweetbody = {
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
    io.emit('allTweet', tweetArray);
  });

  var stream = T.stream('statuses/filter', {
    track: '#coding',
    language: 'en',
  });

  stream.on('tweet', function (tweet) {
    io.emit('tweet', { tweet: tweet });
  });
}

module.exports = socketFunction;
