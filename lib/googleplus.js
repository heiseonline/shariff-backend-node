var request = require('request');

var googlePlusURL = 'https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ';

module.exports = {
    name: "googleplus",
    request: function(url, callback) {
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
        }, callback)
    },
    extractCount: function(data) {
        return data.result.metadata.globalCounts.count;
    }
}
