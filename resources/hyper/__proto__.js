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
                            columnName: ( column.fk && this.tables[ column.fk.table ].meta )
                                ? [ column.fk.table, this.tables[ column.fk.table ].meta.recorddescriptor ].join('.')
                                : undefined,
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
            var tableName = this.path[1],
                table = this.tables[ tableName ],
                fileColumns = this._( table.columns ).filter( column => column.dataType === 'bytea' ),
                fkColumns = this._( table.columns ).filter( column => column.fk ),
                dateColumns = this._( table.columns ).filter( column => column.dataType === 'date' ),
                dateTimeColumns = this._( table.columns ).filter( column => column.dataType === 'timestamp with time zone' ),
                timeColumns = this._( table.columns ).filter( column => column.dataType === 'time with time zone' )

            rv[ tableName ] = result.rows.map( row => {
                var obj = { }
                
                fkColumns.forEach( column => {
                    var descriptor, columnName

                    if( ! ( column.fk && this.tables[ column.fk.table ].meta ) ) return

                    descriptor = this.getDescriptor( column.fk.table, [ ] )
                    
                    if( ! descriptor.column ) return

                    columnName = [ descriptor.table, descriptor.column.name ].join('.')

                    row[ columnName ] = { descriptor: descriptor, table: column.fk.table, id: row[ column.name ], value: row[ columnName ] }
                    delete row[ column.name ]
                } )

                fileColumns.forEach( column => row[ column.name ] = { type: 'file' } )
                dateColumns.forEach( column => row[ column.name ] = { raw: row[ column.name ], type: 'date' } )
                dateTimeColumns.forEach( column => row[ column.name ] = { raw: row[ column.name ], type: 'datetime' } )
                timeColumns.forEach( column => row[ column.name ] = { raw: row[ column.name ], type: 'time' } )
                
                return row
            } )
            this.respond( { body: rv } )
        } )
    },

    getHyperQuery() {
        var fkSelect = [ ],
            fkFrom = [ ]

        this._( this.tables[ this.path[1] ].columns )
            .filter( column => column.fk && this.tables[ column.fk.table ].meta )
            .forEach( column => {
                const fkTableDescriptor = this.tables[ column.fk.table ].meta.recorddescriptor
                    fkTableDescriptorColumn = this._( this.tables[ column.fk.table ].columns ).find( column => column.name === fkTableDescriptor ),
                    fkTableName = column.fk.table,
                    fkColumnName = column.fk.column,
                    descTableName = fkTableDescriptorColumn.fk.table

                if( /id$/.test( fkTableDescriptor ) ) {
                    fkFrom.push( `LEFT JOIN "${fkTableName}" ON "${fkTableName}"."${fkColumnName}" = ${this.path[1]}` )
                    fkSelect.push( `"${descTableName}"."${this.tables[ descTableName ].meta.recorddescriptor}" AS "${descTableName}.${this.tables[ descTableName ].meta.recorddescriptor}"'` )
                    fkFrom.push( this.format( 'LEFT JOIN %s ON %s.%s = %s.%s',
                        fkTableDescriptorColumn.fk.table,
                        fkTableDescriptorColumn.fk.table,
                        "id",
                        column.fk.table, fkTableDescriptorColumn.name ) )
                    fkFrom.push( `LEFT JOIN ${descTableName} ON "${descTableName}"."id" = "${fkTableName}"."${fkTableDescriptorColumn.name}"` )
                } else {
                    if( fkTableDescriptor ) {
                        fkSelect.push( `"${fkTableName}"."${fkTableDescriptor}" AS "${fkTableName}.${fkTableDescriptor}"` )
                    }
                    fkFrom.push( `LEFT JOIN "${fkTableName}" ON "${fkTableName}"."${fkColumnName}" = "${this.path[1]}"."${column.name}"` )
                }
            } )

        return `Select ${this.getSelect()} ${this.getFkSelect(fkSelect)} FROM "${this.path[1]}" ${fkFrom.join(' ')}`
    },

    getFkSelect( fkSelect ) { return fkSelect.length ? ", " + fkSelect.join(', ') : "" },

    getSelect() {
        var tableName = this.path[1], rv = [ ]

        this.tables[ tableName ].columns.forEach( column => {
            if( column.dataType !== 'bytea' ) rv.push( `"${tableName}"."${column.name}"` )
        } )

        return rv.join(', ')
    }

} )

module.exports = HyperResource
