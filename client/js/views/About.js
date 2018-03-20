const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    tables: [ 
        { name: 'Staff', el: 'staff', template: 'staffProfile' }
    ],

    templates: {
        staffProfile: require('./templates/StaffProfile')
    }

} )
