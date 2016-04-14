module.exports = require('backbone').Model.extend( {

    Moment: require('moment'),

    parse( response ) {
        Object.keys( response ).forEach( key => {
            if( typeof response[key] === 'object' && response[key].type === 'date' ) {
                response[key].value = this.Moment( response[key].raw ).format('dddd, MMMM Do YYYY, h:mm:ss a')
            }
        } )

        return response
    }
} )
