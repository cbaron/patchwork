module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
        return { id: response.id, neverReceive: response.produceName || response.produceFamilyName }
    },

    resource: 'never-receive'

} )