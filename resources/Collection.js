var Base = require('./__proto__'),
    Collection = function() { return Base.apply( this, arguments ) }

Object.assign( Collection.prototype, Base.prototype, {

    Fs: require('fs'),

    DELETE() {
        const collectionName = this.path[2]

        return this.validate.DELETE.call(this)
        .then( () => this.validateUser() )
        .then( () => this.Mongo.getDb() )
        .then( db =>
            db.dropCollection( collectionName )
            .then( () => {
                this.Mongo.removeCollection( collectionName )
                return Promise.resolve( this.respond( { body: { name: this.path[2] } } ) )
            } )
        )
    },

    getMongoCollections() {
        return Promise.resolve( this.Mongo.collectionNames.map( name =>
            name === 'Pages'
                ? ( { name, key: '_id', ...this.Mongo.model.Pages } )
                : ( { name, schema: this.Mongo.model[name], key: '_id' } ) )
        )
    },

    getPostgresCollections() {
        const excludedTables = [ 'csaTransaction', 'role', 'spatial_ref_sys', 'tablemeta', 'transaction' ]

        return this.Postgres.query( "SELECT * FROM tablemeta" )
        .then( result => {
            const cmsTablesMeta = result.rows.filter( row => !excludedTables.includes( row.name ) && !/member|person/.test( row.name ) )

            const pgCollections = cmsTablesMeta.map( row => {
                const schema = {
                    attributes: this.Postgres.tables[ row.name ].columns.filter( column => column.name !== 'id' ).map( column => {
                        if( column.fk ) return { fk: column.fk.table, columnName: column.name }

                        return {
                            name: column.name,
                            label: column.name.charAt(0).toUpperCase() + column.name.slice(1),
                            range: column.range
                        }
                    } )
                }

                return { name: row.name, label: row.label, schema, key: 'id' }
            } )

            return Promise.resolve( pgCollections )
        } )
    },

    GET() {
        return Promise.all( [ this.getMongoCollections(), this.getPostgresCollections() ] )
        .then( ( [ mongoCollections, pgCollections ] ) =>
            Promise.resolve(
                this.respond( {
                    body: mongoCollections.concat( pgCollections )
                          .sort( ( a, b ) => ( a.label || a.name ) > ( b.label || b.name ) ? 1 : -1 )
                } )
            )
        )
    },

    PATCH() { return Promise.resolve( this.respond( { stopChain: true, code: 404 } ) ) },

    POST() {
        return this.validate.POST.call(this)
        .then( () => this.validateUser() )
        .then( () => this.slurpBody() )
        .then( () => this.Mongo.getDb() )
        .then( db => db.createCollection( this.body.name ) )
        .then( collection => {
            this.Mongo.addCollection( collection.collectionName )
            return Promise.resolve( this.respond( { body: { name: collection.collectionName, schema: this.Mongo.model[ collection.collectionName ] } } ) )
        } )
    },

    PUT() { return Promise.resolve( this.respond( { stopChain: true, code: 404 } ) ) }

} )

module.exports = Collection