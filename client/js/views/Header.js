module.exports = Object.assign( require('./__proto__'), {

    bindHeaderEvents() {
        this.onMouseEnterLink = e => this.loadHoverColor( e )
        this.onMouseLeaveLink = e => this.loadColor( e )
        this.onNavigate = e => this.navigate(e)

        Array.from( this.els.navLinks.children ).forEach( li => {
            li.addEventListener( 'mouseenter', this.onMouseEnterLink )
            li.addEventListener( 'mouseleave', this.onMouseLeaveLink )
        } )
        
        this.els.headerTitle.addEventListener( 'click', this.onNavigate )
        this.els.headerTitle.addEventListener( 'mouseenter', this.onMouseEnterLink )
        this.els.headerTitle.addEventListener( 'mouseleave', this.onMouseLeaveLink )
    },

    events: {
        'hamburger': 'click',
    },

    onNavigation( resource ) {
        this.modelPromise.then( () =>
            this.model.data.forEach( datum => {
                if( datum.page === resource ) {
                    this.currentlySelected = datum
                    this.size()                                      
                }
            } )
        )

        return this
    },

    insertionMethod: 'before',

    loadColor( e ) { e.target.style.color = this.currentlySelected.color },

    loadHoverColor( e ) {
        if( e.target.getAttribute( 'data-id' ) !== 'home') e.target.style.color = this.currentlySelected.hovercolor
    },

    loadHeader() {
        this.els.container.style.backgroundImage = `url( /file/header/image/${this.currentlySelected.id} )`
    },

    loadMobileHeader() {
        this.els.container.style.backgroundImage = `url( /file/header/mobileimage/${this.currentlySelected.id})`
    },

    onHamburgerClick() {
        this.toggleLogo()
    },

    postRender() {
        this.model = Object.create( this.Model, { resource: { value: 'header' } } )
        this.modelPromise = this.model.get()

        return this
    },

    navigate( e ) {
        this.emit( 'navigate', `/${e.target.getAttribute('data-id')}` )
    },

    removeHeaderEvents() {
        this.templateData.navLinks.children.forEach( li => {
            li.removeEventListener( 'mouseenter', this.onMouseEnterLink )
            li.removeEventListener( 'mouseleave', this.onMouseLeaveLink )
        } )
        
        this.els.headerTitle.removeEventListener( 'click', this.onNavigate )
        this.els.headerTitle.removeEventListener( 'mouseenter', this.onMouseEnterLink )
        this.els.headerTitle.removeEventListener( 'mouseleave', this.onMouseLeaveLink )
    },

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

    toggleLogo() { this.els.headerTitle.classList.toggle('hidden') }

} )
