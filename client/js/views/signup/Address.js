var ListItem = require('../util/ListItem'),
    Address = function() { return ListItem.apply( this, arguments ) }

Object.assign( Address.prototype, ListItem.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/address')( require('handlebars') )

} )

module.exports = Address
