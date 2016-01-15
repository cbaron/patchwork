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
            console.log('router in use')
            this.header = ( resource === 'admin' ) ? require('./views/AdminHeader') : require('./views/Header')

            this.footer = require('./views/Footer')

            if( !resource ) return this.navigate( 'home', { trigger: true } )
          
            this.userPromise.then( () => {

                this.$('body').removeClass().addClass( resource )
                console.log( this.$('body').attr('class') )
                
                if( this.user.id && resource === 'admin' ) this.header.onUser( this.user )
                console.log( Object.keys(this.views) )
                Object.keys( this.views ).forEach( view => this.views[ view ].hide() )

                if( this.views[ resource ] ) return this.views[ resource ].show()
                this.views[ resource ] = new ( this.resources[ resource ].view )( this.resources[ resource ].options )
                //setTimeout( function() { console.log('scrolling'); this.$('body').scrollTop(0) }, 2000 )

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
            signup: { view: require('./views/Signup'), options: { } },
            about: { view: require('./views/About'), options: { } },
            locations: { view: require('./views/Locations'), options: { } },
            members: { view: require('./views/Members'), options: { } },
            employment: { view: require('./views/Employment'), options: { } },
            contact: { view: require('./views/Contact'), options: { } }
        },

        routes: {
            '': 'handler',
            ':resource': 'handler',
            'admin/:resource': 'resourceHandler'
        }

    } )
)()
