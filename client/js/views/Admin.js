var Table = require('./util/Table'),
    Admin = function() { return Table.apply( this, arguments ) }

Object.assign( Admin.prototype, Table.prototype, {

    ItemView: require('./ResourceRow'),

    fields: [
        { name: 'name', label: 'Name', width: 25 },
        { name: 'label', label: 'Label', width: 25 },
        { name: 'description', label: 'Description', width: 50 }
    ],
    
    onItemClick( model ) {
        this.hide().then( () => this.router.navigate( this.util.format( "/admin/%s", model.get('name') ), { trigger: true } ) )
        .fail( err => new this.Error( err ) )
        .done()
    },

    requiresRole: 'admin',

    selection: true,

    template: require('../templates/admin')( require('handlebars') )

} )

module.exports = Admin
