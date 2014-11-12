# Shariff Node Backend

Shariff is used to determine how often a page is shared in social media, but without generating requests from the displaying page to the social sites.

This document describes the Node backend. The following backends are also available:

* [shariff-backend-php](https://github.com/heiseonline/shariff-backend-php)
* [shariff-backend-perl](https://github.com/heiseonline/shariff-backend-perl)

The frontend is available here:

* [shariff](https://github.com/heiseonline/shariff)

## Installing the Shariff backend on you own server

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

Cache settings:

| Key         | Type | Description |
|-------------|------|-------------|
| `engine` | `string` | [catbox](https://github.com/hapijs/catbox) backend |
| `expiresIn` | `integer` | Cache duration in milliseconds |

Start Shariff with:

```bash
$ node node_modules/shariff-backend-node/run.js
141104/143603.929, info, Server ist running at: http://localhost:3001
```

## Testing your installation

Visit `http://localhost:3001/?url=www.example.com` to get a JSON structure containing the share counts:

```json
{"facebook":1452,"twitter":404,"googleplus":23}
```
