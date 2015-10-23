# Shariff Node Backend

Shariff is used to determine how often a page is shared in social media, but without generating requests from the displaying page to the social sites.

![Shariff Logo © 2014 Heise Zeitschriften Verlag](http://www.heise.de/icons/ho/shariff-logo.png)

This document describes the Node backend. The following backends are also available:

* [shariff-backend-php](https://github.com/heiseonline/shariff-backend-php)
* [shariff-backend-perl](https://github.com/heiseonline/shariff-backend-perl)

The frontend is available here:

* [shariff](https://github.com/heiseonline/shariff)

## Installing the Shariff backend on you own server

### Option 1: Run the standalone server

Create a project folder and install the Shariff server using `npm`:

```sh
$ mkdir my-shariff-server
$ cd my-shariff-server
$ npm init
$ npm install --save shariff-backend-node
```

The node package contains a configuration file `shariff.json`. The following configuration options are available:

| Key         | Type | Description |
|-------------|------|-------------|
| `port`    | `integer`  | Port Shariff runs on |
| `host`    | `string`  | Host/IP address Shariff runs on |
| `cache`    | `object`  | Cache settings described below |
| `services` | `array`   | Array of services to be used (optional) |
| `facebook` | `object`  | Facebook access settings (optional) |
| `cors`     | `boolean` | Allow/disallow cross-domain requests |
| `tls`      | `object`  | Settings to run server over HTTPS |

Cache settings:

| Key         | Type | Description |
|-------------|------|-------------|
| `engine` | `string` | [catbox](https://github.com/hapijs/catbox) backend |
| `expiresIn` | `integer` | Cache duration in milliseconds |

[Facebook access settings](https://developers.facebook.com/docs/apps/register):

| Key         | Type | Description |
|-------------|------|-------------|
| `client_id` | `string` | Application id |
| `client_secret` | `string` | Application secret key |

TLS settings:

| Key         | Type     | Description         |
|-------------|----------|---------------------|
| `key`       | `string` | Path to `key` file  |
| `cert`      | `string` | Path to `cert` file |

Start Shariff with:

```bash
$ node node_modules/shariff-backend-node/run.js
141104/143603.929, info, Server ist running at: http://localhost:3001
```
### Option 2:

Alternatively, you may call the Shariff backend from your own code. If called directly, the code will still use a cache and honor the expiresIn setting, the engine will however not be used in this case, just a simple object store.

Sample:

```node
var Shariff = require('shariff-backend-node');

Shariff.getCounts('google.com').then(function(counts) {
    console.log('Success, counts:', counts);
}, function(err) {
    console.log('Failed to grab counts!', err);
});
```
If passed `true` as second parameter, the `getCounts()` method will not use its cache and instead re-query the services.

## Testing your installation

Visit `http://localhost:3001/?url=www.example.com` to get a JSON structure containing the share counts:

```json
{"facebook":1452,"twitter":404,"googleplus":23}
```
