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
                "@id": this.format( "https://%s:%s", process.env.DOMAIN, process.env.PORT ),
                "resource": []
            }

        return this.dbQuery( { query: "SELECT * FROM tablemeta" } )
        .then( result => {
            result.rows.forEach( row => metadata[ row.name ] = { label: row.label, description: row.description } )
            rv.resource = Object.keys( this.tables ).map( name => { 
                var label = ( metadata[name] ) ? metadata[name].label : "",
                    description = ( metadata[name] ) ? metadata[name].description : ""
                return {
                  "@id": this.format( "https://%s:%s/%s", process.env.DOMAIN, process.env.PORT, name ),
                  "name": name,
                  "label": label,
                  "description": description
                }
            } )
            this.respond( { body: rv } )
        } )
    }

} )

module.exports = Index
