var GetData = require('./util/GetData'),
    About = function() { return GetData.apply( this, arguments ) }

Object.assign( About.prototype, GetData.prototype, {

    dataTables: [ { name: 'staffprofile', comparator: 'id'} ],

    getTemplateOptions() {
        return { images: this.images }
    },

    requiresLogin: false,

    template: require('../templates/about')( require('handlebars') ),

    templates: {
        staffprofile: require('../templates/staffProfile')( require('handlebars') )
    }

} )

module.exports = About
