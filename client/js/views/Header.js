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

    size() { return },

    templateOpts() {
        return { fields: this.Nav.data, home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' } }
    }

} )
    /*

    size() {
        const model = this.currentlySelected,
            width = this.els.container.clientWidth,
            height = this.els.container.clientHeight,
            aspectRatio = width / height
        
        if( window.innerWidth > 767 && model ) {

            this.loadHeader()
            this.bindHeaderEvents()
            Array.from( this.els.navLinks.children ).forEach( li => li.style.color = this.currentlySelected.color )
            this.els.headerTitle.style.color = this.currentlySelected.color
        
            if( this.els.headerTitle.style.display === "none" ) this.els.headerTitle.style.display = 'inline-block'

        } else if( window.innerWidth < 768 && model ) {

            ( aspectRatio > 1.6 ) ? this.loadHeader() : this.loadMobileHeader()

            this.removeHeaderEvents()
            Array.from( this.els.navLinks.children ).forEach( li => li.style.color = '#ccc' )
            this.els.headerTitle.style.color = this.currentlySelected.color
            
            if( this.els.navbarCollapse.hasClass('in') ) this.els.headerTitle.style.display = 'none'
        }
    },

    toggleLogo() { this.els.headerTitle.classList.toggle('hidden') }
*/
