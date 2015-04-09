var request = require('request');

var facebookURL = 'https://api.facebook.com/method/fql.query?format=json';
facebookURL    += '&query=select share_count from link_stat where url=\"';

module.exports = {
    name: "facebook",
    request: function(url, callback) {
        return request(
            facebookURL + encodeURIComponent(url) +'\"',
            callback
        );
    },
    extractCount: function(data) {
        return !data || !data.length ? 0 : data[0].share_count;
    }
};
