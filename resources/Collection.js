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

    GET() {
        return Promise.resolve(
            this.respond( {
                body: this.Mongo.collectionNames.map( name =>
                    name === 'Pages'
                        ? ( { name,
                              documents: this.Mongo.viewModelNames.map( name => ( {
                                  name, 
                                  schema: this.Mongo.model[name]
                              } ) )
                          } )
                        : ( { name, schema: this.Mongo.model[name] } )
                )
                .concat( this.Postgres.cmsModels )
                .sort( ( a, b ) => a.name > b.name ? 1 : -1 )
            } )
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