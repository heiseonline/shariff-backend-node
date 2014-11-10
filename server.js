var Hapi    = require('hapi');
var Promise = require('promise');
var request = require('request');
var config  = require('./shariff.json');

var server = new Hapi.Server(config.port, {
    cache: {
        engine: require('catbox-memory'),
    }
});

function getTwitter(resourceURL) {
    return new Promise(function(resolve, reject) {
        var twitterURL = 'http://urls.api.twitter.com/1/urls/count.json';
        twitterURL += '?url=' + resourceURL;

        request(twitterURL, function(error, response, body) {
            if ( !error && response.statusCode == 200 ) {
                var twitter = JSON.parse(body);
                resolve(twitter);
            } else {
                reject(Error(error));
            }
        });
    });
}

function getFacebook(resourceURL) {
    return new Promise(function(resolve, reject) {
        var facebookURL = 'https://api.facebook.com/method/fql.query';
        facebookURL += '?format=json';
        facebookURL += '&query=select like_count from link_stat where url=\"'+resourceURL+'\"';

        request(facebookURL, function(error, response, body) {
            if ( !error && response.statusCode == 200 ) {
                var facebook = JSON.parse(body);
                resolve(facebook);
            } else {
                reject(Error(error));
            }
        });
    });
}

function getGooglePlus(resourceURL) {
    return new Promise(function(resolve, reject) {
        var gplusURL = 'https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ';
        var gplusBody = {
            method: 'pos.plusones.get',
            id: 'p',
            params: {
                nolog: true,
                id: resourceURL,
                source: 'widget',
                userId: '@viewer',
                groupId: '@self',
            },
            jsonrpc: '2.0',
            key: 'p',
            apiVersion: 'v1',
        };

        request({uri: gplusURL, method: 'POST', json: gplusBody}, function(error, response, body) {
            if ( !error && response.statusCode == 200 ) {
                resolve(body);
            }
        });
    });
}

function getCountOnly(res) {
    return new Promise(function(resolve, reject) {
        if (res.length !== 3) {
            reject();
        }

        resolve({
            twitter:    res[0].count,
            facebook:   res[1][0].like_count,
            googleplus: res[2].result.metadata.globalCounts.count
        });
    });
}

function toJSON(data) {
    return new Promise(function(resolve, reject) {

        try {
            var jsonString = JSON.stringify(data);
            if (jsonString && typeof jsonString === "string") {
                resolve(jsonString);
            } else {
                throw "Failed generating JSON string."
            }
        }
        catch(e) {
            reject(Error(e));
        }
    });
}

server.method('getJSONOutput', function(resourceURL, next) {
    Promise.all(
        [
            getTwitter(resourceURL),
            getFacebook(resourceURL),
            getGooglePlus(resourceURL)
        ]
    ).then(getCountOnly).then(toJSON).then(function(jsonOutput) {
        server.log('info', 'before next');
        next(null, jsonOutput);
    });
}, {
    cache: {
        expiresIn: 3600 * 1000
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(req, reply) {
        var resourceURL = req.query.url;

        if ( ! resourceURL ) {
            reply('{}').type('application/json');
        }

        server.methods.getJSONOutput(resourceURL, function(err, jsonOutput) {
            reply(jsonOutput).type('application/json');
        });
    }
});

module.exports = server;


