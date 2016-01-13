var MyView = require('./MyView'),
    Contact = function() { return MyView.apply( this, arguments ) }

Object.assign( Contact.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/contact')( require('handlebars') )

} )

module.exports = Contact