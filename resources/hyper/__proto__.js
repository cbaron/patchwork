var BaseResource = require('../__proto__'),
    HyperResource = function() { return BaseResource.apply( this, arguments ) }

Object.assign( HyperResource.prototype, BaseResource.prototype, {

    getQuery() {
        var fkSelect = [ ],
            fkFrom = [ ]

        this._( this.tables[ this.path[1] ].columns )
            .filter( column => column.fk )
            .forEach( column => {
                fkSelect.push( this.format( '%s.%s', column.fk.table, column.fk.column ) )
                fkSelect.push( this.format( '%s.%s', column.fk.table, this.tables[ column.fk.table ].meta.recorddescriptor ) )
                fkFrom.push( this.format( 'JOIN %s ON %s.%s = %s.%s', column.fk.table, column.fk.table, column.fk.column, this.path[1], column.name ) )
            } )
        
        return this.format( "Select %s.* %s FROM %s %s", this.path[1], ( fkSelect.length ) ? ", " + fkSelect.join(', ') : "", this.path[1], fkFrom.join(' ') )
    },

    GET() {
        var rv = {
                "@context": [
                    "http://www.w3.org/ns/hydra/core",
                    {
                        "@vocab": "https://schema.org/"
                    }
                ],
                "@id": this.format( "https://%s:%s/%s", process.env.DOMAIN, process.env.PORT, this.path[1] ),
                label: ( this.tables[ this.path[1] ].meta ) ? this.tables[ this.path[1] ].meta.label : this.path[1],
                recordDescriptor:( this.tables[ this.path[1] ].meta ) ? this.tables[ this.path[1] ].meta.recorddescriptor : this.path[1],
                operation: {
                    "@type": "Create",
                    "method": "POST",
                    "expects": {
                        "@id": "http://schema.org/Person",
                        "supportedProperty": this._( this.tables[ this.path[1] ].columns )
                            .filter( column => column.name !== 'id' && column.name !== 'created' && column.name !== 'updated' )
                            .map( column => ( { property: column.name, range: column.range, fk: column.fk } ) )
                    }
                },
                [this.path[1]]: []
            }
        
        return this.dbQuery( { query: this.getQuery() } )
        .then( result => {
            rv[ this.path[1] ] = result.rows.map( row => {
                var obj = { }
                this._( this.tables[ this.path[1] ].columns )
                    .filter( column => column.fk )
                    .forEach( column => {
                        var fkDescriptor = this.tables[ column.fk.table ].meta.recorddescriptor
                        row[ fkDescriptor ] = { table: column.fk.table, id: row[ column.name ], value: row[ fkDescriptor ] }
                        delete row[ column.name ]
                    } )
                return row
            } )
            this.respond( { body: rv } )
        } )
    }

} )

module.exports = HyperResource
