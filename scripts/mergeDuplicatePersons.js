#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres')

function findMemberReferences() {
    return Object.keys( Postgres.tables ).reduce( ( memo, tableName ) => {
        if( Postgres.tables[ tableName ].columns.find( column => column.name === 'memberid' ) ) memo.push( tableName )
        return memo
    }, [ ] )
}

function updateAndDelete( extraPersonId, newestMemberId, extraMemberId ) {
    return Promise.all( findMemberReferences().map( tableName =>
        Postgres.query( `UPDATE ${tableName} SET memberid = $1 WHERE memberid = $2`, [ newestMemberId, extraMemberId ] )
    ) )
    .then( () => Postgres.query( `DELETE FROM member WHERE id = $1`, [ extraMemberId ] ) )
    .then( () => Postgres.query( `DELETE FROM person WHERE id = $1`, [ extraPersonId ] ) )
    .then( () => Promise.resolve( duplicates++ ) )
}

let duplicates = 0

Postgres.initialize()
.then( () =>
    Postgres.query( `SELECT * FROM person`, [ ], { rowsOnly: true } )
    .then( personRows => {

        const processedEmails = [ ]

        return Promise.all( personRows.map( person => {
            if( !person.email ) return Promise.resolve()

            return Postgres.query( "SELECT * FROM person WHERE email ~* $1 ORDER BY created DESC", [ person.email ], { rowsOnly: true } )
            .then( matches => {
                if( !matches.length || matches.length < 2 || processedEmails.includes( matches[0].email ) ) return Promise.resolve()

                matches.forEach( match => processedEmails.push( match.email ) )

                return Postgres.query( `SELECT * FROM member WHERE personid = $1`, [ matches[0].id ], { rowsOnly: true } )
                .then( newestMemberRow => {
                    if( !newestMemberRow.length ) return Promise.resolve()

                    return Promise.all( matches.slice(1).map( extraPersonRow =>
                        Postgres.query( `SELECT * FROM member WHERE personid = $1`, [ extraPersonRow.id ], { rowsOnly: true } )
                        .then( extraMemberRow => {
                            if( !extraMemberRow.length ) return Promise.resolve()
                            return updateAndDelete( extraPersonRow.id, newestMemberRow[0].id, extraMemberRow[0].id )
                        } )
                    ) )
                    .catch( e => { console.log( e.stack || e ); process.exit(1) } )

                } )
                .catch( e => { console.log( e.stack || e ); process.exit(1) } )

            } )
            .catch( e => { console.log( e.stack || e ); process.exit(1) } )

        } ) )
        .catch( e => { console.log( e.stack || e ); process.exit(1) } )

    } )
)
.then( () => Promise.resolve( console.log( `Number of duplicate accounts deleted: ${duplicates}` ) ) )
.catch( e => { console.log( e.stack || e ); process.exit(1) } )
.then( () => process.exit(0) )