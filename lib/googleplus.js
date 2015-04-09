var request = require('request');

var googlePlusURL = 'https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ';

module.exports = {
    name: "googleplus",
    request: function(url, callback) {
        // g+ requires protocol to be included
        if (!/^https?:\/\//.test(url))
            url = 'http://' + url;

        return request({
            uri:    googlePlusURL,
            method: 'POST',
            json:   {
                method: 'pos.plusones.get',
                id: 'p',
                params: {
                    nolog: true,
                    id: url,
                    source: 'widget',
                    userId: '@viewer',
                    groupId: '@self',
                },
                jsonrpc: '2.0',
                key: 'p',
                apiVersion: 'v1',
            }
        }, function(error, response, body) {
            // just pass the error on to the parent handler
            if (error || response.statusCode !== 200)
                return callback(error, response, body);

            if (body.error)
                return callback(body.error, response, body);

            return callback(error, response, body);
        });
    },
    extractCount: function(data) {
        return data.result.metadata.globalCounts.count;
    }
};
