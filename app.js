const fs = require('fs'),
      router = require('./router')

require('node-env-file')( __dirname + '/.env' )

const port = process.env.PORT || 80

router.initialize()
.then( () => {
    
    require('http').createServer( ( request, response ) => {
        response.writeHead( 301, { 'Location': `https://${process.env.DOMAIN}${request.url}` } )
        response.end("")
    } ).listen( port )

    require('https')
        .createServer( { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) }, router.handler.bind( router ) )
        .listen( 443 )

    console.log( "Secure server spinning" )
} )
.catch( e => console.log( e.stack || e ) )
