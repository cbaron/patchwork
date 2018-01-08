module.exports = Object.create( {

    Error: require('../../lib/MyError'),

    Resource: require('./views/Resource'),

    ViewFactory: require('./factory/View'),

    Views: require('./.ViewMap'),

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    initialize() {
        this.content = document.querySelector('#content')

        window.onpopstate = this.handle.bind(this)

        this.user = require('./models/User')

        this.user.on( 'loggedIn', () => this.onLogin() )

        this.userPromise = new Promise( ( resolve, reject ) => this.user.fetch().done( resolve ).fail( reject ) )

        this.footer = this.ViewFactory.create( 'footer', { insertion: { el: this.content, method: 'after' } } )

        this.views = { }

        this.handle()
    },

    handle() {
        this.handler( window.location.pathname.split('/').slice(1) )
    },

    handleHeader( resource ) {
        if( /admin/.test(resource) ) {
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

            }
        }
    },

    handleLogin() {
        Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ).concat( this.footer.hide() ) )
        .then( () => {
            this.ViewFactory.create( 'login', { insertion: { el: this.content } } )
            .on( "success", () =>
                this.footer.show()
                .then( () => this.header.onLogin() )
                .then( () => this.handle() )
                .catch( this.Error )
            )
        } )
        .catch( this.Error )
    },

    handleFooter( resource ) {
        this.footer.els.container.classList.toggle( 'fd-hidden', /admin/.test( resource ) )
    },

    handler( path ) {
        if( path[0] === 'admin' && path[1] ) return this.resourceHandler( path[1] )

        let name = this.pathToView( path[0] ),
            view = this.Views[ name ] ? path[0] : 'home'

        if( this.resources[ path[0] ] ) view = path[0]
      
        this.userPromise.then( () => {
            this.handleHeader( path[0] )
            this.handleFooter( path[0] )

            if( this.user.id && /admin/.test( path[0] ) ) this.adminHeader.onUser( this.user )

            if( view === this.currentView ) return this.views[ view ].onNavigation( path.slice(1) )

            Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
            .then( () => {

                this.currentView = view

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
                        
                if( !/admin/.test( path[0] ) ) document.body.scrollTop = 0

                return Promise.resolve()
            } )
        } )
        .catch( err => new this.Error(err) )
    },

    navigate( location, options={} ) {
        if( options.replace || options.up ) {
            let path = `${window.location.pathname}`.split('/')
            path.pop()
            if( options.replace ) path.push( location )
            location = path.join('/')
        } else if( options.append ) { location = `${window.location.pathname}/${location}` }

        if( location !== window.location.pathname ) history.pushState( {}, '', location )
        if( !options.silent ) this.handle()
    },

    onLogin() { this.onUser( this.user ) },

    onViewNavigate( route ) { this.navigate( route, { trigger: true } ) },

    onSignout() {
        Object.keys( this.views ).forEach( name => {
            this.views[ name ].delete()
            delete this.views[name] 
        } )
    
        this.navigate( "/" )
    },

    onUser( user ) {
        console.log( 'router onUser' )
        this.adminHeader ? this.adminHeader.onUser( this.user ) : this.header.onUser( this.user )
    },

    pathToView( path ) {
        const hyphenSplit = path.split('-')
        return hyphenSplit.map( item => this.capitalizeFirstLetter( item ) ).join('')
    },
    
    resourceHandler( resource ) {
        this.handleHeader( `admin/${resource}` )
        this.handleFooter( `admin/${resource}` )

        this.userPromise.then( () => {

            if( this.user.id ) this.adminHeader.onUser( this.user )

            Object.keys( this.views ).forEach( key => this.views[key].hide() )

            if( this.views.resource ) return this.views.resource.update( resource )

            this.views.resource = new this.Resource( { resource: resource } )

        } ).catch( err => new this.Error(err) )
    },

    resources: {
        admin: {
            view: require('./views/Admin'),
            options: {
                collection: {
                    comparator: "name",
                    model: require('./models/Resource'),
                    parse: response => response.resource,
                    url: "/"
                },
                fetch: { headers: { accept: "application/ld+json" } }
            }
        },
        "sign-up": { view: require('./views/Signup'), options: { } },
    }

} )
