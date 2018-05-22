var router,
    MyObject = require('./lib/MyObject'),
    Router = function() { return MyObject.apply( this, arguments ) }

Object.assign( Router.prototype, MyObject.prototype, {

    Path: require('path'),

    Fs: require('fs'),

    Mongo: require('./dal/Mongo'),

    Postgres: require('./dal/postgres'),

    _postgresQuery( query, args ) { return this.Postgres.query( query, args ) },

    applyHTMLResource( request, response, path ) {
        return new Promise( ( resolve, reject ) => {

            var file = './resources/html'

            this.fs.stat( this.format( '%s/%s.js', __dirname, file ), err => {
                if( err ) reject( err )
                new ( require(file) )( { path: path, request: request, response: response } )[ request.method ]().catch( err => reject( err ) )
            } )
        } )
    },
    
    applyResource( request, response, path, subPath ) {
        var filename = this.mongoRoutes[ path[1] ]
            ? this.mongoRoutes[ path[1] ]
            : ( path[1] === "" && subPath )
                ? 'index'
                : path[1],
            file = `./resources${subPath || ''}/${filename}`

        return new Promise( ( resolve, reject ) => {

            this.fs.stat( `${__dirname}/${file}.js`, err => {
                var instance

                if( err ) { 
                    if( err.code !== "ENOENT" ) return reject( err )
                    file = `./resources${subPath || ''}/__proto__`
                }

                instance = new ( require(file) )( {
                    request,
                    response,
                    path,
                    tables: this.tables,
                    veeTwo: Boolean( this.mongoRoutes[ path[1] ] )
                } )

                if( !instance[ request.method ] ) { this.handleFailure( response, new Error("Not Found"), 404, false ); return resolve() }

                instance[ request.method ]()
                .catch( err => {
                    if( err && err.message === "Handled" ) return
                    reject(err)
                } )
            } )
        } )
    },

    dataTypeToRange: {
        "boolean": "Boolean",
        "bytea": "File",
        "character varying": "Text",
        "date": "Date",
        "integer": "Integer",
        "money": "Float",
        "real": "Float",
        "text": "TextArea",
        "timestamp with time zone": "DateTime",
        "time with time zone": "Time"
    },

    fs: require('fs'),

    getAllTables() {
        return this.format(
            "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';" )
    },

    getTableColumns( tableName ) {
        return this.format(
            'SELECT column_name, data_type',
            'FROM information_schema.columns',
            this.format( "WHERE table_name = '%s';", tableName ) )
    },

    getForeignKeys() {
        return [
            "SELECT conrelid::regclass AS table_from, conname, pg_get_constraintdef(c.oid)",
            "FROM pg_constraint c",
            "JOIN pg_namespace n ON n.oid = c.connamespace",
            "WHERE contype = 'f' AND n.nspname = 'public';"
        ].join(' ')
    },

    handleFailure( response, err, code, log ) {
        var message = ( process.env.NODE_ENV === "production" ) ? "Unknown Error" : err.stack || err

        if( log ) { console.log( new Date() ); console.log( err.stack || err ); }

        response.writeHead( code || 500, Object.assign( {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Keep-Alive': 'timeout=50, max=100',
            'Date': new Date().toISOString() }, { "Content-Length": Buffer.byteLength( message ) } ) )

        response.end( message )
    },

    handleFileRequest( request, response, path ) {
        const table = this.tables[ path[0] ]

        if( table === undefined ) return this.handleFailure( response, '404', 404, false )

        const column = table.columns.find( column => column.name === path[1] )

        if( column === undefined ) return this.handleFailure( response, '404', 404, false )

        const filePath = `${__dirname}/static/data/${path[0]}/${column.name}/${path[2]}`
        let stream = undefined

        if( path.length !== 3 || table === undefined || column === undefined ||
            Number.isNaN( parseInt( path[2], 10 ) ) ) return this.handleFailure( response, "Sorry mate" )

        response.writeHead( 200, { 'Connection': 'keep-alive' } )

        this.fs.stat( filePath, ( err, stat ) => {
            if( err ) return this.handleFailure( response, err, 500, false ) 

            stream = this.fs.createReadStream( filePath )
            
            stream.on( 'error', err => this.handleFailure( response, err, 500, true ) )
            stream.pipe( response )
        } )
    },
    
    handler( request, response ) {
        var path = this.url.parse( request.url ).pathname.split("/")
        request.setEncoding('utf8');

        if( request.method === "GET" && ( path[1] === "static" || path[1] === 'dist' || path[1] === "favicon.ico" ) ) return this.serveStaticFile( request, response, path )


        if( path[1] === "file" ) {
            if( request.method === "GET" ) return this.handleFileRequest( request, response, path.splice(2,3) )
            else if( request.method === "POST" ) {
                return new ( require('./resources/file') )( {
                    request: request,
                    response: response,
                    path: path.splice(2,3),
                    tables: this.tables,
                } ).POST().catch( err => this.handleFailure( response, err, 500, true ) )
            }
        }

        if( /text\/html/.test( request.headers.accept ) && request.method === "GET" && path[1] === "report" ) {
            return this.applyResource( request, response, path ).catch( err => this.handleFailure( response, err, 500, true ) )
        } else if( /text\/html/.test( request.headers.accept ) && request.method === "GET" ) {
            return this.applyHTMLResource( request, response, path ).catch( err => this.handleFailure( response, err, 500, true ) )
        } else if( ( /application\/json/.test( request.headers.accept ) || /(POST|PATCH|DELETE)/.test(request.method) ) &&
                   ( this.routes.REST[ path[1] ] || this.mongoRoutes[ path[1] ] || this.tables[ path[1] ] ) ) {
            return this.applyResource( request, response, path ).catch( err => this.handleFailure( response, err, 500, true ) )
        } else if( /application\/ld\+json/.test( request.headers.accept ) && ( this.tables[ path[1] ] || path[1] === "" ) ) {
            if( path[1] === "" ) path[1] === "index"
            return this.applyResource( request, response, path, '/hyper' ).catch( err => this.handleFailure( response, err, 500, true ) )
        }

        return this.handleFailure( response, new Error("Not Found"), 404, false )

    },
    initialize() {
        return this._postgresQuery( this.getAllTables() )
        .then( results =>
            this.storeTableData( results.rows ).then( () => this._postgresQuery( "SELECT * FROM tablemeta" ) )
        )
        .then( results => {
            this.storeTableMetaData( results.rows )
            return this._postgresQuery( this.getForeignKeys() )
        } )
        .then( results => {
            return Promise.resolve( this.storeForeignKeyData( results.rows ) )
        } )
        .then( () => this.initializeMongo() )
    },

    initializeMongo() {
        this.mongoRoutes = { }

        return this.Mongo.initialize( this.mongoRoutes )
        .then( () => this.P( this.Fs.readdir, [ `${__dirname}/resources` ] ) )
        .then( ( [ files ] ) => {
            const fileHash =
                files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) )
                .reduce( ( memo, name ) => Object.assign( memo, { [name.replace('.js','')]: true } ), { } )

            this.Mongo.collectionNames.forEach( table => this.mongoRoutes[ table ] = fileHash[ table ] ? table : '__proto__' )

            return Promise.resolve() 
        } )
    },

    serveStaticFile( request, response, path ) {
        var fileName = path.pop(),
            filePath = `${__dirname}/${path.join('/')}/${fileName}`,
            ext = this.Path.extname( filePath )

        return this.P( this.fs.stat, [ filePath ] )
        .then( ( [ stat ] ) => new Promise( ( resolve, reject ) => {
            
            var stream = this.fs.createReadStream( filePath )
            
            response.on( 'error', e => { stream.end(); reject(e) } )
            stream.on( 'error', reject )
            stream.on( 'end', () => {
                response.end();
                resolve()
            } )

            response.writeHead(
                200,
                {
                    'Cache-Control': `max-age=600`,
                    'Connection': 'keep-alive',
                    'Content-Encoding': ext === ".gz" ? 'gzip' : 'identity',
                    'Content-Length': stat.size,
                    'Content-Type':
                        /\.css/.test(fileName)
                            ? 'text/css'
                            : ext === '.svg'
                                ? 'image/svg+xml'
                                : 'text/plain'
                }
            )
            stream.pipe( response, { end: false } )
        } ) )
        .catch( e => console.log( e.stack || e ) )
    },

    storeForeignKeyData( foreignKeyResult ) {
        foreignKeyResult.forEach( row => {
            const match = /FOREIGN KEY \("?(\w+)"?\) REFERENCES ("?[a-zA-Z-]+"?)\((\w+)\)/.exec( row.pg_get_constraintdef )
            let column = this.tables[ row.table_from.replace(/"/g,'') ].columns.find( column => column.name === match[1] )
            match[2] = match[2].replace( /"/g, '' )

            column.fk = {
                table: match[2],
                column: match[3],
                recorddescriptor: ( this.tables[ match[2] ].meta ) ? this.tables[ match[2] ].meta.recorddescriptor : null
            }
        } )
    },

    storeTableData( tableResult ) {
        return Promise.all(
            tableResult.map( row =>
                this._postgresQuery( this.getTableColumns( row.table_name ) )
                .then( result =>
                    Promise.resolve(
                        this.tables[ row.table_name ] =
                            { columns: result.rows.map( columnRow => ( { name: columnRow.column_name, dataType: columnRow.data_type, range: this.dataTypeToRange[columnRow.data_type] } ) ) }
                    )
                )
            )
        )
    },
    
    storeTableMetaData( metaDataResult ) {
        metaDataResult.forEach( row => {
            if( this.tables[ row.name ] ) this.tables[ row.name ].meta = this._( row ).pick( [ 'label', 'description', 'recorddescriptor' ] )
         } )
    },

    url: require( 'url' )


} )

module.exports = new Router( {
    routes: {
        REST: {
            'accountInfo': true,
            'auth': true,
            'check-email': true,
            'Collection': true,
            'currentFarmDelivery': true,
            'currentGroupDelivery': true,
            'currentGroups': true,
            'currentShare': true,
            'customer-login': true,
            'document': true,
            'food': true,
            'mail': true,
            'member-order': true,
            'never-receive': true,
            'payment': true,
            'report': true,
            'reset-password': true,
            'seasonalAddOn': true,
            'seasonalAddOnOption': true,
            'signup': true,
            'user': true,
            'verify': true
        }
    },
    tables: { } 
} )
