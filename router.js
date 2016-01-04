var router,
    MyObject = require('./lib/MyObject'),
    Router = function() { return MyObject.apply( this, arguments ) }

Object.assign( Router.prototype, MyObject.prototype, {

    _postgresQuerySync( query, args ) {
        return new ( require('./dal/postgres') )( { connectionString: process.env.POSTGRES } ).querySync( query, args );
    },

    applyHTMLResource( request, response, path ) {
        return new Promise( ( resolve, reject ) => {

            var file = './resources/html'

            require('fs').stat( this.format( '%s/%s.js', __dirname, file ), err => {
                if( err ) reject( err )
                new ( require(file) )( { path: path, response: response } )[ request.method ]().catch( err => reject( err ) )
            } )
        } )
    },
    
    applyResource( request, response, path, subPath ) {

        var filename = ( path[1] === "" && subPath ) ? 'index' : path[1],
            file = this.format('./resources%s/%s', subPath || '', filename )

        return new Promise( ( resolve, reject ) => {

            require('fs').stat( this.format( '%s/%s.js', __dirname, file ), err => {
                if( err ) reject( err )

                new ( require(file) )( {
                    request: request,
                    response: response,
                    path: path,
                    tables: this.tables,
                } )[ request.method ]()
                .catch( err => reject( err ) )
            } )
        } )
    },

    getAllTables() {
        return this.format(
            "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';" )
    },

    getTableColumns( tableName ) {
        return this.format(
            'SELECT column_name',
            'FROM information_schema.columns',
            this.format( "WHERE table_name = '%s';", tableName ) )
    },

    handleFailure( response, err, code ) {

        var message = ( process.env.NODE_ENV === "production" ) ? "Unknown Error" : err.stack || err

        console.log( err.stack || err );

        response.writeHead( code || 500, Object.assign( {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Keep-Alive': 'timeout=50, max=100',
            'Date': new Date().toISOString() }, { "Content-Length": Buffer.byteLength( message ) } ) )

        response.end( message )
    },
    
    handler( request, response ) {
        var path = this.url.parse( request.url ).pathname.split("/")
        console.log(path)

        request.setEncoding('utf8');

        if( ( request.method === "GET" && path[1] === "static" ) || path[1] === "favicon.ico" ) {
            return request.addListener( 'end', this.serveStaticFile.bind( this, request, response ) ).resume() }

        if( /text\/html/.test( request.headers.accept ) ) {
            return this.applyHTMLResource( request, response, path ).catch( err => this.handleFailure( response, err ) )
        } else if( ( /application\/json/.test( request.headers.accept ) || /(POST|PATCH|DELETE)/.test(request.method) ) &&
                   ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] ) ) {
            return this.applyResource( request, response, path ).catch( err => this.handleFailure( response, err ) )
        } else if( /application\/ld\+json/.test( request.headers.accept ) && ( this.tables[ path[1] ] || path[1] === "" ) ) {
            if( path[1] === "" ) path[1] === "index"
            return this.applyResource( request, response, path, '/hyper' ).catch( err => this.handleFailure( response, err ) )
        }

        return this.handleFailure( response, new Error("Not Found"), 404 )

        /*
        if( this.routes[ path[1] || "/" ] === undefined ) return this.handleFailure( response, new Error("Not Found"), 404 )

        this.applyResource( request, response, path, this.routes[path[1]] )
        .catch( err => this.handleFailure( response, err ) )
        */
    },

    initialize() {
        this.storeTableData( this._postgresQuerySync( this.getAllTables() ) )

        this.staticFolder = new (require('node-static').Server)();

        return this;
    },

    serveStaticFile( request, response ) { this.staticFolder.serve( request, response ) },

    storeTableData( tableResult ) {
        tableResult.forEach( row => {
            var columnResult = this._postgresQuerySync( this.getTableColumns( row.table_name ) )
            this.tables[ row.table_name ] = columnResult.map( column => column.column_name )
        }, this )
    },

    url: require( 'url' )

} )

router = new Router( {
    routes: {
        REST: {
            'auth': true,
            'user': true
        }
    },
    tables: { } 
} ).initialize();

module.exports = router.handler.bind(router);
