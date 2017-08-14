var request = require('request');

var linkedinURL = 'https://www.linkedin.com/countserv/count/share?url=';
var linkedinParams = '&lang=de_DE&format=json';

module.exports = {
    name: "linkedin",
    request: function(url, callback) {

        // linkedin requires protocol to be included
        if (!/^https?:\/\//.test(url))
            url = 'http://' + url;

        return request(
            linkedinURL + encodeURIComponent(url) + linkedinParams,
            callback
        );
    },
    extractCount: function(data) {
        return data.count;
    }
};
