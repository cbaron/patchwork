var modulePath = "../node_modules/",
    Postgres = function() {
        this.connectionString = "postgres://cbaron:38024630@localhost/patchwork"
        return this
    }

Object.assign( Postgres.prototype, {

    _copyTo: require(modulePath+'pg-copy-streams').to,

    _pg: require(modulePath+'pg'),

    connect: function() {
        return new Promise( ( resolve, reject ) =>
            this._pg.connect( this.connectionString, ( err, client, done ) => {
                if( err ) return reject( new Error( "Error fetching client from pool : " + err ) )

                this.client = client
                this.done = done

                resolve( true )
            } )
        )
    },

    query( query, args ) {
        return new Promise( ( resolve, reject ) => 
            this.connect()
            .then( () => {
                this.client.query( query, args, ( err, result ) => {
                    this.done()
                    if( err ) return reject( new Error( this.format( 'Running query (%s [%s]) : %s', query, args, err ) ) )
                    resolve( result )
                } )
            } )
            .catch( e => reject(e) )
        )
    },

    stream( query, pipe ) {
        return new Promise( ( resolve, reject ) => {
            this.connect()
            .then( () => {
                var stream = this.client.query( this._copyTo( query ) )
                stream.setEncoding( null )
                stream.on( 'end', () => {
                    this.done()
                    pipe.end()
                    resolve()
                } )
                stream.on( 'error', e => { this.done(); console.log(e.stack || e); reject( e ) } )
                stream.on( 'data', chunk => {
                    pipe.write( new Buffer( chunk, 'hex' ).toString('binary'), 'binary' )
                } )
            } )
            .catch( e => { console.log(e.stack || e ); reject(e) } )
        } )
    }
    
} )

new Postgres().query( "SELECT id from header" ).then( result => console.log( result.rows ) ).catch( e => console.log( e.stack || e ) )

for( var i = 0, ii = 10; i < ii; i++ ) {
    new Postgres().stream( "COPY ( SELECT encode( image, 'hex' ) FROM header WHERE id = 1 ) TO STDOUT", require('fs').createWriteStream('/tmp/whatever')  )
    .then( result => console.log( "Stream Written to" ) ).catch( e => console.log( e.stack || e ) )
}

new Postgres().query( "SELECT id from header" ).then( result => console.log( result.rows ) ).catch( e => console.log( e.stack || e ) )
