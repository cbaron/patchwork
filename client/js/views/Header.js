module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        justify: 'click',
        navLinks: 'click',
        title: 'click'
    },

    onJustifyClick() { this.els.navLinks.classList.toggle('is-mobile') },

    onNavLinksClick( e ) {
        const el = e.target.closest('li')

        if( !el ) return

        this.emit( 'navigate', el.getAttribute('data-name') )

        if( this.els.navLinks.classList.contains('is-mobile') ) this.els.navLinks.classList.remove('is-mobile')
    },

    onTitleClick() { this.emit( 'navigate', '/' ) },

    postRender() {
        this.on('imgLoaded', () => this.els.nav.classList.remove('fd-hidden') )

        return this
    },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', name: 'home' } }
    }

} )
