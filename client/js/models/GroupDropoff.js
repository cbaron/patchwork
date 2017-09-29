module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
        return response.map( row => row.location
            ? Object.assign( row, { location: JSON.parse( row.location ).coordinates } )
            : row
        )
    },

    resource: 'groupdropoff'

} )