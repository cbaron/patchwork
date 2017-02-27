module.exports = Object.create( {

    buildSelect: function() {

        var selectArray = this.tables[ this.name ].map( column => {
            var rv;
            if( this.request.headers.iosapp && ( column === "updated" || column === "created" || column === "birthdate" ) ) {
                rv = this.format( 'FLOOR(EXTRACT(EPOCH FROM %s.%s))||to_char(%s.%s,\'.US\')', this.name, column, this.name, column )
            } else {
                rv = this.format( '%s.%s', this.name, column )
            }
            if( this.request.headers.iosapp && this.transformer.to.iOS[ column ] ) rv += this.format(' AS "%s"', this.transformer.to.iOS[ column ] )
            else if( column === "birthdate" ) rv += ' AS "birthdate"'
            return rv;
        }, this );

        return selectArray.join(", ");
    },
    
    buildFrom: function() {

        var rv = this.name + " ";

        this.relations.forEach( relation => {
            rv += this.format('JOIN %s %s ON %s.%s = %s.%s ', relation.table, relation.tableReference, relation.tableReference,
                                                                   relation.foreignKey, this.name, relation.column) }, this )

        return rv;
    },

    buildSet: function( columns ) {
        return columns.map( function( column, idx ) { return column + " = $" + (idx+1).toString() } ).join(", ")
    },

    buildWhere: function() {

        var rv = { string: '', values: [ ] }

        if( this.path.length > 2 ) {
            rv.string = this.format('%s.id = $1',this.name)
            rv.values = this.path[2]
        }

        return rv
    },

    

    deleteQuery: function() {
        return { query: this.format('DELETE FROM %s WHERE id = $1', this.path[1] ), values: [ this.path[2] ] }
    },

    getAllTables: function() {
        return this.format(
            "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';" )
    },

    getQuery: function() {
        var selectArray = ( this.columns || this.tables[ this.path[1] ].columns ).map( column => this.format( '"%s"."%s"', this.path[1], column.name ) ),
            ctr = 1,
            fromString = this.format( 'FROM "%s"', this.path[1] ),
            where = { clause: "", stringArray: [], values: [ ] },
            like = ( this.query.like ) ? true : false,
            path = ( this.query.path ) ? this.query.path : undefined,
            pathResult

        var buildWithPath = ( path ) => {
            console.log( 'buildWithPath' )
            console.log( path )
            var result = { from: [], select: [] },
                prev = this.path[1]

            path.forEach( item => {
                result.from.push(
                    this.format("LEFT JOIN %s ON %s.%s = %s.%s",
                    item.table, item.table, item.column.name, prev, 'id' ) )

                result.select.push(
                    this.tables[ item.table ].columns.map( column =>
                        this.format( '%s.%s as "%s.%s"', item.table, column.name, item.table, column.name ) ).join(', ') )

                prev = item.table
            } )

            return result
        }

        if( this.path.length > 2 ) {
            where.stringArray.push( this.format('"%s".id = $%d',this.path[1],ctr++) )
            where.values.push( this.path[2] )
        }

        if( like ) delete this.query.like

        if( path ) {
            delete this.query.path
            pathResult = buildWithPath( path )
            selectArray = selectArray.concat( pathResult.select )
            fromString = fromString + " " + pathResult.from.join(" ")
        }

        Object.keys( this.query ).forEach( key => {
            var value = this.query[key]

            if( typeof value === 'object' ) {
                where.stringArray.push( this.format('"%s"."%s" %s $%d', this.path[1], key, value.operation, ctr++ ) )
                where.values.push( value.value )
            } else if( like ) {
                where.stringArray.push( this.format('"%s"."%s" ~* $%d', this.path[1], key, ctr++ ) )
                where.values.push( this.format( ".*%s.*", value ) )
            } else if( /,/.test(value) ) {
                where.stringArray.push(
                    this.format('"%s"."%s" IN (%s)', this.path[1], key, value.split(',').map( id => this.format( '$%d', ctr++ ) ).join(',') )
                )
                value.split(',').forEach( v => where.values.push( v ) )
            } else {
                where.stringArray.push( this.format('"%s"."%s" = $%d', this.path[1], key, ctr++ ) )
                where.values.push( value )
            }
        } )
        
        if( where.stringArray.length ) where.clause = "WHERE " + where.stringArray.join(" AND ")
        //console.log( this.format( 'SELECT %s %s %s', selectArray.join(", "), fromString, where.clause ) )
        return {
            query: this.format( 'SELECT %s %s %s', selectArray.join(", "), fromString, where.clause ),
            values: where.values
        }
    },

    getTableColumns: function( tableName ) {
        return this.format(
            'SELECT column_name',
            'FROM information_schema.columns',
            this.format( "WHERE table_name = '%s';", tableName ) )
    },


    patchQuery: function() {
        var contextFilter = ''
            ctr = 2,
            setArray = [],
            values = [ this.path[2] ],
            returning = "";

        this._.each( this.body, ( value, key ) => {
            var dataType = this._( this.tables[ this.path[1] ].columns ).find( column => column.name === key ).dataType
  
            if( this._.contains( [ "created", "id", "updated" ], key ) ) return 

            setArray.push(this.format('%s = $%s', key, ctr++))
            if( dataType === 'bytea' ) {
                values.push( '\\x' + new Buffer( value, 'base64' ).toString('hex') )
            } else { values.push( value ) }
        } )

        if( this.contextFilter ) {
            contextFilter = ' AND '
            
            this.contextFilter.forEach( filter => {
                contextFilter += this.format( '%s = $%d ', filter.column, ctr++ )
                values.push( filter.value )
            }, this )
        }

        return {
            query: this.format( 'UPDATE %s SET %s WHERE id = $1%s %s;', this.path[1], setArray.join(', '), contextFilter, returning ),
            values: values
        }
    },

    postQuery: function() {
        var columnString = '', variableString = '', ctr = 1, values = [],
            returning = this.format( "RETURNING %s", this.tables[ this.path[1] ].columns.map( column => column.name ).join(', ') )

        this._.each( this.body, ( value, key ) => {
            var dataType = this._( this.tables[ this.path[1] ].columns ).find( column => column.name === key ).dataType
            columnString += `"${key}", `
            variableString += this.format('$%d',ctr++) + ', '
            if( dataType === 'bytea' ) {
                values.push( '\\x' + new Buffer( value, 'base64' ).toString('hex') )
            } else { values.push( value ) }
        } )

        return {
            query: this.format( 'INSERT INTO "%s" ( %s ) VALUES ( %s ) %s;', this.path[1], columnString.slice(0,-2), variableString.slice(0,-2), returning ),
            values: values
        }
    }

} )

