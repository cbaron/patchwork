var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/signup')( require('handlebars') )

} )

module.exports = Signup