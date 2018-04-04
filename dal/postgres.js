const MyObject = require('../lib/MyObject').prototype

module.exports = Object.create( Object.assign( {}, MyObject, {

    Enum: require('../lib/Enum'),

    enumReference: {
        contactinfo: {
            location: "Geography"
        },
        farmermarket: {
            location: "Geography"
        },
        groupdropoff: {
            location: "Geography"
        },
        restaurant: {
            location: "Geography"
        },
        retailoutlet: {
            location: "Geography"
        }
    },

    excludedCmsTables: [ 'csaTransaction', 'role', 'spatial_ref_sys', 'tablemeta', 'transaction' ],

    initialize() {
        return this.getTableData()
    },

    query( query, args, opts = { } ) {
        return this._factory( opts ).query( query, args, opts )
    },

    select( name, where, opts = { } ) {
        const keys = Object.keys( where )
              whereClause = keys.map( ( key, i ) => `"${key}" = $${i+1}` ).join(', ')
        return this._factory( opts ).query(
            `SELECT * FROM ${name} WHERE ${whereClause}`,
            keys.map( key => where[key] )
        )
    },

    stream( query, pipe, opts ) {
        return this._factory( opts ).stream( query, pipe )
    },

    transaction( queries ) {
        return this._factory().transaction( queries )
    },

    truncate() {
        return this.query( `TRUNCATE ` + Object.keys( this.tables ).map( table => `"${table}"` ).join(', ') )
    },

    getColumnDescription( table, column ) {
        const isEnum = ( this.enumReference && this.enumReference[ table.table_name ] && this.enumReference[ table.table_name ][ column.column_name ] ) ? true : false,
              range = isEnum
                ? this.enumReference[ table.table_name ][ column.column_name ]
                : this.dataTypeToRange[column.data_type]

        return {
            isEnum,
            isNullable: column.is_nullable,
            maximumCharacterLength: column.data_type === "text" ? 1000 : column.character_maximum_length,
            name: column.column_name,
            range
        }
    },

    getSelectList( table, opts={} ) {
        const tableAlias = opts.alias ? opts.alias : table
        return this.tables[ table ].columns.map( column => `"${tableAlias}"."${column.name}" as "${tableAlias}.${column.name}"` ).join(', ')
    },

    getTableData() {
        return this.query( this._queries.selectAllTables() )
        .then( result =>
            Promise.all( result.rows.map( row =>
                this.query( this._queries.selectTableColumns( row.table_name ) )
                .then( columnResult =>
                    Promise.resolve(
                        this.tables[ row.table_name ] = {
                            columns: columnResult.rows.reduce( ( memo, columnRow ) =>
                                columnRow.column_name !== 'password' ? memo.concat( this.getColumnDescription( row, columnRow ) ) : memo,
                                [ ]
                            )
                        }
                    )
                )
            ) )
        )
        .then( () =>
            this.query( this._queries.selectForeignKeys() )
            .then( result =>
                Promise.resolve(
                    result.rows.forEach( row => {
                        const match = /FOREIGN KEY \("?(\w+)"?\) REFERENCES ("?[a-zA-Z-]+"?)\((\w+)\)/.exec( row.pg_get_constraintdef )
                        let column = this.tables[ row.tablefrom.replace(/"/g,'') ].columns.find( column => column.name === match[1] )
                        match[2] = match[2].replace( /"/g, '' ) 

                        column.fk = {
                            table: match[2],
                            column: match[3],
                            recordType: ( this.tables[ match[2] ].meta ) ? this.tables[ match[2] ].meta.recordType : null
                        }
                    } )
                )
            )
        )
        .then( () => {
            return this.query( "SELECT * FROM tablemeta" )
            .then( result => {
                const cmsTablesMeta = result.rows.filter( row => !this.excludedCmsTables.includes( row.name ) && !/member|person/.test( row.name ) )

                this.cmsModels = cmsTablesMeta.map( row => {
                    const schema = {
                        attributes: this.tables[ row.name ].columns.filter( column => column.name !== 'id' ).map( column => {
                            if( column.fk ) return { fk: column.fk.table, columnName: column.name }

                            const range = column.range === 'Text'
                                ? column.name === 'description' ? 'Text' : 'String'
                                : column.range

                            return {
                                name: column.name,
                                label: column.name.charAt(0).toUpperCase() + column.name.slice(1),
                                range
                            }
                        } )
                    }

                    return { name: row.name, label: row.label, schema, isPostgres: true }
                } )

                return Promise.resolve()
            } )
        } )
    },

    _factory( data ) {
        return Object.create( {
            CopyTo: require('pg-copy-streams').to,

            P: MyObject.P,

            connect() {
                return new Promise( ( resolve, reject ) => {
                    this.pool.connect( ( err, client, done ) => {
                        if( err ) return reject( err )

                        this.client = client
                        this.done = done
                     
                        resolve()
                    } )
                } )
            },

            query( query, args, opts={} ) {
                return this.connect().then( () =>
                    new Promise( ( resolve, reject ) => {
                        this.client.query( query, args, ( err, result ) => {
                            this.done()

                            if( err ) { console.log( query, args ); return reject( err ) }

                            resolve( opts.rowsOnly ? result.rows : result )
                        } )
                    } )
                )
            },

            stream( query, pipe ) {
                return this.connect().then( () =>
                    new Promise( ( resolve, reject ) => {
                        const stream = this.client.query( this.CopyTo( query ) )
                        stream.pipe( pipe )
                        stream.on( 'end', () => { resolve(); this.done() } )
                        stream.on( 'error', e => { reject(e); this.done() } )
                    } )
                )
            },

            rollback( e ) {
                return this.P( this.client.query, [ 'ROLLBACK' ], this.client )
                .then( () => { this.done(); return Promise.reject(e) } )
                .catch( error => { console.log(`Error rolling back: ${error}, ${e}`); return Promise.reject(e) } )
            },

            transaction( queries ) {
                return this.connect().then( () => {
                    let chain = this.P( this.client.query, [ `BEGIN` ], this.client ).catch( e => this.rollback(e) )

                    queries.forEach( query => chain = chain.then( () => this.P( this.client.query, query, this.client ).catch( e => this.rollback( e ) ) ) )

                    return chain.then( () => this.P( this.client.query, [ 'COMMIT' ], this.client ).then( () => Promise.resolve( this.done() ) ) )
                } )
            },

        }, { pool: { value: this.pool } } )
    },

    _queries: {

        selectAllTables() { return [
           "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';"
        ].join(' ') },

        selectForeignKeys() { return [
            "SELECT conrelid::regclass AS tableFrom, conname, pg_get_constraintdef(c.oid)",
            "FROM pg_constraint c",
            "JOIN pg_namespace n ON n.oid = c.connamespace",
            "WHERE contype = 'f' AND n.nspname = 'public';"
        ].join(' ') },

        selectTableColumns( tableName ) {
            return [
                'SELECT column_name, data_type, is_nullable, character_maximum_length',
                'FROM information_schema.columns',
                `WHERE table_name = '${tableName}'`
            ].join(' ')
        },

    },

    dataTypeToRange: {
        "bigint": "Integer",
        "boolean": "Boolean",
        "character varying": "Text",
        "date": "Date",
        "integer": "Integer",
        "money": "Float",
        "real": "Float",
        "time without time zone": "Time",
        "timestamp with time zone": "DateTime",
        "text": "Text"
    }

} ), {
    pool: { value: new (require('pg')).Pool() },
    tables: { value: { } }
} )
