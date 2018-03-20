const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    tables: [ { name: 'contactinfo', el: 'contactInfo', template: 'contact'} ],

    templates: {
        contact: require('./templates/Location')
    }

} )