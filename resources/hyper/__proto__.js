var BaseResource = require('../__proto__'),
    HyperResource = function() { return BaseResource.apply( this, arguments ) }

Object.assign( HyperResource.prototype, BaseResource.prototype, {

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
                        .map( column => ( {
                            descriptor: ( column.fk && this.tables[ column.fk.table ].meta ) ? this.getDescriptor( column.fk.table, [ ] ) : undefined,
                            fk: column.fk,
                            property: column.name,
                            range: column.range
                         } ) )
                }
            },
            [this.path[1]]: []
        }
       
        return this.dbQuery( { query: this.getHyperQuery() } )
        .then( result => {
            rv[ this.path[1] ] = result.rows.map( row => {
                var obj = { }
                this._( this.tables[ this.path[1] ].columns )
                    .filter( column => column.fk )
                    .forEach( column => {
                        var fkDescriptor = this.tables[ column.fk.table ].meta.recorddescriptor,
                            columnName = [ column.fk.table, fkDescriptor ].join('.')
                        row[ this.tables[ column.fk.table ].meta.label ] =
                            { table: column.fk.table, id: row[ column.name ], value: row[ [ column.fk.table, fkDescriptor ].join('.') ] }
                        delete row[ column.name ]
                        delete row[ columnName ]
                    } )
                return row
            } )
            this.respond( { body: rv } )
        } )
    },

    getDescriptor( tableName, path ) {
        var table = this.tables[ tableName ],
            descriptorColumn = this._( table.columns ).find( column => column.name === table.meta.recorddescriptor )

        if( !descriptorColumn || !descriptorColumn.fk ) return { table: tableName, column: descriptorColumn, path }

        path.push( { table: tableName, column: descriptorColumn } )

        return this.getDescriptor( descriptorColumn.fk.table, path )
    },

    getHyperQuery() {
        var fkSelect = [ ],
            fkFrom = [ ]

        this._( this.tables[ this.path[1] ].columns )
            .filter( column => column.fk && this.tables[ column.fk.table ].meta )
            .forEach( column => {
                var fkTableDescriptor = this.tables[ column.fk.table ].meta.recorddescriptor
                    fkTableDescriptorColumn = this._( this.tables[ column.fk.table ].columns ).find( column => column.name === fkTableDescriptor )

                if( /id$/.test( fkTableDescriptor ) ) {
                    fkFrom.push( this.format( 'JOIN %s ON %s.%s = %s.%s', column.fk.table, column.fk.table, column.fk.column, this.path[1], column.name ) )
                    fkSelect.push(
                        this.format( '%s.%s AS "%s.%s"',
                            fkTableDescriptorColumn.fk.table,
                            this.tables[ fkTableDescriptorColumn.fk.table ].meta.recorddescriptor,
                            fkTableDescriptorColumn.fk.table,
                            this.tables[ fkTableDescriptorColumn.fk.table ].meta.recorddescriptor )
                    )
                    fkFrom.push( this.format( 'JOIN %s ON %s.%s = %s.%s',
                        fkTableDescriptorColumn.fk.table,
                        fkTableDescriptorColumn.fk.table,
                        "id",
                        column.fk.table, fkTableDescriptorColumn.name ) )
                } else {
                    if( fkTableDescriptor ) {
                        fkSelect.push( this.format( '%s.%s AS "%s.%s"', column.fk.table, fkTableDescriptor, column.fk.table, fkTableDescriptor ) )
                    }
                    fkFrom.push( this.format( 'JOIN %s ON %s.%s = %s.%s', column.fk.table, column.fk.table, column.fk.column, this.path[1], column.name ) )
                }
            } )
        
        return this.format( "Select %s.* %s FROM %s %s", this.path[1], ( fkSelect.length ) ? ", " + fkSelect.join(', ') : "", this.path[1], fkFrom.join(' ') )
    }

} )

module.exports = HyperResource
