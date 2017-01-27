#!/usr/bin/env node

var fs = require('fs'),
    server

require('node-env-file')( `${__dirname}/../.env` )

server = require('livereload').createServer( {
    exts: [ 'gz' ],
    https: { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) },
    ignoreExts: [ 'js', 'css' ],
    originalPath: `https://${process.env.DOMAIN}.com`
} )

server.watch( `${__dirname}/../static` )
