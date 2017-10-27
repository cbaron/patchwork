const CustomContent = require('./util/CustomContent')

module.exports = Object.assign( {}, require('./__proto__'), CustomContent, {

    events: {
        link: 'click'
    },

    onLinkClick( e ) {
        this.emit( 'navigate', e.target.getAttribute('data-name') )
    },

    tables: [ 
        { name: 'staffprofile', el: 'staffBios', image: true, template: 'staffProfile' }
    ],

    templates: {
        staffProfile: require('./templates/StaffProfile')
    }

} )
