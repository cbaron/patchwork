const router = require('./router'),
      Postgres = require('./dal/postgres')

require('node-env-file')( __dirname + '/.env' )

const port = process.env.PORT

Promise.all( [
    router.initialize(),
    Postgres.initialize()
] )
.then( () => {
    
    require('http')
        .createServer( router.handler.bind( router ) )
        .listen( port )

    console.log( `Server spinning at ${port}` )
} )
.catch( e => console.log( e.stack || e ) )

process.on( 'unhandledRejection' , e => console.log( e.stack || e ) )
