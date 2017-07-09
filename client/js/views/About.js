module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    tables: [ 
        { name: 'staffprofile', comparator: 'position', el: 'staffProfile', image: true, template: 'staffProfile'}
    ],

    templates: {
        staffProfile: require('./templates/StaffProfile')
    }

} )
