var MyObject = require('../lib/MyObject');

var Postgres = function() {
    this.connectionString = process.env.POSTGRES
    return MyObject.apply( Object.assign( this, {
        client: undefined,
        deferred: { connection: this.Q.defer(), query: this.Q.defer() },
        done: undefined } ), arguments )
}

Object.assign( Postgres.prototype, MyObject.prototype, {

    _copyTo: require('pg-copy-streams').to,

    _handleConnect: function( err, client, done ) {
        if( err ) return this.deferred.connection.reject( new Error( "Error fetching client from pool : " + err ) )

        this.client = client;
        this.done = done;

        this.deferred.connection.resolve( true );

        return this;
    },

    _handleQuery: function( query, args, err, result ) {
        this.done();

        if( err ) return this.deferred.query.reject( new Error( this.format( 'Running query (%s [%s]) : %s', query, args, err ) ) )

        this.deferred.query.resolve( result );

        return this;
    },

    _pg: require('pg'),

    _pgNative: require('pg-native'),

    _query: function( query, args ) {

        this.client.query( query, args, this._handleQuery.bind( this, query, args ) );
        return this;
    },
    
    _queryStream: require('pg-query-stream'),

    connect: function() {
        this._pg.connect( this.connectionString, this._handleConnect.bind(this) );
        return this.deferred.connection.promise;
    },

    query( query, args ) {
        this.connect().then( this._query.bind( this, query, args ) ).done()
        return this.deferred.query.promise
    },

    queryStream( query, pipe ) {
        return new Promise( ( resolve, reject ) => {
            this.connect()
            .then( () => {
                var qStream = new this._queryStream( query )
                    stream = this.client.query( qStream )
                stream.on( 'end', () => { this.done(); qStream.close(); pipe.end(); resolve() } )
                stream.on( 'data', chunk => {
                    pipe.write( new Buffer( chunk.encode, 'hex' ).toString('binary'), 'binary' )
                } )
                stream.on( 'error', e => { this.done(); qStream.close(); pipe.end(); console.log(e.stack || e); reject( e ) } )
            } )
            .fail( e => { console.log(e.stack || e ); reject(e) } )
            .done()
        } )
    },

    stream( query, pipe ) {
        return new Promise( ( resolve, reject ) => {
            this.connect()
            .then( () => {
                var stream = this.client.query( this._copyTo( query, { highWaterMark: 8192 } ) )
                stream.setEncoding( null )
                stream.on( 'end', () => {
                    this.done()
                    pipe.end()
                    resolve()
                } )
                stream.on( 'error', e => { this.done(); console.log(e.stack || e); reject( e ) } )
                stream.on( 'data', chunk => {
                    console.log( query, chunk.length )
                    pipe.write( new Buffer( chunk, 'hex' ).toString('binary'), 'binary' )
                } )
            } )
            .fail( e => { console.log(e.stack || e ); reject(e) } )
            .done()
        } )
    },
    
    querySync: function( query, args ) {
        var client = new this._pgNative(),
            rows

        client.connectSync( this.connectionString )
        
        rows = client.querySync( query, args )

        client.end()

        return rows        
    }

} )

module.exports = Postgres
