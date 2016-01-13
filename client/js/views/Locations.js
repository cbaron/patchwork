var MyView = require('./MyView'),
    Locations = function() { return MyView.apply( this, arguments ) }

Object.assign( Locations.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/locations')( require('handlebars') )

} )

module.exports = Locations