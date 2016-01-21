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
        return { query: this.format('UPDATE %s SET isdeleted = true WHERE id = $1', this.name), values: [ this.path[2] ] }
    },

    getAllTables: function() {
        return this.format(
            "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';" )
    },

    getQuery: function() {
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
        }, this ),
            ctr = 1,
            fromString = this.name + " ",
            where = { clause: "", stringArray: [], values: [ ] }

        if( this.path.length > 2 ) {

            where.stringArray.push( this.format('%s.id = $%d',this.name,ctr++) )
            where.values.push( this.path[2] )
        }

        if( ! this.request.headers.iosapp && this._( this.tables[ this.name ] ).contains('isdeleted') ) {
            where.stringArray.push( this.format('%s.isdeleted = false',this.name) ) }

        this._.each( this.query, function( value, key ) {

            if( key === "updatedAt" ) {
                where.stringArray.push( this.format('%s.%s > (SELECT to_timestamp($%d))', this.name, "updated", ctr++ ) )
                where.values.push( parseFloat(value) )
            } else {
                where.stringArray.push( this.format('%s.%s = $%d', this.name, key, ctr++ ) )
                where.values.push( value )
            }

        }, this )
        
        if( where.stringArray.length ) where.clause = "WHERE " + where.stringArray.join(" AND ")

        return {
            query: this.format( 'SELECT %s FROM %s %s', selectArray.join(", "), fromString, where.clause ),
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

            if( this._.contains( [ "created", "id", "updated" ], key ) ) return 

            setArray.push(this.format('%s = $%s', key, ctr++))
            values.push( value )
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
            returning = "RETURNING id";

        this._.each( this.body, ( value, key ) => {
            columnString += key + ', '
            variableString += this.format('$%d',ctr++) + ', '
            values.push( value )
        } )

        return {
            query: this.format( 'INSERT INTO %s ( %s ) VALUES ( %s ) %s;', this.path[1], columnString.slice(0,-2), variableString.slice(0,-2), returning ),
            values: values
        }
    }

} )

