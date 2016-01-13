var MyView = require('./MyView'),
    Employment = function() { return MyView.apply( this, arguments ) }

Object.assign( Employment.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/employment')( require('handlebars') )

} )

module.exports = Employment