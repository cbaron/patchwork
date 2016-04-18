var ListItem = require('../util/ListItem'),
    DeliveryOption = function() { return ListItem.apply( this, arguments ) }

Object.assign( DeliveryOption.prototype, ListItem.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/deliveryOption')( require('handlebars') )

} )

module.exports = DeliveryOption
