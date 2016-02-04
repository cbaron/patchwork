var GetData = require('./util/GetData'),
    Contact = function() { return GetData.apply( this, arguments ) }

Object.assign( Contact.prototype, GetData.prototype, {

    dataTables: [ { name: 'contactinfo', comparator: 'id'} ],

    requiresLogin: false,

    template: require('../templates/contact')( require('handlebars') ),

    templates: {
        contactinfo: require('../templates/business')( require('handlebars') )
    }

} )

module.exports = Contact