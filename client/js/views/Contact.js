module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    tables: [ { name: 'contactinfo', el: 'contactInfo', template: 'contact'} ],

    templates: {
        contact: require('./templates/Location')
    }

} )