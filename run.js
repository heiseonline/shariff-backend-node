var server = require('./server');
var Good   = require('good');

server.pack.register(Good, function(err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function() {
        server.log('info', 'Server ist running at: ' + server.info.uri);
    });
});