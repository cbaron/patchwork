var ListItem = require('../util/ListItem'),
    PaymentOption = function() { return ListItem.apply( this, arguments ) }

Object.assign( PaymentOption.prototype, ListItem.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/paymentOption')( require('handlebars') )

} )

module.exports = PaymentOption
