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
            where = undefined

        queryKeys.forEach( key => {
            const operation = typeof resource.query[key] === 'object' ? resource.query[key].operation : `=`
            if( ! [ '<', '>', '<=', '>=', '=', '<>', '!=', '~*', 'join' ].includes( operation ) ) { throw new Error('Invalid parameter') }

            if( operation === 'join' ) {
                let fkCol = this.Postgres.tables[ table ].columns.find( column => column.name === key )
                joins.push( `JOIN "${fkCol.fk.table}" ON "${table}"."${fkCol.name}" = "${fkCol.fk.table}"."${fkCol.fk.column}"` )
                selects[ fkCol.fk.table ] = true
            } else {
                where += ` "${name}"."${key}" ${operation} $${paramCtr++}` 
            }
        } )
        
        where = paramCtr > 1 ? 'WHERE ${where}' : ''
        joins = joins.join(' ')
        selects = Object.keys( selects ).map( table => this._getColumns(table) ).join(', ')

        return this.Postgres.query( `SELECT ${selects}this._getColumns(table)} FROM "${table}" ${joins} ${where}`,
            queryKeys.map( key => typeof resource.query[key] === 'object' ? resource.query[key].value : resource.query[key] )
        )
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

    _getColumns( name ) { return this.Postgres.tables[ name ].columns.map( column => `"${name}"."${column.name}"` ).join(', ') },

    _wrapKeys: keys => keys.map( key => `"${key}"` ).join(', ')

}, { } )
