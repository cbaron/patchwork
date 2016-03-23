var CustomContent = require('./util/CustomContent'),
    Contact = function() { return CustomContent.apply( this, arguments ) }

Object.assign( Contact.prototype, CustomContent.prototype, {

    requiresLogin: false,

    tables: [ { name: 'contactinfo', comparator: 'id', el: 'contactInfo', template: 'contact'} ],

    template: require('../templates/contact')( require('handlebars') ),

    templates: {
        contact: require('../templates/business')( require('handlebars') )
    }

} )

module.exports = Contact