module.exports = Object.create( {

    Mongo: require('../../dal/Mongo'),

    apply( resource, result ) { return this[ resource.request.method ]( resource, result ) },

    DELETE( resource, result ) { return resource.respond( { body: result.rows ? result.rows[0].id : { } } ) },

    GET( resource, result ) {
        return resource.respond( { body: this.Mongo.model[ resource.path[0] ]
            ? result
            : ( resource.path.length > 2 )
                ? ( ( result.rows.length ) ? result.rows[0] : { } )
                : result.rows
        } )
    },

    PATCH( resource, result ) { resource.respond( { body: result.rows ? result.rows[0] : result[0] } ) },

    POST( resource, result ) { resource.respond( { body: result.rows ? result.rows[0] : result[0] } ) },

    PUT( resource, result ) { resource.respond( { body: result.rows ? result.rows[0] : result[0] } ) }

}, { } )
