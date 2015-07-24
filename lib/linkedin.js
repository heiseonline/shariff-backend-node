var request = require('request');

var linkedinURL = 'https://www.linkedin.com/countserv/count/share?url=';
var linkedinParams = '&lang=de_DE&format=json';

module.exports = {
    name: "linkedin",
    request: function(url, callback) {
        return request(
            linkedinURL + encodeURIComponent(url) + linkedinParams,
            callback
        );
    },
    extractCount: function(data) {
        return data.count;
    }
};
