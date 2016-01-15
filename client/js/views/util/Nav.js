var MyView = require('../MyView'),
    Nav = function() { return MyView.apply( this, arguments ) }

Object.assign( Nav.prototype, MyView.prototype, {

    events: {
        'home': { event: 'click', selector: '', method: 'navigate' },
        'signup': { event: 'click', selector: '', method: 'navigate' },
        'about': { event: 'click', selector: '', method: 'navigate' },
        'locations': { event: 'click', selector: '', method: 'navigate' },
        'members': { event: 'click', selector: '', method: 'navigate' },
        'employment': { event: 'click', selector: '', method: 'navigate' },
        'contact': { event: 'click', selector: '', method: 'navigate' }
    },

    fields: [
            { label: 'Sign Up', name: 'signup' },
            { label: 'About Us', name: 'about' },
            { label: 'Locations', name: 'locations' },
            { label: 'Member Resources', name: 'members' },
            { label: 'Employment', name: 'employment' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields, home: this.home } },

    home: { label: 'Patchwork Gardens', name: 'home' },

    requiresLogin: false,

    navigate( e ) {
        var id = this.$( e.currentTarget ).attr( 'data-id' )        
        this.router.navigate( id, { trigger: true } )      
    }

} )

module.exports = Nav