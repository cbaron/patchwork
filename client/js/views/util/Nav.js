module.exports = {

    events: {
        'hamburger': { event: 'click', selector: '', method: 'toggleLogo' },
        'headerTitle': { event: 'click', selector: '', method: 'navigate' },
        'home': { event: 'click', selector: '', method: 'navigate' },
        'about': { event: 'click', selector: '', method: 'navigate' },
        'csa': { event: 'click', selector: '', method: 'navigate' },
        'markets': { event: 'click', selector: '', method: 'navigate' },
        'sign-up': { event: 'click', selector: '', method: 'navigate' },
        'members': { event: 'click', selector: '', method: 'navigate' },
        'get-involved': { event: 'click', selector: '', method: 'navigate' },
        'contact': { event: 'click', selector: '', method: 'navigate' }
    },

    fields: [
            { label: 'About Us', name: 'about' },
            { label: 'CSA Program', name: 'csa' },
            { label: 'Markets', name: 'markets' },
            { label: 'Sign-Up', name: 'sign-up' },
            { label: 'Get Involved', name: 'get-involved' },
            { label: 'Contact Us', name: 'contact' }
    ],

    templateOpts() {
        return { fields: this.fields, home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' } }
    },

    navigate( e ) {
        var id = this.$( e.currentTarget ).attr( 'data-id' )     
        this.emit( 'navigate', { location: id, options: { trigger: true } } )
    },

    requiresLogin: false,

    toggleLogo() { this.els.headerTitle.toggle() }

}
