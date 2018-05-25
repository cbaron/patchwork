#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres')

async function execute() {
    const idsToDelete = [ ]
    await Postgres.initialize()

    const foodOmissionRows = await Postgres.query( `SELECT * FROM memberfoodomission`, [ ], { rowsOnly: true } )

    const rowsByMemberId = foodOmissionRows.reduce( ( memo, row ) => {
        memo[ row.memberid ] ? idsToDelete.push( row.id ) : memo[ row.memberid ] = [ ]        
        memo[ row.memberid ].push( row )
        return memo
    }, { } )

    console.log( 'Members with multiple rows:\n' )

    Object.entries( rowsByMemberId ).forEach( ( [ key, val ] ) => {
        if( val.length > 1 ) {
            console.log( `Member Id: ${key}` )
            console.log( val )
        }
    } )

    return Postgres.query( `DELETE FROM memberfoodomission WHERE id = ANY($1)`, [ idsToDelete ] )
}

execute()
.catch( e => { console.log( e.stack || e ); process.exit(1) } )
.then( () => process.exit(0) )