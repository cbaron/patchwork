module.exports = Object.assign( {}, require('./__proto__'), {

    Nav: require( '../models/Nav'),

    events: {
        nav: 'click',
        title: 'click'
    },

    onNavClick( e ) {
        const el = e.target.closest('li'),
            name = el.getAttribute('data-name')

        this.emit( 'navigate', name )
    },

    onTitleClick() { this.emit( 'navigate', '/' ) },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' } }
    }

} )
