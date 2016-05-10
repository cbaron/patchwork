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
    pg = require('../dal/postgres')


tables.forEach( table =>
    Promise.all( table.columns.map( column => new pg().query( format( "UPDATE %s SET %s = NULL", table.name, column ) ) ) )
    .catch( e => console.log( e.stack || e ) )
)
