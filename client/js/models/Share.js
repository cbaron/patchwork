module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {
    parse( response ) {
        return Object.assign( response, {
            duration: Math.ceil( this.moment( response.enddate ).diff( this.moment( response.startdate ), 'days' ) / 7 ),
            humanEnddate: this.moment( response.enddate ).format("MMM D"),
            humanStartdate: this.moment( response.startdate ).format("MMM D"),
        } )
    } 
} ) )
