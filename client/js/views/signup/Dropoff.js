var Item = require('../util/ListItem'),
    Dropoff = function() { return Item.apply( this, arguments ) }

Object.assign( Dropoff.prototype, Item.prototype, {

    requiresLogin: false,

    template: require('../../templates/signup/dropoff')( require('handlebars') )

} )

module.exports = Dropoff
