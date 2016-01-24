var MyView = require('../MyView'),
    Nav = function() { return MyView.apply( this, arguments ) }

Object.assign( Nav.prototype, MyView.prototype, {

    events: {
        'hamburger': { event: 'click', selector: '', method: 'toggleLogo' },
        'home': { event: 'click', selector: '', method: 'navigate' },
        'about': { event: 'click', selector: '', method: 'navigate' },
        'csa': { event: 'click', selector: '', method: 'navigate' },
        'markets': { event: 'click', selector: '', method: 'navigate' },
        'signup': { event: 'click', selector: '', method: 'navigate' },
        'members': { event: 'click', selector: '', method: 'navigate' },
        'employment': { event: 'click', selector: '', method: 'navigate' },
        'contact': { event: 'click', selector: '', method: 'navigate' }
    },

    fields: [
            { label: 'About Us', name: 'about' },
            { label: 'CSA Program', name: 'csa' },
            { label: 'Markets', name: 'markets' },
            //{ label: 'Sign Up', name: 'signup' },
            //{ label: 'Member Resources', name: 'members' },
            { label: 'Get Involved', name: 'employment' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields, home: this.home } },

    home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' },

    requiresLogin: false,

    navigate( e ) {
        var id = this.$( e.currentTarget ).attr( 'data-id' )        
        this.router.navigate( id, { trigger: true } )     
    },

    toggleLogo() { this.$('.site-title-text').toggle() }

} )

module.exports = Nav