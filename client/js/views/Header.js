module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        justify: 'click',
        nav: 'click',
        title: 'click'
    },

    onJustifyClick() { this.els.nav.classList.toggle('mobile-menu-show') },

    onNavClick( e ) {
        const el = e.target.closest('li'),
            name = el.getAttribute('data-name')

        this.emit( 'navigate', name )

        if( this.els.nav.classList.contains('mobile-menu-show') ) this.els.nav.classList.toggle('mobile-menu-show')
    },

    onTitleClick() { this.emit( 'navigate', '/' ) },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' } }
    }

} )
