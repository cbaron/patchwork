var MyView = require('./MyView'),
    Admin = function() { return MyView.apply( this, arguments ) }

Object.assign( Admin.prototype, MyView.prototype, {
} )

module.exports = Admin
