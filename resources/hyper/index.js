var BaseResource = require('../__proto__'),
    Index = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Index.prototype, BaseResource.prototype, {

    GET() {
        var metadata = {},
            rv = {
                "@context": [
                    "http://www.w3.org/ns/hydra/core",
                    {
                        "@vocab": "https://schema.org/"
                    }
                ],
                "@id": this.format( "https://%s:%d", process.env.DOMAIN, process.env.POST ),
                "resource": []
            }

        return this.dbQuery( { query: SELECT * FROM tablemeta } )
        .then( result => {
            result.rows.forEach( row => metadata[ row.name ] = { label: row.label, description: row.description } )
            rv.resource = Object.keys( this.tables ).map( name => {
                "@id": this.format( "https://%s:%d/%s", process.env.DOMAIN, process.env.POST, name ),
                "name": table,
                "label" metadata[ name ].label,
                "description" metadata[ name ].description
            } )
        } )
    },

} )

module.exports = User
