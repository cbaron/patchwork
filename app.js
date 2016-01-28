var fs = require('fs');

require('node-env-file')( __dirname + '/.env' );

if( process.env.HTTPS === "false" ) {
    require('http')
        .createServer( require('./router') )
        .listen( process.env.PORT || 1337 )
} else {
    require('https')
        .createServer( { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) }, require('./router') )
        .listen( process.env.PORT || 1337 )
}
