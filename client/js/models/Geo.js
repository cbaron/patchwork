module.exports = {

    parse( response ) {
        return response.map( row => row.location
            ? Object.assign( row, { location: JSON.parse( row.location ).coordinates } )
            : row
        )
    }

}