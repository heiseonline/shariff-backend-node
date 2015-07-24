var request = require('request');

var flattrURL = 'https://api.flattr.com/rest/v2/things/lookup/?url=';

module.exports = {
    name: "flattr",
    request: function(url, callback) {
        return request(
            flattrURL + encodeURIComponent(url),
            callback
        );
    },
    extractCount: function(data) {
        return data.flattrs;
    }
};
