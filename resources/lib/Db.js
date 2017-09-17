module.exports = Object.create( {

    Postgres: require('../../dal/postgres'),

    apply( resource ) { return this[ resource.request.method ]( resource ) },

    DELETE( resource ) {
        return this.Postgres.query( `DELETE FROM "${resource.path[0]}" WHERE id = $1 RETURNING id`, [ resource.path[1] ]  )
    },

    GET( resource ) {
        const table = resource.path[0],
            queryKeys = ( resource.path.length > 1 ) ? { id: resource.path[1] } : Object.keys( resource.query )
            
        let paramCtr = 1,
            joins = [ ],
            selects = { [table]: true },
            where = [ ],
            params = [ ]

        queryKeys.forEach( key => {
            const datum = resource.query[key],
                operation = typeof datum === 'object' ? datum.operation : `=`
            if( ! [ '<', '>', '<=', '>=', '=', '<>', '!=', '~*', 'join', 'leftJoin' ].includes( operation ) ) { throw new Error('Invalid parameter') }

            if( /join/i.test( operation ) ) {
                let fkCol = this.Postgres.tables[ datum.value.table ].columns.find( column => column.name === datum.value.column )
                if( fkCol === undefined ) throw Error( `Invalid join ${key}: ${datum}` )
                joins.push( `${operation === 'leftJoin' ? 'LEFT' : ''} JOIN "${datum.value.table}" ON "${table}"."${key}" = "${datum.value.table}"."${datum.value.column}"` )
                selects[ datum.value.table ] = true
            } else {
                where.push(`"${table}"."${key}" ${operation} $${paramCtr++}`)
                params.push( typeof datum === 'object' ? datum.value : datum )
            }
        } )
        
        where = paramCtr > 1 ? `WHERE ${where.join(' AND ')}` : ''
        joins = joins.join(' ')
        selects = Object.keys( selects ).map( tableName => this._getColumns( tableName, { extend: joins.length } ) ).join(', ')

        return this.Postgres.query( `SELECT ${selects} FROM "${table}" ${joins} ${where}`, params )
    },

    PATCH( resource ) { 
        var paramCtr = 1,
            name = resource.path[0],
            bodyKeys = Object.keys( resource.body ),
            set = 'SET ' + bodyKeys.map( key => `"${key}" = $${paramCtr++}` ).join(', ')

        return this.Postgres.query(
            `UPDATE "${name}" ${set} WHERE id = $${paramCtr} RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => resource.body[key] ).concat( resource.path[1] ) )
    },

    POST( resource ) {
        var bodyKeys = Object.keys( resource.body ),
            name = resource.path[0]
               
        return this.Postgres.query(
            `INSERT INTO "${name}" ( ${this._wrapKeys(bodyKeys)} ) VALUES ( ${ bodyKeys.map( ( key, i ) => "$"+(i+1) ).join(', ') } ) RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => resource.body[key] ) )
    },

    _getColumns( name, opts={} ) {
        return this.Postgres.tables[ name ].columns.map( column => {
            return column.name === 'location'
                ? `ST_AsGeoJSON(location) as location`
                : `"${name}"."${column.name}"` + ( opts.extend ? ` as "${name}.${column.name}"` : '' )
        }
        ).join(', ')
    },
        
    _wrapKeys: keys => keys.map( key => `"${key}"` ).join(', ')

}, { } )
