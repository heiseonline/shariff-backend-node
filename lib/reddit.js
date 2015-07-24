var request = require('request');

var redditURL = 'https://www.reddit.com/api/info.json?url=';

module.exports = {
    name: "reddit",
    request: function(url, callback) {
        return request(
            redditURL + encodeURIComponent(url),
            callback
        );
    },
    extractCount: function(data) {
        var count = 0;
        data.data.children.map(function(item) {
            count += item.data.score;
        });
        return count;
    }
};
