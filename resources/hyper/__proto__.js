var BaseResource = require('../__proto__'),
    HyperResource = function() { return BaseResource.apply( this, arguments ) }

Object.assign( HyperResource.prototype, BaseResource.prototype, {

    GET() {
        var metadata = {},
            rv = {
                "@context": [
                    "http://www.w3.org/ns/hydra/core",
                    {
                        "@vocab": "https://schema.org/"
                    }
                ],
                "@id": this.format( "https://%s:%s/%s", process.env.DOMAIN, process.env.PORT, this.path[1] ),
                label: ( this.tables[ this.path[1] ].meta ) ? this.tables[ this.path[1] ].meta.label : this.path[1],
                operation: {
                    "@type": "Create",
                    "method": "POST",
                    "expects": {
                        "@id": "http://schema.org/Person",
                        "supportedProperty": this._( this.tables[ this.path[1] ].columns )
                            .filter( column => column.name !== 'id')
                            .map( column => ( { property: column.name, range: column.range, fk: column.fk } ) )
                    }
                },
                [this.path[1]]: []
            }

        return this.dbQuery( { query: this.format( "SELECT * FROM %s", this.path[1] ) } )
        .then( result => { rv[ this.path[1] ] = result.rows; this.respond( { body: rv } ) } )
    }

} )

module.exports = HyperResource
