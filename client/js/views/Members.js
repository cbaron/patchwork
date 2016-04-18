var MyView = require('./MyView'),
    Members = function() { return MyView.apply( this, arguments ) }

Object.assign( Members.prototype, MyView.prototype, {

    template: require('../templates/members')( require('handlebars') )

} )

module.exports = Members
