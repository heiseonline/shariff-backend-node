var Promise = require('promise');
var config  = require('./shariff.json');

var cache = {};

/**
 * Returns the counts for the given url on success. Keeps an internal
 * cache of the results which expires based on the expiresIn config value
 *
 * @param  String  url     URL to search for counts
 * @param  bool    noCache If true, the request bypasses the cache
 *
 * @return Promise         Promise resolving to an object containing the counts
 *                         or an error on reject
 */
function getCounts(url, noCache) {
    var services = [
        require('./lib/facebook'),
        require('./lib/googleplus'),
        require('./lib/flattr'),
        require('./lib/linkedin'),
        require('./lib/reddit'),
        require('./lib/stumbleupon'),
        require('./lib/xing')
    ];

    var cached = cache[url];
    if (!noCache && cached && cached.expire > new Date())
        return Promise.resolve(cached.counts);

    var requests = services.map(function(service) {
        return new Promise(function(resolve, reject) {

            service.request(url, function(error, response, body) {
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

    return Promise
        .all(requests)
        .then(extractCounts)
        .then(toJSON)
        .then(function(counts) {
            cache[url] = {
                expire: +new Date() + config.cache.expiresIn,
                counts: counts
            };

            return Promise.resolve(counts);
        }, function(err) {
            return Promise.reject(err);
        });
}

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

module.exports = {
    getCounts: getCounts
};
