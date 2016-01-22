var MyView = require('./MyView'),
    CSA = function() { return MyView.apply( this, arguments ) }

Object.assign( CSA.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/csa')( require('handlebars') )

} )

module.exports = CSA