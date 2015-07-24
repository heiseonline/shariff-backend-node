var request = require('request');

var xingURL = 'https://www.xing-share.com/spi/shares/statistics';

module.exports = {
    name: "xing",
    request: function(url, callback) {
        return request.post({
            url: xingURL,
            form: {url: url}
        }, callback);
    },
    extractCount: function(data) {
        return parseInt(data.share_counter, 10);
    }
};
