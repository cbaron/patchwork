module.exports = new (
    require('backbone').Router.extend( {

        $: require('jquery'),

        Error: require('./MyError'),

        Resource: require('./views/Resource'),

        initialize: function() {

            this.user = require('./models/User');

            this.userPromise = new Promise( ( resolve, reject ) => this.user.fetch().done( resolve ).fail( reject ) )

            this.views = { }

            return this;
        },

        handler( resource ) {
            
            this.header = ( resource === 'admin' ) ? require('./views/AdminHeader') : require('./views/Header')
            this.footer = require('./views/Footer')

            if( !resource ) return this.navigate( 'home', { trigger: true } )
          
            this.userPromise.then( () => {

                this.$('body').removeClass().addClass( resource )
                
                if( this.user.id && resource === 'admin' ) this.header.onUser( this.user )
                
                Object.keys( this.views ).forEach( view => this.views[ view ].hide() )

                if( this.views[ resource ] ) this.views[ resource ].show()
                else this.views[ resource ] = new ( this.resources[ resource ].view )( this.resources[ resource ].options )
                
                if( this.header.$('.header-title').css( 'display' ) === 'none' ) this.header.toggleLogo()
                this.header.$('.navbar-collapse').removeClass( 'in' )
                this.$('body').scrollTop(0)

            } ).catch( err => new this.Error(err) )
        },
        
        Q: require('q'),

        resourceHandler( resource ) {
            this.header = require('./views/AdminHeader')

            this.userPromise.then( () => {

                if( this.user.id ) this.header.onUser( this.user )

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
            signup: { view: require('./views/Signup'), options: { } },
            members: { view: require('./views/Members'), options: { } },
            "get-involved": { view: require('./views/Get-involved'), options: { } },
            contact: { view: require('./views/Contact'), options: { } }
        },

        routes: {
            '': 'handler',
            ':resource': 'handler',
            'admin/:resource': 'resourceHandler'
        }

    } )
)()
