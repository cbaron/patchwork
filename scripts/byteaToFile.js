#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

var dataPath = __dirname + '/../static/data'
    tables = [
        { name: 'carousel', columns: [ 'image' ] },
        { name: 'csapageimage', columns: [ 'image' ] },
        { name: 'header', columns: [ 'image', 'mobileimage' ] },
        { name: 'staffprofile', columns: [ 'image' ] }
    ],
    format = require('util').format,
    fs = require('fs')
    pg = require('../dal/postgres'),
    mkDir = ( dir ) => new Promise( ( resolve, reject ) => {
        fs.stat( dir, ( err, stats ) => {
            if( err && err.code !== 'ENOENT' ) { return reject( err.stack || err ) }
            if( stats && stats.isDirectory() ) return resolve()
            fs.mkdir( dir, mkdirErr => {
                if( mkdirErr ) reject( mkdirErr.stack || mkdirErr )
                resolve()
            } )
        } )
    } ),
    zlib = require('zlib')


tables.forEach( table => {
    mkDir( format( "%s/%s", dataPath, table.name ) )
    .then( () => Promise.all( table.columns.map( column => mkDir( format( "%s/%s/%s", dataPath, table.name, column ) ) ) ) )
    .then( () => new pg().query( format( "SELECT id FROM %s", table.name ) ) )
    .then( result => {
        var chain = new Promise( ( resolve, reject ) => resolve() )
        result.rows.forEach( row =>
            table.columns.forEach( column =>
                chain.then( () => new pg().query( format( "SELECT %s FROM %s WHERE id = %s", column, table.name, row.id ) ) )
                .then( columnResult => new Promise( ( resolve, reject ) => {
                    fs.writeFile(
                        format( "%s/%s/%s/%s", dataPath, table.name, column, row.id ),
                        columnResult.rows[0][ column ].toString('binary'),
                        { encoding: 'binary' }, err => {
                            if( err ) return reject( err.stack || err )
                            resolve()
                        }
                    )
                } ) )
            )
        )
        return chain
    } )
    .catch( e => console.log( e.stack || e ) )
} )
