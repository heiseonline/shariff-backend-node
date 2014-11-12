var request = require('request');

var twitterURL = 'http://urls.api.twitter.com/1/urls/count.json?url=';

module.exports = {
    name: "twitter",
    request: function(url, callback) {
        return request(
            twitterURL + encodeURIComponent(url),
            callback
        );
    },
    extractCount: function(data) {
        return data.count;
    }
}
