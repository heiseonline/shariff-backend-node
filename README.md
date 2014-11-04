# Shariff Node Backend

Shariff is used to determine how often a page is shared in social media, but without generating a request from the displaying page to the social sites. See URL for why this is a good idea.

This document describes the Node backend. The following backends are also available:

* shariff-backend-php
* shariff-backend-perl

## Installing the Shariff backend on you own server

Requirements:

* [node](http://nodejs.org/) >= 0.10.22
* [hapi](http://hapijs.com) >= 7.0
* [good](https://github.com/hapijs/good) >= 3.0.1
* [request](https://github.com/request/request) >= 2.45
* [promise](https://github.com/then/promise) >= 6.0.1

To install Shariff on your server, unzip the release zip file, change into the extracted directory and run `npm install`.

This zip file contains contains a configuration file `shariff.json`. The following configuration options are available:

| Key         | Type | Description |
|-------------|------|-------------|
| `port`    | `integer`  | Port Shariff runs on |

Start Shariff with `node index.js`.

```bash
foo@bar:~/shariff-backend-node$ node index.js
141104/143603.929, info, Server ist running at: http://localhost:3001
```

## Testing your installation

Visit `http://localhost:3001/sharecount/?url=www.example.com` to get a JSON structure containing only the share counts.

```json
{"facebook":1452,"twitter":404,"gplus":23}
```

Visit `http://localhost:3001/services/?url=www.example.com` to get the raw data sent by the social networks as a JSON structure.

```json
{"facebook":1452,"twitter":404,"gplus":23}
```
