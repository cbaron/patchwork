var ListItem = require('../util/ListItem'),
    PickupDate = function() { return ListItem.apply( this, arguments ) }

Object.assign( PickupDate.prototype, ListItem.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/pickupDate')

} )

module.exports = PickupDate
