var List = require('../util/List'),
    Addresses = function() { return List.apply( this, arguments ) }

Object.assign( Addresses.prototype, List.prototype, {

    ItemView: require('./Address'),

    getItemViewOptions() { return { container: this.templateData.addresses } },

    requiresLogin: false,

    selection: 'single',

    template: require('../../templates/signup/addresses')( require('handlebars') ),
} )

module.exports = Addresses
