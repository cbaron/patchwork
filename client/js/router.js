module.exports = new (
    require('backbone').Router.extend( {

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

            if( !resource ) return this.navigate( 'home', { trigger: true } )
          
            this.userPromise.then( () => {

                if( this.user.id && resource === 'admin' ) this.header.onUser( this.user )

                Object.keys( this.views ).forEach( resource => this.views[ resource ].hide() )

                if( this.views[ resource ] ) return this.views[ resource ].show()

                this.views[ resource ] = new ( this.resources[ resource ].view )(this.resources[ resource ].options)

            } ).catch( err => new this.Error(err) )
        },
        
        Q: require('q'),

        resourceHandler( resource ) {
            this.header = require('./views/AdminHeader')

            this.userPromise.then( () => {

                if( this.user.id ) this.header.onUser( this.user )

                Object.keys( this.views ).forEach( key => this.views[key].hide() )

                if( this.views.resource ) return this.views.resource.update( resource )

                this.views.resource = new this.Resource( { resource: resource } )

            } ).catch( err => new this.Error(err) )
        },

        resources: {
            //about: { view: require('./views/About'), options: { } },
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
            //home:  { view: require('./views/Home'), options: { } }
        },

        routes: {
            '': 'handler',
            ':resource': 'handler',
            'admin/:resource': 'resourceHandler'
        }

    } )
)()
