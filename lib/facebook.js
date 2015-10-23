var request = require('request');

var config = require('../shariff.json');
var accessToken = '';
if (config && config.facebook && config.facebook.client_id && config.facebook.client_secret) {
    accessToken += 'access_token=' + config.facebook.client_id + '|' + config.facebook.client_secret + '&';
}

var facebookURL = 'https://graph.facebook.com/?' + accessToken + 'id=';
module.exports = {
    name: "facebook",
    request: function(url, callback) {
        return request(
            facebookURL + encodeURIComponent(url),
            callback
        );
    },
    extractCount: function(data) {
        var count = 0;
        if (data) {
            if (data.share && data.share.share_count) {
                count = data.share.share_count;
            } else if (data.shares) {
                count = data.shares;
            }
        }
        return count;
    }
};