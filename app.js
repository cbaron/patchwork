var fs = require('fs'),
    port = process.env.PORT || 1337

require('node-env-file')( __dirname + '/.env' );

require('http').createServer( ( request, response ) => {
    response.writeHead( 301, { 'Location': require('util').format( 'https://%s%s', process.env.DOMAIN, request.url ) } )
    response.end("")
} ).listen( port )

require('https')
    .createServer( { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) }, require('./router') )
    .listen( 443 )
