module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
      return response.map( row =>
            Object.keys( row ).reduce(
                ( memo, key ) => {
                    const index = key.indexOf('.'),
                        table = key.slice(0, index)
                    if( table !== 'share' ) return memo

                    return Object.assign( memo, { [ key.slice( index + 1 ) ]: row[key] } )
                },
                { membershareid: row[ 'membershare.id' ] }
            )
        )
    },

    resource: 'membershare'
} )
