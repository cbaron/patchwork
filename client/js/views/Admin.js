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
        this.hide().then( () => this.emit( 'navigate', `/admin/${model.get('name')}` ) )
        .catch( err => new this.Error( err ) )
    },

    requiresRole: 'admin',

    selection: true,

    template: require('./templates/Admin')

} )

module.exports = Admin
