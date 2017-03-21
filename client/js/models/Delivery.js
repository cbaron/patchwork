module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
        return response.map( row =>
            Object.keys( row ).reduce(
                ( memo, key ) => {
                    const index = key.indexOf('.'),
                        table = key.slice(0, index)
                    if( !memo[ table ] ) memo[ table ] = { }
                    memo[ table ][ key.slice( index + 1 ) ] = row[key]
                    return memo
                },
                { }
            )
        )
    },

    resource: 'membersharedelivery'

} )
