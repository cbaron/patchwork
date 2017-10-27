var MyObject = require('../lib/MyObject'),
    Resource = function() { return MyObject.apply( this, arguments ) }

Object.assign( Resource.prototype, MyObject.prototype, {

    Db: require('./lib/Db'),

    Mongo: require('../dal/Mongo'),

    Permissions: require('./.Permissions'),

    Postgres: require('../dal/postgres'),

    QueryString: require('querystring'),
    
    Response: require('./lib/Response'),

    badRequest() { return this.respond( { stopChain: true, code: 400, body: 'BadRequest' } ) },

    context: {
        DELETE() { if( this.veeTwo ) return this.path.shift() },

        GET() {
            const query = require('url').parse( this.request.url ).query

            if( query === '{}' ) return this.query = { }

            if( this.request.headers.v2 ) {
                this.path.shift()
                this.veeTwo = true
            }

            if( query !== null && query.charAt(0) === "{" ) {
                this.veeTwo = true
                this.path.shift()
                if( [ 'member', 'person' ].includes[ this.path[0] ] && !this.user.roles.includes('admin') ) throw Error("401")
                return this.query = JSON.parse( decodeURIComponent( query ) )
            }

            if( this.veeTwo ) this.path.shift()
                
            this.query = this.QueryString.parse( query )

            Object.keys( this.query ).forEach( attr => {
                if( this.query[ attr ].charAt(0) === '{' ) {
                    this.query[ attr ] = JSON.parse( this.query[ attr ] )
                    if( ! this._( [ '<', '>', '<=', '>=', '=', '<>', '!=' ] ).contains( this.query[ attr ].operation ) ) throw new Error('Invalid Parameter')
                } else if( attr === 'path' && this.query[ attr ].charAt(0) === '[' ) {
                    this.query[ attr ] = JSON.parse( this.query[ attr ] )
                }
            } )
        },

        PATCH() {
            if( this.request.headers.v2 ) this.veeTwo = true

            if( this.veeTwo ) { this.path.shift(); return }

            this.body = this._.omit( this.body, [ 'id', 'serverId', 'updated', 'updatedAt', 'created', 'createdAt' ] )
        },

        POST() {
            if( this.request.headers.v2 ) this.veeTwo = true

            if( this.veeTwo ) { this.path.shift(); return }
        },

        PUT() {
            console.log( 'context PUT' )
            this.path.shift()
        }
    },

    DELETE() {
        return [
            this.validate.DELETE.bind(this),
            this.context.DELETE.bind(this),
            this.db.DELETE.bind(this),
            this.responses.DELETE.bind(this) ].reduce( this.Q.when, this.Q() )
    },

    db: {
        DELETE() { return this.veeTwo ? this.Db.apply( this ) : this.dbQuery( this.queryBuilder.deleteQuery.call( this ) ) },
        GET() { return this.veeTwo ? this.Db.apply( this ) : this.dbQuery( this.queryBuilder.getQuery.call( this ) ) },
        PATCH() { return this.veeTwo ? this.Db.apply( this ) : this.dbQuery( this.queryBuilder.patchQuery.call( this ) ) },
        POST() { return this.veeTwo ? this.Db.apply( this ) : this.dbQuery( this.queryBuilder.postQuery.call( this ) ) },
        PUT() { return this.Db.apply( this ) }
    },

    dbQuery( data  ) { return this.Q( this.Postgres.query( data.query, data.values ) ) },

    getQs() {
        const query = require('url').parse( this.request.url ).query
        return this.query = JSON.parse( decodeURIComponent( query ) )
    },

    GET() {
        return [
            this.validate.GET.bind(this),
            this.context.GET.bind(this),
            this.db.GET.bind(this),
            this.responses.GET.bind(this) ].reduce( this.Q.when, this.Q() )
    },

    getDescriptor( tableName, path ) {
        var table = this.tables[ tableName ],
            descriptorColumn = this._( table.columns ).find( column => column.name === table.meta.recorddescriptor )

        if( !descriptorColumn || !descriptorColumn.fk ) return { table: tableName, column: descriptorColumn, path }

        path.push( { table: tableName, column: descriptorColumn } )

        return this.getDescriptor( descriptorColumn.fk.table, path )
    },

    getHeaders( body ) { return this._.extend( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=50, max=100',
    },

    handleIncomingData( someData ) {

        this.body += someData;

        if( this.body.length > 1e10 ) {
            this.request.connection.destroy();
            throw new Error("Too much data");
        }
    },

    handleRequestEnd() {

        if( this.body.length === 0 ) this.body = "{}"

        try {
            this.body = JSON.parse( this.body );
        } catch( e ) {
            return this.requestEnded.reject( 'Unable to parse request : ' + e );
        }

        if( ! this._.has( this.validate, this.request.method ) ) return this.requestEnded.reject('Invalid Request')

        this.Q.fcall( this.validate[ this.request.method ].bind(this) )
            .then( this.requestEnded.resolve.bind(this) )
            .fail( this.requestEnded.reject.bind(this) )
            .done();
    },

    jws: require('jws'),

    PATCH() {
        return [
            this.slurpBody.bind(this),
            this.context.PATCH.bind(this),
            this.db.PATCH.bind(this),
            this.responses.PATCH.bind(this) ].reduce( this.Q.when, this.Q() )
    },

    POST() {
        return [
            this.slurpBody.bind(this),
            this.context.POST.bind(this),
            this.db.POST.bind(this),
            this.responses.POST.bind(this) ].reduce( this.Q.when, this.Q() )
    },

    PUT() {
        return [
            this.slurpBody.bind(this),
            this.context.PUT.bind(this),
            this.db.PUT.bind(this),
            this.responses.PUT.bind(this) ].reduce( this.Q.when, this.Q() )        
    },

    queryBuilder: require('../lib/queryBuilder'),

    relations: [ ],

    respond( data ) {
        data.body = JSON.stringify( data.body );
        this.response.writeHead( data.code || 200, this._.extend( this.getHeaders( data.body ), data.headers || {} ) )
        this.response.end( data.body );
        if( data.stopChain ) { this.handled = true; throw new Error("Handled") }
    },

    responses: {
        
        DELETE( result ) {
            if( this.veeTwo ) return this.Response.apply( this, result )

            this.respond( { body: { success: true } } )
        },

        GET( result ) {
            if( this.veeTwo ) return this.Response.apply( this, result )

            const body = ( this.path.length > 2 ) ? ( ( result.rows.length ) ? result.rows[0] : { } ) : result.rows
            return this.respond( { body: body } )
        },

        PATCH( result ) {
            if( this.veeTwo ) { return this.Response.apply( this, result ) }

            const payload = { body: { success: true } };

            if( this.request.headers.iosapp ) payload.body.result = { updatedAt: result.rows[0].updatedAt }

            this.respond( payload )
        },

        POST( result ) {
            if( this.veeTwo ) { return this.Response.apply( this, result ) }

            var tableName = this.path[1],
                table = this.tables[ tableName ],
                fileColumns = this._( table.columns ).filter( column => column.dataType === 'bytea' ),
                fkColumns = this._( table.columns ).filter( column => column.fk ),
                dateColumns = this._( table.columns ).filter( column => column.dataType === 'timestamp with time zone' ),
                row = result.rows[0]
            
            fkColumns.forEach( column => {
                var descriptor, columnName

                if( ! ( column.fk && this.tables[ column.fk.table ].meta ) ) return

                descriptor = this.getDescriptor( column.fk.table, [ ] )
                columnName = [ descriptor.table, descriptor.column.name ].join('.')

                row[ columnName ] = { descriptor: descriptor, table: column.fk.table, id: row[ column.name ], value: row[ columnName ] }
                delete row[ column.name ]
            } )

            fileColumns.forEach( column => row[ column.name ] = { type: 'file' } )
            dateColumns.forEach( column => row[ column.name ] = { raw: row[ column.name ], type: 'date' } )
                
            this.respond( { body: row } )
        },

        PUT( result ) { return this.Response.apply( this, result ) }
    },

    slurpBody() {

        this.requestEnded = this.Q.defer();

        this.body = "";
        
        this.request.on( "data", this.handleIncomingData.bind(this) );

        this.request.on( "end", this.handleRequestEnd.bind(this) );

        return this.requestEnded.promise;
    },

    transform( obj, mapping ) {
        this._.each( obj, ( value, key ) => {
            if( this._.has( mapping, key ) ) {
                obj[ mapping[ key ] ] = value;
                delete obj[ key ]
            } 
        }, this )
    },

    validate: {

        DELETE() {

            this.validate.Token.call(this)
            
            if( this.path.length !== 3 ) throw new Error("Invalid resource id")

            return this.validate.User.call(this)
        },

        GET() {

            this.validate.Token.call(this)

            if( this.path.length > 2 && Number.isNaN( parseInt( this.path[2], 10 ) ) ) throw new Error("Invalid resource id")
            
            return this.validate.User.call(this)
        },

        PATCH() {
            
            this.validate.Token.call(this)

            if( this.path.length !== 3 || Number.isNaN( parseInt( this.path[2], 10 ) ) ) throw new Error("Invalid resource id")

            return this.validate.User.call(this)
        },

        POST() {
            //if( /(auth)/.test(this.path[1]) ) return
            
            this.validate.Token.call(this)
            
            return this.validate.User.call(this)
        },

        PUT() {
            
            this.validate.Token.call(this)
            
            return this.validate.User.call(this)
        },
    
        Token() {
            var list = {},
                rc = this.request.headers.cookie

            rc && rc.split(';').forEach( cookie => {
                var parts = cookie.split('=');
                list[ parts.shift().trim() ] = parts.join('=')
            } )

            this.token = list.patchworkjwt
        },

        User() {
            return new Promise( ( resolve, reject ) => {
                if( ! this.token ) { this.user = { }; return resolve() }
                this.jws.createVerify( {
                    algorithm: "HS256",
                    key: process.env.JWS_SECRET,
                    signature: this.token,
                } ).on( 'done', ( verified, obj ) => {
                    if( ! verified ) reject( 'Invalid Signature' )
                    this.user = obj.payload
                    resolve()
                } ).on( 'error', e => { this.user = { }; return resolve() } )
            } )
        }
    },

    validateUser() {
        const permissions = this.Permissions[ this.path[1] ] && this.Permissions[ this.path[1] ][ this.request.method ]

        if( this.user.id === undefined ||
            permissions && this.user.roles.find( role => permissions.has( role ) ) === undefined
          ) { return this.respond( { stopChain: true, code: 401, body: { } } ) }

        return Promise.resolve()
    }

} )

module.exports = Resource
