const router = require('./router'),
    Postgres = require('./dal/postgres'),
    Mongo = require('./dal/Mongo')

require('node-env-file')( __dirname + '/.env' )

const port = process.env.PORT
if (!port) return console.log('NEED PORT! Specify in .env')

Promise.all( [
    router.initialize(),
    Postgres.initialize()
] )
.then( () => {
    require('http').createServer( router.handler.bind(router) ).listen( port )
    console.log( `server spinning at ${port}` )
} )
.catch( e => console.log( e.stack || e ) )

process.on( 'unhandledRejection' , e => console.log( e.stack || e ) )
