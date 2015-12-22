var MyObject = require('../lib/MyObject');

var Postgres = function() {
    return MyObject.apply( MyObject.prototype._.extend( this, {
        client: undefined,
        deferred: { connection: this.Q.defer(), query: this.Q.defer() },
        done: undefined } ), arguments )
}

Object.assign( Postgres.prototype, MyObject.prototype, {

    _handleConnect: function( err, client, done ) {
        if( err ) return this.deferred.connection.reject( new Error( "Error fetching client from pool : " + err ) )

        this.client = client;
        this.done = done;
     
        this.deferred.connection.resolve( true );

        return this;
    },

    _handleQuery: function( query, args, err, result ) {
        this.done();

        if( err ) return this.deferred.query.reject( new Error( this.util.format( 'Running query (%s [%s]) : %s', query, args.join(), err ) ) )

        this.deferred.query.resolve( result );

        return this;
    },

    _pg: require('pg'),

    _pgNative: require('pg-native'),

    _query: function( query, args ) {

        this.client.query( query, args, this._handleQuery.bind( this, query, args ) );
        return this;
    },

    connect: function() {
        this._pg.connect( this.connectionString, this._handleConnect.bind(this) );
        return this.deferred.connection.promise;
    },

    query: function( query, args ) {

        this.connect().then( this._query.bind( this, query, args ) ).done();
        
        return this.deferred.query.promise;
    },

    querySync: function( query, args ) {
        this._pgNative.connectSync( this.connectionString )
        this._pgNative.querySync( query, args )        
    }

} );

module.exports = Postgres;
