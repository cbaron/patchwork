var Nav = require('./util/Nav'),
    Footer = function() { return Nav.apply( this, arguments ) }

Object.assign( Footer.prototype, Nav.prototype, {

    fields: [
            { label: 'Home', name: 'home' },
            { label: 'Sign Up', name: 'signup' },
            { label: 'About Us', name: 'about' },
            { label: 'Where To Find Us', name: 'findUs' },
            { label: 'Member Resources', name: 'member' },
            { label: 'Employment', name: 'employment' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields } },

    insertionMethod: 'after',

    template: require('../templates/footer')( require('handlebars') )

} )

module.exports = new Footer()