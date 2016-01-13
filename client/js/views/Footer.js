var Nav = require('./util/Nav'),
    Footer = function() { return Nav.apply( this, arguments ) }

Object.assign( Footer.prototype, Nav.prototype, {

    fields: [
            { label: 'Home', name: 'home' },
            { label: 'Sign Up', name: 'signup' },
            { label: 'About Us', name: 'about' },
            { label: 'Locations', name: 'locations' },
            { label: 'Member Resources', name: 'members' },
            { label: 'Employment', name: 'employment' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields } },

    insertionMethod: 'after',

    template: require('../templates/footer')( require('handlebars') )

} )

module.exports = new Footer()