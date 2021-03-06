module.exports = Object.create( {

    Error: require('../../lib/MyError'),

    ViewFactory: require('./factory/View'),

    Views: require('./.ViewMap'),

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    async clearAndNavigate( route ) {
        try {
            await Promise.all( Object.entries( this.views ).map( ( [ key, val ] ) => val.delete() ) )
            this.currentView = undefined
            this.navigate( route )
        } catch( err ) { this.Error( err ) }
    },

    initialize() {
        this.content = document.querySelector('#content')

        window.onpopstate = this.handle.bind(this)

        this.user = require('./models/User')

        this.user.on( 'loggedIn', () => this.onLogin() )

        this.user.on( 'loginAsCustomer', () => this.clearAndNavigate('/sign-up') )

        this.userPromise = new Promise( ( resolve, reject ) => this.user.fetch().done( resolve ).fail( reject ) )

        this.footer = this.ViewFactory.create( 'footer', { insertion: { el: this.content, method: 'after' } } )

        this.views = { }

        this.handle()
    },

    handle() {
        this.handler( window.location.pathname.split('/').slice(1) )
    },

    handleHeader( resource ) {
        if( /verify|resetPassword/.test(resource) ) return
        else if( resource === 'admin-plus' ) {
            if( this.adminHeader ) { this.adminHeader.onNavigation() }
            else {
                this.adminHeader = this.ViewFactory.create( 'adminHeader', { insertion: { el: this.content, method: 'insertBefore' } } )
                                   .on( 'signout', () => this.onSignout() )
            }
        } else {
            if( this.adminHeader ) { this.adminHeader.hide() }
            if( this.header ) { return }
            else {
                this.header =
                    this.ViewFactory.create( 'header', { insertion: { el: this.content, method: 'insertBefore' } } )
                    .on( 'navigate', this.onViewNavigate.bind(this) )
                    .on( 'signInClicked', () => this.handleLogin() )
                    .on( 'signOutClicked', () => this.onSignout() )
                    .on( 'removeLogin', () => this.Login.delete().catch( this.Error ) )
            }
        }
    },

    handleLogin() {
        Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
        .then( () => {
            this.Login = this.ViewFactory.create( 'login', { insertion: { el: this.content } } )
            .on( "success", () => {
                this.header.onLogin()
                .then( () => this.handle() )
                .catch( this.Error )
            } )
            .on( 'loginCancelled', () => { this.header.displayingLogin = false; this.handle() } )
        } )
        .catch( this.Error )
    },

    handleFooter( resource ) {
        this.footer.els.container.classList.toggle( 'fd-hidden', /admin-plus|verify|resetPassword/.test( resource ) )
    },

    handler( path ) {
        if( path[0] === 'admin' ) path[0] = 'admin-plus'
        let name = this.pathToView( path[0] ),
            view = this.Views[ name ] ? path[0] : 'home'

        if( this.resources[ path[0] ] ) view = path[0]

        this.userPromise.then( () => {
            this.handleHeader( path[0] )
            this.handleFooter( path[0] )

            if( this.user.id && path[0] === 'admin-plus' ) this.adminHeader.onUser( this.user )

            if( view === this.currentView ) return this.views[ view ].onNavigation( path.slice(1) )

            Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
            .then( () => {
                this.currentView = view

                if( this.header ) this.header.toggleSignUpBtn( view )

                if( this.views[ view ] ) return this.views[ view ].onNavigation( path )

                this.views[ view ] = !this.resources[ view ]
                    ? this.ViewFactory.create( view, {
                        insertion: { el: this.content },
                        path
                      } )
                      .on( 'navigate', ( route, options ) => this.navigate( route, options ) )
                      .on( 'deleted', () => delete this.views[ view ] )
                    : new ( this.resources[ view ].view )( Object.assign( { factory: this.ViewFactory }, this.resources[ view ].options ) )
                        .on( 'navigate', ( route, options ) => this.navigate( route, options ) )
                        .on( 'deleted', () => delete this.views[ view ] )
                        
                if( path[0] !== 'admin-plus' ) document.body.scrollTop = 0

                return Promise.resolve()
            } )
        } )
        .catch( err => new this.Error(err) )
    },

    navigate( location, options={} ) {
        let path = `${window.location.pathname}`.split('/')

        if( options.replace || options.up ) {
            path.pop()
            if( options.replace ) path.push( location )
            location = path.join('/')
        } else if( options.append ) { location = `${window.location.pathname}/${location}` }

        if( location !== window.location.pathname ) history.pushState( {}, '', location )
        if( !options.silent ) this.handle()
    },

    onLogin() {
        this.onUser( this.user )
        if( this.header ) this.header.onLogin().catch( this.Error )
    },

    onViewNavigate( route ) { this.navigate( route, { trigger: true } ) },

    onSignout() { this.clearAndNavigate('/') },

    onUser( user ) {
        this.adminHeader ? this.adminHeader.onUser( this.user ) : this.header.onUser( this.user )
    },

    pathToView( path ) {
        const hyphenSplit = path.split('-')
        return hyphenSplit.map( item => this.capitalizeFirstLetter( item ) ).join('')
    },

    resources: {
        "sign-up": { view: require('./views/Signup'), options: { } },
    }

} )
