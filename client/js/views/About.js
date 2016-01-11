var MyView = require('./MyView'),
    About = function() { return MyView.apply( this, arguments ) }

Object.assign( About.prototype, MyView.prototype, {

    requiresLogin: false,

    template: require('../templates/about')( require('handlebars') )

} )

module.exports = About
