var MyView = require('./MyView'),
    Header = function() { return MyView.apply( this, arguments ) }

Object.assign( Header.prototype, MyView.prototype, {

    events: {
        'logo': { event: 'click', selector: '', method: 'showHome' },
    },

    fields: [
            { label: 'Sign Up', name: 'signup' },
            { label: 'About Us', name: 'about' },
            { label: 'Where To Find Us', name: 'findUs' },
            { label: 'Member Resources', name: 'member' },
            { label: 'Employment', name: 'employment' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields } },

    insertionMethod: 'before',

    requiresLogin: false,

    showHome() { this.router.navigate( 'home' ) },

    size() {
        var content = this.$('#content'),
            jWindow = this.$(window)

        if( this.hidden ) return content.height( jWindow.height() )

        content.height( jWindow.height() - this.templateData.container.outerHeight( true ) )

        return this
    },

    template: require('../templates/header')( require('handlebars') )

} )

module.exports = new Header()
