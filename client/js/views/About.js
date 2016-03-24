var CustomContent = require('./util/CustomContent'),
    About = function() { return CustomContent.apply( this, arguments ) }

Object.assign( About.prototype, CustomContent.prototype, {

    requiresLogin: false,

    tables: [ 
        { name: 'staffprofile', comparator: 'position', el: 'staffProfile', image: true, template: 'staffProfile'}
    ],

    template: require('../templates/about')( require('handlebars') ),

    templates: {
        staffProfile: require('../templates/staffProfile')( require('handlebars') )
    }

} )

module.exports = About
