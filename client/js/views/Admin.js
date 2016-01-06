var Table = require('./util/Table'),
    Admin = function() { return Table.apply( this, arguments ) }

Object.assign( Admin.prototype, Table.prototype, {

    ItemView: require('./Resource'),

    fields: [
        { name: 'name', label: 'Name' },
        { name: 'label', label: 'Label' },
        { name: 'description', label: 'Description' }
    ],

    template: require('../templates/admin')( require('handlebars') )

} )

module.exports = Admin
