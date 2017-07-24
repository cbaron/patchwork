module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        justify: 'click',
        nav: 'click',
        title: 'click'
    },

    onJustifyClick() { this.els.nav.classList.toggle('is-mobile') },

    onNavClick( e ) {
        const el = e.target.closest('li'),
            name = el.getAttribute('data-name')

        this.emit( 'navigate', name )

        if( this.els.nav.classList.contains('is-mobile') ) this.els.nav.classList.remove('is-mobile')
    },

    onTitleClick() { this.emit( 'navigate', '/' ) },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' } }
    }

} )
