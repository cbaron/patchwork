var ListView = require('./util/List'),
    Admin = function() { return ListView.apply( this, arguments ) }

Object.assign( Admin.prototype, ListView.prototype, {

    template: require('../templates/admin')( require('handlebars') )

} )

module.exports = Admin
