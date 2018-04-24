#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres')

Postgres.initialize()
.then( () =>
    Postgres.query( `SELECT * FROM person`, [ ], { rowsOnly: true } )
    .then( personRows =>
        Promise.all( personRows.map( person => {
            if( !person.email ) return Promise.resolve()

            return Postgres.query( `UPDATE person SET email = $1 WHERE email = $2`, [ person.email.toLowerCase(), person.email ] )
            .catch( e => { console.log( e.stack || e ); process.exit(1) } )
        } ) )
    )
)
.catch( e => { console.log( e.stack || e ); process.exit(1) } )
.then( () => process.exit(0) )