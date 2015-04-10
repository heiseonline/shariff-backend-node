var Hapi    = require('hapi');
var Promise = require('promise');
var config  = require('./shariff.json');
var Shariff = require('./index.js');

var server = new Hapi.Server(config.port, config.host, {
    cache: {
        engine: require(config.cache.engine)
    }
});

server.method('getJSONOutput', function(resourceURL, next) {
    Shariff.getCounts(resourceURL).then(function(counts) {
        next(null, counts);
    }, function(err) {
        next(err);
    });
}, {
    cache: {
        expiresIn: config.cache.expiresIn
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
            if (err)
                reply(!(err instanceof Error) ? new Error(err) : err, null);
            else
                reply(jsonOutput).type('application/json');
        });
    }
});

module.exports = server;

