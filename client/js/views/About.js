const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    tables: [ 
        { name: 'Staff', el: 'staff', sort: { 'order': 1 }, template: 'staffProfile' }
    ],

    templates: {
        staffProfile: require('./templates/StaffProfile')
    }

} )
