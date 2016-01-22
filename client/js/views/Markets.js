var MyView = require('./MyView'),
    Markets = function() { return MyView.apply( this, arguments ) }

Object.assign( Markets.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/markets')( require('handlebars') )

} )

module.exports = Markets