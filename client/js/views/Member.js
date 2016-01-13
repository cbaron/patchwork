var MyView = require('./MyView'),
    Member = function() { return MyView.apply( this, arguments ) }

Object.assign( Member.prototype, MyView.prototype, {

    template: require('../templates/member')( require('handlebars') )

} )

module.exports = Member