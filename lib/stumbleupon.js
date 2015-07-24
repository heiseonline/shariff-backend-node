var request = require('request');

var stumbleuponURL = 'https://www.stumbleupon.com/services/1.01/badge.getinfo?url=';

module.exports = {
    name: "stumbleupon",
    request: function(url, callback) {
        return request(
            stumbleuponURL + encodeURIComponent(url),
            callback
        );
    },
    extractCount: function(data) {
        return data.result.views;
    }
};
