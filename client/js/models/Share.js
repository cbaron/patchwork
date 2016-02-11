module.exports = require('backbone').Model.extend( Object.assign( { }, require('../../../lib/MyObject').prototype, {
    parse( response ) {
        return Object.assign( response, {
            enddate: this.moment( response.enddate ).format("MMM D"),
            startdate: this.moment( response.startdate ).format("MMM D"),
            duration: this.moment( response.enddate ).diff( this.moment( response.startdate ), 'weeks' )
        } )
    } 
} ) )
