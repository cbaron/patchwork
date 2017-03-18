module.exports = new (
    require('backbone').Router.extend( {

        $: require('jquery'),

        Error: require('./MyError'),

        Resource: require('./views/Resource'),

        ViewFactory: require('./factory/View'),

        adminPlusHandler( resource ) {
            this.header = require('./views/AdminHeader')

            if( this.footer ) this.footer.hide()

            this.userPromise.then( () => {

                console.log( this.header )            

                if( this.user.id ) this.header.onUser( this.user )

                Object.keys( this.views ).forEach( key => this.views[key].hide() )

                //if( this.views.resource ) return this.views.resource.update( resource )

                this.views.resource = this.createAdminPlusView( resource )

            } ).catch( err => new this.Error(err) )

        },

        createAdminPlusView( resource ) {
            const view = this.routeToViewName[ resource ] || resource

            return this.ViewFactory.create( view, {
                insertion: { value: { el: document.querySelector('#content') } },
                //path: { value: path, writable: true },
                user: { value: this.user }
            } )
            
        },

        initialize: function() {
            this.user = require('./models/User');

            this.userPromise = new Promise( ( resolve, reject ) => this.user.fetch().done( resolve ).fail( reject ) )

            console.log( this.userPromise )

            this.views = { }

            return this;
        },

        handler( resource ) {
            this.header = ( resource === 'admin' || resource === 'admin-plus' ) ? require('./views/AdminHeader') : require('./views/Header')
            if( resource !== 'admin' && resource !== 'admin-plus' ) this.header.initiateHeader( resource )

            this.footer = require('./views/Footer')
            this.footer[ ( resource === 'admin' || resource === 'admin-plus' ) ? 'hide' : 'show' ]()

            if( !resource ) return this.navigate( 'home', { trigger: true } )
          
            this.userPromise.then( () => {
                this.$('body').removeClass().addClass( resource )
                
                Object.keys( this.views ).forEach( view => this.views[ view ].hide() )
                
                if( this.views[ resource ] ) this.views[ resource ].show()
                else this.views[ resource ] = ( resource === "admin-plus" )
                    ? this.createAdminPlusView( resource )
                    : new ( this.resources[ resource ].view )( this.resources[ resource ].options )
            
                if( this.header.$('.header-title').css( 'display' ) === 'none' ) this.header.toggleLogo()
                
                this.header.$('.navbar-collapse').removeClass( 'in' )
                this.$(window).scrollTop(0)
                this.footer.size()

            } ).catch( err => new this.Error(err) )
        },
        
        Q: require('q'),

        resourceHandler( resource ) {
            this.header = require('./views/AdminHeader')

            if( this.footer ) this.footer.hide()

            this.userPromise.then( () => {

                if( this.user.id ) this.header.onUser( this.user )

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
            home: { view: require('./views/Home'), options: { } },
            csa: { view: require('./views/CSA'), options: { } },
            about: { view: require('./views/About'), options: { } },
            markets: { view: require('./views/Markets'), options: { } },
            "sign-up": { view: require('./views/Signup'), options: { } },
            members: { view: require('./views/Members'), options: { } },
            "get-involved": { view: require('./views/GetInvolved'), options: { } },
            contact: { view: require('./views/Contact'), options: { } }
        },

        routeToViewName: {
            'admin-plus': 'adminPlus',
            'manage-customer': 'manageCustomer'
        },

        routes: {
            '': 'handler',
            ':resource': 'handler',
            'admin/:resource': 'resourceHandler',
            'admin-plus/:resource': 'adminPlusHandler'
        }

    } )
)()
