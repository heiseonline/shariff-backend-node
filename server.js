var Hapi    = require('hapi');
var Promise = require('promise');
var config  = require('./shariff.json');

var server = new Hapi.Server(config.port, config.host, {
    cache: {
        engine: require(config.cache.engine)
    }
});

function toJSON(data) {
    return new Promise(function(resolve, reject) {

        try {
            var jsonString = JSON.stringify(data);
            if (jsonString && typeof jsonString === "string") {
                resolve(jsonString);
            } else {
                throw "Failed generating JSON string.";
            }
        }
        catch(e) {
            reject(Error(e));
        }
    });
}

server.method('getJSONOutput', function(resourceURL, next) {

    var services = [
        require('./lib/twitter'),
        require('./lib/facebook'),
        require('./lib/googleplus')
    ];

    var requests = services.map(function(service) {
        return new Promise(function(resolve, reject) {

            service.request(resourceURL, function(error, response, body) {
                if ( !error && response.statusCode === 200 ) {

                    if ( typeof body === "object" ) {
                        resolve(body);
                    } else {
                        resolve(JSON.parse(body));
                    }

                } else {
                    reject(error);
                }
            });
        });
    });

    // res: Array of result objects
    function extractCounts(res) {
        return new Promise(function(resolve, reject) {
            var result = {};

            var i = 0;
            res.forEach(function() {
                var count = services[i].extractCount(res[i]);
                result[ services[i].name ] = count;
                i++;
            });

            resolve(result);
        });
    }

    Promise
        .all(requests)
        .catch(function(error) {
            console.log(require('util').inspect(error));
            next(error);
        })
        .then(extractCounts)
        .then(toJSON)
        .then(function(jsonOutput) {
            next(null, jsonOutput);
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

