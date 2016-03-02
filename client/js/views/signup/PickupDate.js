var ListItem = require('../util/ListItem'),
    PickupDate = function() { return ListItem.apply( this, arguments ) }

Object.assign( PickupDate.prototype, ListItem.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/pickupDate')( require('handlebars') )

} )

module.exports = PickupDate
