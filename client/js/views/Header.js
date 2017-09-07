module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        justify: 'click',
        nav: 'click',
        title: 'click'
    },

    onJustifyClick() { this.els.nav.classList.toggle('is-mobile') },

    onNavClick( e ) {
        const el = e.target.closest('li')

        if( !el ) return

        this.emit( 'navigate', el.getAttribute('data-name') )

        if( this.els.nav.classList.contains('is-mobile') ) this.els.nav.classList.remove('is-mobile')
    },

    onTitleClick() { this.emit( 'navigate', '/' ) },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', name: 'home' } }
    }

} )
