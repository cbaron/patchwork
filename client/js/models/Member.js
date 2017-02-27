module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
        if( response.length === 1 ) return response[0]
    },

    resource: 'member'

} )