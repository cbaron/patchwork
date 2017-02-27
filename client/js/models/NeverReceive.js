module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
        return { neverReceive: response.produceName || response.produceFamilyName }
    },

    resource: 'never-receive'

} )