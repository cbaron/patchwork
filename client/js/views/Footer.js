var MyView = require('./MyView'),
    Footer = function() { return MyView.apply( this, arguments ) }

Object.assign( Footer.prototype, MyView.prototype, {

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

    requiresLogin: false,

    template: require('../templates/footer')( require('handlebars') )

} )

module.exports = new Footer()