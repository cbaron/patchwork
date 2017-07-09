module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    tables: [ { name: 'contactinfo', comparator: 'id', el: 'contactInfo', template: 'contact'} ],

    templates: {
        contact: require('../templates/business')( require('handlebars') )
    }

} )