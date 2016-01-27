var MyView = require('./MyView'),
    GetInvolved = function() { return MyView.apply( this, arguments ) }

Object.assign( GetInvolved.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/get-involved')( require('handlebars') )

} )

module.exports = GetInvolved