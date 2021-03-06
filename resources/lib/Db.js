module.exports = Object.create( {

    Mongo: require('../../dal/Mongo'),

    Postgres: require('../../dal/postgres'),

    apply( resource ) {
        if( this.Mongo.model[ resource.path[0] ] ) return this.Mongo[ resource.request.method ]( resource )

        return this[ resource.request.method ]( resource )
    },

    DELETE( resource ) {
        return this.Postgres.query( `DELETE FROM "${resource.path[0]}" WHERE id = $1 RETURNING id`, [ resource.path[1] ]  )
    },

    GET( resource ) {
        const table = resource.path[0],
            queryKeys = ( resource.path.length > 1 ) ? { id: resource.path[1] } : Object.keys( resource.query )
        if( queryKeys.includes( 'countOnly' ) ) return this.Postgres.query( `SELECT count(*) FROM "${table}"` )

        let paramCtr = 1,
            joins = [ ],
            selects = { [table]: true },
            where = [ ],
            params = [ ],
            sort = ''

        queryKeys.forEach( key => {
            const datum = resource.query[key],
                operation = typeof datum === 'object' ? datum.operation : `=`

            if( key === 'sort' ) return sort = ` ORDER BY ${datum}`;
            if( ! [ '<', '>', '<=', '>=', '=', '<>', '!=', '~*', 'in', 'join', 'leftJoin' ].includes( operation ) ) { throw new Error('Invalid parameter') }
            if( operation === '~*' && !resource.user.roles.includes('admin') ) { throw new Error('Access Forbidden') }
            
            if( /join/i.test( operation ) ) {
                let fkCol = this.Postgres.tables[ datum.value.table ].columns.find( column => column.name === datum.value.column )
                if( fkCol === undefined ) throw Error( `Invalid join ${key}: ${datum}` )
                joins.push( `${operation === 'leftJoin' ? 'LEFT' : ''} JOIN "${datum.value.table}" ON "${table}"."${key}" = "${datum.value.table}"."${datum.value.column}"` )
                selects[ datum.value.table ] = true
            } else if( operation === 'in' ) {
                where.push(`"${datum.table || table}"."${key}" = ANY ($${paramCtr++})`)
                params.push( datum.value )
            } else {
                where.push(`"${table}"."${key}" ${operation} $${paramCtr++}`)
                params.push( typeof datum === 'object' ? datum.value : datum )
            }
        } )

        where = paramCtr > 1 ? `WHERE ${where.join(' AND ')}` : ''
        joins = joins.join(' ')
        selects = Object.keys( selects ).map( tableName => this._getColumns( tableName, { extend: joins.length } ) ).join(', ')

        return this.Postgres.query( `SELECT ${selects} FROM "${table}" ${joins} ${where}${sort}`, params )
    },

    PATCH( resource ) {
        var paramCtr = 1,
            name = resource.path[0],
            bodyKeys = Object.keys( resource.body ),
            set = 'SET ' + bodyKeys.map( key => {
                const column = this.Postgres.tables[ name ].columns.find( col => col.name === key )
                return column.range === 'Geography'
                    ? `"${key}" = ST_MakePoint( $${paramCtr++}, $${paramCtr++} )`
                    : `"${key}" = $${paramCtr++}`
            } ).join(', ')

        let values = [ ]

        bodyKeys.forEach( key => {
            const column = this.Postgres.tables[ name ].columns.find( col => col.name === key )
            if( column.range === 'Geography' ) {
                values.push( resource.body[key][0] )
                values.push( resource.body[key][1] )
            } else values.push( resource.body[key] )
        } )

        return this.Postgres.query(
            `UPDATE "${name}" ${set} WHERE id = $${paramCtr} RETURNING ${this._getColumns(name)}`,
            values.concat( resource.path[1] )
        )
    },

    POST( resource ) {
        const bodyKeys = Object.keys( resource.body );
        const name = resource.path[0];
        const valuesString = bodyKeys.map( ( key, i ) => {
            const column = this.Postgres.tables[ name ].columns.find( col => col.name === key );
            return column.range === 'Geography'
                ? `ST_MakePoint( $${i+1}, $${i+2} )`
                : `$${i+1}`
            } ).join(', ')

        let values = [ ]

        bodyKeys.forEach( key => {
            const column = this.Postgres.tables[ name ].columns.find( col => col.name === key )
            if( column.range === 'Geography' ) {
                values.push( resource.body[key][0] )
                values.push( resource.body[key][1] )
            } else values.push( resource.body[key] )
        } )

        return this.Postgres.query(
            `INSERT INTO "${name}" ( ${this._wrapKeys(bodyKeys)} ) VALUES ( ${valuesString} ) RETURNING ${this._getColumns(name)}`,
            values
        )
    },

    _getColumns( name, opts={} ) {
        return this.Postgres.tables[ name ].columns.map( column =>
            column.range === 'Geography'
                ? `ST_AsGeoJSON(${column.name}) as ${column.name}`
                : `"${name}"."${column.name}"` + ( opts.extend ? ` as "${name}.${column.name}"` : '' )
        ).join(', ')
    },
        
    _wrapKeys: keys => keys.map( key => `"${key}"` ).join(', ')

}, { } )
